import { Tabs } from 'expo-router';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

import { Snackbar, FAB } from '@/components/ui';
import { TabBar } from '@/components/tabs/TabBar';
import { Plus } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <BottomSheetModalProvider>
      <Tabs
        tabBar={(props) => <TabBar {...props} />}
        screenOptions={{
          headerShown: false,
          tabBarStyle: { backgroundColor: 'transparent' },
        }}
      >
        <Tabs.Screen name="index" options={{ title: 'Today' }} />
        <Tabs.Screen name="tasks" options={{ title: 'Tasks' }} />
        <Tabs.Screen name="calendar" options={{ title: 'Calendar' }} />
        <Tabs.Screen name="grow" options={{ title: 'Grow' }} />
        <Tabs.Screen name="notes" options={{ title: 'Notes' }} />
      </Tabs>
      <FAB icon={Plus} onPress={() => {}} accessibilityLabel="Quick add" testID="fab-quick-add" />
      <Snackbar />
    </BottomSheetModalProvider>
  );
}
