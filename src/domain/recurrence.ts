import { RRule, Frequency } from 'rrule';

export type RecurrencePreset = 'none' | 'daily' | 'weekdays' | 'weekly' | 'monthly' | 'yearly';

/**
 * Returns an RRULE string corresponding to a standard preset.
 */
export function getPresetRRule(
  preset: RecurrencePreset,
  dtstart: Date = new Date(),
): string | null {
  if (preset === 'none') return null;

  switch (preset) {
    case 'daily':
      return new RRule({ freq: Frequency.DAILY, dtstart }).toString();
    case 'weekdays':
      return new RRule({
        freq: Frequency.WEEKLY,
        byweekday: [RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR],
        dtstart,
      }).toString();
    case 'weekly':
      return new RRule({ freq: Frequency.WEEKLY, dtstart }).toString();
    case 'monthly':
      return new RRule({ freq: Frequency.MONTHLY, dtstart }).toString();
    case 'yearly':
      return new RRule({ freq: Frequency.YEARLY, dtstart }).toString();
    default:
      return null;
  }
}

/**
 * Computes the next occurrence date (as YYYY-MM-DD string) after a reference date based on an RRULE string.
 */
export function getNextOccurrence(
  rruleString: string,
  afterDate: Date = new Date(),
): string | null {
  try {
    const rule = RRule.fromString(rruleString);
    const nextDate = rule.after(afterDate, false);
    if (!nextDate) return null;

    const year = nextDate.getFullYear();
    const month = String(nextDate.getMonth() + 1).padStart(2, '0');
    const day = String(nextDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch {
    return null;
  }
}

/**
 * Converts an RRULE string into a human-readable summary text.
 */
export function describeRRule(rruleString: string): string {
  try {
    const rule = RRule.fromString(rruleString);
    return rule.toText();
  } catch {
    return 'Custom recurrence';
  }
}
