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
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme/useTheme';
import { useTasks } from '@/features/tasks/hooks';
import { ProjectService } from '@/features/projects/service';
import { EmptyState, Chip, Button, SwipeableRow } from '@/components/ui';
import { Check, Trash2, Calendar, RotateCcw, Archive } from 'lucide-react-native';
import type { TaskRow, ProjectRow } from '@/db/schema';

type FilterTab = 'all' | 'today' | 'upcoming' | 'overdue' | 'done';

export default function TasksScreen() {
  const theme = useTheme();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [quickInput, setQuickInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [projects] = useState<ProjectRow[]>(() => {
    try {
      return ProjectService.list();
    } catch {
      return [];
    }
  });

  const todayStr = new Date().toISOString().split('T')[0] ?? '';

  const filterParam =
    activeTab === 'today'
      ? { dueLocalDate: todayStr }
      : activeTab === 'done'
        ? { statuses: ['done' as const] }
        : activeTab === 'upcoming'
          ? { statuses: ['todo' as const, 'doing' as const] }
          : activeTab === 'overdue'
            ? { overdue: true }
            : {};

  const baseFilter = {
    ...filterParam,
    projectId: selectedProjectId || undefined,
  };

  const { tasks, loading, quickAdd, toggleComplete, deleteTask, refresh } = useTasks(baseFilter);

  const filteredTasks = searchQuery
    ? tasks.filter(
        (t) =>
          t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.notes?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : tasks;

  const handleQuickAdd = () => {
    if (!quickInput.trim()) return;
    try {
      quickAdd(quickInput.trim());
      setQuickInput('');
    } catch {
      // handled in hook
    }
  };

  const clearProjectFilter = () => {
    setSelectedProjectId(null);
  };

  const renderItem = ({ item }: { item: TaskRow }) => {
    const isDone = item.status === 'done';
    const priorityColor =
      item.priority === 'high'
        ? theme.colors.error
        : item.priority === 'medium'
          ? theme.colors.warning
          : theme.colors.border;

    const isOverdue =
      item.dueLocalDate &&
      item.dueLocalDate < todayStr &&
      item.status !== 'done' &&
      item.status !== 'cancelled';

    const leftActions = [
      {
        label: isDone ? 'Undo' : 'Done',
        icon: isDone ? <RotateCcw size={20} color="#fff" /> : <Check size={20} color="#fff" />,
        color: isDone ? theme.colors.warning : theme.colors.success,
        onPress: () => toggleComplete(item.id, item.status),
      },
    ];

    const rightActions = [
      {
        label: 'Reschedule',
        icon: <Calendar size={20} color="#fff" />,
        color: theme.colors.info,
        onPress: () => router.push(`/task/${item.id}` as const),
      },
      {
        label: 'Delete',
        icon: <Trash2 size={20} color="#fff" />,
        color: theme.colors.error,
        onPress: () => deleteTask(item.id),
      },
    ];

    return (
      <SwipeableRow leftActions={leftActions} rightActions={rightActions} threshold={0.3}>
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

          <TouchableOpacity
            style={styles.taskContent}
            onPress={() => router.push(`/task/${item.id}` as const)}
          >
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
                <Text
                  style={[
                    theme.typography.caption,
                    {
                      color: isOverdue ? theme.colors.error : theme.colors.textSecondary,
                      fontWeight: isOverdue ? '600' : '400',
                    },
                  ]}
                >
                  📅 {item.dueLocalDate}
                  {isOverdue && ' (OVERDUE)'}
                </Text>
              )}
              {item.priority !== 'none' && (
                <View style={[styles.priorityDot, { backgroundColor: priorityColor }]} />
              )}
            </View>
          </TouchableOpacity>
        </View>
      </SwipeableRow>
    );
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.bg }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.headerRow}>
          <Text style={[theme.typography.h1, { color: theme.colors.text }]}>Tasks</Text>
          <TouchableOpacity
            style={[
              styles.projectFilterBtn,
              { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
            ]}
            accessibilityLabel="Filter by project"
          >
            <View style={styles.projectFilterContent}>
              {selectedProjectId ? (
                <>
                  <Text style={[theme.typography.caption, { color: theme.colors.text }]}>
                    {projects.find((p) => p.id === selectedProjectId)?.name || 'Project'}
                  </Text>
                  <TouchableOpacity
                    onPress={(e) => {
                      e.stopPropagation();
                      clearProjectFilter();
                    }}
                    style={styles.clearProjectBtn}
                    accessibilityLabel="Clear project filter"
                  >
                    <Archive size={14} color={theme.colors.textSecondary} />
                  </TouchableOpacity>
                </>
              ) : (
                <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>
                  All Projects
                </Text>
              )}
            </View>
          </TouchableOpacity>
        </View>

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

        {/* Search Bar */}
        <View style={[styles.searchContainer, { backgroundColor: theme.colors.surface }]}>
          <TextInput
            style={[styles.searchInput, { color: theme.colors.text }]}
            placeholder="Search tasks..."
            placeholderTextColor={theme.colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Filter Chips */}
        <View style={styles.filterRow}>
          {(['all', 'today', 'upcoming', 'overdue', 'done'] as FilterTab[]).map((tab) => (
            <Chip
              key={tab}
              label={tab.toUpperCase()}
              selected={activeTab === tab}
              onPress={() => setActiveTab(tab)}
            />
          ))}
        </View>

        {/* Task List */}
        {filteredTasks.length === 0 && !loading ? (
          <EmptyState
            title={searchQuery ? 'No matching tasks' : 'No tasks found'}
            body={
              searchQuery
                ? 'Try a different search term'
                : 'Create a new task above or relax for the day!'
            }
          />
        ) : (
          <FlatList
            data={filteredTasks}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            refreshing={loading}
            onRefresh={refresh}
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
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  projectFilterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    gap: 8,
  },
  projectFilterContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  clearProjectBtn: {
    padding: 2,
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
  searchContainer: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  searchInput: {
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
});
