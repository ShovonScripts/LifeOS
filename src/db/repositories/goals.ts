import { and, asc, eq, isNull } from 'drizzle-orm';

import { newId } from '@/core/ids';

import {
  goals,
  goalMilestones,
  type NewGoalRow,
  type GoalRow,
  type NewGoalMilestoneRow,
  type GoalMilestoneRow,
} from '../schema';
import type { Executor } from '../transaction';
import {
  createSyncFields,
  softDeleteFields,
  updateSyncFields,
  type CreateInput,
  type UpdateInput,
} from './helpers';

export type CreateGoalInput = CreateInput<NewGoalRow>;
export type CreateGoalMilestoneInput = CreateInput<NewGoalMilestoneRow>;

export function listGoals(executor: Executor): GoalRow[] {
  return executor
    .select()
    .from(goals)
    .where(isNull(goals.deletedAt))
    .orderBy(asc(goals.createdAt))
    .all();
}

export function getGoal(executor: Executor, id: string): GoalRow | undefined {
  return executor
    .select()
    .from(goals)
    .where(and(eq(goals.id, id), isNull(goals.deletedAt)))
    .get();
}

export function createGoal(executor: Executor, input: CreateGoalInput): GoalRow {
  const id = input.id ?? newId();

  executor
    .insert(goals)
    .values({ ...input, id, ...createSyncFields() })
    .run();

  const created = getGoal(executor, id);

  if (!created) {
    throw new Error('Failed to read goal after insert');
  }

  return created;
}

export function updateGoal(
  executor: Executor,
  id: string,
  patch: UpdateInput<GoalRow>,
): GoalRow | undefined {
  executor
    .update(goals)
    .set({ ...patch, ...updateSyncFields() })
    .where(and(eq(goals.id, id), isNull(goals.deletedAt)))
    .run();

  return getGoal(executor, id);
}

export function deleteGoal(executor: Executor, id: string): void {
  executor.update(goals).set(softDeleteFields()).where(eq(goals.id, id)).run();
}

// Goal Milestones
export function listGoalMilestones(executor: Executor, goalId: string): GoalMilestoneRow[] {
  return executor
    .select()
    .from(goalMilestones)
    .where(and(eq(goalMilestones.goalId, goalId), isNull(goalMilestones.deletedAt)))
    .orderBy(asc(goalMilestones.sortOrder))
    .all();
}

export function createGoalMilestone(
  executor: Executor,
  input: CreateGoalMilestoneInput,
): GoalMilestoneRow {
  const id = input.id ?? newId();

  executor
    .insert(goalMilestones)
    .values({ ...input, id, ...createSyncFields() })
    .run();

  const created = executor
    .select()
    .from(goalMilestones)
    .where(and(eq(goalMilestones.id, id), isNull(goalMilestones.deletedAt)))
    .get();

  if (!created) {
    throw new Error('Failed to read milestone after insert');
  }

  return created;
}

export function toggleGoalMilestone(
  executor: Executor,
  id: string,
  isDone: boolean,
): GoalMilestoneRow | undefined {
  executor
    .update(goalMilestones)
    .set({ isDone: !isDone, ...updateSyncFields() })
    .where(and(eq(goalMilestones.id, id), isNull(goalMilestones.deletedAt)))
    .run();

  return executor
    .select()
    .from(goalMilestones)
    .where(and(eq(goalMilestones.id, id), isNull(goalMilestones.deletedAt)))
    .get();
}
