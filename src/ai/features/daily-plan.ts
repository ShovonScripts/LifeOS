import { z } from 'zod';

export const dailyPlanProposalSchema = z.object({
  summary: z.string(),
  suggestedTasks: z.array(
    z.object({
      title: z.string(),
      priority: z.enum(['low', 'medium', 'high']),
      dueLocalDate: z.string().optional(),
    }),
  ),
});

export type DailyPlanProposal = z.infer<typeof dailyPlanProposalSchema>;

export function buildDailyPlanPrompt(context: {
  activeTasks: string[];
  activeHabits: string[];
}): string {
  return `Act as a productivity assistant.
Here are the user's active tasks:
${context.activeTasks.map((t) => `- ${t}`).join('\n') || 'None'}

Here are the user's active habits:
${context.activeHabits.map((h) => `- ${h}`).join('\n') || 'None'}

Suggest a concise daily focus plan for today with a summary and a list of suggested high-impact tasks. Return JSON with 'summary' and 'suggestedTasks' array.`;
}
