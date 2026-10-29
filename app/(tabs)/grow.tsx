import { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme/useTheme';
import { useHabits } from '@/features/habits/hooks';
import { useGoals } from '@/features/goals/hooks';
import { HabitService } from '@/features/habits/service';
import { FAB, ProgressBar, EmptyState } from '@/components/ui';
import { Flame, Check, Plus, Target } from 'lucide-react-native';
import type { HabitRow, GoalRow } from '@/db/schema';

type Segment = 'habits' | 'goals';

export default function GrowScreen() {
  const theme = useTheme();
  const router = useRouter();

  const [activeSegment, setActiveSegment] = useState<Segment>('habits');
  const todayStr = new Date().toISOString().split('T')[0] ?? '2025-06-01';

  const { habits, toggleCheckin } = useHabits();
  const { goals } = useGoals();

  const renderHabitItem = ({ item }: { item: HabitRow }) => {
    let currentStreak = 0;
    try {
      currentStreak = HabitService.getStreak(item.id).currentStreak;
    } catch {
      // handled
    }

    let isCheckedToday = false;
    try {
      const logs = HabitService.getLogs(item.id);
      isCheckedToday = logs.some((l) => l.localDate === todayStr);
    } catch {
      // handled
    }

    return (
      <TouchableOpacity
        style={[
          styles.card,
          { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
        ]}
        onPress={() => router.push(`/habit/${item.id}` as const)}
      >
        <TouchableOpacity
          onPress={() => toggleCheckin(item.id, todayStr)}
          style={[
            styles.checkCircle,
            {
              backgroundColor: isCheckedToday ? theme.colors.primary : 'transparent',
              borderColor: isCheckedToday ? theme.colors.primary : theme.colors.textSecondary,
            },
          ]}
        >
          {isCheckedToday && <Check size={16} color="#fff" />}
        </TouchableOpacity>

        <View style={{ flex: 1 }}>
          <Text style={[theme.typography.bodyStrong, { color: theme.colors.text }]}>
            {item.name}
          </Text>
          <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>
            {item.scheduleType.toUpperCase().replace('_', ' ')}
          </Text>
        </View>

        <View style={styles.streakBadge}>
          <Flame size={16} color={theme.colors.warning} />
          <Text style={[theme.typography.caption, { color: theme.colors.text, fontWeight: '700' }]}>
            {currentStreak}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderGoalItem = ({ item }: { item: GoalRow }) => {
    const progressPercent =
      item.type === 'numeric' && item.targetValue && item.targetValue > 0
        ? Math.min(1, item.currentValue / item.targetValue)
        : 0;

    return (
      <TouchableOpacity
        style={[
          styles.card,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
            flexDirection: 'column',
            alignItems: 'stretch',
          },
        ]}
        onPress={() => router.push(`/goal/${item.id}` as const)}
      >
        <View style={styles.goalRow}>
          <Target size={20} color={theme.colors.primary} />
          <Text style={[theme.typography.bodyStrong, { color: theme.colors.text, flex: 1 }]}>
            {item.title}
          </Text>
          <Text style={[theme.typography.caption, { color: theme.colors.primary }]}>
            {Math.round(progressPercent * 100)}%
          </Text>
        </View>
        <ProgressBar progress={progressPercent} />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.bg }]}>
      <View style={styles.container}>
        <Text style={[theme.typography.h1, { color: theme.colors.text }]}>Grow</Text>

        {/* Segment Switcher */}
        <View style={[styles.segmentContainer, { backgroundColor: theme.colors.surface }]}>
          <TouchableOpacity
            onPress={() => setActiveSegment('habits')}
            style={[
              styles.segmentBtn,
              activeSegment === 'habits' && { backgroundColor: theme.colors.primary },
            ]}
          >
            <Text
              style={[
                theme.typography.bodyStrong,
                { color: activeSegment === 'habits' ? '#fff' : theme.colors.text },
              ]}
            >
              Habits
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveSegment('goals')}
            style={[
              styles.segmentBtn,
              activeSegment === 'goals' && { backgroundColor: theme.colors.primary },
            ]}
          >
            <Text
              style={[
                theme.typography.bodyStrong,
                { color: activeSegment === 'goals' ? '#fff' : theme.colors.text },
              ]}
            >
              Goals
            </Text>
          </TouchableOpacity>
        </View>

        {/* Habits Content */}
        {activeSegment === 'habits' ? (
          habits.length === 0 ? (
            <EmptyState
              title="No habits tracked yet"
              body="Build strong routines by adding your first habit!"
            />
          ) : (
            <FlatList
              data={habits}
              keyExtractor={(item) => item.id}
              renderItem={renderHabitItem}
              contentContainerStyle={styles.listContent}
            />
          )
        ) : goals.length === 0 ? (
          <EmptyState
            title="No goals set yet"
            body="Set ambitious milestones to track your long-term growth!"
          />
        ) : (
          <FlatList
            data={goals}
            keyExtractor={(item) => item.id}
            renderItem={renderGoalItem}
            contentContainerStyle={styles.listContent}
          />
        )}

        <FAB
          icon={Plus}
          onPress={() =>
            router.push(activeSegment === 'habits' ? '/habit/new' : ('/goal/new' as const))
          }
          accessibilityLabel={`Add new ${activeSegment === 'habits' ? 'habit' : 'goal'}`}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 12, gap: 16 },
  segmentContainer: {
    flexDirection: 'row',
    borderRadius: 14,
    padding: 4,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  listContent: { gap: 12, paddingBottom: 80 },
  card: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
  },
  goalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
});
