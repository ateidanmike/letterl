import { describe, expect, it } from "vitest";
import { getPageMm, mmToPx } from "./page-size";
import type { PageFormat } from "./types";

describe("getPageMm", () => {
  it("defaults to A4 portrait", () => {
    expect(getPageMm()).toEqual([210, 297]);
  });

  it("swaps width and height for landscape", () => {
    expect(getPageMm("letter", "landscape")).toEqual([279, 216]);
    expect(getPageMm("legal", "portrait")).toEqual([216, 356]);
  });

  it("falls back to A4 for an unknown format from stored data", () => {
    expect(getPageMm("tabloid" as PageFormat)).toEqual([210, 297]);
  });
});

describe("mmToPx", () => {
  it("converts at 96 dpi", () => {
    expect(mmToPx(25.4)).toBe(96);
    expect(mmToPx(210)).toBe(794);
    expect(mmToPx(297)).toBe(1123);
  });
});
