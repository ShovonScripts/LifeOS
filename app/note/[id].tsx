import { useState } from 'react';
import {
  StyleSheet,
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
import { NoteService } from '@/features/notes/service';
import { Button, ConfirmDialog } from '@/components/ui';
import { ArrowLeft, Trash2, Pin } from 'lucide-react-native';
import type { NoteRow } from '@/db/schema';

export default function NoteDetailScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const isNew = id === 'new';

  const [note] = useState<NoteRow | null>(() => {
    if (isNew || !id) return null;
    try {
      return NoteService.get(id) ?? null;
    } catch {
      return null;
    }
  });

  const [title, setTitle] = useState(() => note?.title ?? '');
  const [body, setBody] = useState(() => note?.body ?? '');
  const [isPinned, setIsPinned] = useState(() => note?.isPinned ?? false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSave = () => {
    if (!title.trim() && !body.trim()) return;
    try {
      if (isNew) {
        NoteService.create({
          title: title.trim() || 'Untitled Note',
          body: body.trim(),
          isPinned,
        });
      } else if (id) {
        NoteService.update(id, {
          title: title.trim() || 'Untitled Note',
          body: body.trim(),
          isPinned,
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
      NoteService.remove(id);
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

          <View style={styles.headerRight}>
            <TouchableOpacity onPress={() => setIsPinned(!isPinned)}>
              <Pin size={22} color={isPinned ? theme.colors.primary : theme.colors.textSecondary} />
            </TouchableOpacity>
            {!isNew && (
              <TouchableOpacity onPress={() => setShowDeleteConfirm(true)}>
                <Trash2 size={22} color={theme.colors.error} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <TextInput
            style={[theme.typography.h1, { color: theme.colors.text }]}
            value={title}
            onChangeText={setTitle}
            placeholder="Note Title"
            placeholderTextColor={theme.colors.textSecondary}
          />

          <TextInput
            style={[
              styles.bodyInput,
              {
                backgroundColor: theme.colors.surface,
                color: theme.colors.text,
                borderColor: theme.colors.border,
              },
            ]}
            value={body}
            onChangeText={setBody}
            placeholder="Start writing..."
            placeholderTextColor={theme.colors.textSecondary}
            multiline
          />

          <Button onPress={handleSave} variant="primary">
            Save Note
          </Button>
        </ScrollView>

        <ConfirmDialog
          visible={showDeleteConfirm}
          title="Delete Note"
          message="Are you sure you want to delete this note?"
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
  headerRight: { flexDirection: 'row', gap: 16, alignItems: 'center' },
  content: { paddingHorizontal: 20, paddingBottom: 40, gap: 20 },
  bodyInput: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    minHeight: 250,
    textAlignVertical: 'top',
  },
});
