import { db } from '@/db/client';
import {
  createHabit,
  deleteHabit,
  getHabit,
  getHabitLogs,
  listHabits,
  toggleHabitCheckin,
  updateHabit,
  type CreateHabitInput,
} from '@/db/repositories/habits';
import { runInTransaction } from '@/db/transaction';
import type { HabitLogRow, HabitRow } from '@/db/schema';
import { AppError } from '@/core/errors';
import { calculateStreaks, type StreakSummary } from '@/domain/streaks';

export class HabitService {
  static list(): HabitRow[] {
    try {
      return listHabits(db);
    } catch (error) {
      throw new AppError({ code: 'DB_ERROR', userMessage: 'Failed to load habits', cause: error });
    }
  }

  static get(id: string): HabitRow | undefined {
    try {
      return getHabit(db, id);
    } catch (error) {
      throw new AppError({ code: 'DB_ERROR', userMessage: 'Failed to fetch habit', cause: error });
    }
  }

  static getLogs(id: string): HabitLogRow[] {
    try {
      return getHabitLogs(db, id);
    } catch (error) {
      throw new AppError({
        code: 'DB_ERROR',
        userMessage: 'Failed to fetch habit logs',
        cause: error,
      });
    }
  }

  static getStreak(id: string): StreakSummary {
    try {
      const logs = getHabitLogs(db, id);
      const checkins = logs.map((l) => ({ localDate: l.localDate, completed: true }));
      return calculateStreaks(checkins);
    } catch (error) {
      throw new AppError({
        code: 'DB_ERROR',
        userMessage: 'Failed to calculate streak',
        cause: error,
      });
    }
  }

  static create(input: CreateHabitInput): HabitRow {
    try {
      return runInTransaction(db, (tx) => {
        return createHabit(tx, input);
      });
    } catch (error) {
      throw new AppError({ code: 'DB_ERROR', userMessage: 'Failed to create habit', cause: error });
    }
  }

  static update(id: string, patch: Partial<HabitRow>): HabitRow {
    try {
      return runInTransaction(db, (tx) => {
        const updated = updateHabit(tx, id, patch);
        if (!updated) {
          throw new AppError({ code: 'NOT_FOUND', userMessage: 'Habit not found' });
        }
        return updated;
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError({ code: 'DB_ERROR', userMessage: 'Failed to update habit', cause: error });
    }
  }

  static toggleCheckin(id: string, localDate: string): { checked: boolean } {
    try {
      return runInTransaction(db, (tx) => {
        return toggleHabitCheckin(tx, id, localDate);
      });
    } catch (error) {
      throw new AppError({
        code: 'DB_ERROR',
        userMessage: 'Failed to toggle check-in',
        cause: error,
      });
    }
  }

  static remove(id: string): void {
    try {
      runInTransaction(db, (tx) => {
        deleteHabit(tx, id);
      });
    } catch (error) {
      throw new AppError({ code: 'DB_ERROR', userMessage: 'Failed to delete habit', cause: error });
    }
  }
}
