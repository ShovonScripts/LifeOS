import { and, asc, eq, isNull } from 'drizzle-orm';

import { newId } from '@/core/ids';

import { subtasks, type NewSubtaskRow, type SubtaskRow } from '../schema';
import type { Executor } from '../transaction';
import {
  createSyncFields,
  softDeleteFields,
  updateSyncFields,
  type CreateInput,
  type UpdateInput,
} from './helpers';

export type CreateSubtaskInput = CreateInput<NewSubtaskRow>;

export function listSubtasks(executor: Executor, taskId: string): SubtaskRow[] {
  return executor
    .select()
    .from(subtasks)
    .where(and(eq(subtasks.taskId, taskId), isNull(subtasks.deletedAt)))
    .orderBy(asc(subtasks.sortOrder), asc(subtasks.createdAt))
    .all();
}

export function getSubtask(executor: Executor, id: string): SubtaskRow | undefined {
  return executor
    .select()
    .from(subtasks)
    .where(and(eq(subtasks.id, id), isNull(subtasks.deletedAt)))
    .get();
}

export function createSubtask(executor: Executor, input: CreateSubtaskInput): SubtaskRow {
  const id = input.id ?? newId();

  executor
    .insert(subtasks)
    .values({ ...input, id, ...createSyncFields() })
    .run();

  const created = getSubtask(executor, id);

  if (!created) {
    throw new Error('Failed to read subtask after insert');
  }

  return created;
}

export function updateSubtask(
  executor: Executor,
  id: string,
  patch: UpdateInput<SubtaskRow>,
): SubtaskRow | undefined {
  executor
    .update(subtasks)
    .set({ ...patch, ...updateSyncFields() })
    .where(and(eq(subtasks.id, id), isNull(subtasks.deletedAt)))
    .run();

  return getSubtask(executor, id);
}

export function deleteSubtask(executor: Executor, id: string): void {
  executor.update(subtasks).set(softDeleteFields()).where(eq(subtasks.id, id)).run();
}

export function deleteSubtasksForTask(executor: Executor, taskId: string): void {
  executor
    .update(subtasks)
    .set(softDeleteFields())
    .where(and(eq(subtasks.taskId, taskId), isNull(subtasks.deletedAt)))
    .run();
}
