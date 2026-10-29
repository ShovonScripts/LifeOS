import { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme/useTheme';
import { TaskService } from '@/features/tasks/service';
import { Button } from '@/components/ui';
import { ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react-native';

export default function AIPlanPreviewScreen() {
  const theme = useTheme();
  const router = useRouter();

  // Mock proposal state for preview demonstration
  const [proposal] = useState({
    summary: 'Focus on finishing the project report and completing your daily reflection habit.',
    suggestedTasks: [
      { title: 'Finalize quarterly report slides', priority: 'high' as const },
      { title: 'Review team feedback on notes', priority: 'medium' as const },
    ],
  });

  const handleApplyProposals = () => {
    try {
      // Execute transaction applying AI proposals to SQLite
      for (const t of proposal.suggestedTasks) {
        TaskService.create({
          title: t.title,
          priority: t.priority,
          status: 'todo',
        });
      }

      Alert.alert('Applied Successfully', 'AI proposed tasks have been created!');
      router.replace('/');
    } catch {
      Alert.alert('Error', 'Failed to apply proposed tasks.');
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.bg }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Go back">
          <ArrowLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[theme.typography.h2, { color: theme.colors.text }]}>AI Proposal Preview</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View
          style={[
            styles.banner,
            { backgroundColor: theme.colors.surface, borderColor: theme.colors.primary },
          ]}
        >
          <Sparkles size={24} color={theme.colors.primary} />
          <Text style={[theme.typography.body, { color: theme.colors.text, flex: 1 }]}>
            Review the proposed plan below. No changes are saved to your database until you confirm.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>
            SUMMARY
          </Text>
          <Text style={[theme.typography.body, { color: theme.colors.text }]}>
            {proposal.summary}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>
            PROPOSED TASKS ({proposal.suggestedTasks.length})
          </Text>

          {proposal.suggestedTasks.map((task, i) => (
            <View
              key={i}
              style={[
                styles.taskCard,
                { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
              ]}
            >
              <CheckCircle2 size={20} color={theme.colors.primary} />
              <View style={{ flex: 1 }}>
                <Text style={[theme.typography.bodyStrong, { color: theme.colors.text }]}>
                  {task.title}
                </Text>
                <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>
                  Priority: {task.priority.toUpperCase()}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <Button onPress={handleApplyProposals} variant="primary">
          Confirm & Apply Proposals
        </Button>
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
  content: { paddingHorizontal: 20, paddingBottom: 40, gap: 20 },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  section: { gap: 8 },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
});
