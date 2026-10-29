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
import { ProjectService } from '@/features/projects/service';
import { Button, EmptyState } from '@/components/ui';
import { ArrowLeft, Folder, Trash2 } from 'lucide-react-native';
import type { ProjectRow } from '@/db/schema';

export default function ProjectsScreen() {
  const theme = useTheme();
  const router = useRouter();

  const [projects, setProjects] = useState<ProjectRow[]>(() => {
    try {
      return ProjectService.list();
    } catch {
      return [];
    }
  });
  const [newProjectName, setNewProjectName] = useState('');

  const refreshProjects = () => {
    try {
      setProjects(ProjectService.list());
    } catch {
      // handled
    }
  };

  const handleCreateProject = () => {
    if (!newProjectName.trim()) return;
    try {
      ProjectService.create({ name: newProjectName.trim() });
      setNewProjectName('');
      refreshProjects();
    } catch {
      // handled
    }
  };

  const handleDeleteProject = (id: string) => {
    try {
      ProjectService.remove(id);
      refreshProjects();
    } catch {
      // handled
    }
  };

  const renderItem = ({ item }: { item: ProjectRow }) => (
    <View
      style={[
        styles.projectCard,
        { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
      ]}
    >
      <TouchableOpacity
        style={styles.projectMain}
        onPress={() => router.push(`/project/${item.id}` as const)}
      >
        <Folder size={20} color={theme.colors.primary} />
        <Text style={[theme.typography.bodyStrong, { color: theme.colors.text, flex: 1 }]}>
          {item.name}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => handleDeleteProject(item.id)}
        style={styles.deleteBtn}
        accessibilityLabel={`Delete project ${item.name}`}
      >
        <Trash2 size={18} color={theme.colors.error} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.bg }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Go back">
            <ArrowLeft size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={[theme.typography.h2, { color: theme.colors.text }]}>Projects</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Create Input */}
        <View style={[styles.inputRow, { backgroundColor: theme.colors.surface }]}>
          <TextInput
            style={[styles.input, { color: theme.colors.text }]}
            placeholder="New project name..."
            placeholderTextColor={theme.colors.textSecondary}
            value={newProjectName}
            onChangeText={setNewProjectName}
            onSubmitEditing={handleCreateProject}
          />
          <Button onPress={handleCreateProject} size="md">
            Add
          </Button>
        </View>

        {/* Projects List */}
        {projects.length === 0 ? (
          <EmptyState
            title="No projects yet"
            body="Group your tasks into projects to stay organized."
          />
        ) : (
          <FlatList
            data={projects}
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
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 12, gap: 16 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  input: { flex: 1, fontSize: 15, paddingVertical: 4 },
  listContent: { gap: 10, paddingBottom: 24 },
  projectCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  projectMain: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  deleteBtn: { padding: 4 },
});
