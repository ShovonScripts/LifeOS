import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/useTheme';
import { Sun, CheckSquare, Calendar, TrendingUp, FileText } from 'lucide-react-native';

export interface TabBarProps {
  state: { routes: { key: string; name: string }[]; index: number } | unknown;
  navigation?: unknown;
  navigateToTab?: (routeKey: string) => void;
  descriptors?: Record<string, unknown>;
  insets?: { top: number; bottom: number; left: number; right: number };
}

export function TabBar({ state, navigation, navigateToTab }: TabBarProps) {
  const theme = useTheme();
  const safeAreaInsets = useSafeAreaInsets();

  const stateObj = state as { routes: { key: string; name: string }[]; index: number };
  const navObj = navigation as {
    emit?: (event: { type: string; target: string; canPreventDefault: boolean }) => {
      defaultPrevented: boolean;
    };
    navigate?: (name: string) => void;
  };

  const tabRoutes = stateObj.routes;

  const getIcon = (name: string, color: string) => {
    switch (name) {
      case 'index':
        return <Sun size={20} color={color} />;
      case 'tasks':
        return <CheckSquare size={20} color={color} />;
      case 'calendar':
        return <Calendar size={20} color={color} />;
      case 'grow':
        return <TrendingUp size={20} color={color} />;
      case 'notes':
        return <FileText size={20} color={color} />;
      default:
        return <Sun size={20} color={color} />;
    }
  };

  const getLabel = (name: string) => {
    switch (name) {
      case 'index':
        return 'Today';
      case 'tasks':
        return 'Tasks';
      case 'calendar':
        return 'Calendar';
      case 'grow':
        return 'Grow';
      case 'notes':
        return 'Notes';
      default:
        return name;
    }
  };

  return (
    <View
      style={[
        styles.tabBarContainer,
        {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          paddingBottom: Math.max(safeAreaInsets.bottom, 8),
        },
      ]}
    >
      <View style={styles.tabRow}>
        {tabRoutes.map((route, index) => {
          const isFocused = stateObj.index === index;
          const label = getLabel(route.name);
          const color = isFocused ? theme.colors.primary : theme.colors.textSecondary;

          const onPress = () => {
            if (navObj?.emit) {
              const event = navObj.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });
              if (!isFocused && !event.defaultPrevented && navObj.navigate) {
                navObj.navigate(route.name);
              }
            } else if (navObj?.navigate) {
              navObj.navigate(route.name);
            } else if (navigateToTab) {
              navigateToTab(route.name);
            }
          };

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityLabel={label}
              accessibilityState={{ selected: isFocused }}
              onPress={onPress}
              style={styles.tabButton}
            >
              <View
                style={[
                  styles.iconContainer,
                  isFocused && { backgroundColor: theme.colors.primarySoft },
                ]}
              >
                {getIcon(route.name, color)}
              </View>

              <Text
                style={[
                  theme.typography.caption,
                  {
                    fontSize: 11,
                    fontWeight: isFocused ? '600' : '400',
                    color,
                  },
                ]}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    borderTopWidth: 1,
    paddingTop: 8,
    paddingHorizontal: 8,
  },
  tabRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  iconContainer: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
