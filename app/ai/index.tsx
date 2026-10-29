import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme/useTheme';
import { Button } from '@/components/ui';
import { ArrowLeft, Sparkles, Key } from 'lucide-react-native';

export default function AIScreen() {
  const theme = useTheme();
  const router = useRouter();

  const [promptInput, setPromptInput] = useState('');

  const handleGeneratePlan = () => {
    // Navigates to proposal preview screen
    router.push('/ai/plan-preview' as const);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.bg }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Go back">
          <ArrowLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[theme.typography.h2, { color: theme.colors.text }]}>AI Assistant</Text>
        <TouchableOpacity onPress={() => router.push('/settings/ai' as const)}>
          <Key size={22} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View
          style={[
            styles.privacyCard,
            { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
          ]}
        >
          <Sparkles size={24} color={theme.colors.primary} />
          <View style={{ flex: 1 }}>
            <Text style={[theme.typography.bodyStrong, { color: theme.colors.text }]}>
              BYOK AI Layer
            </Text>
            <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>
              Bring your own API key (Gemini, OpenAI, OpenRouter). AI outputs are ALWAYS shown in
              preview before writing to your database.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>
            WHAT WOULD YOU LIKE HELP WITH?
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.colors.surface,
                color: theme.colors.text,
                borderColor: theme.colors.border,
              },
            ]}
            value={promptInput}
            onChangeText={setPromptInput}
            placeholder="e.g. Help me prioritize today's tasks and create a focus plan..."
            placeholderTextColor={theme.colors.textSecondary}
            multiline
          />
        </View>

        <Button onPress={handleGeneratePlan} variant="primary">
          Generate Daily Plan Proposal
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
  privacyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  section: { gap: 8 },
  input: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    minHeight: 120,
    textAlignVertical: 'top',
  },
});
