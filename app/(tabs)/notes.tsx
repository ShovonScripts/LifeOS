import { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme/useTheme';
import { NoteService } from '@/features/notes/service';
import { FAB, EmptyState } from '@/components/ui';
import { Search, Pin, Plus } from 'lucide-react-native';
import type { NoteRow } from '@/db/schema';

export default function NotesScreen() {
  const theme = useTheme();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [notes, setNotes] = useState<NoteRow[]>(() => {
    try {
      return NoteService.list();
    } catch {
      return [];
    }
  });

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    try {
      setNotes(NoteService.list(text));
    } catch {
      // handled
    }
  };

  const renderNoteItem = ({ item }: { item: NoteRow }) => (
    <TouchableOpacity
      style={[
        styles.noteCard,
        { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
      ]}
      onPress={() => router.push(`/note/${item.id}` as const)}
    >
      <View style={styles.cardHeader}>
        <Text style={[theme.typography.bodyStrong, { color: theme.colors.text, flex: 1 }]}>
          {item.title || 'Untitled Note'}
        </Text>
        {item.isPinned && <Pin size={16} color={theme.colors.primary} />}
      </View>
      {item.body ? (
        <Text
          style={[theme.typography.caption, { color: theme.colors.textSecondary }]}
          numberOfLines={2}
        >
          {item.body}
        </Text>
      ) : null}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.bg }]}>
      <View style={styles.container}>
        <Text style={[theme.typography.h1, { color: theme.colors.text }]}>Notes</Text>

        {/* Search Bar */}
        <View style={[styles.searchRow, { backgroundColor: theme.colors.surface }]}>
          <Search size={18} color={theme.colors.textSecondary} />
          <TextInput
            style={[styles.input, { color: theme.colors.text }]}
            placeholder="Search notes..."
            placeholderTextColor={theme.colors.textSecondary}
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>

        {/* Notes Grid / List */}
        {notes.length === 0 ? (
          <EmptyState title="No notes found" body="Tap the '+' button to capture your thoughts." />
        ) : (
          <FlatList
            data={notes}
            keyExtractor={(item) => item.id}
            renderItem={renderNoteItem}
            contentContainerStyle={styles.listContent}
          />
        )}

        <FAB
          icon={Plus}
          onPress={() => router.push('/note/new' as const)}
          accessibilityLabel="Add new note"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 12, gap: 16 },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderRadius: 12,
    gap: 8,
  },
  input: { flex: 1, paddingVertical: 10, fontSize: 15 },
  listContent: { gap: 10, paddingBottom: 80 },
  noteCard: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    gap: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
