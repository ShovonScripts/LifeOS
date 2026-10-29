import { formatInTimeZone } from 'date-fns-tz';

export type Clock = {
  now: () => Date;
  nowIso: () => string;
  todayLocalDate: (timeZone?: string) => string;
};

export const DEFAULT_TIME_ZONE = 'UTC';

export function deviceTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || DEFAULT_TIME_ZONE;
  } catch {
    return DEFAULT_TIME_ZONE;
  }
}

export const systemClock: Clock = {
  now: () => new Date(),
  nowIso: () => new Date().toISOString(),
  todayLocalDate: (timeZone = deviceTimeZone()) =>
    formatInTimeZone(new Date(), timeZone, 'yyyy-MM-dd'),
};

export function createFixedClock(iso: string): Clock {
  const fixed = new Date(iso);

  return {
    now: () => fixed,
    nowIso: () => fixed.toISOString(),
    todayLocalDate: (timeZone = DEFAULT_TIME_ZONE) =>
      formatInTimeZone(fixed, timeZone, 'yyyy-MM-dd'),
  };
}
