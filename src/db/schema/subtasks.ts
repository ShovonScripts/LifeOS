import { sql } from 'drizzle-orm';
import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { syncColumns } from './columns';
import { tasks } from './tasks';

export const subtasks = sqliteTable(
  'subtasks',
  {
    id: text('id').primaryKey(),
    taskId: text('task_id')
      .notNull()
      .references(() => tasks.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    isDone: integer('is_done', { mode: 'boolean' }).notNull().default(false),
    sortOrder: integer('sort_order').notNull().default(0),
    ...syncColumns(),
  },
  (table) => [
    index('idx_subtasks_task')
      .on(table.taskId)
      .where(sql`${table.deletedAt} is null`),
  ],
);

export type SubtaskRow = typeof subtasks.$inferSelect;
export type NewSubtaskRow = typeof subtasks.$inferInsert;
