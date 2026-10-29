import { desc } from 'drizzle-orm';

import { newId } from '@/core/ids';

import { focusSessions, type NewFocusSessionRow, type FocusSessionRow } from '../schema';
import type { Executor } from '../transaction';

export function listFocusSessions(executor: Executor): FocusSessionRow[] {
  return executor.select().from(focusSessions).orderBy(desc(focusSessions.startedAt)).all();
}

export function createFocusSession(
  executor: Executor,
  input: Omit<NewFocusSessionRow, 'id' | 'createdAt'>,
): FocusSessionRow {
  const id = newId();
  const createdAt = new Date().toISOString();

  executor
    .insert(focusSessions)
    .values({ ...input, id, createdAt })
    .run();

  const created = executor.select().from(focusSessions).where(desc(focusSessions.createdAt)).get();

  if (!created) {
    throw new Error('Failed to read focus session after insert');
  }

  return created;
}
