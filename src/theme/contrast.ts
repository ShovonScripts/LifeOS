type Rgb = { r: number; g: number; b: number };

export function hexToRgb(hex: string): Rgb {
  const normalized = hex.replace('#', '');

  if (normalized.length !== 6) {
    throw new Error(`Unsupported hex color: ${hex}`);
  }

  return {
    r: Number.parseInt(normalized.slice(0, 2), 16),
    g: Number.parseInt(normalized.slice(2, 4), 16),
    b: Number.parseInt(normalized.slice(4, 6), 16),
  };
}

function channelToLinear(channel: number): number {
  const value = channel / 255;
  return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

export function relativeLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  return 0.2126 * channelToLinear(r) + 0.7152 * channelToLinear(g) + 0.0722 * channelToLinear(b);
}

export function contrastRatio(foreground: string, background: string): number {
  const luminanceA = relativeLuminance(foreground);
  const luminanceB = relativeLuminance(background);
  const lighter = Math.max(luminanceA, luminanceB);
  const darker = Math.min(luminanceA, luminanceB);

  return (lighter + 0.05) / (darker + 0.05);
}

export function readableTextOn(background: string): '#FFFFFF' | '#19172A' {
  return contrastRatio('#FFFFFF', background) >= contrastRatio('#19172A', background)
    ? '#FFFFFF'
    : '#19172A';
}
