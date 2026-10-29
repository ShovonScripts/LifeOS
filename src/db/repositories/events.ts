import { and, asc, eq, gte, lte, isNull } from 'drizzle-orm';

import { newId } from '@/core/ids';

import { events, type NewEventRow, type EventRow } from '../schema';
import type { Executor } from '../transaction';
import {
  createSyncFields,
  softDeleteFields,
  updateSyncFields,
  type CreateInput,
  type UpdateInput,
} from './helpers';

export type CreateEventInput = CreateInput<NewEventRow>;

export function listEventsInRange(
  executor: Executor,
  startIso: string,
  endIso: string,
): EventRow[] {
  return executor
    .select()
    .from(events)
    .where(
      and(isNull(events.deletedAt), gte(events.startsAt, startIso), lte(events.startsAt, endIso)),
    )
    .orderBy(asc(events.startsAt))
    .all();
}

export function getEvent(executor: Executor, id: string): EventRow | undefined {
  return executor
    .select()
    .from(events)
    .where(and(eq(events.id, id), isNull(events.deletedAt)))
    .get();
}

export function createEvent(executor: Executor, input: CreateEventInput): EventRow {
  const id = input.id ?? newId();

  executor
    .insert(events)
    .values({ ...input, id, ...createSyncFields() })
    .run();

  const created = getEvent(executor, id);

  if (!created) {
    throw new Error('Failed to read event after insert');
  }

  return created;
}

export function updateEvent(
  executor: Executor,
  id: string,
  patch: UpdateInput<EventRow>,
): EventRow | undefined {
  executor
    .update(events)
    .set({ ...patch, ...updateSyncFields() })
    .where(and(eq(events.id, id), isNull(events.deletedAt)))
    .run();

  return getEvent(executor, id);
}

export function deleteEvent(executor: Executor, id: string): void {
  executor.update(events).set(softDeleteFields()).where(eq(events.id, id)).run();
}
