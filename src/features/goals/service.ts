import { db } from '@/db/client';
import {
  createGoal,
  createGoalMilestone,
  deleteGoal,
  getGoal,
  listGoalMilestones,
  listGoals,
  toggleGoalMilestone,
  updateGoal,
  type CreateGoalInput,
  type CreateGoalMilestoneInput,
} from '@/db/repositories/goals';
import { runInTransaction } from '@/db/transaction';
import type { GoalMilestoneRow, GoalRow } from '@/db/schema';
import { AppError } from '@/core/errors';

export class GoalService {
  static list(): GoalRow[] {
    try {
      return listGoals(db);
    } catch (error) {
      throw new AppError({ code: 'DB_ERROR', userMessage: 'Failed to load goals', cause: error });
    }
  }

  static get(id: string): GoalRow | undefined {
    try {
      return getGoal(db, id);
    } catch (error) {
      throw new AppError({ code: 'DB_ERROR', userMessage: 'Failed to fetch goal', cause: error });
    }
  }

  static getMilestones(goalId: string): GoalMilestoneRow[] {
    try {
      return listGoalMilestones(db, goalId);
    } catch (error) {
      throw new AppError({
        code: 'DB_ERROR',
        userMessage: 'Failed to load milestones',
        cause: error,
      });
    }
  }

  static create(input: CreateGoalInput): GoalRow {
    try {
      return runInTransaction(db, (tx) => {
        return createGoal(tx, input);
      });
    } catch (error) {
      throw new AppError({ code: 'DB_ERROR', userMessage: 'Failed to create goal', cause: error });
    }
  }

  static update(id: string, patch: Partial<GoalRow>): GoalRow {
    try {
      return runInTransaction(db, (tx) => {
        const updated = updateGoal(tx, id, patch);
        if (!updated) {
          throw new AppError({ code: 'NOT_FOUND', userMessage: 'Goal not found' });
        }
        return updated;
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError({ code: 'DB_ERROR', userMessage: 'Failed to update goal', cause: error });
    }
  }

  static remove(id: string): void {
    try {
      runInTransaction(db, (tx) => {
        deleteGoal(tx, id);
      });
    } catch (error) {
      throw new AppError({ code: 'DB_ERROR', userMessage: 'Failed to delete goal', cause: error });
    }
  }

  static createMilestone(input: CreateGoalMilestoneInput): GoalMilestoneRow {
    try {
      return runInTransaction(db, (tx) => {
        return createGoalMilestone(tx, input);
      });
    } catch (error) {
      throw new AppError({
        code: 'DB_ERROR',
        userMessage: 'Failed to create milestone',
        cause: error,
      });
    }
  }

  static toggleMilestone(id: string, currentIsDone: boolean): GoalMilestoneRow {
    try {
      return runInTransaction(db, (tx) => {
        const updated = toggleGoalMilestone(tx, id, currentIsDone);
        if (!updated) {
          throw new AppError({ code: 'NOT_FOUND', userMessage: 'Milestone not found' });
        }
        return updated;
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError({
        code: 'DB_ERROR',
        userMessage: 'Failed to toggle milestone',
        cause: error,
      });
    }
  }
}
