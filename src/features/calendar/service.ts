import { db } from '@/db/client';
import {
  createEvent as repoCreateEvent,
  deleteEvent as repoDeleteEvent,
  getEvent as repoGetEvent,
  listEventsInRange,
  updateEvent as repoUpdateEvent,
  type CreateEventInput,
} from '@/db/repositories/events';
import { listTasks } from '@/db/repositories/tasks';
import { runInTransaction } from '@/db/transaction';
import type { EventRow, TaskRow } from '@/db/schema';
import { AppError } from '@/core/errors';

export class CalendarService {
  static getEvents(startIso: string, endIso: string): EventRow[] {
    try {
      return listEventsInRange(db, startIso, endIso);
    } catch (error) {
      throw new AppError({ code: 'DB_ERROR', userMessage: 'Failed to load events', cause: error });
    }
  }

  static getEvent(id: string): EventRow | undefined {
    try {
      return repoGetEvent(db, id);
    } catch (error) {
      throw new AppError({ code: 'DB_ERROR', userMessage: 'Failed to fetch event', cause: error });
    }
  }

  static getTasksForDay(localDate: string): TaskRow[] {
    try {
      return listTasks(db, { dueLocalDate: localDate });
    } catch (error) {
      throw new AppError({
        code: 'DB_ERROR',
        userMessage: 'Failed to load tasks for calendar',
        cause: error,
      });
    }
  }

  static createEvent(input: CreateEventInput): EventRow {
    try {
      return runInTransaction(db, (tx) => {
        return repoCreateEvent(tx, input);
      });
    } catch (error) {
      throw new AppError({ code: 'DB_ERROR', userMessage: 'Failed to create event', cause: error });
    }
  }

  static updateEvent(id: string, patch: Partial<EventRow>): EventRow {
    try {
      return runInTransaction(db, (tx) => {
        const updated = repoUpdateEvent(tx, id, patch);
        if (!updated) {
          throw new AppError({ code: 'NOT_FOUND', userMessage: 'Event not found' });
        }
        return updated;
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError({ code: 'DB_ERROR', userMessage: 'Failed to update event', cause: error });
    }
  }

  static deleteEvent(id: string): void {
    try {
      runInTransaction(db, (tx) => {
        repoDeleteEvent(tx, id);
      });
    } catch (error) {
      throw new AppError({ code: 'DB_ERROR', userMessage: 'Failed to delete event', cause: error });
    }
  }
}
