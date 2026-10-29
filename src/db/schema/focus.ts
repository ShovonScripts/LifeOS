import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { tasks } from './tasks';

export const focusSessions = sqliteTable(
  'focus_sessions',
  {
    id: text('id').primaryKey(),
    taskId: text('task_id').references(() => tasks.id, { onDelete: 'set null' }),
    startedAt: text('started_at').notNull(),
    endedAt: text('ended_at'),
    plannedSeconds: integer('planned_seconds').notNull(),
    actualSeconds: integer('actual_seconds'),
    completed: integer('completed', { mode: 'boolean' }).notNull().default(false),
    createdAt: text('created_at').notNull(),
  },
  (table) => [index('idx_focus_started').on(table.startedAt)],
);

export type FocusSessionRow = typeof focusSessions.$inferSelect;
export type NewFocusSessionRow = typeof focusSessions.$inferInsert;
