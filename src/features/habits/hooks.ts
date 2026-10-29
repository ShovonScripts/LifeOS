import { useCallback, useState } from 'react';
import type { HabitRow } from '@/db/schema';
import { HabitService } from './service';

export function useHabits() {
  const [habits, setHabits] = useState<HabitRow[]>(() => {
    try {
      return HabitService.list();
    } catch {
      return [];
    }
  });

  const refresh = useCallback(() => {
    try {
      setHabits(HabitService.list());
    } catch {
      // handled
    }
  }, []);

  const toggleCheckin = useCallback(
    (id: string, localDate: string) => {
      try {
        const result = HabitService.toggleCheckin(id, localDate);
        refresh();
        return result;
      } catch (err: unknown) {
        throw err;
      }
    },
    [refresh],
  );

  return {
    habits,
    refresh,
    toggleCheckin,
  };
}
