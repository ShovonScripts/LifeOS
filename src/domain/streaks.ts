export type HabitCheckin = {
  localDate: string; // YYYY-MM-DD
  completed: boolean;
};

export type StreakSummary = {
  currentStreak: number;
  bestStreak: number;
  totalCheckins: number;
};

/**
 * Calculates current streak and best streak from a sorted list of completed local dates.
 * Dates are expected in YYYY-MM-DD format.
 */
export function calculateStreaks(
  checkins: HabitCheckin[],
  referenceDate: Date = new Date(),
): StreakSummary {
  const completedDates = new Set(checkins.filter((c) => c.completed).map((c) => c.localDate));

  const totalCheckins = completedDates.size;
  if (totalCheckins === 0) {
    return { currentStreak: 0, bestStreak: 0, totalCheckins: 0 };
  }

  // Generate date helper
  const formatDate = (d: Date): string => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const todayStr = formatDate(referenceDate);
  const yesterday = new Date(referenceDate);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = formatDate(yesterday);

  // 1. Calculate Current Streak
  let currentStreak = 0;
  let cursor = new Date(referenceDate);

  if (completedDates.has(todayStr)) {
    cursor = new Date(referenceDate);
  } else if (completedDates.has(yesterdayStr)) {
    cursor = yesterday;
  } else {
    currentStreak = 0;
  }

  if (completedDates.has(todayStr) || completedDates.has(yesterdayStr)) {
    while (completedDates.has(formatDate(cursor))) {
      currentStreak++;
      cursor.setDate(cursor.getDate() - 1);
    }
  }

  // 2. Calculate Best Streak across all logs
  const sortedDates = Array.from(completedDates).sort();
  let bestStreak = 0;
  let tempStreak = 0;
  let prevDateObj: Date | null = null;

  for (const dateStr of sortedDates) {
    const parts = dateStr.split('-').map(Number);
    const year = parts[0] ?? 2025;
    const month = parts[1] ?? 1;
    const day = parts[2] ?? 1;
    const currDateObj = new Date(year, month - 1, day);

    if (!prevDateObj) {
      tempStreak = 1;
    } else {
      const diffMs = currDateObj.getTime() - prevDateObj.getTime();
      const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        tempStreak++;
      } else if (diffDays > 1) {
        tempStreak = 1;
      }
    }

    if (tempStreak > bestStreak) {
      bestStreak = tempStreak;
    }
    prevDateObj = currDateObj;
  }

  return {
    currentStreak,
    bestStreak,
    totalCheckins,
  };
}
