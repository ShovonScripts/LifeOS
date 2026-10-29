import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { useTheme } from '@/theme/useTheme';

export interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  trackColor?: string;
  progressColor?: string;
  showLabel?: boolean;
  label?: string;
  testID?: string;
}

export function ProgressRing({
  progress,
  size = 48,
  strokeWidth = 4,
  trackColor,
  progressColor,
  showLabel = false,
  label,
  testID,
}: ProgressRingProps) {
  const theme = useTheme();

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference * (1 - Math.max(0, Math.min(1, progress)));

  return (
    <View style={styles.container} testID={testID}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor ?? (theme.isDark ? theme.colors.surfaceAlt : theme.colors.border)}
          strokeWidth={strokeWidth}
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={progressColor ?? theme.colors.primary}
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={[{ rotate: '-90deg' }]}
        />
      </Svg>
      {showLabel && (
        <View style={styles.labelContainer}>
          <Text style={[theme.typography.bodyStrong, { color: theme.colors.text }]}>
            {label ?? `${Math.round(progress * 100)}%`}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
