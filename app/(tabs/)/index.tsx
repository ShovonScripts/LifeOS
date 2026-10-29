import { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme/useTheme';
import { TaskService } from '@/features/tasks/service';
import { HabitService } from '@/features/habits/service';
import { SectionHeader, EmptyState } from '@/components/ui';
import { Search, Flame, Clock, Check, BarChart2 } from 'lucide-react-native';
import type { TaskRow, HabitRow } from '@/db/schema';

export default function TodayDashboardScreen() {
  const theme = useTheme();
  const router = useRouter();

  const todayStr = new Date().toISOString().split('T')[0] ?? '2025-06-01';

  const [todayTasks, setTodayTasks] = useState<TaskRow[]>(() => {
    try {
      return TaskService.list({ dueLocalDate: todayStr });
    } catch {
      return [];
    }
  });

  const [habits] = useState<HabitRow[]>(() => {
    try {
      return HabitService.list();
    } catch {
      return [];
    }
  });

  const handleToggleTask = (task: TaskRow) => {
    try {
      TaskService.toggleComplete(task.id, task.status);
      setTodayTasks(TaskService.list({ dueLocalDate: todayStr }));
    } catch {
      // handled
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.bg }]}>
      <View style={styles.container}>
        {/* Top Header Bar */}
        <View style={styles.header}>
          <View>
            <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>
              TODAY&apos;S DASHBOARD
            </Text>
            <Text style={[theme.typography.h1, { color: theme.colors.text }]}>Hello!</Text>
          </View>

          <View style={styles.headerIcons}>
            <TouchableOpacity
              onPress={() => router.push('/review' as const)}
              style={styles.iconBtn}
            >
              <BarChart2 size={22} color={theme.colors.text} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push('/search' as const)}
              style={styles.iconBtn}
            >
              <Search size={22} color={theme.colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Focus Timer Launch Card */}
          <TouchableOpacity
            style={[styles.focusWidget, { backgroundColor: theme.colors.primary }]}
            onPress={() => router.push('/focus' as const)}
          >
            <Clock size={28} color="#fff" />
            <View style={{ flex: 1 }}>
              <Text style={[theme.typography.bodyStrong, { color: '#fff' }]}>Deep Work Focus</Text>
              <Text style={[theme.typography.caption, { color: 'rgba(255,255,255,0.8)' }]}>
                Start a 25-min Pomodoro timer
              </Text>
            </View>
          </TouchableOpacity>

          {/* Today Tasks Section */}
          <SectionHeader title="Tasks Due Today" />
          {todayTasks.length === 0 ? (
            <EmptyState title="All caught up!" body="No tasks due today. Enjoy your time!" />
          ) : (
            todayTasks.map((t) => {
              const isDone = t.status === 'done';
              return (
                <View
                  key={t.id}
                  style={[
                    styles.card,
                    { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
                  ]}
                >
                  <TouchableOpacity
                    onPress={() => handleToggleTask(t)}
                    style={styles.checkboxContainer}
                  >
                    <View
                      style={[
                        styles.checkbox,
                        {
                          borderColor: isDone ? theme.colors.primary : theme.colors.textSecondary,
                          backgroundColor: isDone ? theme.colors.primary : 'transparent',
                        },
                      ]}
                    >
                      {isDone && <Check size={12} color="#fff" />}
                    </View>
                  </TouchableOpacity>

                  <Text
                    style={[
                      theme.typography.body,
                      {
                        flex: 1,
                        color: isDone ? theme.colors.textSecondary : theme.colors.text,
                        textDecorationLine: isDone ? 'line-through' : 'none',
                      },
                    ]}
                  >
                    {t.title}
                  </Text>
                </View>
              );
            })
          )}

          {/* Habit Routines Section */}
          <SectionHeader title="Habit Routines" />
          {habits.length === 0 ? (
            <EmptyState
              title="No active habits"
              body="Add habits in the Grow tab to track them here."
            />
          ) : (
            habits.map((h) => {
              let streak = 0;
              try {
                streak = HabitService.getStreak(h.id).currentStreak;
              } catch {
                // handled
              }

              return (
                <View
                  key={h.id}
                  style={[
                    styles.card,
                    { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
                  ]}
                >
                  <Flame size={20} color={theme.colors.warning} />
                  <Text
                    style={[theme.typography.bodyStrong, { color: theme.colors.text, flex: 1 }]}
                  >
                    {h.name}
                  </Text>
                  <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>
                    {streak} days streak
                  </Text>
                </View>
              );
            })
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 12 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerIcons: { flexDirection: 'row', gap: 12 },
  iconBtn: { padding: 6 },
  scrollContent: { gap: 16, paddingBottom: 40 },
  focusWidget: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderRadius: 18,
    gap: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  checkboxContainer: { padding: 2 },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
