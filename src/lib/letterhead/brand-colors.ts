import { extractPalette } from "./color-extract";

export type ColorPair = { primary_color: string; accent_color: string };

/** The app's stock colours, used until a brand or letter has its own. */
export const DEFAULT_COLORS: ColorPair = { primary_color: "#0067ec", accent_color: "#011b43" };

export function isDefaultColors(colors: ColorPair) {
  return (
    colors.primary_color.toLowerCase() === DEFAULT_COLORS.primary_color &&
    colors.accent_color.toLowerCase() === DEFAULT_COLORS.accent_color
  );
}

/**
 * The colours a brand's letters should use. Normally these are the brand's
 * saved colours, which the brand page fills in from the logo. If the brand has
 * a logo but still carries the stock colours, they are read from the logo here.
 */
export async function resolveBrandColors(
  brand: ColorPair & { logo_url: string | null },
  extract: typeof extractPalette = extractPalette,
): Promise<ColorPair> {
  const saved = { primary_color: brand.primary_color, accent_color: brand.accent_color };
  if (!brand.logo_url || !isDefaultColors(saved)) return saved;
  const palette = await extract(brand.logo_url);
  return palette ? { primary_color: palette.primary, accent_color: palette.accent } : saved;
}

/**
 * Colours for a letter being opened: a new letter, or a saved one that was
 * never given colours of its own, follows the brand; a customised one is kept.
 */
export function colorsForLetter(saved: ColorPair | null, brandColors: ColorPair | null): ColorPair {
  if (!brandColors) return saved ?? DEFAULT_COLORS;
  if (!saved || isDefaultColors(saved)) return brandColors;
  return { primary_color: saved.primary_color, accent_color: saved.accent_color };
}

export function sameColors(a: ColorPair, b: ColorPair) {
  return (
    a.primary_color.toLowerCase() === b.primary_color.toLowerCase() &&
    a.accent_color.toLowerCase() === b.accent_color.toLowerCase()
  );
}
