import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/theme/useTheme';

export interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
  accessibilityLabel?: string;
  testID?: string;
}

export function Chip({
  label,
  selected = false,
  onPress,
  icon,
  disabled = false,
  accessibilityLabel,
  testID,
}: ChipProps) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ selected, disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        {
          backgroundColor: selected
            ? theme.colors.primarySoft
            : disabled
              ? theme.colors.surfaceAlt
              : theme.colors.surface,
          borderColor: selected ? theme.colors.primary : theme.colors.border,
          borderWidth: selected ? 2 : StyleSheet.hairlineWidth,
          borderRadius: theme.radius.chip,
          opacity: pressed && !disabled ? 0.8 : 1,
        },
      ]}
      testID={testID}
    >
      <View style={styles.content}>
        {icon && <View style={styles.icon}>{icon}</View>}
        <Text
          style={[
            theme.typography.caption,
            {
              color: selected
                ? theme.colors.primary
                : disabled
                  ? theme.colors.textSecondary
                  : theme.colors.text,
            },
          ]}
        >
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    minHeight: 32,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  icon: {
    width: 14,
    height: 14,
  },
});
