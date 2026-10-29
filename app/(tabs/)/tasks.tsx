import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/useTheme';
import { useTasks } from '@/features/tasks/hooks';
import { EmptyState, Chip, Button } from '@/components/ui';
import { Check, Trash2 } from 'lucide-react-native';
import type { TaskRow } from '@/db/schema';

type FilterTab = 'all' | 'today' | 'upcoming' | 'done';

export default function TasksScreen() {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [quickInput, setQuickInput] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];

  const filterParam =
    activeTab === 'today'
      ? { dueLocalDate: todayStr }
      : activeTab === 'done'
        ? { statuses: ['done' as const] }
        : activeTab === 'upcoming'
          ? { statuses: ['todo' as const, 'doing' as const] }
          : {};

  const { tasks, loading, quickAdd, toggleComplete, deleteTask } = useTasks(filterParam);

  const handleQuickAdd = () => {
    if (!quickInput.trim()) return;
    try {
      quickAdd(quickInput.trim());
      setQuickInput('');
    } catch {
      // handled in hook
    }
  };

  const renderItem = ({ item }: { item: TaskRow }) => {
    const isDone = item.status === 'done';
    const priorityColor =
      item.priority === 'high'
        ? theme.colors.error
        : item.priority === 'medium'
          ? theme.colors.warning
          : theme.colors.border;

    return (
      <View
        style={[
          styles.taskCard,
          { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
        ]}
      >
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => toggleComplete(item.id, item.status)}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: isDone }}
          accessibilityLabel={`Mark task ${item.title} as ${isDone ? 'incomplete' : 'complete'}`}
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
            {isDone && <Check size={14} color="#fff" />}
          </View>
        </TouchableOpacity>

        <View style={styles.taskContent}>
          <Text
            style={[
              theme.typography.body,
              {
                color: isDone ? theme.colors.textSecondary : theme.colors.text,
                textDecorationLine: isDone ? 'line-through' : 'none',
              },
            ]}
            numberOfLines={2}
          >
            {item.title}
          </Text>

          <View style={styles.metaRow}>
            {item.dueLocalDate && (
              <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>
                📅 {item.dueLocalDate}
              </Text>
            )}
            {item.priority !== 'none' && (
              <View style={[styles.priorityDot, { backgroundColor: priorityColor }]} />
            )}
          </View>
        </View>

        <TouchableOpacity
          onPress={() => deleteTask(item.id)}
          style={styles.deleteButton}
          accessibilityRole="button"
          accessibilityLabel={`Delete task ${item.title}`}
        >
          <Trash2 size={18} color={theme.colors.error} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.bg }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <Text style={[theme.typography.h1, { color: theme.colors.text }]}>Tasks</Text>

        {/* Quick Add Bar */}
        <View style={[styles.quickAddContainer, { backgroundColor: theme.colors.surface }]}>
          <TextInput
            style={[styles.quickInput, { color: theme.colors.text }]}
            placeholder="Add task... (e.g. Finish report tomorrow !high)"
            placeholderTextColor={theme.colors.textSecondary}
            value={quickInput}
            onChangeText={setQuickInput}
            onSubmitEditing={handleQuickAdd}
            returnKeyType="done"
          />
          <Button onPress={handleQuickAdd} size="md">
            Add
          </Button>
        </View>

        {/* Filter Chips */}
        <View style={styles.filterRow}>
          {(['all', 'today', 'upcoming', 'done'] as FilterTab[]).map((tab) => (
            <Chip
              key={tab}
              label={tab.toUpperCase()}
              selected={activeTab === tab}
              onPress={() => setActiveTab(tab)}
            />
          ))}
        </View>

        {/* Task List */}
        {tasks.length === 0 && !loading ? (
          <EmptyState title="No tasks found" body="Create a new task above or relax for the day!" />
        ) : (
          <FlatList
            data={tasks}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
          />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 16,
  },
  quickAddContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  quickInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 4,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
  },
  listContent: {
    gap: 10,
    paddingBottom: 24,
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  checkboxContainer: {
    padding: 2,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskContent: {
    flex: 1,
    gap: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  deleteButton: {
    padding: 6,
  },
});
