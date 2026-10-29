import { getPresetRRule, getNextOccurrence, describeRRule } from '../../src/domain/recurrence';

describe('Recurrence Domain Logic', () => {
  const refDate = new Date('2025-06-01T00:00:00Z'); // Sunday June 1, 2025

  test('generates preset daily rrule and gets next occurrence', () => {
    const rruleStr = getPresetRRule('daily', refDate);
    expect(rruleStr).not.toBeNull();
    if (rruleStr) {
      const next = getNextOccurrence(rruleStr, refDate);
      expect(next).toBe('2025-06-02');
    }
  });

  test('generates weekday rrule and correctly skips weekends', () => {
    const rruleStr = getPresetRRule('weekdays', refDate);
    expect(rruleStr).not.toBeNull();
    if (rruleStr) {
      // refDate is Sunday June 1. Next weekday should be Monday June 2.
      const next = getNextOccurrence(rruleStr, refDate);
      expect(next).toBe('2025-06-02');
    }
  });

  test('returns human readable text description', () => {
    const rruleStr = getPresetRRule('daily', refDate);
    if (rruleStr) {
      const text = describeRRule(rruleStr);
      expect(text.toLowerCase()).toContain('every day');
    }
  });

  test('returns null for invalid rrule string', () => {
    const next = getNextOccurrence('INVALID_RRULE', refDate);
    expect(next).toBeNull();
  });
});
