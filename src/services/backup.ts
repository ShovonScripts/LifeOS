import { z } from 'zod';
import { db } from '@/db/client';
import { runInTransaction } from '@/db/transaction';
import {
  tasks,
  subtasks,
  projects,
  labels,
  events,
  habits,
  habitLogs,
  goals,
  goalMilestones,
  notes,
  focusSessions,
} from '@/db/schema';
import { AppError } from '@/core/errors';

export const backupSchema = z.object({
  version: z.literal(1),
  exportedAt: z.string(),
  data: z.object({
    projects: z.array(z.record(z.string(), z.unknown())),
    tasks: z.array(z.record(z.string(), z.unknown())),
    subtasks: z.array(z.record(z.string(), z.unknown())),
    labels: z.array(z.record(z.string(), z.unknown())),
    events: z.array(z.record(z.string(), z.unknown())),
    habits: z.array(z.record(z.string(), z.unknown())),
    habitLogs: z.array(z.record(z.string(), z.unknown())),
    goals: z.array(z.record(z.string(), z.unknown())),
    goalMilestones: z.array(z.record(z.string(), z.unknown())),
    notes: z.array(z.record(z.string(), z.unknown())),
    focusSessions: z.array(z.record(z.string(), z.unknown())),
  }),
});

export type BackupPayload = z.infer<typeof backupSchema>;

export class BackupService {
  /**
   * Generates a full JSON backup payload containing user data across all tables.
   */
  static exportBackup(): BackupPayload {
    try {
      return {
        version: 1,
        exportedAt: new Date().toISOString(),
        data: {
          projects: db.select().from(projects).all(),
          tasks: db.select().from(tasks).all(),
          subtasks: db.select().from(subtasks).all(),
          labels: db.select().from(labels).all(),
          events: db.select().from(events).all(),
          habits: db.select().from(habits).all(),
          habitLogs: db.select().from(habitLogs).all(),
          goals: db.select().from(goals).all(),
          goalMilestones: db.select().from(goalMilestones).all(),
          notes: db.select().from(notes).all(),
          focusSessions: db.select().from(focusSessions).all(),
        },
      };
    } catch (error) {
      throw new AppError({
        code: 'DB_ERROR',
        userMessage: 'Failed to export backup data',
        cause: error,
      });
    }
  }

  /**
   * Restores user data from a validated backup payload.
   */
  static restoreBackup(rawPayload: unknown): void {
    const parseResult = backupSchema.safeParse(rawPayload);
    if (!parseResult.success) {
      throw new AppError({
        code: 'BACKUP_INVALID',
        userMessage: 'Backup file is invalid or corrupted',
        cause: parseResult.error,
      });
    }

    const backup = parseResult.data;

    try {
      runInTransaction(db, (tx) => {
        // Clear current user data
        tx.delete(focusSessions).run();
        tx.delete(notes).run();
        tx.delete(goalMilestones).run();
        tx.delete(goals).run();
        tx.delete(habitLogs).run();
        tx.delete(habits).run();
        tx.delete(events).run();
        tx.delete(labels).run();
        tx.delete(subtasks).run();
        tx.delete(tasks).run();
        tx.delete(projects).run();

        // Restore items
        if (backup.data.projects.length)
          tx.insert(projects)
            .values(backup.data.projects as never[])
            .run();
        if (backup.data.tasks.length)
          tx.insert(tasks)
            .values(backup.data.tasks as never[])
            .run();
        if (backup.data.subtasks.length)
          tx.insert(subtasks)
            .values(backup.data.subtasks as never[])
            .run();
        if (backup.data.labels.length)
          tx.insert(labels)
            .values(backup.data.labels as never[])
            .run();
        if (backup.data.events.length)
          tx.insert(events)
            .values(backup.data.events as never[])
            .run();
        if (backup.data.habits.length)
          tx.insert(habits)
            .values(backup.data.habits as never[])
            .run();
        if (backup.data.habitLogs.length)
          tx.insert(habitLogs)
            .values(backup.data.habitLogs as never[])
            .run();
        if (backup.data.goals.length)
          tx.insert(goals)
            .values(backup.data.goals as never[])
            .run();
        if (backup.data.goalMilestones.length)
          tx.insert(goalMilestones)
            .values(backup.data.goalMilestones as never[])
            .run();
        if (backup.data.notes.length)
          tx.insert(notes)
            .values(backup.data.notes as never[])
            .run();
        if (backup.data.focusSessions.length)
          tx.insert(focusSessions)
            .values(backup.data.focusSessions as never[])
            .run();
      });
    } catch (error) {
      throw new AppError({
        code: 'DB_ERROR',
        userMessage: 'Failed to restore backup data',
        cause: error,
      });
    }
  }

  /**
   * Permanently wipes all user data tables.
   */
  static clearAllData(): void {
    try {
      runInTransaction(db, (tx) => {
        tx.delete(focusSessions).run();
        tx.delete(notes).run();
        tx.delete(goalMilestones).run();
        tx.delete(goals).run();
        tx.delete(habitLogs).run();
        tx.delete(habits).run();
        tx.delete(events).run();
        tx.delete(labels).run();
        tx.delete(subtasks).run();
        tx.delete(tasks).run();
        tx.delete(projects).run();
      });
    } catch (error) {
      throw new AppError({
        code: 'DB_ERROR',
        userMessage: 'Failed to clear user data',
        cause: error,
      });
    }
  }
}
