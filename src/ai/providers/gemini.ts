import { z } from 'zod';
import type { AIProviderAdapter, AIProviderId } from '../types';
import { AIError } from '../errors';

export class GeminiAdapter implements AIProviderAdapter {
  readonly providerId: AIProviderId = 'gemini';

  async generateJSON<T>(prompt: string, schema: z.ZodSchema<T>, apiKey: string): Promise<T> {
    if (!apiKey) {
      throw new AIError('INVALID_KEY', 'API Key is missing for Gemini.');
    }

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `${prompt}\n\nOUTPUT ONLY VALID JSON. DO NOT INCLUDE MARKDOWN TRIPLE BACKTICKS.`,
                },
              ],
            },
          ],
          generationConfig: {
            responseMimeType: 'application/json',
          },
        }),
      });

      if (!response.ok) {
        if (response.status === 400 || response.status === 403) {
          throw new AIError('INVALID_KEY', 'Invalid Gemini API key.');
        }
        if (response.status === 429) {
          throw new AIError('RATE_LIMITED', 'Gemini rate limit exceeded.');
        }
        throw new AIError('NETWORK_ERROR', `Gemini API returned status ${response.status}`);
      }

      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

      try {
        const json = JSON.parse(rawText);
        return schema.parse(json);
      } catch (parseErr) {
        throw new AIError(
          'VALIDATION_FAILED',
          'Gemini response failed contract validation.',
          parseErr,
        );
      }
    } catch (err: unknown) {
      if (err instanceof AIError) throw err;
      throw new AIError('NETWORK_ERROR', 'Network error connecting to Gemini.', err);
    }
  }
}
