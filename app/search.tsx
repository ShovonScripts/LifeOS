import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme/useTheme';
import { TaskService } from '@/features/tasks/service';
import { NoteService } from '@/features/notes/service';
import { ProjectService } from '@/features/projects/service';
import {
  ArrowLeft,
  Search as SearchIcon,
  CheckSquare,
  FileText,
  Folder,
} from 'lucide-react-native';
import type { TaskRow, NoteRow, ProjectRow } from '@/db/schema';

type SearchResultItem =
  | { type: 'task'; data: TaskRow }
  | { type: 'note'; data: NoteRow }
  | { type: 'project'; data: ProjectRow };

export default function SearchScreen() {
  const theme = useTheme();
  const router = useRouter();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResultItem[]>([]);

  const handleSearch = (text: string) => {
    setQuery(text);
    if (!text.trim()) {
      setResults([]);
      return;
    }

    try {
      const allTasks = TaskService.list().filter((t) =>
        t.title.toLowerCase().includes(text.toLowerCase()),
      );
      const allNotes = NoteService.list(text);
      const allProjects = ProjectService.list().filter((p) =>
        p.name.toLowerCase().includes(text.toLowerCase()),
      );

      const items: SearchResultItem[] = [
        ...allTasks.map((t) => ({ type: 'task' as const, data: t })),
        ...allNotes.map((n) => ({ type: 'note' as const, data: n })),
        ...allProjects.map((p) => ({ type: 'project' as const, data: p })),
      ];

      setResults(items);
    } catch {
      // handled
    }
  };

  const renderItem = ({ item }: { item: SearchResultItem }) => {
    if (item.type === 'task') {
      return (
        <TouchableOpacity
          style={[
            styles.card,
            { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
          ]}
          onPress={() => router.push(`/task/${item.data.id}` as const)}
        >
          <CheckSquare size={20} color={theme.colors.primary} />
          <View style={{ flex: 1 }}>
            <Text style={[theme.typography.bodyStrong, { color: theme.colors.text }]}>
              {item.data.title}
            </Text>
            <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>
              Task
            </Text>
          </View>
        </TouchableOpacity>
      );
    } else if (item.type === 'note') {
      return (
        <TouchableOpacity
          style={[
            styles.card,
            { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
          ]}
          onPress={() => router.push(`/note/${item.data.id}` as const)}
        >
          <FileText size={20} color={theme.colors.warning} />
          <View style={{ flex: 1 }}>
            <Text style={[theme.typography.bodyStrong, { color: theme.colors.text }]}>
              {item.data.title || 'Untitled Note'}
            </Text>
            <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>
              Note
            </Text>
          </View>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          style={[
            styles.card,
            { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
          ]}
          onPress={() => router.push(`/project/${item.data.id}` as const)}
        >
          <Folder size={20} color={theme.colors.info} />
          <View style={{ flex: 1 }}>
            <Text style={[theme.typography.bodyStrong, { color: theme.colors.text }]}>
              {item.data.name}
            </Text>
            <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>
              Project
            </Text>
          </View>
        </TouchableOpacity>
      );
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.bg }]}>
      <View style={styles.container}>
        {/* Search Bar Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Go back">
            <ArrowLeft size={24} color={theme.colors.text} />
          </TouchableOpacity>

          <View style={[styles.searchInputRow, { backgroundColor: theme.colors.surface }]}>
            <SearchIcon size={18} color={theme.colors.textSecondary} />
            <TextInput
              style={[styles.input, { color: theme.colors.text }]}
              placeholder="Search tasks, notes, projects..."
              placeholderTextColor={theme.colors.textSecondary}
              value={query}
              onChangeText={handleSearch}
              autoFocus
            />
          </View>
        </View>

        {/* Results */}
        <FlatList
          data={results}
          keyExtractor={(item) => `${item.type}-${item.data.id}`}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 12, gap: 16 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchInputRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderRadius: 12,
    gap: 8,
  },
  input: { flex: 1, paddingVertical: 10, fontSize: 15 },
  listContent: { gap: 10, paddingBottom: 24 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
});
