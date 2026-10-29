import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/theme/useTheme';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive';
export type ButtonSize = 'md' | 'lg';

export interface ButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  accessibilityLabel?: string;
  testID?: string;
}

export function Button({
  children,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  accessibilityLabel,
  testID,
}: ButtonProps) {
  const theme = useTheme();

  const isDisabled = disabled || loading;
  const baseStyles = [
    styles.button,
    size === 'lg' ? styles.buttonLg : styles.buttonMd,
    {
      backgroundColor: isDisabled
        ? theme.colors.border
        : variant === 'primary'
          ? theme.colors.primary
          : variant === 'secondary'
            ? theme.colors.surfaceAlt
            : variant === 'destructive'
              ? theme.colors.error
              : 'transparent',
      borderWidth: variant === 'ghost' || variant === 'secondary' ? 1 : 0,
      borderColor: variant === 'ghost' ? theme.colors.border : undefined,
    },
  ];

  const textStyles = [
    theme.typography.bodyStrong,
    {
      color: isDisabled
        ? theme.colors.textSecondary
        : variant === 'primary'
          ? theme.colors.textOnPrimary
          : variant === 'destructive'
            ? theme.colors.textOnPrimary
            : theme.colors.text,
    },
  ];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [...baseStyles, pressed && !isDisabled && { opacity: 0.8 }]}
      testID={testID}
    >
      {loading ? <View style={styles.spinner} /> : <Text style={textStyles}>{children}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    minHeight: 48,
  },
  buttonMd: {
    paddingHorizontal: 16,
  },
  buttonLg: {
    paddingHorizontal: 24,
  },
  spinner: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: 'currentColor',
    borderTopColor: 'transparent',
    borderRadius: 10,
  },
});
