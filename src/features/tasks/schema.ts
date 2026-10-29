import { z } from 'zod';

export const taskStatusSchema = z.enum(['todo', 'doing', 'done', 'cancelled']);
export const taskPrioritySchema = z.enum(['none', 'low', 'medium', 'high']);

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(500),
  notes: z.string().max(5000).optional().nullable(),
  status: taskStatusSchema.default('todo'),
  priority: taskPrioritySchema.default('none'),
  dueLocalDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional()
    .nullable(),
  dueTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/)
    .optional()
    .nullable(),
  projectId: z.string().optional().nullable(),
  rrule: z.string().optional().nullable(),
  durationMinutes: z.number().int().positive().optional().nullable(),
});

export const updateTaskSchema = createTaskSchema.partial().extend({
  completedAt: z.string().optional().nullable(),
});

export type CreateTaskInputZod = z.infer<typeof createTaskSchema>;
export type UpdateTaskInputZod = z.infer<typeof updateTaskSchema>;
