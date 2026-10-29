import { db } from '@/db/client';
import { createFocusSession, listFocusSessions } from '@/db/repositories/focus';
import { runInTransaction } from '@/db/transaction';
import type { FocusSessionRow, NewFocusSessionRow } from '@/db/schema';
import { AppError } from '@/core/errors';

export class FocusService {
  static list(): FocusSessionRow[] {
    try {
      return listFocusSessions(db);
    } catch (error) {
      throw new AppError({
        code: 'DB_ERROR',
        userMessage: 'Failed to load focus sessions',
        cause: error,
      });
    }
  }

  static recordSession(input: Omit<NewFocusSessionRow, 'id' | 'createdAt'>): FocusSessionRow {
    try {
      return runInTransaction(db, (tx) => {
        return createFocusSession(tx, input);
      });
    } catch (error) {
      throw new AppError({
        code: 'DB_ERROR',
        userMessage: 'Failed to record focus session',
        cause: error,
      });
    }
  }
}
