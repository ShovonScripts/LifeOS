import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { syncColumns } from './columns';

export const projects = sqliteTable('projects', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  color: text('color').notNull().default('#7657E8'),
  icon: text('icon'),
  sortOrder: integer('sort_order').notNull().default(0),
  archivedAt: text('archived_at'),
  ...syncColumns(),
});

export type ProjectRow = typeof projects.$inferSelect;
export type NewProjectRow = typeof projects.$inferInsert;
