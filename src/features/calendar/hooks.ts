import { useCallback, useState } from 'react';
import type { EventRow, TaskRow } from '@/db/schema';
import { CalendarService } from './service';

export function useCalendar(selectedDateStr: string) {
  const [events, setEvents] = useState<EventRow[]>(() => {
    try {
      const start = `${selectedDateStr}T00:00:00.000Z`;
      const end = `${selectedDateStr}T23:59:59.999Z`;
      return CalendarService.getEvents(start, end);
    } catch {
      return [];
    }
  });

  const [tasks, setTasks] = useState<TaskRow[]>(() => {
    try {
      return CalendarService.getTasksForDay(selectedDateStr);
    } catch {
      return [];
    }
  });

  const refresh = useCallback((dateStr: string) => {
    try {
      const start = `${dateStr}T00:00:00.000Z`;
      const end = `${dateStr}T23:59:59.999Z`;
      setEvents(CalendarService.getEvents(start, end));
      setTasks(CalendarService.getTasksForDay(dateStr));
    } catch {
      // handled
    }
  }, []);

  return {
    events,
    tasks,
    refresh,
  };
}
