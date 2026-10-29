import { index, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const reminders = sqliteTable(
  'reminders',
  {
    id: text('id').primaryKey(),
    entityType: text('entity_type', { enum: ['task', 'event', 'habit'] }).notNull(),
    entityId: text('entity_id').notNull(),
    triggerAt: text('trigger_at').notNull(),
    notificationId: text('notification_id'),
    channel: text('channel', {
      enum: ['reminders', 'habits', 'daily-summary', 'focus'],
    }).notNull(),
    createdAt: text('created_at').notNull(),
  },
  (table) => [
    index('idx_reminders_trigger').on(table.triggerAt),
    index('idx_reminders_entity').on(table.entityType, table.entityId),
  ],
);

export type ReminderRow = typeof reminders.$inferSelect;
export type NewReminderRow = typeof reminders.$inferInsert;
