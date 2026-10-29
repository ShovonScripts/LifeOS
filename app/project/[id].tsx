import { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '@/theme/useTheme';
import { ProjectService } from '@/features/projects/service';
import { useTasks } from '@/features/tasks/hooks';
import { EmptyState } from '@/components/ui';
import { ArrowLeft, Check } from 'lucide-react-native';
import type { ProjectRow, TaskRow } from '@/db/schema';

export default function ProjectDetailScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [project] = useState<ProjectRow | null>(() => {
    if (!id) return null;
    try {
      return ProjectService.get(id) ?? null;
    } catch {
      return null;
    }
  });

  const { tasks, toggleComplete } = useTasks(id ? { projectId: id } : {});

  if (!project) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.bg }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Go back">
            <ArrowLeft size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </View>
        <View style={styles.center}>
          <Text style={[theme.typography.body, { color: theme.colors.textSecondary }]}>
            Project not found.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const renderTask = ({ item }: { item: TaskRow }) => {
    const isDone = item.status === 'done';

    return (
      <TouchableOpacity
        style={[
          styles.taskCard,
          { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
        ]}
        onPress={() => router.push(`/task/${item.id}` as const)}
      >
        <TouchableOpacity
          onPress={() => toggleComplete(item.id, item.status)}
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
          {item.title}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.bg }]}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Go back">
            <ArrowLeft size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={[theme.typography.h2, { color: theme.colors.text }]}>{project.name}</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Tasks in Project */}
        {tasks.length === 0 ? (
          <EmptyState
            title="No tasks in this project"
            body="Assign tasks to this project to track them here."
          />
        ) : (
          <FlatList
            data={tasks}
            keyExtractor={(item) => item.id}
            renderItem={renderTask}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 12, gap: 16 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  listContent: { gap: 10, paddingBottom: 24 },
  taskCard: {
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
