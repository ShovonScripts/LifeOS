import { z } from 'zod';

export type AIProviderId = 'gemini' | 'openai' | 'openrouter' | 'custom';

export type AIErrorCode =
  'INVALID_KEY' | 'RATE_LIMITED' | 'TIMEOUT' | 'VALIDATION_FAILED' | 'NETWORK_ERROR' | 'UNKNOWN';

export interface AIProviderAdapter {
  providerId: AIProviderId;
  generateJSON<T>(prompt: string, schema: z.ZodSchema<T>, apiKey: string): Promise<T>;
}
