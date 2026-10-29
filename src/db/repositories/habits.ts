import { and, asc, eq, isNull } from 'drizzle-orm';

import { newId } from '@/core/ids';

import { habits, habitLogs, type NewHabitRow, type HabitRow, type HabitLogRow } from '../schema';
import type { Executor } from '../transaction';
import {
  createSyncFields,
  softDeleteFields,
  updateSyncFields,
  type CreateInput,
  type UpdateInput,
} from './helpers';

export type CreateHabitInput = CreateInput<NewHabitRow>;

export function listHabits(executor: Executor): HabitRow[] {
  return executor
    .select()
    .from(habits)
    .where(and(isNull(habits.deletedAt), isNull(habits.archivedAt)))
    .orderBy(asc(habits.sortOrder))
    .all();
}

export function getHabit(executor: Executor, id: string): HabitRow | undefined {
  return executor
    .select()
    .from(habits)
    .where(and(eq(habits.id, id), isNull(habits.deletedAt)))
    .get();
}

export function createHabit(executor: Executor, input: CreateHabitInput): HabitRow {
  const id = input.id ?? newId();

  executor
    .insert(habits)
    .values({ ...input, id, ...createSyncFields() })
    .run();

  const created = getHabit(executor, id);

  if (!created) {
    throw new Error('Failed to read habit after insert');
  }

  return created;
}

export function updateHabit(
  executor: Executor,
  id: string,
  patch: UpdateInput<HabitRow>,
): HabitRow | undefined {
  executor
    .update(habits)
    .set({ ...patch, ...updateSyncFields() })
    .where(and(eq(habits.id, id), isNull(habits.deletedAt)))
    .run();

  return getHabit(executor, id);
}

export function deleteHabit(executor: Executor, id: string): void {
  executor.update(habits).set(softDeleteFields()).where(eq(habits.id, id)).run();
}

// Habit Logs
export function getHabitLogs(executor: Executor, habitId: string): HabitLogRow[] {
  return executor
    .select()
    .from(habitLogs)
    .where(and(eq(habitLogs.habitId, habitId), isNull(habitLogs.deletedAt)))
    .all();
}

export function toggleHabitCheckin(
  executor: Executor,
  habitId: string,
  localDate: string,
): { checked: boolean } {
  const existing = executor
    .select()
    .from(habitLogs)
    .where(
      and(
        eq(habitLogs.habitId, habitId),
        eq(habitLogs.localDate, localDate),
        isNull(habitLogs.deletedAt),
      ),
    )
    .get();

  if (existing) {
    executor.delete(habitLogs).where(eq(habitLogs.id, existing.id)).run();
    return { checked: false };
  } else {
    executor
      .insert(habitLogs)
      .values({
        id: newId(),
        habitId,
        localDate,
        count: 1,
        ...createSyncFields(),
      })
      .run();
    return { checked: true };
  }
}
