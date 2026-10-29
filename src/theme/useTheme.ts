import { useMemo } from 'react';
import { useColorScheme } from 'react-native';

import { useSettingsStore } from '@/store/settings';

import { createTheme, type ColorScheme, type Theme } from './index';

export function useTheme(): Theme {
  const systemScheme = useColorScheme();
  const mode = useSettingsStore((state) => state.preferences.themeMode);
  const language = useSettingsStore((state) => state.preferences.locale);

  const scheme: ColorScheme =
    mode === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : mode;

  return useMemo(() => createTheme(scheme, language), [scheme, language]);
}
