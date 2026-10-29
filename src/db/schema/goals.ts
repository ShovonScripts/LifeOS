import { sql } from 'drizzle-orm';
import { index, integer, primaryKey, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { syncColumns } from './columns';
import { tasks } from './tasks';

export const goals = sqliteTable('goals', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  type: text('type', { enum: ['numeric', 'milestone'] })
    .notNull()
    .default('numeric'),
  targetValue: real('target_value'),
  currentValue: real('current_value').notNull().default(0),
  unit: text('unit'),
  status: text('status', { enum: ['active', 'completed', 'archived'] })
    .notNull()
    .default('active'),
  startDate: text('start_date'),
  targetDate: text('target_date'),
  completedAt: text('completed_at'),
  ...syncColumns(),
});

export const goalMilestones = sqliteTable(
  'goal_milestones',
  {
    id: text('id').primaryKey(),
    goalId: text('goal_id')
      .notNull()
      .references(() => goals.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    isDone: integer('is_done', { mode: 'boolean' }).notNull().default(false),
    dueDate: text('due_date'),
    completedAt: text('completed_at'),
    sortOrder: integer('sort_order').notNull().default(0),
    ...syncColumns(),
  },
  (table) => [
    index('idx_goal_milestones_goal')
      .on(table.goalId)
      .where(sql`${table.deletedAt} is null`),
  ],
);

export const goalTasks = sqliteTable(
  'goal_tasks',
  {
    goalId: text('goal_id')
      .notNull()
      .references(() => goals.id, { onDelete: 'cascade' }),
    taskId: text('task_id')
      .notNull()
      .references(() => tasks.id, { onDelete: 'cascade' }),
    createdAt: text('created_at').notNull(),
  },
  (table) => [primaryKey({ columns: [table.goalId, table.taskId] })],
);

export type GoalRow = typeof goals.$inferSelect;
export type NewGoalRow = typeof goals.$inferInsert;
export type GoalMilestoneRow = typeof goalMilestones.$inferSelect;
export type NewGoalMilestoneRow = typeof goalMilestones.$inferInsert;
