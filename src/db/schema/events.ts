import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { syncColumns } from './columns';

export const events = sqliteTable(
  'events',
  {
    id: text('id').primaryKey(),
    title: text('title').notNull(),
    notes: text('notes'),
    location: text('location'),
    startsAt: text('starts_at').notNull(),
    endsAt: text('ends_at').notNull(),
    isAllDay: integer('is_all_day', { mode: 'boolean' }).notNull().default(false),
    timezone: text('timezone').notNull(),
    recurrenceRule: text('recurrence_rule'),
    seriesId: text('series_id'),
    color: text('color'),
    ...syncColumns(),
  },
  (table) => [index('idx_events_starts').on(table.startsAt)],
);

export type EventRow = typeof events.$inferSelect;
export type NewEventRow = typeof events.$inferInsert;
