import { calculateStreaks } from '../../src/domain/streaks';

describe('Streaks Calculation Logic', () => {
  const refDate = new Date('2025-06-10T12:00:00Z'); // Tuesday June 10, 2025

  test('returns zeros for empty checkins', () => {
    const summary = calculateStreaks([], refDate);
    expect(summary).toEqual({ currentStreak: 0, bestStreak: 0, totalCheckins: 0 });
  });

  test('calculates current streak when checked in today and consecutive days', () => {
    const checkins = [
      { localDate: '2025-06-08', completed: true },
      { localDate: '2025-06-09', completed: true },
      { localDate: '2025-06-10', completed: true },
    ];
    const summary = calculateStreaks(checkins, refDate);
    expect(summary.currentStreak).toBe(3);
    expect(summary.bestStreak).toBe(3);
    expect(summary.totalCheckins).toBe(3);
  });

  test('maintains streak if checked in yesterday but not yet today', () => {
    const checkins = [
      { localDate: '2025-06-08', completed: true },
      { localDate: '2025-06-09', completed: true },
    ];
    const summary = calculateStreaks(checkins, refDate);
    expect(summary.currentStreak).toBe(2);
    expect(summary.bestStreak).toBe(2);
  });

  test('resets current streak when missing yesterday and today', () => {
    const checkins = [
      { localDate: '2025-06-05', completed: true },
      { localDate: '2025-06-06', completed: true },
    ];
    const summary = calculateStreaks(checkins, refDate);
    expect(summary.currentStreak).toBe(0);
    expect(summary.bestStreak).toBe(2);
    expect(summary.totalCheckins).toBe(2);
  });
});
