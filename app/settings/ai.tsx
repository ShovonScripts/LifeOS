import { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme/useTheme';
import { SecretManager, type AIProviderId } from '@/storage/secure-secrets';
import { Button, Chip } from '@/components/ui';
import { ArrowLeft, Key, ShieldCheck } from 'lucide-react-native';

export default function AISettingsScreen() {
  const theme = useTheme();
  const router = useRouter();

  const [provider, setProvider] = useState<AIProviderId>('gemini');
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [maskedKey, setMaskedKey] = useState<string | null>(null);

  useEffect(() => {
    async function loadKey() {
      const existing = await SecretManager.getApiKey(provider);
      if (existing) {
        setMaskedKey(SecretManager.maskKey(existing));
      } else {
        setMaskedKey(null);
      }
      setApiKeyInput('');
    }
    loadKey();
  }, [provider]);

  const handleSaveKey = async () => {
    if (!apiKeyInput.trim()) return;
    try {
      await SecretManager.saveApiKey(provider, apiKeyInput.trim());
      setMaskedKey(SecretManager.maskKey(apiKeyInput.trim()));
      setApiKeyInput('');
      Alert.alert('Key Saved', `${provider.toUpperCase()} API key saved securely!`);
    } catch {
      Alert.alert('Error', 'Failed to save API key to SecureStore.');
    }
  };

  const handleDeleteKey = async () => {
    try {
      await SecretManager.deleteApiKey(provider);
      setMaskedKey(null);
      setApiKeyInput('');
      Alert.alert('Key Removed', `${provider.toUpperCase()} API key deleted.`);
    } catch {
      Alert.alert('Error', 'Failed to delete API key.');
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.bg }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Go back">
          <ArrowLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[theme.typography.h2, { color: theme.colors.text }]}>
          AI Provider Settings
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>
            SELECT AI PROVIDER
          </Text>
          <View style={styles.chipRow}>
            {(['gemini', 'openai', 'openrouter'] as const).map((p) => (
              <Chip
                key={p}
                label={p.toUpperCase()}
                selected={provider === p}
                onPress={() => setProvider(p)}
              />
            ))}
          </View>
        </View>

        <View
          style={[
            styles.card,
            { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
          ]}
        >
          <View style={styles.cardHeader}>
            <Key size={20} color={theme.colors.primary} />
            <Text style={[theme.typography.bodyStrong, { color: theme.colors.text }]}>
              {provider.toUpperCase()} API Key
            </Text>
          </View>

          {maskedKey ? (
            <View style={styles.savedRow}>
              <Text style={[theme.typography.body, { color: theme.colors.text, flex: 1 }]}>
                Saved Key: {maskedKey}
              </Text>
              <Button onPress={handleDeleteKey} variant="destructive" size="md">
                Remove Key
              </Button>
            </View>
          ) : (
            <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>
              No key configured for {provider}. Enter your key below.
            </Text>
          )}

          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.colors.surface,
                color: theme.colors.text,
                borderColor: theme.colors.border,
              },
            ]}
            value={apiKeyInput}
            onChangeText={setApiKeyInput}
            placeholder={`Enter ${provider.toUpperCase()} key (e.g. sk-...)`}
            placeholderTextColor={theme.colors.textSecondary}
            secureTextEntry
          />

          <Button onPress={handleSaveKey} size="md">
            Save Key Securely
          </Button>
        </View>

        <View
          style={[
            styles.privacyCard,
            { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
          ]}
        >
          <ShieldCheck size={24} color={theme.colors.success} />
          <View style={{ flex: 1 }}>
            <Text style={[theme.typography.bodyStrong, { color: theme.colors.text }]}>
              SecureStore Encryption
            </Text>
            <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>
              API keys are stored strictly in your device encrypted keychain/SecureStore. They are
              never saved in SQLite, logs, or backups.
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
  content: { paddingHorizontal: 20, paddingBottom: 40, gap: 20 },
  section: { gap: 8 },
  chipRow: { flexDirection: 'row', gap: 8 },
  card: { padding: 18, borderRadius: 16, borderWidth: 1, gap: 14 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  savedRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
  },
  privacyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
});
