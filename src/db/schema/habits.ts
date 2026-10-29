import { index, integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

import { syncColumns } from './columns';

export const habits = sqliteTable('habits', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  icon: text('icon'),
  color: text('color'),
  scheduleType: text('schedule_type', { enum: ['daily', 'weekdays', 'weekly_count'] })
    .notNull()
    .default('daily'),
  weekdays: text('weekdays'),
  targetPerWeek: integer('target_per_week'),
  targetPerDay: integer('target_per_day').notNull().default(1),
  unit: text('unit'),
  startDate: text('start_date').notNull(),
  sortOrder: integer('sort_order').notNull().default(0),
  archivedAt: text('archived_at'),
  ...syncColumns(),
});

export const habitLogs = sqliteTable(
  'habit_logs',
  {
    id: text('id').primaryKey(),
    habitId: text('habit_id')
      .notNull()
      .references(() => habits.id, { onDelete: 'cascade' }),
    localDate: text('local_date').notNull(),
    count: integer('count').notNull().default(1),
    note: text('note'),
    ...syncColumns(),
  },
  (table) => [
    uniqueIndex('idx_habit_logs_unique').on(table.habitId, table.localDate),
    index('idx_habit_logs_date').on(table.localDate),
  ],
);

export type HabitRow = typeof habits.$inferSelect;
export type NewHabitRow = typeof habits.$inferInsert;
export type HabitLogRow = typeof habitLogs.$inferSelect;
export type NewHabitLogRow = typeof habitLogs.$inferInsert;
