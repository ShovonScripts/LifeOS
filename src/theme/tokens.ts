export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
} as const;

export const screenPadding = spacing.lg;

export const radius = {
  chip: 999,
  input: 14,
  button: 16,
  card: 20,
  sheet: 28,
} as const;

export const sizes = {
  icon: 24,
  touchTarget: 48,
  fab: 60,
  tabBar: 64,
} as const;

export const motion = {
  pressScale: 0.97,
  pressDuration: 90,
  sheetSpring: { damping: 18, stiffness: 180 },
  checkDuration: 180,
  rowCollapseDuration: 220,
  progressDuration: 500,
  tabCrossfade: 150,
  undoTimeout: 5000,
} as const;

export const gradients = {
  hero: ['#7657E8', '#A78BFA'],
  heroDark: ['#5B3FD0', '#8B6CF0'],
} as const;

export const priorityColors = {
  high: '#DC2626',
  medium: '#F59E0B',
  low: '#3B82F6',
  none: '#9CA3AF',
} as const;

export type Priority = keyof typeof priorityColors;

export type ThemeColors = {
  primary: string;
  primaryPressed: string;
  primarySoft: string;
  accent: string;
  bg: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  text: string;
  textSecondary: string;
  textOnPrimary: string;
  success: string;
  warning: string;
  error: string;
  info: string;
};

export type FontWeightKey = 'regular' | 'medium' | 'semibold' | 'bold';

export type FontFamilies = Record<FontWeightKey, string>;

export type LanguageCode = 'en' | 'bn';
