import { useMemo } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/useTheme';
import type { EventRow, TaskRow } from '@/db/schema';

type TimelineEvent = {
  id: string;
  title: string;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  color: string;
  type: 'event' | 'task';
  isAllDay: boolean;
  originalData: EventRow | TaskRow;
};

const HOUR_HEIGHT = 60;
const DAY_WIDTH = 100;
const TIME_LABEL_WIDTH = 50;

function parseTime(timeStr: string): { hour: number; minute: number } {
  const parts = timeStr.split(':');
  return { hour: parseInt(parts[0] ?? '0', 10), minute: parseInt(parts[1] ?? '0', 10) };
}

function formatHour(hour: number): string {
  if (hour === 0) return '12 AM';
  if (hour === 12) return '12 PM';
  if (hour > 12) return `${hour - 12} PM`;
  return `${hour} AM`;
}

export function DayTimelineView({
  events,
  tasks,
  selectedDate,
  theme,
  onPressEvent,
  onPressTask,
}: {
  events: EventRow[];
  tasks: TaskRow[];
  selectedDate: string;
  theme: ReturnType<typeof useTheme>;
  onPressEvent: (id: string) => void;
  onPressTask: (id: string) => void;
}) {
  const timelineItems = useMemo(() => {
    const items: TimelineEvent[] = [];

    events.forEach((e) => {
      const start = new Date(e.startsAt);
      const end = new Date(e.endsAt);
      const isSameDay = start.toISOString().split('T')[0] === selectedDate;

      if (e.isAllDay || !isSameDay) {
        items.push({
          id: e.id,
          title: e.title,
          startHour: 0,
          startMinute: 0,
          endHour: 24,
          endMinute: 0,
          color: e.color ?? theme.colors.primary,
          type: 'event',
          isAllDay: true,
          originalData: e,
        });
      } else {
        const startHour = start.getHours();
        const startMinute = start.getMinutes();
        const endHour = end.getHours();
        const endMinute = end.getMinutes();
        items.push({
          id: e.id,
          title: e.title,
          startHour,
          startMinute,
          endHour: endHour === 0 && endMinute === 0 ? 24 : endHour,
          endMinute,
          color: e.color ?? theme.colors.primary,
          type: 'event',
          isAllDay: false,
          originalData: e,
        });
      }
    });

    tasks.forEach((t) => {
      if (t.dueLocalDate === selectedDate && t.dueTime) {
        const { hour, minute } = parseTime(t.dueTime);
        items.push({
          id: t.id,
          title: t.title,
          startHour: hour,
          startMinute: minute,
          endHour: hour,
          endMinute: minute + 30,
          color: theme.colors.accent,
          type: 'task',
          isAllDay: false,
          originalData: t,
        });
      }
    });

    return items.sort((a, b) => a.startHour - b.startHour || a.startMinute - b.startMinute);
  }, [events, tasks, selectedDate, theme]);

  const allDayItems = timelineItems.filter((i) => i.isAllDay);
  const timedItems = timelineItems.filter((i) => !i.isAllDay);

  return (
    <View style={styles.container}>
      {/* All-day section */}
      {allDayItems.length > 0 && (
        <View style={styles.allDaySection}>
          <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>
            ALL DAY
          </Text>
          <View style={styles.allDayItems}>
            {allDayItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.allDayItem,
                  { backgroundColor: item.color + '20', borderColor: item.color },
                ]}
                onPress={() =>
                  item.type === 'event' ? onPressEvent(item.id) : onPressTask(item.id)
                }
              >
                <View style={[styles.allDayIndicator, { backgroundColor: item.color }]} />
                <Text style={[theme.typography.caption, { color: item.color, fontWeight: '600' }]}>
                  {item.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Time grid */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.timeGrid}>
          {/* Time labels */}
          <View style={styles.timeLabels}>
            {Array.from({ length: 24 }, (_, h) => (
              <Text key={h} style={styles.timeLabel}>
                {formatHour(h)}
              </Text>
            ))}
          </View>

          {/* Timeline lanes */}
          <View style={styles.timelineLanes}>
            {timedItems.map((item, index) => {
              const top = item.startHour * HOUR_HEIGHT + (item.startMinute / 60) * HOUR_HEIGHT;
              const height = Math.max(
                30,
                (item.endHour - item.startHour) * HOUR_HEIGHT +
                  ((item.endMinute - item.startMinute) / 60) * HOUR_HEIGHT,
              );

              return (
                <TouchableOpacity
                  key={`${item.id}-${index}`}
                  style={[
                    styles.timelineItem,
                    {
                      top,
                      height,
                      backgroundColor: item.color + '20',
                      borderLeftColor: item.color,
                    },
                  ]}
                  onPress={() =>
                    item.type === 'event' ? onPressEvent(item.id) : onPressTask(item.id)
                  }
                >
                  <View style={styles.timelineItemHeader}>
                    <Text
                      style={[theme.typography.caption, { color: item.color, fontWeight: '600' }]}
                    >
                      {formatTimeString(item.startHour, item.startMinute)}
                    </Text>
                    <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>
                      {item.type === 'event' ? '📅' : '📋'}
                    </Text>
                  </View>
                  <Text
                    style={[theme.typography.body, { color: theme.colors.text, fontWeight: '500' }]}
                    numberOfLines={2}
                  >
                    {item.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

export function WeekTimelineView({
  events,
  tasks,
  weekStart,
  theme,
  onPressEvent,
  onPressTask,
  onSelectDate,
}: {
  events: EventRow[];
  tasks: TaskRow[];
  weekStart: string; // YYYY-MM-DD (Monday)
  theme: ReturnType<typeof useTheme>;
  onPressEvent: (id: string) => void;
  onPressTask: (id: string) => void;
  onSelectDate: (date: string) => void;
}) {
  const days = useMemo(() => {
    const result = [];
    const start = new Date(weekStart + 'T00:00:00');
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      const iso = d.toISOString().split('T')[0] ?? '';
      result.push({
        iso,
        dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNum: d.getDate(),
        isToday: iso === new Date().toISOString().split('T')[0],
      });
    }
    return result;
  }, [weekStart]);

  const dayEvents = useMemo(() => {
    const map = new Map<string, EventRow[]>();
    events.forEach((e) => {
      const date = new Date(e.startsAt).toISOString().split('T')[0];
      if (!map.has(date)) map.set(date, []);
      map.get(date)!.push(e);
    });
    return map;
  }, [events]);

  const dayTasks = useMemo(() => {
    const map = new Map<string, TaskRow[]>();
    tasks.forEach((t) => {
      if (t.dueLocalDate) {
        if (!map.has(t.dueLocalDate)) map.set(t.dueLocalDate, []);
        map.get(t.dueLocalDate)!.push(t);
      }
    });
    return map;
  }, [tasks]);

  return (
    <ScrollView
      horizontal
      style={styles.weekScroll}
      contentContainerStyle={styles.weekScrollContent}
      showsHorizontalScrollIndicator={false}
    >
      {days.map((day) => {
        const dayEvts = dayEvents.get(day.iso) ?? [];
        const dayTks = dayTasks.get(day.iso) ?? [];

        return (
          <TouchableOpacity
            key={day.iso}
            style={[
              styles.weekDayColumn,
              day.isToday && {
                backgroundColor: theme.colors.primary + '10',
                borderWidth: 2,
                borderColor: theme.colors.primary,
              },
            ]}
            onPress={() => onSelectDate(day.iso)}
          >
            <View style={styles.weekDayHeader}>
              <Text
                style={[
                  theme.typography.caption,
                  { color: day.isToday ? theme.colors.primary : theme.colors.textSecondary },
                ]}
              >
                {day.dayName}
              </Text>
              <Text
                style={[
                  theme.typography.bodyStrong,
                  { color: day.isToday ? theme.colors.primary : theme.colors.text },
                ]}
              >
                {day.dayNum}
              </Text>
            </View>

            <View style={styles.weekDayEvents}>
              {dayEvts.map((e) => (
                <TouchableOpacity
                  key={e.id}
                  style={[
                    styles.weekEventItem,
                    {
                      backgroundColor: (e.color ?? theme.colors.primary) + '20',
                      borderLeftColor: e.color ?? theme.colors.primary,
                    },
                  ]}
                  onPress={(ev) => {
                    ev.stopPropagation();
                    onPressEvent(e.id);
                  }}
                >
                  <Text
                    style={[
                      theme.typography.caption,
                      { color: e.color ?? theme.colors.primary, fontWeight: '600' },
                    ]}
                  >
                    {formatEventTime(e.startsAt, e.endsAt)}
                  </Text>
                  <Text
                    style={[
                      theme.typography.caption,
                      { color: theme.colors.text, fontWeight: '500' },
                    ]}
                    numberOfLines={1}
                  >
                    {e.title}
                  </Text>
                </TouchableOpacity>
              ))}
              {dayTks.map((t) => (
                <TouchableOpacity
                  key={t.id}
                  style={[
                    styles.weekEventItem,
                    {
                      backgroundColor: theme.colors.accent + '20',
                      borderLeftColor: theme.colors.accent,
                    },
                  ]}
                  onPress={(ev) => {
                    ev.stopPropagation();
                    onPressTask(t.id);
                  }}
                >
                  <Text
                    style={[
                      theme.typography.caption,
                      { color: theme.colors.accent, fontWeight: '600' },
                    ]}
                  >
                    {t.dueTime ?? 'All day'}
                  </Text>
                  <Text
                    style={[
                      theme.typography.caption,
                      { color: theme.colors.text, fontWeight: '500' },
                    ]}
                    numberOfLines={1}
                  >
                    {t.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

function formatTimeString(hour: number, minute: number): string {
  const h = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  const ampm = hour >= 12 ? 'PM' : 'AM';
  return `${h}:${String(minute).padStart(2, '0')} ${ampm}`;
}

function formatEventTime(startsAt: string, endsAt: string): string {
  const start = new Date(startsAt);
  const end = new Date(endsAt);
  const startHour = start.getHours();
  const startMinute = start.getMinutes();
  const endHour = end.getHours();
  const endMinute = end.getMinutes();
  return `${formatTimeString(startHour, startMinute)} - ${formatTimeString(endHour, endMinute)}`;
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  allDaySection: { paddingHorizontal: 16, paddingVertical: 8, gap: 8 },
  allDayItems: { flexDirection: 'row', gap: 8 },
  allDayItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    gap: 6,
  },
  allDayIndicator: { width: 6, height: 6, borderRadius: 3 },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 40 },
  timeGrid: { flexDirection: 'row' },
  timeLabels: {
    width: TIME_LABEL_WIDTH,
    paddingTop: HOUR_HEIGHT / 2,
    paddingRight: 8,
  },
  timeLabel: {
    height: HOUR_HEIGHT,
    textAlign: 'right',
    fontSize: 11,
    color: '#999',
    includeFontPadding: false,
  },
  timelineLanes: { flex: 1, position: 'relative' },
  timelineItem: {
    position: 'absolute',
    left: 4,
    right: 4,
    borderRadius: 8,
    borderLeftWidth: 3,
    padding: 8,
  },
  timelineItemHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  weekScroll: { flex: 1 },
  weekScrollContent: { paddingHorizontal: 16, gap: 12, paddingBottom: 40 },
  weekDayColumn: {
    width: DAY_WIDTH,
    borderRadius: 12,
    borderWidth: 1,
    padding: 8,
    gap: 8,
  },
  weekDayHeader: { alignItems: 'center', gap: 2 },
  weekDayEvents: { gap: 6 },
  weekEventItem: {
    borderRadius: 8,
    borderLeftWidth: 3,
    padding: 8,
  },
});
