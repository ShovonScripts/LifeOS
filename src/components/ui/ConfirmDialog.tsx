import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/theme/useTheme';
import { Button } from './Button';

export interface ConfirmDialogProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  testID?: string;
}

export function ConfirmDialog({
  visible,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = false,
  testID,
}: ConfirmDialogProps) {
  const theme = useTheme();

  if (!visible) return null;

  return (
    <View style={styles.overlay} accessibilityViewIsModal onStartShouldSetResponder={() => true}>
      <Pressable onPress={onClose} style={styles.backdrop} accessible={false} />
      <View style={[styles.dialog, { backgroundColor: theme.colors.surface }]} testID={testID}>
        <View style={styles.content}>
          <Text style={[theme.typography.h3, { color: theme.colors.text }, styles.title]}>
            {title}
          </Text>
          {message && (
            <Text
              style={[theme.typography.body, { color: theme.colors.textSecondary }, styles.message]}
            >
              {message}
            </Text>
          )}
        </View>
        <View style={styles.actions}>
          <Button onPress={onClose} variant="ghost" size="md">
            {cancelLabel}
          </Button>
          <Button
            onPress={() => {
              onConfirm();
              onClose();
            }}
            variant={destructive ? 'destructive' : 'primary'}
            size="md"
          >
            {confirmLabel}
          </Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  dialog: {
    borderRadius: 20,
    padding: 20,
    elevation: 16,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 },
  },
  content: {
    gap: 12,
  },
  title: {
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 8,
  },
});
