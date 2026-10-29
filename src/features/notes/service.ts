import { db } from '@/db/client';
import {
  createNote,
  deleteNote,
  getNote,
  listNotes,
  updateNote,
  type CreateNoteInput,
} from '@/db/repositories/notes';
import { runInTransaction } from '@/db/transaction';
import type { NoteRow } from '@/db/schema';
import { AppError } from '@/core/errors';

export class NoteService {
  static list(queryStr?: string): NoteRow[] {
    try {
      return listNotes(db, queryStr);
    } catch (error) {
      throw new AppError({ code: 'DB_ERROR', userMessage: 'Failed to load notes', cause: error });
    }
  }

  static get(id: string): NoteRow | undefined {
    try {
      return getNote(db, id);
    } catch (error) {
      throw new AppError({ code: 'DB_ERROR', userMessage: 'Failed to fetch note', cause: error });
    }
  }

  static create(input: CreateNoteInput): NoteRow {
    try {
      return runInTransaction(db, (tx) => {
        return createNote(tx, input);
      });
    } catch (error) {
      throw new AppError({ code: 'DB_ERROR', userMessage: 'Failed to create note', cause: error });
    }
  }

  static update(id: string, patch: Partial<NoteRow>): NoteRow {
    try {
      return runInTransaction(db, (tx) => {
        const updated = updateNote(tx, id, patch);
        if (!updated) {
          throw new AppError({ code: 'NOT_FOUND', userMessage: 'Note not found' });
        }
        return updated;
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError({ code: 'DB_ERROR', userMessage: 'Failed to update note', cause: error });
    }
  }

  static togglePin(id: string, currentPinned: boolean): NoteRow {
    return NoteService.update(id, { isPinned: !currentPinned });
  }

  static remove(id: string): void {
    try {
      runInTransaction(db, (tx) => {
        deleteNote(tx, id);
      });
    } catch (error) {
      throw new AppError({ code: 'DB_ERROR', userMessage: 'Failed to delete note', cause: error });
    }
  }
}
