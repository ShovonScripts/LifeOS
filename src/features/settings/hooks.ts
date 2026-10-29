import { useCallback } from 'react';

import { newId } from '@/core/ids';
import { setDeviceId } from '@/core/device';
import { db } from '@/db/client';
import { getSetting, setSetting } from '@/db/repositories/app-settings';
import type { Executor } from '@/db/transaction';
import i18n from '@/i18n';
import { logger } from '@/services/logger';
import { loadPreferences, savePreferences, type Preferences } from '@/storage/preferences';
import { useSettingsStore } from '@/store/settings';

export const DEVICE_ID_KEY = 'device.id';

export function bootstrapDatabase(executor: Executor): void {
  const storedDeviceId = getSetting(executor, DEVICE_ID_KEY);

  if (storedDeviceId && storedDeviceId.length > 0) {
    setDeviceId(storedDeviceId);
  } else {
    const deviceId = newId();
    setSetting(executor, DEVICE_ID_KEY, deviceId);
    setDeviceId(deviceId);
  }

  const preferences = loadPreferences(executor);
  useSettingsStore.getState().setPreferences(preferences);
  useSettingsStore.getState().setHydrated(true);
  void i18n.changeLanguage(preferences.locale);
}

export function useSettings() {
  const preferences = useSettingsStore((state) => state.preferences);
  const updatePreferences = useSettingsStore((state) => state.updatePreferences);

  const update = useCallback(
    (patch: Partial<Preferences>) => {
      updatePreferences(patch);
      const next = useSettingsStore.getState().preferences;

      try {
        savePreferences(db, next);
      } catch (error) {
        logger.error('settings.persist.failed', { error });
      }

      if (patch.locale) {
        void i18n.changeLanguage(patch.locale);
      }
    },
    [updatePreferences],
  );

  return { preferences, update };
}
