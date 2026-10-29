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
import { TaskService } from '@/features/tasks/service';
import { SubtaskService } from '@/features/subtasks/service';
import { Button, Chip, ConfirmDialog } from '@/components/ui';
import { ArrowLeft, Plus, Check, Trash2 } from 'lucide-react-native';
import type { TaskRow, SubtaskRow } from '@/db/schema';

export default function TaskDetailScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [task] = useState<TaskRow | null>(() => {
    if (!id) return null;
    try {
      return TaskService.get(id) ?? null;
    } catch {
      return null;
    }
  });

  const [subtasks, setSubtasks] = useState<SubtaskRow[]>(() => {
    if (!id) return [];
    try {
      return SubtaskService.listForTask(id);
    } catch {
      return [];
    }
  });

  const [title, setTitle] = useState(() => task?.title ?? '');
  const [notes, setNotes] = useState(() => task?.notes ?? '');
  const [priority, setPriority] = useState<'none' | 'low' | 'medium' | 'high'>(
    () => task?.priority ?? 'none',
  );
  const [dueLocalDate, setDueLocalDate] = useState(() => task?.dueLocalDate ?? '');
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSave = () => {
    if (!id || !title.trim()) return;
    try {
      TaskService.update(id, {
        title: title.trim(),
        notes: notes.trim() || null,
        priority,
        dueLocalDate: dueLocalDate.trim() || null,
      });
      router.back();
    } catch {
      // handled
    }
  };

  const handleDelete = () => {
    if (!id) return;
    try {
      TaskService.remove(id);
      router.back();
    } catch {
      // handled
    }
  };

  const handleAddSubtask = () => {
    if (!id || !newSubtaskTitle.trim()) return;
    try {
      const created = SubtaskService.create({
        taskId: id,
        title: newSubtaskTitle.trim(),
        isDone: false,
      });
      setSubtasks((prev) => [...prev, created]);
      setNewSubtaskTitle('');
    } catch {
      // handled
    }
  };

  const handleToggleSubtask = (subtask: SubtaskRow) => {
    try {
      const updated = SubtaskService.toggleComplete(subtask.id, subtask.isDone);
      setSubtasks((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    } catch {
      // handled
    }
  };

  const handleDeleteSubtask = (subtaskId: string) => {
    try {
      SubtaskService.remove(subtaskId);
      setSubtasks((prev) => prev.filter((s) => s.id !== subtaskId));
    } catch {
      // handled
    }
  };

  if (!task) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.bg }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Go back">
            <ArrowLeft size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </View>
        <View style={styles.center}>
          <Text style={[theme.typography.body, { color: theme.colors.textSecondary }]}>
            Task not found.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.bg }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {/* Top Navigation */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.iconBtn}
            accessibilityLabel="Go back"
          >
            <ArrowLeft size={24} color={theme.colors.text} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setShowDeleteConfirm(true)}
            style={styles.iconBtn}
            accessibilityLabel="Delete task"
          >
            <Trash2 size={22} color={theme.colors.error} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          {/* Title Input */}
          <TextInput
            style={[theme.typography.h1, { color: theme.colors.text }]}
            value={title}
            onChangeText={setTitle}
            placeholder="Task Title"
            placeholderTextColor={theme.colors.textSecondary}
            multiline
          />

          {/* Priority Options */}
          <View style={styles.section}>
            <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>
              PRIORITY
            </Text>
            <View style={styles.chipRow}>
              {(['none', 'low', 'medium', 'high'] as const).map((p) => (
                <Chip
                  key={p}
                  label={p.toUpperCase()}
                  selected={priority === p}
                  onPress={() => setPriority(p)}
                />
              ))}
            </View>
          </View>

          {/* Due Date Input */}
          <View style={styles.section}>
            <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>
              DUE DATE (YYYY-MM-DD)
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
              value={dueLocalDate}
              onChangeText={setDueLocalDate}
              placeholder="e.g. 2025-06-15"
              placeholderTextColor={theme.colors.textSecondary}
            />
          </View>

          {/* Notes */}
          <View style={styles.section}>
            <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>
              NOTES
            </Text>
            <TextInput
              style={[
                styles.notesInput,
                {
                  backgroundColor: theme.colors.surface,
                  color: theme.colors.text,
                  borderColor: theme.colors.border,
                },
              ]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Add details or notes..."
              placeholderTextColor={theme.colors.textSecondary}
              multiline
            />
          </View>

          {/* Subtasks Section */}
          <View style={styles.section}>
            <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>
              SUBTASKS ({subtasks.filter((s) => s.isDone).length}/{subtasks.length})
            </Text>

            {subtasks.map((sub) => (
              <View
                key={sub.id}
                style={[
                  styles.subtaskRow,
                  { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
                ]}
              >
                <TouchableOpacity
                  onPress={() => handleToggleSubtask(sub)}
                  style={styles.checkboxContainer}
                >
                  <View
                    style={[
                      styles.checkbox,
                      {
                        borderColor: sub.isDone ? theme.colors.primary : theme.colors.textSecondary,
                        backgroundColor: sub.isDone ? theme.colors.primary : 'transparent',
                      },
                    ]}
                  >
                    {sub.isDone && <Check size={12} color="#fff" />}
                  </View>
                </TouchableOpacity>

                <Text
                  style={[
                    theme.typography.body,
                    {
                      flex: 1,
                      color: sub.isDone ? theme.colors.textSecondary : theme.colors.text,
                      textDecorationLine: sub.isDone ? 'line-through' : 'none',
                    },
                  ]}
                >
                  {sub.title}
                </Text>

                <TouchableOpacity
                  onPress={() => handleDeleteSubtask(sub.id)}
                  style={{ padding: 4 }}
                >
                  <Trash2 size={16} color={theme.colors.textSecondary} />
                </TouchableOpacity>
              </View>
            ))}

            {/* Add Subtask Input */}
            <View style={styles.addSubtaskRow}>
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
                value={newSubtaskTitle}
                onChangeText={setNewSubtaskTitle}
                placeholder="Add a subtask..."
                placeholderTextColor={theme.colors.textSecondary}
                onSubmitEditing={handleAddSubtask}
              />
              <TouchableOpacity
                onPress={handleAddSubtask}
                style={[styles.addBtn, { backgroundColor: theme.colors.primary }]}
              >
                <Plus size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          <Button onPress={handleSave} variant="primary">
            Save Changes
          </Button>
        </ScrollView>

        <ConfirmDialog
          visible={showDeleteConfirm}
          title="Delete Task"
          message="Are you sure you want to delete this task? This action cannot be undone."
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
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  iconBtn: { padding: 4 },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 20,
  },
  section: {
    gap: 8,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
  },
  notesInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  subtaskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    gap: 10,
  },
  checkboxContainer: {
    padding: 2,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addSubtaskRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  addBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
