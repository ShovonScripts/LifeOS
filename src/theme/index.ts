import { darkColors } from './dark';
import { lightColors } from './light';
import {
  gradients,
  motion,
  priorityColors,
  radius,
  sizes,
  spacing,
  type FontFamilies,
  type LanguageCode,
  type ThemeColors,
} from './tokens';
import { buildTypography, getFontFamilies, type TypeStyleName } from './typography';
import type { TextStyle } from 'react-native';

export type ColorScheme = 'light' | 'dark';

export type Theme = {
  scheme: ColorScheme;
  isDark: boolean;
  language: LanguageCode;
  colors: ThemeColors;
  spacing: typeof spacing;
  radius: typeof radius;
  sizes: typeof sizes;
  motion: typeof motion;
  gradients: typeof gradients;
  priority: typeof priorityColors;
  fonts: FontFamilies;
  typography: Record<TypeStyleName, TextStyle>;
};

export function createTheme(scheme: ColorScheme, language: LanguageCode): Theme {
  const fonts = getFontFamilies(language);

  return {
    scheme,
    isDark: scheme === 'dark',
    language,
    colors: scheme === 'dark' ? darkColors : lightColors,
    spacing,
    radius,
    sizes,
    motion,
    gradients,
    priority: priorityColors,
    fonts,
    typography: buildTypography(fonts, language),
  };
}

export { typeScale, type TypeStyleName } from './typography';
export { spacing, radius, sizes, motion, gradients, priorityColors } from './tokens';
export type { ThemeColors, FontFamilies, LanguageCode, Priority } from './tokens';
