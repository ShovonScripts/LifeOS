import { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme/useTheme';
import { TaskService } from '@/features/tasks/service';
import { HabitService } from '@/features/habits/service';
import { FocusService } from '@/features/focus/service';
import { ArrowLeft, CheckCircle2, Flame, Clock } from 'lucide-react-native';

export default function WeeklyReviewScreen() {
  const theme = useTheme();
  const router = useRouter();

  const [completedTasksCount] = useState(() => {
    try {
      return TaskService.list({ statuses: ['done'] }).length;
    } catch {
      return 0;
    }
  });

  const [habitsCount] = useState(() => {
    try {
      return HabitService.list().length;
    } catch {
      return 0;
    }
  });

  const [focusMinutes] = useState(() => {
    try {
      const sessions = FocusService.list();
      const totalSecs = sessions.reduce((acc, s) => acc + (s.actualSeconds ?? 0), 0);
      return Math.round(totalSecs / 60);
    } catch {
      return 0;
    }
  });

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.bg }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Go back">
          <ArrowLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[theme.typography.h2, { color: theme.colors.text }]}>Weekly Review</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[theme.typography.body, { color: theme.colors.textSecondary }]}>
          Here is a summary of your achievements and focus over the past week:
        </Text>

        <View
          style={[
            styles.statCard,
            { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
          ]}
        >
          <CheckCircle2 size={24} color={theme.colors.success} />
          <View>
            <Text style={[theme.typography.h2, { color: theme.colors.text }]}>
              {completedTasksCount}
            </Text>
            <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>
              Tasks Completed
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.statCard,
            { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
          ]}
        >
          <Flame size={24} color={theme.colors.warning} />
          <View>
            <Text style={[theme.typography.h2, { color: theme.colors.text }]}>{habitsCount}</Text>
            <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>
              Active Habits Maintained
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.statCard,
            { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
          ]}
        >
          <Clock size={24} color={theme.colors.primary} />
          <View>
            <Text style={[theme.typography.h2, { color: theme.colors.text }]}>
              {focusMinutes} mins
            </Text>
            <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>
              Total Deep Work Focus
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  content: { paddingHorizontal: 20, paddingBottom: 40, gap: 16 },
  statCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    gap: 16,
  },
});
