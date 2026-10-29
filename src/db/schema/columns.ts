import { integer, text } from 'drizzle-orm/sqlite-core';

export type SyncStatus = 'local' | 'pending' | 'synced';

export function syncColumns() {
  return {
    createdAt: text('created_at').notNull(),
    updatedAt: text('updated_at').notNull(),
    deletedAt: text('deleted_at'),
    rev: integer('rev').notNull().default(0),
    deviceId: text('device_id').notNull(),
    syncStatus: text('sync_status', { enum: ['local', 'pending', 'synced'] })
      .notNull()
      .default('local'),
  };
}
