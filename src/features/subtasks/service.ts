import { db } from '@/db/client';
import {
  createSubtask,
  deleteSubtask,
  listSubtasks,
  updateSubtask,
  type CreateSubtaskInput,
} from '@/db/repositories/subtasks';
import { runInTransaction } from '@/db/transaction';
import type { SubtaskRow } from '@/db/schema';
import { AppError } from '@/core/errors';

export class SubtaskService {
  static listForTask(taskId: string): SubtaskRow[] {
    try {
      return listSubtasks(db, taskId);
    } catch (error) {
      throw new AppError({
        code: 'DB_ERROR',
        userMessage: 'Failed to load subtasks',
        cause: error,
      });
    }
  }

  static create(input: CreateSubtaskInput): SubtaskRow {
    try {
      return runInTransaction(db, (tx) => {
        return createSubtask(tx, input);
      });
    } catch (error) {
      throw new AppError({
        code: 'DB_ERROR',
        userMessage: 'Failed to create subtask',
        cause: error,
      });
    }
  }

  static toggleComplete(id: string, isDone: boolean): SubtaskRow {
    try {
      return runInTransaction(db, (tx) => {
        const updated = updateSubtask(tx, id, { isDone: !isDone });
        if (!updated) {
          throw new AppError({ code: 'NOT_FOUND', userMessage: 'Subtask not found' });
        }
        return updated;
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError({
        code: 'DB_ERROR',
        userMessage: 'Failed to update subtask',
        cause: error,
      });
    }
  }

  static remove(id: string): void {
    try {
      runInTransaction(db, (tx) => {
        deleteSubtask(tx, id);
      });
    } catch (error) {
      throw new AppError({
        code: 'DB_ERROR',
        userMessage: 'Failed to delete subtask',
        cause: error,
      });
    }
  }
}
