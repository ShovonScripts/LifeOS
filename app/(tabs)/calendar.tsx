import { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme/useTheme';
import { useCalendar } from '@/features/calendar/hooks';
import { FAB, SectionHeader, EmptyState } from '@/components/ui';
import { Calendar as CalendarIcon, Clock, Plus } from 'lucide-react-native';
import type { EventRow, TaskRow } from '@/db/schema';

export default function CalendarScreen() {
  const theme = useTheme();
  const router = useRouter();

  const todayStr = new Date().toISOString().split('T')[0] ?? '2025-06-01';
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  const { events, tasks, refresh } = useCalendar(selectedDate);

  const handleSelectDate = (dateStr: string) => {
    setSelectedDate(dateStr);
    refresh(dateStr);
  };

  // Generate 7 days strip for date picker
  const dateStrip = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - 3 + i);
    const iso = d.toISOString().split('T')[0] ?? '2025-06-01';
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNum = d.getDate();
    return { iso, dayName, dayNum };
  });

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.bg }]}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[theme.typography.h1, { color: theme.colors.text }]}>Calendar</Text>
          <TouchableOpacity style={styles.todayBtn} onPress={() => handleSelectDate(todayStr)}>
            <CalendarIcon size={18} color={theme.colors.primary} />
            <Text style={[theme.typography.caption, { color: theme.colors.primary }]}>Today</Text>
          </TouchableOpacity>
        </View>

        {/* Date Strip Picker */}
        <View style={styles.stripContainer}>
          {dateStrip.map((item) => {
            const isSelected = item.iso === selectedDate;
            return (
              <TouchableOpacity
                key={item.iso}
                onPress={() => handleSelectDate(item.iso)}
                style={[
                  styles.stripCard,
                  {
                    backgroundColor: isSelected ? theme.colors.primary : theme.colors.surface,
                    borderColor: theme.colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    theme.typography.caption,
                    { color: isSelected ? '#fff' : theme.colors.textSecondary },
                  ]}
                >
                  {item.dayName}
                </Text>
                <Text
                  style={[
                    theme.typography.bodyStrong,
                    { color: isSelected ? '#fff' : theme.colors.text },
                  ]}
                >
                  {item.dayNum}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Day Agenda Header */}
        <SectionHeader title={`Agenda for ${selectedDate}`} />

        {/* Agenda Content */}
        {events.length === 0 && tasks.length === 0 ? (
          <EmptyState
            title="No items for this date"
            body="Tap the '+' button below to schedule an event."
          />
        ) : (
          <FlatList
            data={[
              ...events.map((e) => ({ type: 'event' as const, data: e })),
              ...tasks.map((t) => ({ type: 'task' as const, data: t })),
            ]}
            keyExtractor={(item) =>
              item.type === 'event' ? `event-${item.data.id}` : `task-${item.data.id}`
            }
            renderItem={({ item }) => {
              if (item.type === 'event') {
                const event = item.data as EventRow;
                return (
                  <TouchableOpacity
                    style={[
                      styles.agendaCard,
                      { backgroundColor: theme.colors.surface, borderColor: theme.colors.primary },
                    ]}
                    onPress={() => router.push(`/event/${event.id}` as const)}
                  >
                    <Clock size={18} color={theme.colors.primary} />
                    <View style={{ flex: 1 }}>
                      <Text style={[theme.typography.bodyStrong, { color: theme.colors.text }]}>
                        {event.title}
                      </Text>
                      <Text
                        style={[theme.typography.caption, { color: theme.colors.textSecondary }]}
                      >
                        Event • {event.startsAt.split('T')[1]?.substring(0, 5) ?? ''}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              } else {
                const task = item.data as TaskRow;
                return (
                  <TouchableOpacity
                    style={[
                      styles.agendaCard,
                      { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
                    ]}
                    onPress={() => router.push(`/task/${task.id}` as const)}
                  >
                    <View style={[styles.taskDot, { backgroundColor: theme.colors.accent }]} />
                    <View style={{ flex: 1 }}>
                      <Text style={[theme.typography.body, { color: theme.colors.text }]}>
                        {task.title}
                      </Text>
                      <Text
                        style={[theme.typography.caption, { color: theme.colors.textSecondary }]}
                      >
                        Due Task
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              }
            }}
            contentContainerStyle={styles.listContent}
          />
        )}

        {/* FAB to add event */}
        <FAB
          icon={Plus}
          onPress={() => router.push('/event/new' as const)}
          accessibilityLabel="Add new event"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 12, gap: 16 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  todayBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 6,
  },
  stripContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stripCard: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 4,
  },
  listContent: { gap: 10, paddingBottom: 80 },
  agendaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  taskDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
