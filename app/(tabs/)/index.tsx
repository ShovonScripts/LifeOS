import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/theme/useTheme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EmptyState } from '@/components/ui';

export default function TodayScreen() {
  const theme = useTheme();
  const t = useTranslation();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.bg }]}>
      <View style={styles.container}>
        <View style={styles.hero}>
          <Text style={[theme.typography.micro, { color: theme.colors.textSecondary }]}>
            LIFEOS
          </Text>
          <Text style={[theme.typography.h1, styles.title, { color: theme.colors.text }]}>
            {t('today.tagline')}
          </Text>
          <Text style={[theme.typography.body, { color: theme.colors.textSecondary }]}>
            {t('today.subtitle')}
          </Text>
        </View>
        <View style={styles.cards}>
          <EmptyState title="No tasks today" body="Add a task to see it here" />
        </View>
      </View>
    </SafeAreaView>
  );
}

function useTranslation() {
  return (key: string) => {
    const map: Record<string, string> = {
      'today.tagline': 'Your life, one calm place.',
      'today.subtitle': 'Plan less. Do more.',
    };
    return map[key] ?? key;
  };
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    gap: 24,
  },
  hero: {
    marginTop: 12,
    gap: 8,
  },
  title: { maxWidth: 320 },
  cards: { gap: 12 },
});
