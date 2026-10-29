import { useCallback, useState } from 'react';
import type { TaskRow } from '@/db/schema';
import { TaskService } from './service';
import type { TaskFilter } from '@/db/repositories/tasks';
import type { CreateTaskInputZod, UpdateTaskInputZod } from './schema';

export function useTasks(filter: TaskFilter = {}) {
  const [tasks, setTasks] = useState<TaskRow[]>(() => {
    try {
      return TaskService.list(filter);
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(() => {
    try {
      setLoading(true);
      const data = TaskService.list(filter);
      setTasks(data);
      setError(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load tasks';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  const createTask = useCallback(
    (input: CreateTaskInputZod) => {
      try {
        const newTask = TaskService.create(input);
        refresh();
        return newTask;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to create task';
        setError(message);
        throw err;
      }
    },
    [refresh],
  );

  const quickAdd = useCallback(
    (rawInput: string) => {
      try {
        const newTask = TaskService.quickAdd(rawInput);
        refresh();
        return newTask;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Quick add failed';
        setError(message);
        throw err;
      }
    },
    [refresh],
  );

  const updateTask = useCallback(
    (id: string, patch: UpdateTaskInputZod) => {
      try {
        const updated = TaskService.update(id, patch);
        refresh();
        return updated;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to update task';
        setError(message);
        throw err;
      }
    },
    [refresh],
  );

  const toggleComplete = useCallback(
    (id: string, currentStatus: string) => {
      try {
        const updated = TaskService.toggleComplete(id, currentStatus);
        refresh();
        return updated;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to toggle task';
        setError(message);
        throw err;
      }
    },
    [refresh],
  );

  const deleteTask = useCallback(
    (id: string) => {
      try {
        TaskService.remove(id);
        refresh();
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to delete task';
        setError(message);
        throw err;
      }
    },
    [refresh],
  );

  return {
    tasks,
    loading,
    error,
    refresh,
    createTask,
    quickAdd,
    updateTask,
    toggleComplete,
    deleteTask,
  };
}
