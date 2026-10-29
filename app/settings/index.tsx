import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme/useTheme';
import { ArrowLeft, Database, Shield, ChevronRight } from 'lucide-react-native';

export default function SettingsIndexScreen() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.bg }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Go back">
          <ArrowLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[theme.typography.h2, { color: theme.colors.text }]}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity
          style={[
            styles.menuCard,
            { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
          ]}
          onPress={() => router.push('/settings/data' as const)}
        >
          <Database size={22} color={theme.colors.primary} />
          <View style={{ flex: 1 }}>
            <Text style={[theme.typography.bodyStrong, { color: theme.colors.text }]}>
              Data Safety & Backups
            </Text>
            <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>
              Export JSON backup, restore data, or clear local database
            </Text>
          </View>
          <ChevronRight size={20} color={theme.colors.textSecondary} />
        </TouchableOpacity>

        <View
          style={[
            styles.menuCard,
            { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
          ]}
        >
          <Shield size={22} color={theme.colors.success} />
          <View style={{ flex: 1 }}>
            <Text style={[theme.typography.bodyStrong, { color: theme.colors.text }]}>
              Local-First & Offline
            </Text>
            <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>
              Your data never leaves your device unless exported by you.
            </Text>
          </View>
        </View>
      </ScrollView>
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
  content: { paddingHorizontal: 20, paddingBottom: 40, gap: 12 },
  menuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 14,
  },
});
