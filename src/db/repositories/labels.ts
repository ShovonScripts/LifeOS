import { and, asc, eq, isNull } from 'drizzle-orm';

import { newId } from '@/core/ids';

import { labels, taskLabels, type LabelRow, type NewLabelRow } from '../schema';
import type { Executor } from '../transaction';
import {
  createSyncFields,
  softDeleteFields,
  updateSyncFields,
  type CreateInput,
  type UpdateInput,
} from './helpers';

export type CreateLabelInput = CreateInput<NewLabelRow>;

export function listLabels(executor: Executor): LabelRow[] {
  return executor
    .select()
    .from(labels)
    .where(isNull(labels.deletedAt))
    .orderBy(asc(labels.name))
    .all();
}

export function getLabel(executor: Executor, id: string): LabelRow | undefined {
  return executor
    .select()
    .from(labels)
    .where(and(eq(labels.id, id), isNull(labels.deletedAt)))
    .get();
}

export function createLabel(executor: Executor, input: CreateLabelInput): LabelRow {
  const id = input.id ?? newId();

  executor
    .insert(labels)
    .values({ ...input, id, ...createSyncFields() })
    .run();

  const created = getLabel(executor, id);

  if (!created) {
    throw new Error('Failed to read label after insert');
  }

  return created;
}

export function updateLabel(
  executor: Executor,
  id: string,
  patch: UpdateInput<LabelRow>,
): LabelRow | undefined {
  executor
    .update(labels)
    .set({ ...patch, ...updateSyncFields() })
    .where(and(eq(labels.id, id), isNull(labels.deletedAt)))
    .run();

  return getLabel(executor, id);
}

export function deleteLabel(executor: Executor, id: string): void {
  executor.update(labels).set(softDeleteFields()).where(eq(labels.id, id)).run();
}

export function listLabelsForTask(executor: Executor, taskId: string): LabelRow[] {
  return executor
    .select({
      id: labels.id,
      name: labels.name,
      color: labels.color,
      createdAt: labels.createdAt,
      updatedAt: labels.updatedAt,
      deletedAt: labels.deletedAt,
      rev: labels.rev,
      deviceId: labels.deviceId,
      syncStatus: labels.syncStatus,
    })
    .from(taskLabels)
    .innerJoin(labels, eq(taskLabels.labelId, labels.id))
    .where(and(eq(taskLabels.taskId, taskId), isNull(labels.deletedAt)))
    .orderBy(asc(labels.name))
    .all();
}

export function replaceTaskLabels(executor: Executor, taskId: string, labelIds: string[]): void {
  executor.delete(taskLabels).where(eq(taskLabels.taskId, taskId)).run();

  if (labelIds.length === 0) {
    return;
  }

  const createdAt = new Date().toISOString();
  executor
    .insert(taskLabels)
    .values(labelIds.map((labelId) => ({ taskId, labelId, createdAt })))
    .run();
}
