import { z } from 'zod';
import type { AIProviderAdapter, AIProviderId } from '../types';
import { AIError } from '../errors';

export class OpenAIAdapter implements AIProviderAdapter {
  readonly providerId: AIProviderId = 'openai';

  async generateJSON<T>(prompt: string, schema: z.ZodSchema<T>, apiKey: string): Promise<T> {
    if (!apiKey) {
      throw new AIError('INVALID_KEY', 'API Key is missing for OpenAI.');
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content:
                'You are a helpful assistant. Output ONLY valid JSON matching the user requirements with no markdown surrounding code blocks.',
            },
            { role: 'user', content: prompt },
          ],
          response_format: { type: 'json_object' },
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new AIError('INVALID_KEY', 'Invalid OpenAI API key.');
        }
        if (response.status === 429) {
          throw new AIError('RATE_LIMITED', 'OpenAI rate limit exceeded.');
        }
        throw new AIError('NETWORK_ERROR', `OpenAI API returned status ${response.status}`);
      }

      const data = await response.json();
      const rawText = data?.choices?.[0]?.message?.content ?? '';

      // Try validation
      try {
        const json = JSON.parse(rawText);
        return schema.parse(json);
      } catch (parseErr) {
        throw new AIError('VALIDATION_FAILED', 'AI response failed contract validation.', parseErr);
      }
    } catch (err: unknown) {
      if (err instanceof AIError) throw err;
      throw new AIError('NETWORK_ERROR', 'Network error connecting to OpenAI.', err);
    }
  }
}
