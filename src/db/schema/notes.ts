import { sql } from 'drizzle-orm';
import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { syncColumns } from './columns';
import { goals } from './goals';
import { projects } from './projects';
import { tasks } from './tasks';

export const notes = sqliteTable(
  'notes',
  {
    id: text('id').primaryKey(),
    title: text('title').notNull().default(''),
    body: text('body').notNull().default(''),
    isPinned: integer('is_pinned', { mode: 'boolean' }).notNull().default(false),
    taskId: text('task_id').references(() => tasks.id, { onDelete: 'set null' }),
    goalId: text('goal_id').references(() => goals.id, { onDelete: 'set null' }),
    projectId: text('project_id').references(() => projects.id, { onDelete: 'set null' }),
    ...syncColumns(),
  },
  (table) => [
    index('idx_notes_pinned')
      .on(table.isPinned)
      .where(sql`${table.deletedAt} is null`),
  ],
);

export type NoteRow = typeof notes.$inferSelect;
export type NewNoteRow = typeof notes.$inferInsert;
