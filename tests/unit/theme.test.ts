import { contrastRatio } from '@/theme/contrast';
import { darkColors } from '@/theme/dark';
import { lightColors } from '@/theme/light';
import { buildTypography, typeScale } from '@/theme/typography';

const AA_BODY = 4.5;

describe('theme contrast (AA)', () => {
  it.each([
    ['light text on bg', lightColors.text, lightColors.bg],
    ['light text on surface', lightColors.text, lightColors.surface],
    ['light secondary text on bg', lightColors.textSecondary, lightColors.bg],
    ['light secondary text on surface', lightColors.textSecondary, lightColors.surface],
    ['light secondary text on surfaceAlt', lightColors.textSecondary, lightColors.surfaceAlt],
    ['light text on primary', lightColors.textOnPrimary, lightColors.primary],
    ['dark text on bg', darkColors.text, darkColors.bg],
    ['dark text on surface', darkColors.text, darkColors.surface],
    ['dark secondary text on bg', darkColors.textSecondary, darkColors.bg],
    ['dark secondary text on surface', darkColors.textSecondary, darkColors.surface],
    ['dark secondary text on surfaceAlt', darkColors.textSecondary, darkColors.surfaceAlt],
    ['dark text on primary', darkColors.textOnPrimary, darkColors.primary],
  ])('%s meets 4.5:1', (_name, foreground, background) => {
    expect(contrastRatio(foreground, background)).toBeGreaterThanOrEqual(AA_BODY);
  });

  it('rejects unsupported hex colors', () => {
    expect(() => contrastRatio('#fff', '#000000')).toThrow();
  });
});

describe('typography', () => {
  it('increases Bangla line heights by the documented multiplier', () => {
    const english = buildTypography(
      {
        regular: 'Regular',
        medium: 'Medium',
        semibold: 'SemiBold',
        bold: 'Bold',
      },
      'en',
    );
    const bangla = buildTypography(
      {
        regular: 'Regular',
        medium: 'Medium',
        semibold: 'SemiBold',
        bold: 'Bold',
      },
      'bn',
    );

    expect(bangla.body?.lineHeight).toBe(Math.round((english.body?.lineHeight ?? 0) * 1.1));
    expect(bangla.body?.fontSize).toBe(english.body?.fontSize);
  });

  it('maps each type style to the family for its weight', () => {
    const fonts = {
      regular: 'Regular',
      medium: 'Medium',
      semibold: 'SemiBold',
      bold: 'Bold',
    };
    const typography = buildTypography(fonts, 'en');

    expect(typography.display.fontFamily).toBe('Bold');
    expect(typography.h2.fontFamily).toBe('SemiBold');
    expect(typography.caption.fontFamily).toBe('Medium');
    expect(typography.body.fontFamily).toBe('Regular');
  });

  it('has a descending size scale', () => {
    const sizes = Object.values(typeScale).map((style) => style.fontSize);
    expect(sizes).toEqual([...sizes].sort((a, b) => b - a));
  });
});
