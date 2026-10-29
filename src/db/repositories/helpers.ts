import { sql, type SQL } from 'drizzle-orm';

import { systemClock } from '@/core/clock';
import { getDeviceId } from '@/core/device';

export type SyncFieldKeys =
  'createdAt' | 'updatedAt' | 'deletedAt' | 'rev' | 'deviceId' | 'syncStatus';

export type CreateInput<TRow> = Omit<TRow, 'id' | SyncFieldKeys> & { id?: string };

export type UpdateInput<TRow> = Partial<
  Omit<TRow, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'rev' | 'deviceId' | 'syncStatus'>
>;

export function createSyncFields(): {
  createdAt: string;
  updatedAt: string;
  deletedAt: null;
  rev: number;
  deviceId: string;
  syncStatus: 'local';
} {
  const now = systemClock.nowIso();

  return {
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
    rev: 0,
    deviceId: getDeviceId(),
    syncStatus: 'local',
  };
}

export function updateSyncFields(): {
  updatedAt: string;
  rev: SQL;
  syncStatus: 'pending';
} {
  return {
    updatedAt: systemClock.nowIso(),
    rev: sql`rev + 1`,
    syncStatus: 'pending',
  };
}

export function softDeleteFields(): {
  deletedAt: string;
  updatedAt: string;
  rev: SQL;
  syncStatus: 'pending';
} {
  const now = systemClock.nowIso();

  return {
    deletedAt: now,
    updatedAt: now,
    rev: sql`rev + 1`,
    syncStatus: 'pending',
  };
}
