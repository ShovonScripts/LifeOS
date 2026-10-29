import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/theme/useTheme';
import { Button } from './Button';

export interface EmptyStateProps {
  title: string;
  body?: string;
  actionLabel?: string;
  onAction?: () => void;
  illustration?: React.ReactNode;
  testID?: string;
}

export function EmptyState({
  title,
  body,
  actionLabel,
  onAction,
  illustration,
  testID,
}: EmptyStateProps) {
  const theme = useTheme();

  return (
    <View style={[styles.container, { padding: theme.spacing.xl }]} testID={testID}>
      {illustration ? (
        <View style={styles.illustration}>{illustration}</View>
      ) : (
        <View style={[styles.placeholder, { backgroundColor: theme.colors.surfaceAlt }]} />
      )}
      <Text style={[theme.typography.h3, styles.title, { color: theme.colors.text }]}>{title}</Text>
      {body && (
        <Text style={[theme.typography.body, styles.body, { color: theme.colors.textSecondary }]}>
          {body}
        </Text>
      )}
      {actionLabel && onAction && (
        <Button onPress={onAction} variant="primary" size="md" testID={`${testID}-action`}>
          {actionLabel}
        </Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  placeholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  illustration: {
    marginBottom: 8,
  },
  title: {
    textAlign: 'center',
  },
  body: {
    textAlign: 'center',
    maxWidth: 280,
  },
});
