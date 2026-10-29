import { db } from '@/db/client';
import {
  createProject,
  deleteProject,
  getProject,
  listProjects,
  updateProject,
  type CreateProjectInput,
} from '@/db/repositories/projects';
import { runInTransaction } from '@/db/transaction';
import type { ProjectRow } from '@/db/schema';
import { AppError } from '@/core/errors';

export class ProjectService {
  static list(options: { includeArchived?: boolean } = {}): ProjectRow[] {
    try {
      return listProjects(db, options);
    } catch (error) {
      throw new AppError({
        code: 'DB_ERROR',
        userMessage: 'Failed to load projects',
        cause: error,
      });
    }
  }

  static get(id: string): ProjectRow | undefined {
    try {
      return getProject(db, id);
    } catch (error) {
      throw new AppError({ code: 'DB_ERROR', userMessage: 'Failed to load project', cause: error });
    }
  }

  static create(input: CreateProjectInput): ProjectRow {
    try {
      return runInTransaction(db, (tx) => {
        return createProject(tx, input);
      });
    } catch (error) {
      throw new AppError({
        code: 'DB_ERROR',
        userMessage: 'Failed to create project',
        cause: error,
      });
    }
  }

  static update(id: string, patch: Partial<ProjectRow>): ProjectRow {
    try {
      return runInTransaction(db, (tx) => {
        const updated = updateProject(tx, id, patch);
        if (!updated) {
          throw new AppError({ code: 'NOT_FOUND', userMessage: 'Project not found' });
        }
        return updated;
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError({
        code: 'DB_ERROR',
        userMessage: 'Failed to update project',
        cause: error,
      });
    }
  }

  static remove(id: string): void {
    try {
      runInTransaction(db, (tx) => {
        deleteProject(tx, id);
      });
    } catch (error) {
      throw new AppError({
        code: 'DB_ERROR',
        userMessage: 'Failed to delete project',
        cause: error,
      });
    }
  }
}
