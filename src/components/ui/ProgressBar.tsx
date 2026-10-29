import { StyleSheet, View } from 'react-native';
import { useTheme } from '@/theme/useTheme';

export interface ProgressBarProps {
  progress: number; // 0 to 1
  height?: number;
  testID?: string;
}

export function ProgressBar({ progress, height = 8, testID }: ProgressBarProps) {
  const theme = useTheme();
  const clamped = Math.max(0, Math.min(1, progress));

  return (
    <View
      style={[
        styles.track,
        {
          height,
          backgroundColor: theme.colors.surfaceAlt,
          borderColor: theme.colors.border,
        },
      ]}
      testID={testID}
    >
      <View
        style={[
          styles.fill,
          {
            width: `${clamped * 100}%`,
            backgroundColor: theme.colors.primary,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    borderRadius: 999,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 999,
  },
});
