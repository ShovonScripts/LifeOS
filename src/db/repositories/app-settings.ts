import { eq } from 'drizzle-orm';

import { systemClock } from '@/core/clock';

import { appSettings } from '../schema';
import type { Executor } from '../transaction';

export function getSetting(executor: Executor, key: string): string | undefined {
  return executor
    .select({ value: appSettings.value })
    .from(appSettings)
    .where(eq(appSettings.key, key))
    .get()?.value;
}

export function getAllSettings(executor: Executor): Record<string, string> {
  const rows = executor.select().from(appSettings).all();
  return Object.fromEntries(rows.map((row) => [row.key, row.value]));
}

export function setSetting(executor: Executor, key: string, value: string): void {
  const updatedAt = systemClock.nowIso();

  executor
    .insert(appSettings)
    .values({ key, value, updatedAt })
    .onConflictDoUpdate({ target: appSettings.key, set: { value, updatedAt } })
    .run();
}

export function deleteSetting(executor: Executor, key: string): void {
  executor.delete(appSettings).where(eq(appSettings.key, key)).run();
}
