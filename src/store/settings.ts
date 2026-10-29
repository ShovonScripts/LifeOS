import { create } from 'zustand';

import { defaultPreferences, type Preferences } from '@/storage/preferences';

export type ThemeMode = 'system' | 'light' | 'dark';

type SettingsState = {
  preferences: Preferences;
  hydrated: boolean;
  setPreferences: (preferences: Preferences) => void;
  updatePreferences: (patch: Partial<Preferences>) => void;
  setHydrated: (hydrated: boolean) => void;
};

export const useSettingsStore = create<SettingsState>((set) => ({
  preferences: defaultPreferences(),
  hydrated: false,
  setPreferences: (preferences) => set({ preferences }),
  updatePreferences: (patch) =>
    set((state) => ({ preferences: { ...state.preferences, ...patch } })),
  setHydrated: (hydrated) => set({ hydrated }),
}));
