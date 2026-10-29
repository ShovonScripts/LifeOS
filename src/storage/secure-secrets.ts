import * as SecureStore from 'expo-secure-store';

export type AIProviderId = 'gemini' | 'openai' | 'openrouter' | 'custom';

const KEY_PREFIX = 'lifeos_key_';

export class SecretManager {
  static async saveApiKey(provider: AIProviderId, apiKey: string): Promise<void> {
    const keyName = `${KEY_PREFIX}${provider}`;
    await SecureStore.setItemAsync(keyName, apiKey.trim());
  }

  static async getApiKey(provider: AIProviderId): Promise<string | null> {
    const keyName = `${KEY_PREFIX}${provider}`;
    return await SecureStore.getItemAsync(keyName);
  }

  static async deleteApiKey(provider: AIProviderId): Promise<void> {
    const keyName = `${KEY_PREFIX}${provider}`;
    await SecureStore.deleteItemAsync(keyName);
  }

  static maskKey(apiKey: string): string {
    if (!apiKey || apiKey.length < 8) return '••••••••';
    const first4 = apiKey.slice(0, 4);
    const last4 = apiKey.slice(-4);
    return `${first4}••••${last4}`;
  }
}
