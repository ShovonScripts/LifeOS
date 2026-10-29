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
import { CalendarService } from '@/features/calendar/service';
import { Button, ConfirmDialog } from '@/components/ui';
import { ArrowLeft, Trash2 } from 'lucide-react-native';
import type { EventRow } from '@/db/schema';

export default function EventDetailScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const isNew = id === 'new';

  const [event] = useState<EventRow | null>(() => {
    if (isNew || !id) return null;
    try {
      return CalendarService.getEvent(id) ?? null;
    } catch {
      return null;
    }
  });

  const todayStr = new Date().toISOString().split('T')[0];

  const [title, setTitle] = useState(() => event?.title ?? '');
  const [notes, setNotes] = useState(() => event?.notes ?? '');
  const [location, setLocation] = useState(() => event?.location ?? '');
  const [startsAt, setStartsAt] = useState(() => event?.startsAt ?? `${todayStr}T09:00:00.000Z`);
  const [endsAt, setEndsAt] = useState(() => event?.endsAt ?? `${todayStr}T10:00:00.000Z`);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSave = () => {
    if (!title.trim()) return;
    try {
      if (isNew) {
        CalendarService.createEvent({
          title: title.trim(),
          notes: notes.trim() || null,
          location: location.trim() || null,
          startsAt,
          endsAt,
          isAllDay: false,
          timezone: 'UTC',
        });
      } else if (id) {
        CalendarService.updateEvent(id, {
          title: title.trim(),
          notes: notes.trim() || null,
          location: location.trim() || null,
          startsAt,
          endsAt,
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
      CalendarService.deleteEvent(id);
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
            {isNew ? 'New Event' : 'Event Details'}
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
            placeholder="Event Title"
            placeholderTextColor={theme.colors.textSecondary}
          />

          <View style={styles.section}>
            <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>
              START TIME (ISO String)
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
              value={startsAt}
              onChangeText={setStartsAt}
            />
          </View>

          <View style={styles.section}>
            <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>
              END TIME (ISO String)
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
              value={endsAt}
              onChangeText={setEndsAt}
            />
          </View>

          <View style={styles.section}>
            <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>
              LOCATION
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
              value={location}
              onChangeText={setLocation}
              placeholder="Add location..."
              placeholderTextColor={theme.colors.textSecondary}
            />
          </View>

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
              placeholder="Add notes..."
              placeholderTextColor={theme.colors.textSecondary}
              multiline
            />
          </View>

          <Button onPress={handleSave} variant="primary">
            Save Event
          </Button>
        </ScrollView>

        <ConfirmDialog
          visible={showDeleteConfirm}
          title="Delete Event"
          message="Are you sure you want to delete this event?"
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
  section: { gap: 8 },
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
});
