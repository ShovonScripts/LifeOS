import { z } from 'zod';

import { DEFAULT_TIME_ZONE, deviceTimeZone } from '@/core/clock';
import type { Executor } from '@/db/transaction';
import { getSetting, setSetting } from '@/db/repositories/app-settings';
import { logger } from '@/services/logger';

export const preferencesSchema = z.object({
  themeMode: z.enum(['system', 'light', 'dark']),
  locale: z.enum(['en', 'bn']),
  weekStartsOn: z.number().int().min(0).max(6),
  timeZone: z.string().min(1),
  onboardingCompleted: z.boolean(),
  sampleProjectSeeded: z.boolean(),
});

export type Preferences = z.infer<typeof preferencesSchema>;

export const PREFERENCES_KEY = 'preferences';

export function defaultPreferences(): Preferences {
  return {
    themeMode: 'system',
    locale: 'en',
    weekStartsOn: 0,
    timeZone: deviceTimeZone() || DEFAULT_TIME_ZONE,
    onboardingCompleted: false,
    sampleProjectSeeded: false,
  };
}

export function loadPreferences(executor: Executor): Preferences {
  const raw = getSetting(executor, PREFERENCES_KEY);

  if (!raw) {
    return defaultPreferences();
  }

  try {
    return preferencesSchema.parse(JSON.parse(raw));
  } catch (error) {
    logger.warn('preferences.invalid', { error });
    return defaultPreferences();
  }
}

export function savePreferences(executor: Executor, preferences: Preferences): Preferences {
  const parsed = preferencesSchema.parse(preferences);
  setSetting(executor, PREFERENCES_KEY, JSON.stringify(parsed));
  return parsed;
}
