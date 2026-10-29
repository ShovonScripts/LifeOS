import { and, desc, eq, isNull, like, or } from 'drizzle-orm';

import { newId } from '@/core/ids';

import { notes, type NewNoteRow, type NoteRow } from '../schema';
import type { Executor } from '../transaction';
import {
  createSyncFields,
  softDeleteFields,
  updateSyncFields,
  type CreateInput,
  type UpdateInput,
} from './helpers';

export type CreateNoteInput = CreateInput<NewNoteRow>;

export function listNotes(executor: Executor, queryStr?: string): NoteRow[] {
  let where = isNull(notes.deletedAt);

  if (queryStr && queryStr.trim()) {
    const pattern = `%${queryStr.trim()}%`;
    where = and(where, or(like(notes.title, pattern), like(notes.body, pattern)))!;
  }

  return executor
    .select()
    .from(notes)
    .where(where)
    .orderBy(desc(notes.isPinned), desc(notes.updatedAt))
    .all();
}

export function getNote(executor: Executor, id: string): NoteRow | undefined {
  return executor
    .select()
    .from(notes)
    .where(and(eq(notes.id, id), isNull(notes.deletedAt)))
    .get();
}

export function createNote(executor: Executor, input: CreateNoteInput): NoteRow {
  const id = input.id ?? newId();

  executor
    .insert(notes)
    .values({ ...input, id, ...createSyncFields() })
    .run();

  const created = getNote(executor, id);

  if (!created) {
    throw new Error('Failed to read note after insert');
  }

  return created;
}

export function updateNote(
  executor: Executor,
  id: string,
  patch: UpdateInput<NoteRow>,
): NoteRow | undefined {
  executor
    .update(notes)
    .set({ ...patch, ...updateSyncFields() })
    .where(and(eq(notes.id, id), isNull(notes.deletedAt)))
    .run();

  return getNote(executor, id);
}

export function deleteNote(executor: Executor, id: string): void {
  executor.update(notes).set(softDeleteFields()).where(eq(notes.id, id)).run();
}
