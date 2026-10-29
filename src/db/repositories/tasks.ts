import { and, asc, eq, inArray, isNull, type SQL } from 'drizzle-orm';

import { newId } from '@/core/ids';

import { tasks, type NewTaskRow, type TaskRow } from '../schema';
import type { Executor } from '../transaction';
import {
  createSyncFields,
  softDeleteFields,
  updateSyncFields,
  type CreateInput,
  type UpdateInput,
} from './helpers';

export type CreateTaskInput = CreateInput<NewTaskRow>;
export type TaskStatus = TaskRow['status'];

export type TaskFilter = {
  projectId?: string;
  statuses?: TaskStatus[];
  dueLocalDate?: string;
  includeDeleted?: boolean;
  limit?: number;
};

export function listTasks(executor: Executor, filter: TaskFilter = {}): TaskRow[] {
  const conditions: SQL[] = [];

  if (!filter.includeDeleted) {
    conditions.push(isNull(tasks.deletedAt));
  }

  if (filter.projectId) {
    conditions.push(eq(tasks.projectId, filter.projectId));
  }

  if (filter.statuses?.length) {
    conditions.push(inArray(tasks.status, filter.statuses));
  }

  if (filter.dueLocalDate) {
    conditions.push(eq(tasks.dueLocalDate, filter.dueLocalDate));
  }

  const query = executor
    .select()
    .from(tasks)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(asc(tasks.sortOrder), asc(tasks.createdAt));

  return filter.limit ? query.limit(filter.limit).all() : query.all();
}

export function getTask(executor: Executor, id: string): TaskRow | undefined {
  return executor
    .select()
    .from(tasks)
    .where(and(eq(tasks.id, id), isNull(tasks.deletedAt)))
    .get();
}

export function createTask(executor: Executor, input: CreateTaskInput): TaskRow {
  const id = input.id ?? newId();

  executor
    .insert(tasks)
    .values({ ...input, id, ...createSyncFields() })
    .run();

  const created = getTask(executor, id);

  if (!created) {
    throw new Error('Failed to read task after insert');
  }

  return created;
}

export function updateTask(
  executor: Executor,
  id: string,
  patch: UpdateInput<TaskRow>,
): TaskRow | undefined {
  executor
    .update(tasks)
    .set({ ...patch, ...updateSyncFields() })
    .where(and(eq(tasks.id, id), isNull(tasks.deletedAt)))
    .run();

  return getTask(executor, id);
}

export function completeTask(
  executor: Executor,
  id: string,
  completedAt: string,
): TaskRow | undefined {
  return updateTask(executor, id, {
    status: 'done',
    completedAt,
    dueLocalDate: null,
  });
}

export function deleteTask(executor: Executor, id: string): void {
  executor.update(tasks).set(softDeleteFields()).where(eq(tasks.id, id)).run();
}
