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
import { GoalService } from '@/features/goals/service';
import { Button, ProgressBar, ConfirmDialog } from '@/components/ui';
import { ArrowLeft, Trash2, Check, Plus } from 'lucide-react-native';
import type { GoalRow, GoalMilestoneRow } from '@/db/schema';

export default function GoalDetailScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const isNew = id === 'new';

  const [goal] = useState<GoalRow | null>(() => {
    if (isNew || !id) return null;
    try {
      return GoalService.get(id) ?? null;
    } catch {
      return null;
    }
  });

  const [milestones, setMilestones] = useState<GoalMilestoneRow[]>(() => {
    if (isNew || !id) return [];
    try {
      return GoalService.getMilestones(id);
    } catch {
      return [];
    }
  });

  const [title, setTitle] = useState(() => goal?.title ?? '');
  const [description] = useState(() => goal?.description ?? '');
  const [type, setType] = useState<'numeric' | 'milestone'>(() => goal?.type ?? 'numeric');
  const [targetValue, setTargetValue] = useState(() => String(goal?.targetValue ?? 100));
  const [currentValue, setCurrentValue] = useState(() => String(goal?.currentValue ?? 0));
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSave = () => {
    if (!title.trim()) return;
    try {
      const targetVal = parseFloat(targetValue) || 100;
      const currentVal = parseFloat(currentValue) || 0;

      if (isNew) {
        GoalService.create({
          title: title.trim(),
          description: description.trim() || null,
          type,
          targetValue: targetVal,
          currentValue: currentVal,
        });
      } else if (id) {
        GoalService.update(id, {
          title: title.trim(),
          description: description.trim() || null,
          type,
          targetValue: targetVal,
          currentValue: currentVal,
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
      GoalService.remove(id);
      router.back();
    } catch {
      // handled
    }
  };

  const handleAddMilestone = () => {
    if (!id || !newMilestoneTitle.trim()) return;
    try {
      const created = GoalService.createMilestone({
        goalId: id,
        title: newMilestoneTitle.trim(),
        isDone: false,
      });
      setMilestones((prev) => [...prev, created]);
      setNewMilestoneTitle('');
    } catch {
      // handled
    }
  };

  const handleToggleMilestone = (m: GoalMilestoneRow) => {
    try {
      const updated = GoalService.toggleMilestone(m.id, m.isDone);
      setMilestones((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
    } catch {
      // handled
    }
  };

  const progressPercent =
    type === 'numeric'
      ? Math.min(1, (parseFloat(currentValue) || 0) / (parseFloat(targetValue) || 1))
      : milestones.length > 0
        ? milestones.filter((m) => m.isDone).length / milestones.length
        : 0;

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
            {isNew ? 'New Goal' : 'Goal Details'}
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
            value={title}
            onChangeText={setTitle}
            placeholder="Goal Title"
            placeholderTextColor={theme.colors.textSecondary}
          />

          {!isNew && (
            <View
              style={[
                styles.progressCard,
                { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
              ]}
            >
              <Text style={[theme.typography.bodyStrong, { color: theme.colors.text }]}>
                Progress: {Math.round(progressPercent * 100)}%
              </Text>
              <ProgressBar progress={progressPercent} />
            </View>
          )}

          <View style={styles.section}>
            <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>
              TYPE
            </Text>
            <View style={styles.btnGroup}>
              <TouchableOpacity
                onPress={() => setType('numeric')}
                style={[
                  styles.groupBtn,
                  {
                    backgroundColor:
                      type === 'numeric' ? theme.colors.primary : theme.colors.surface,
                    borderColor: theme.colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    theme.typography.caption,
                    { color: type === 'numeric' ? '#fff' : theme.colors.text },
                  ]}
                >
                  NUMERIC
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setType('milestone')}
                style={[
                  styles.groupBtn,
                  {
                    backgroundColor:
                      type === 'milestone' ? theme.colors.primary : theme.colors.surface,
                    borderColor: theme.colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    theme.typography.caption,
                    { color: type === 'milestone' ? '#fff' : theme.colors.text },
                  ]}
                >
                  MILESTONE
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {type === 'numeric' ? (
            <View style={styles.numericRow}>
              <View style={[styles.section, { flex: 1 }]}>
                <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>
                  CURRENT VALUE
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: theme.colors.surface,
                      color: theme.colors.text,
                      borderColor: theme.colors.border,
                    },
                  ]}
                  value={currentValue}
                  onChangeText={setCurrentValue}
                  keyboardType="numeric"
                />
              </View>

              <View style={[styles.section, { flex: 1 }]}>
                <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>
                  TARGET VALUE
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: theme.colors.surface,
                      color: theme.colors.text,
                      borderColor: theme.colors.border,
                    },
                  ]}
                  value={targetValue}
                  onChangeText={setTargetValue}
                  keyboardType="numeric"
                />
              </View>
            </View>
          ) : (
            <View style={styles.section}>
              <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>
                MILESTONES
              </Text>
              {milestones.map((m) => (
                <TouchableOpacity
                  key={m.id}
                  onPress={() => handleToggleMilestone(m)}
                  style={[
                    styles.milestoneRow,
                    { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
                  ]}
                >
                  <View
                    style={[
                      styles.checkbox,
                      {
                        borderColor: m.isDone ? theme.colors.primary : theme.colors.textSecondary,
                        backgroundColor: m.isDone ? theme.colors.primary : 'transparent',
                      },
                    ]}
                  >
                    {m.isDone && <Check size={12} color="#fff" />}
                  </View>
                  <Text
                    style={[
                      theme.typography.body,
                      {
                        color: m.isDone ? theme.colors.textSecondary : theme.colors.text,
                        textDecorationLine: m.isDone ? 'line-through' : 'none',
                      },
                    ]}
                  >
                    {m.title}
                  </Text>
                </TouchableOpacity>
              ))}

              <View style={styles.addMilestoneRow}>
                <TextInput
                  style={[
                    styles.input,
                    {
                      flex: 1,
                      backgroundColor: theme.colors.surface,
                      color: theme.colors.text,
                      borderColor: theme.colors.border,
                    },
                  ]}
                  value={newMilestoneTitle}
                  onChangeText={setNewMilestoneTitle}
                  placeholder="New milestone..."
                  placeholderTextColor={theme.colors.textSecondary}
                  onSubmitEditing={handleAddMilestone}
                />
                <TouchableOpacity
                  onPress={handleAddMilestone}
                  style={[styles.addBtn, { backgroundColor: theme.colors.primary }]}
                >
                  <Plus size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          )}

          <Button onPress={handleSave} variant="primary">
            Save Goal
          </Button>
        </ScrollView>

        <ConfirmDialog
          visible={showDeleteConfirm}
          title="Delete Goal"
          message="Are you sure you want to delete this goal and its milestones?"
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
  progressCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 10,
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
  numericRow: { flexDirection: 'row', gap: 12 },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
  },
  milestoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    gap: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addMilestoneRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  addBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
