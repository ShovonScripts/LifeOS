import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/theme/useTheme';
import { useSnackbarStore } from './SnackbarStore';
import { Button } from './Button';

export function Snackbar() {
  const theme = useTheme();
  const { visible, message, actionLabel, onAction, hide } = useSnackbarStore();

  if (!visible) return null;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
      ]}
      accessibilityLiveRegion="polite"
    >
      <View style={styles.content}>
        <Text style={[theme.typography.body, { color: theme.colors.text, flex: 1 }]}>
          {message}
        </Text>
        {actionLabel && onAction && (
          <Button
            onPress={() => {
              onAction();
              hide();
            }}
            variant="ghost"
            size="md"
          >
            {actionLabel}
          </Button>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 12,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
});
