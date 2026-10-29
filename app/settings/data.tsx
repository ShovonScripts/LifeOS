import { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme/useTheme';
import { BackupService } from '@/services/backup';
import { Button, ConfirmDialog } from '@/components/ui';
import { ArrowLeft, Download, Trash2 } from 'lucide-react-native';

export default function DataSettingsScreen() {
  const theme = useTheme();
  const router = useRouter();

  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [lastExported, setLastExported] = useState<string | null>(null);

  const handleExport = () => {
    try {
      const backup = BackupService.exportBackup();
      setLastExported(backup.exportedAt);
      Alert.alert(
        'Export Successful',
        `Backup created successfully! Items exported: ${
          backup.data.tasks.length + backup.data.notes.length + backup.data.habits.length
        } items.`,
      );
    } catch {
      Alert.alert('Export Failed', 'Could not generate backup file.');
    }
  };

  const handleClearAll = () => {
    try {
      BackupService.clearAllData();
      Alert.alert('Data Cleared', 'All local database records have been deleted.');
    } catch {
      Alert.alert('Error', 'Failed to clear local data.');
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.bg }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Go back">
          <ArrowLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[theme.typography.h2, { color: theme.colors.text }]}>
          Data Safety & Backup
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Export Card */}
        <View
          style={[
            styles.card,
            { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
          ]}
        >
          <View style={styles.cardHeader}>
            <Download size={22} color={theme.colors.primary} />
            <Text style={[theme.typography.bodyStrong, { color: theme.colors.text }]}>
              Export Backup
            </Text>
          </View>
          <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>
            Generates a complete, unencrypted JSON backup file of all your tasks, habits, goals, and
            notes. API keys and passwords are NEVER included.
          </Text>
          {lastExported && (
            <Text style={[theme.typography.caption, { color: theme.colors.primary }]}>
              Last exported: {lastExported}
            </Text>
          )}
          <Button onPress={handleExport} size="md">
            Generate JSON Backup
          </Button>
        </View>

        {/* Clear Data Card */}
        <View
          style={[
            styles.card,
            { backgroundColor: theme.colors.surface, borderColor: theme.colors.error },
          ]}
        >
          <View style={styles.cardHeader}>
            <Trash2 size={22} color={theme.colors.error} />
            <Text style={[theme.typography.bodyStrong, { color: theme.colors.error }]}>
              Clear All Local Data
            </Text>
          </View>
          <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>
            Permanently deletes all tasks, habits, events, goals, and notes from this device. This
            action cannot be undone unless you have a JSON backup.
          </Text>
          <Button onPress={() => setShowClearConfirm(true)} variant="destructive" size="md">
            Clear Database
          </Button>
        </View>
      </ScrollView>

      <ConfirmDialog
        visible={showClearConfirm}
        title="Clear All Local Data"
        message="Are you completely sure? ALL local database records will be erased permanently!"
        confirmLabel="Erase Everything"
        destructive
        onConfirm={handleClearAll}
        onClose={() => setShowClearConfirm(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  content: { paddingHorizontal: 20, paddingBottom: 40, gap: 16 },
  card: {
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
});
