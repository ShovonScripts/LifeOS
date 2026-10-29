import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '@/theme/useTheme';
import { HabitService } from '@/features/habits/service';
import { Button, ConfirmDialog } from '@/components/ui';
import { ArrowLeft, Trash2, Flame } from 'lucide-react-native';
import type { HabitRow } from '@/db/schema';
import type { StreakSummary } from '@/domain/streaks';

export default function HabitDetailScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const isNew = id === 'new';
  const todayStr = new Date().toISOString().split('T')[0] ?? '2025-06-01';

  const [habit] = useState<HabitRow | null>(() => {
    if (isNew || !id) return null;
    try {
      return HabitService.get(id) ?? null;
    } catch {
      return null;
    }
  });

  const [streak] = useState<StreakSummary>(() => {
    if (isNew || !id) return { currentStreak: 0, bestStreak: 0, totalCheckins: 0 };
    try {
      return HabitService.getStreak(id);
    } catch {
      return { currentStreak: 0, bestStreak: 0, totalCheckins: 0 };
    }
  });

  const [name, setName] = useState(() => habit?.name ?? '');
  const [scheduleType, setScheduleType] = useState<'daily' | 'weekdays' | 'weekly_count'>(
    () => habit?.scheduleType ?? 'daily',
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSave = () => {
    if (!name.trim()) return;
    try {
      if (isNew) {
        HabitService.create({
          name: name.trim(),
          scheduleType,
          startDate: todayStr,
        });
      } else if (id) {
        HabitService.update(id, {
          name: name.trim(),
          scheduleType,
        });
      }
      router.back();
    } catch {
      // handled
    }
  };

  const handleDelete = () => {
    if (!id || isNew) return;
    try {
      HabitService.remove(id);
      router.back();
    } catch {
      // handled
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.bg }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Go back">
            <ArrowLeft size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={[theme.typography.h2, { color: theme.colors.text }]}>
            {isNew ? 'New Habit' : 'Habit Details'}
          </Text>
          {!isNew ? (
            <TouchableOpacity onPress={() => setShowDeleteConfirm(true)}>
              <Trash2 size={22} color={theme.colors.error} />
            </TouchableOpacity>
          ) : (
            <View style={{ width: 24 }} />
          )}
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <TextInput
            style={[theme.typography.h1, { color: theme.colors.text }]}
            value={name}
            onChangeText={setName}
            placeholder="Habit Name (e.g. Read 20 mins)"
            placeholderTextColor={theme.colors.textSecondary}
          />

          {!isNew && (
            <View
              style={[
                styles.streakCard,
                { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
              ]}
            >
              <Flame size={28} color={theme.colors.warning} />
              <View>
                <Text style={[theme.typography.bodyStrong, { color: theme.colors.text }]}>
                  {streak.currentStreak} Day Streak
                </Text>
                <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>
                  Best Streak: {streak.bestStreak} days • Total Check-ins: {streak.totalCheckins}
                </Text>
              </View>
            </View>
          )}

          <View style={styles.section}>
            <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>
              SCHEDULE
            </Text>
            <View style={styles.btnGroup}>
              {(['daily', 'weekdays', 'weekly_count'] as const).map((type) => (
                <TouchableOpacity
                  key={type}
                  onPress={() => setScheduleType(type)}
                  style={[
                    styles.groupBtn,
                    {
                      backgroundColor:
                        scheduleType === type ? theme.colors.primary : theme.colors.surface,
                      borderColor: theme.colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      theme.typography.caption,
                      { color: scheduleType === type ? '#fff' : theme.colors.text },
                    ]}
                  >
                    {type.toUpperCase().replace('_', ' ')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <Button onPress={handleSave} variant="primary">
            Save Habit
          </Button>
        </ScrollView>

        <ConfirmDialog
          visible={showDeleteConfirm}
          title="Delete Habit"
          message="Are you sure you want to delete this habit and all its history?"
          confirmLabel="Delete"
          destructive
          onConfirm={handleDelete}
          onClose={() => setShowDeleteConfirm(false)}
        />
      </KeyboardAvoidingView>
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
  content: { paddingHorizontal: 20, paddingBottom: 40, gap: 20 },
  streakCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 14,
  },
  section: { gap: 8 },
  btnGroup: { flexDirection: 'row', gap: 8 },
  groupBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
  },
});
