import { db } from '@/db/client';
import {
  createTask as repoCreateTask,
  deleteTask as repoDeleteTask,
  listTasks,
  updateTask as repoUpdateTask,
  completeTask as repoCompleteTask,
  type TaskFilter,
} from '@/db/repositories/tasks';
import { runInTransaction } from '@/db/transaction';
import type { TaskRow } from '@/db/schema';
import { AppError } from '@/core/errors';
import { parseQuickAdd } from '@/domain/parser';
import {
  createTaskSchema,
  updateTaskSchema,
  type CreateTaskInputZod,
  type UpdateTaskInputZod,
} from './schema';

export class TaskService {
  static list(filter: TaskFilter = {}): TaskRow[] {
    try {
      return listTasks(db, filter);
    } catch (error) {
      throw new AppError({ code: 'DB_ERROR', userMessage: 'Failed to load tasks', cause: error });
    }
  }

  static create(input: CreateTaskInputZod): TaskRow {
    const parsed = createTaskSchema.parse(input);
    try {
      return runInTransaction(db, (tx) => {
        return repoCreateTask(tx, parsed);
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError({ code: 'DB_ERROR', userMessage: 'Failed to create task', cause: error });
    }
  }

  static quickAdd(rawInput: string): TaskRow {
    const parsed = parseQuickAdd(rawInput);
    return TaskService.create({
      title: parsed.title,
      priority: parsed.priority === 'urgent' ? 'high' : parsed.priority,
      dueLocalDate: parsed.dueLocalDate,
      dueTime: parsed.dueTime,
      status: 'todo',
    });
  }

  static update(id: string, patch: UpdateTaskInputZod): TaskRow {
    const parsed = updateTaskSchema.parse(patch);
    try {
      return runInTransaction(db, (tx) => {
        const updated = repoUpdateTask(tx, id, parsed);
        if (!updated) {
          throw new AppError({ code: 'NOT_FOUND', userMessage: 'Task not found' });
        }
        return updated;
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError({ code: 'DB_ERROR', userMessage: 'Failed to update task', cause: error });
    }
  }

  static toggleComplete(id: string, currentStatus: string): TaskRow {
    const now = new Date().toISOString();
    try {
      return runInTransaction(db, (tx) => {
        if (currentStatus === 'done') {
          const updated = repoUpdateTask(tx, id, { status: 'todo', completedAt: null });
          if (!updated) throw new AppError({ code: 'NOT_FOUND', userMessage: 'Task not found' });
          return updated;
        } else {
          const updated = repoCompleteTask(tx, id, now);
          if (!updated) throw new AppError({ code: 'NOT_FOUND', userMessage: 'Task not found' });
          return updated;
        }
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError({
        code: 'DB_ERROR',
        userMessage: 'Failed to toggle task completion',
        cause: error,
      });
    }
  }

  static remove(id: string): void {
    try {
      runInTransaction(db, (tx) => {
        repoDeleteTask(tx, id);
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError({ code: 'DB_ERROR', userMessage: 'Failed to delete task', cause: error });
    }
  }
}
