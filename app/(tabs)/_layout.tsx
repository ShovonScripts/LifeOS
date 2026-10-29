import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { Tabs } from 'expo-router';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

import { Snackbar, FAB, BottomSheet, Button } from '@/components/ui';
import { TabBar } from '@/components/tabs/TabBar';
import { Plus } from 'lucide-react-native';
import { useTheme } from '@/theme/useTheme';
import { TaskService } from '@/features/tasks/service';

export default function TabLayout() {
  const theme = useTheme();
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [quickInput, setQuickInput] = useState('');

  const handleQuickAddSave = () => {
    if (!quickInput.trim()) return;
    try {
      TaskService.quickAdd(quickInput.trim());
      setQuickInput('');
      setIsQuickAddOpen(false);
    } catch {
      // handled
    }
  };

  return (
    <BottomSheetModalProvider>
      <Tabs
        tabBar={(props) => <TabBar {...props} />}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tabs.Screen name="index" options={{ title: 'Today' }} />
        <Tabs.Screen name="tasks" options={{ title: 'Tasks' }} />
        <Tabs.Screen name="calendar" options={{ title: 'Calendar' }} />
        <Tabs.Screen name="grow" options={{ title: 'Grow' }} />
        <Tabs.Screen name="notes" options={{ title: 'Notes' }} />
      </Tabs>

      <FAB
        icon={Plus}
        onPress={() => setIsQuickAddOpen(true)}
        accessibilityLabel="Quick add task"
        testID="fab-quick-add"
      />

      <BottomSheet
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        title="Quick Add Task"
      >
        <View style={styles.sheetContent}>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.colors.surfaceAlt,
                color: theme.colors.text,
                borderColor: theme.colors.border,
              },
            ]}
            value={quickInput}
            onChangeText={setQuickInput}
            placeholder="e.g. Call Rahim tomorrow 3pm !high #work"
            placeholderTextColor={theme.colors.textSecondary}
            onSubmitEditing={handleQuickAddSave}
            autoFocus
          />
          <Button onPress={handleQuickAddSave} size="md">
            Save Task
          </Button>
        </View>
      </BottomSheet>

      <Snackbar />
    </BottomSheetModalProvider>
  );
}

const styles = StyleSheet.create({
  sheetContent: {
    gap: 12,
    paddingVertical: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
  },
});
