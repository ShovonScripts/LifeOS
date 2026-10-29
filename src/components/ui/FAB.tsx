import { Pressable, StyleSheet } from 'react-native';

import { useTheme } from '@/theme/useTheme';
import { LinearGradient } from 'expo-linear-gradient';

export interface FABProps {
  icon: React.ComponentType<{ size: number; color: string }>;
  onPress: () => void;
  accessibilityLabel: string;
  size?: number;
  testID?: string;
}

export function FAB({ icon: Icon, onPress, accessibilityLabel, size = 60, testID }: FABProps) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={({ pressed }) => [
        styles.fab,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          opacity: pressed ? 0.9 : 1,
        },
      ]}
      testID={testID}
    >
      <LinearGradient
        colors={theme.gradients.hero}
        style={[styles.gradient, { borderRadius: size / 2 }]}
      >
        <Icon size={28} color="#FFFFFF" />
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 80,
    zIndex: 999,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7657E8',
    shadowOpacity: 0.25,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
