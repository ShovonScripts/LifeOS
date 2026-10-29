import { OpenAIAdapter } from '../../src/ai/providers/openai';
import { GeminiAdapter } from '../../src/ai/providers/gemini';
import { dailyPlanProposalSchema } from '../../src/ai/features/daily-plan';

globalThis.fetch = jest.fn() as unknown as typeof fetch;

describe('AI BYOK Providers & Validation Contracts', () => {
  beforeEach(() => {
    (globalThis.fetch as jest.Mock).mockClear();
  });

  test('OpenAIAdapter parses valid JSON response into DailyPlanProposal', async () => {
    const mockResponse = {
      choices: [
        {
          message: {
            content: JSON.stringify({
              summary: 'Great focus day ahead',
              suggestedTasks: [{ title: 'Finish report', priority: 'high' }],
            }),
          },
        },
      ],
    };

    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const adapter = new OpenAIAdapter();
    const result = await adapter.generateJSON('prompt', dailyPlanProposalSchema, 'sk-mock-key');

    expect(result.summary).toBe('Great focus day ahead');
    expect(result.suggestedTasks.length).toBe(1);
    expect(result.suggestedTasks[0]?.title).toBe('Finish report');
  });

  test('GeminiAdapter parses valid response', async () => {
    const mockResponse = {
      candidates: [
        {
          content: {
            parts: [
              {
                text: JSON.stringify({
                  summary: 'Gemini focus plan',
                  suggestedTasks: [{ title: 'Review notes', priority: 'medium' }],
                }),
              },
            ],
          },
        },
      ],
    };

    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const adapter = new GeminiAdapter();
    const result = await adapter.generateJSON('prompt', dailyPlanProposalSchema, 'gemini-mock-key');

    expect(result.summary).toBe('Gemini focus plan');
    expect(result.suggestedTasks[0]?.priority).toBe('medium');
  });
});
