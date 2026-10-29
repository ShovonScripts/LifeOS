import { sql } from 'drizzle-orm';
import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { syncColumns } from './columns';
import { projects } from './projects';

export const tasks = sqliteTable(
  'tasks',
  {
    id: text('id').primaryKey(),
    projectId: text('project_id').references(() => projects.id, { onDelete: 'set null' }),
    title: text('title').notNull(),
    notes: text('notes'),
    status: text('status', { enum: ['todo', 'doing', 'done', 'cancelled'] })
      .notNull()
      .default('todo'),
    priority: text('priority', { enum: ['none', 'low', 'medium', 'high'] })
      .notNull()
      .default('none'),
    dueAt: text('due_at'),
    dueLocalDate: text('due_local_date'),
    isAllDay: integer('is_all_day', { mode: 'boolean' }).notNull().default(false),
    remindAt: text('remind_at'),
    completedAt: text('completed_at'),
    recurrenceRule: text('recurrence_rule'),
    recurrenceTimezone: text('recurrence_timezone'),
    seriesId: text('series_id'),
    source: text('source', { enum: ['user', 'ai'] })
      .notNull()
      .default('user'),
    sortOrder: integer('sort_order').notNull().default(0),
    ...syncColumns(),
  },
  (table) => [
    index('idx_tasks_status')
      .on(table.status)
      .where(sql`${table.deletedAt} is null`),
    index('idx_tasks_due')
      .on(table.dueAt)
      .where(sql`${table.deletedAt} is null`),
    index('idx_tasks_due_local')
      .on(table.dueLocalDate)
      .where(sql`${table.deletedAt} is null`),
    index('idx_tasks_project')
      .on(table.projectId)
      .where(sql`${table.deletedAt} is null`),
    index('idx_tasks_series').on(table.seriesId),
  ],
);

export type TaskRow = typeof tasks.$inferSelect;
export type NewTaskRow = typeof tasks.$inferInsert;
