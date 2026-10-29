import { and, asc, eq, isNull } from 'drizzle-orm';

import { newId } from '@/core/ids';

import { projects, type NewProjectRow, type ProjectRow } from '../schema';
import type { Executor } from '../transaction';
import {
  createSyncFields,
  softDeleteFields,
  updateSyncFields,
  type CreateInput,
  type UpdateInput,
} from './helpers';

export type CreateProjectInput = CreateInput<NewProjectRow>;

export function listProjects(
  executor: Executor,
  options: { includeArchived?: boolean } = {},
): ProjectRow[] {
  const where = options.includeArchived
    ? isNull(projects.deletedAt)
    : and(isNull(projects.deletedAt), isNull(projects.archivedAt));

  return executor.select().from(projects).where(where).orderBy(asc(projects.sortOrder)).all();
}

export function getProject(executor: Executor, id: string): ProjectRow | undefined {
  return executor
    .select()
    .from(projects)
    .where(and(eq(projects.id, id), isNull(projects.deletedAt)))
    .get();
}

export function createProject(executor: Executor, input: CreateProjectInput): ProjectRow {
  const id = input.id ?? newId();

  executor
    .insert(projects)
    .values({ ...input, id, ...createSyncFields() })
    .run();

  const created = getProject(executor, id);

  if (!created) {
    throw new Error('Failed to read project after insert');
  }

  return created;
}

export function updateProject(
  executor: Executor,
  id: string,
  patch: UpdateInput<ProjectRow>,
): ProjectRow | undefined {
  executor
    .update(projects)
    .set({ ...patch, ...updateSyncFields() })
    .where(and(eq(projects.id, id), isNull(projects.deletedAt)))
    .run();

  return getProject(executor, id);
}

export function deleteProject(executor: Executor, id: string): void {
  executor.update(projects).set(softDeleteFields()).where(eq(projects.id, id)).run();
}
