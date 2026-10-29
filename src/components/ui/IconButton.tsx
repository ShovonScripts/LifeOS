import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { useTheme } from '@/theme/useTheme';

export interface IconButtonProps {
  icon: React.ComponentType<{ size: number; color: string }>;
  onPress: () => void;
  accessibilityLabel: string;
  size?: number;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  testID?: string;
}

export function IconButton({
  icon: Icon,
  onPress,
  accessibilityLabel,
  size = 24,
  variant = 'ghost',
  disabled = false,
  testID,
}: IconButtonProps) {
  const theme = useTheme();

  const hitSlop = 12;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      hitSlop={{ top: hitSlop, bottom: hitSlop, left: hitSlop, right: hitSlop }}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor:
            variant === 'primary'
              ? theme.colors.primary
              : variant === 'secondary'
                ? theme.colors.surfaceAlt
                : 'transparent',
          opacity: pressed && !disabled ? 0.7 : 1,
        },
      ]}
      testID={testID}
    >
      <Icon
        size={size}
        color={
          variant === 'primary'
            ? theme.colors.textOnPrimary
            : variant === 'secondary'
              ? theme.colors.text
              : theme.colors.textSecondary
        }
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 48,
    borderRadius: 999,
  },
});
