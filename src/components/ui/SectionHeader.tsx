import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/theme/useTheme';

export interface SectionHeaderProps {
  title: string;
  action?: React.ReactNode;
  testID?: string;
}

export function SectionHeader({ title, action, testID }: SectionHeaderProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.container,
        { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
      ]}
      testID={testID}
    >
      <Text style={[theme.typography.h3, { color: theme.colors.text }]}>{title}</Text>
      {action}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
});
