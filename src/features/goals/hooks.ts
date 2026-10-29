import { useCallback, useState } from 'react';
import type { GoalRow } from '@/db/schema';
import { GoalService } from './service';

export function useGoals() {
  const [goals, setGoals] = useState<GoalRow[]>(() => {
    try {
      return GoalService.list();
    } catch {
      return [];
    }
  });

  const refresh = useCallback(() => {
    try {
      setGoals(GoalService.list());
    } catch {
      // handled
    }
  }, []);

  return {
    goals,
    refresh,
  };
}
