import type { PageFormat, PageOrientation } from "./types";

export const PAGE_MM: Record<PageFormat, [number, number]> = {
  a4: [210, 297],
  letter: [216, 279],
  legal: [216, 356],
};

export function getPageMm(format: PageFormat = "a4", orientation: PageOrientation = "portrait"): [number, number] {
  const [w, h] = PAGE_MM[format] ?? PAGE_MM.a4;
  return orientation === "landscape" ? [h, w] : [w, h];
}

/** Convert mm to pixels at 96 dpi. */
export function mmToPx(mm: number) {
  return Math.round((mm * 96) / 25.4);
}