import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/theme/useTheme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EmptyState } from '@/components/ui';

export default function CalendarScreen() {
  const theme = useTheme();
  const t = useTranslation();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.bg }]}>
      <View style={styles.container}>
        <Text style={[theme.typography.h1, { color: theme.colors.text }]}>
          {t('calendar.title')}
        </Text>
        <EmptyState title={t('calendar.emptyTitle')} body={t('calendar.emptyBody')} />
      </View>
    </SafeAreaView>
  );
}

function useTranslation() {
  return (key: string) => {
    const map: Record<string, string> = {
      'calendar.title': 'Calendar',
      'calendar.emptyTitle': 'No events',
      'calendar.emptyBody': 'Your schedule will appear here.',
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
