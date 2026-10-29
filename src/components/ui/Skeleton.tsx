import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/theme/useTheme';

export interface SkeletonProps {
  width?: number | string;
  height: number;
  borderRadius?: number;
  testID?: string;
}

export function Skeleton({ width = '100%', height, borderRadius = 8, testID }: SkeletonProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
          backgroundColor: theme.isDark ? theme.colors.surfaceAlt : theme.colors.border,
        },
      ]}
      testID={testID}
    />
  );
}

const styles = StyleSheet.create({
  skeleton: {
    overflow: 'hidden',
  },
});
