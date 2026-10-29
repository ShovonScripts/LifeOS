import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/theme/useTheme';

export interface TabBarProps {
  state: { routes: { name: string }[]; index: number };
  descriptors: any;
  navigateToTab: (routeKey: string) => void;
  insets: { top: number; bottom: number; left: number; right: number };
}

export function TabBar({ state, navigateToTab, insets }: TabBarProps) {
  const theme = useTheme();

  const tabs = ['today', 'tasks', 'calendar', 'grow', 'notes'] as const;
  const labels: Record<string, string> = {
    today: 'Today',
    tasks: 'Tasks',
    calendar: 'Calendar',
    grow: 'Grow',
    notes: 'Notes',
  };

  return (
    <View style={styles.container}>
      <View style={[styles.tabBar, { paddingBottom: insets.bottom }]}>
        {tabs.slice(0, 2).map((name) => (
          <TabButton
            key={name}
            name={name}
            label={labels[name] ?? name}
            focused={state.index === tabs.indexOf(name)}
            onPress={() => navigateToTab(name)}
            theme={theme}
          />
        ))}
        <View style={styles.fabSpacer} />
        {tabs.slice(2).map((name) => (
          <TabButton
            key={name}
            name={name}
            label={labels[name] ?? name}
            focused={state.index === tabs.indexOf(name)}
            onPress={() => navigateToTab(name)}
            theme={theme}
          />
        ))}
      </View>
    </View>
  );
}

interface TabButtonProps {
  name: string;
  label: string;
  focused: boolean;
  onPress: () => void;
  theme: ReturnType<typeof useTheme>;
}

function TabButton({ name, label, focused, onPress, theme }: TabButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: focused }}
      onPress={onPress}
      hitSlop={16}
      style={[
        styles.tabButton,
        focused
          ? { backgroundColor: theme.colors.primarySoft }
          : { backgroundColor: 'transparent' },
      ]}
    >
      <View style={styles.iconWrapper}>
        <TabIcon name={name} focused={focused} theme={theme} />
      </View>
      <Text
        style={[
          theme.typography.micro,
          { color: focused ? theme.colors.primary : theme.colors.textSecondary },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function TabIcon({
  name,
  focused,
  theme,
}: {
  name: string;
  focused: boolean;
  theme: ReturnType<typeof useTheme>;
}) {
  return (
    <View
      style={[
        styles.icon,
        { backgroundColor: focused ? theme.colors.primary : 'transparent', borderRadius: 999 },
      ]}
    >
      <TabIconText name={name} focused={focused} theme={theme} />
    </View>
  );
}

function TabIconText({
  name,
  focused,
  theme,
}: {
  name: string;
  focused: boolean;
  theme: ReturnType<typeof useTheme>;
}) {
  const text =
    name === 'today'
      ? 'home'
      : name === 'tasks'
        ? 'check'
        : name === 'calendar'
          ? 'calendar'
          : name === 'grow'
            ? 'sprout'
            : 'file-text';
  return (
    <Text
      style={[
        styles.iconText,
        { color: focused ? theme.colors.textOnPrimary : theme.colors.textSecondary },
      ]}
    >
      {text}
    </Text>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
  },
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 64,
    paddingHorizontal: 8,
    backgroundColor: 'transparent',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    minWidth: 60,
    borderRadius: 16,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 16,
  },
  fabSpacer: {
    width: 60,
  },
});
