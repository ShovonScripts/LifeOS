import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/theme/useTheme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EmptyState } from '@/components/ui';

export default function NotesScreen() {
  const theme = useTheme();
  const t = useTranslation();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.bg }]}>
      <View style={styles.container}>
        <Text style={[theme.typography.h1, { color: theme.colors.text }]}>{t('notes.title')}</Text>
        <EmptyState title={t('notes.emptyTitle')} body={t('notes.emptyBody')} />
      </View>
    </SafeAreaView>
  );
}

function useTranslation() {
  return (key: string) => {
    const map: Record<string, string> = {
      'notes.title': 'Notes',
      'notes.emptyTitle': 'No notes',
      'notes.emptyBody': 'Capture ideas, lists, and drafts.',
    };
    return map[key] ?? key;
  };
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    gap: 16,
  },
});
