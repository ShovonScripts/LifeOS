import type { TextStyle } from 'react-native';

import type { FontFamilies, FontWeightKey, LanguageCode } from './tokens';

export const latinFonts: FontFamilies = {
  regular: 'PlusJakartaSans_400Regular',
  medium: 'PlusJakartaSans_500Medium',
  semibold: 'PlusJakartaSans_600SemiBold',
  bold: 'PlusJakartaSans_700Bold',
};

export const banglaFonts: FontFamilies = {
  regular: 'HindSiliguri_400Regular',
  medium: 'HindSiliguri_500Medium',
  semibold: 'HindSiliguri_600SemiBold',
  bold: 'HindSiliguri_700Bold',
};

type TypeScaleEntry = {
  fontSize: number;
  lineHeight: number;
  weight: FontWeightKey;
};

export const typeScale = {
  display: { fontSize: 32, lineHeight: 40, weight: 'bold' },
  h1: { fontSize: 26, lineHeight: 34, weight: 'bold' },
  h2: { fontSize: 20, lineHeight: 28, weight: 'semibold' },
  h3: { fontSize: 17, lineHeight: 24, weight: 'semibold' },
  body: { fontSize: 15, lineHeight: 22, weight: 'regular' },
  bodyStrong: { fontSize: 15, lineHeight: 22, weight: 'semibold' },
  caption: { fontSize: 13, lineHeight: 18, weight: 'medium' },
  micro: { fontSize: 11, lineHeight: 16, weight: 'semibold' },
} as const satisfies Record<string, TypeScaleEntry>;

export type TypeStyleName = keyof typeof typeScale;

export const BANGLA_LINE_HEIGHT_MULTIPLIER = 1.1;

export function getFontFamilies(language: LanguageCode): FontFamilies {
  return language === 'bn' ? banglaFonts : latinFonts;
}

export function buildTypography(
  fonts: FontFamilies,
  language: LanguageCode,
): Record<TypeStyleName, TextStyle> {
  const lineHeightMultiplier = language === 'bn' ? BANGLA_LINE_HEIGHT_MULTIPLIER : 1;

  return Object.fromEntries(
    Object.entries(typeScale).map(([name, entry]) => [
      name,
      {
        fontFamily: fonts[entry.weight],
        fontSize: entry.fontSize,
        lineHeight: Math.round(entry.lineHeight * lineHeightMultiplier),
      } satisfies TextStyle,
    ]),
  ) as Record<TypeStyleName, TextStyle>;
}
