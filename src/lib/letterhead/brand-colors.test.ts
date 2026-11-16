import { describe, expect, it, vi } from "vitest";
import {
  colorsForLetter,
  DEFAULT_COLORS,
  isDefaultColors,
  resolveBrandColors,
  sameColors,
} from "./brand-colors";

const RED = { primary_color: "#ae1e1e", accent_color: "#000000" };
const GREEN = { primary_color: "#0a8f3c", accent_color: "#222222" };

describe("resolveBrandColors", () => {
  it("uses the brand's saved colours without reading the logo", async () => {
    const extract = vi.fn();
    expect(await resolveBrandColors({ ...RED, logo_url: "logo.png" }, extract)).toEqual(RED);
    expect(extract).not.toHaveBeenCalled();
  });

  it("reads the logo when the brand still has the stock colours", async () => {
    const extract = vi.fn().mockResolvedValue({ primary: "#0a8f3c", accent: "#222222" });
    expect(await resolveBrandColors({ ...DEFAULT_COLORS, logo_url: "logo.png" }, extract)).toEqual(
      GREEN,
    );
    expect(extract).toHaveBeenCalledWith("logo.png");
  });

  it("keeps the saved colours when there is no logo or it cannot be read", async () => {
    const extract = vi.fn().mockResolvedValue(null);
    expect(await resolveBrandColors({ ...DEFAULT_COLORS, logo_url: null }, extract)).toEqual(
      DEFAULT_COLORS,
    );
    expect(extract).not.toHaveBeenCalled();
    expect(await resolveBrandColors({ ...DEFAULT_COLORS, logo_url: "logo.png" }, extract)).toEqual(
      DEFAULT_COLORS,
    );
  });
});

describe("colorsForLetter", () => {
  it("gives a new letter the brand colours", () => {
    expect(colorsForLetter(null, RED)).toEqual(RED);
  });

  it("moves a saved letter still on the stock colours to the brand colours", () => {
    expect(colorsForLetter({ primary_color: "#0067EC", accent_color: "#011B43" }, RED)).toEqual(
      RED,
    );
  });

  it("keeps colours the user chose for a saved letter", () => {
    expect(colorsForLetter(GREEN, RED)).toEqual(GREEN);
    // One customised colour is enough to count as chosen.
    const half = { primary_color: DEFAULT_COLORS.primary_color, accent_color: "#222222" };
    expect(colorsForLetter(half, RED)).toEqual(half);
  });

  it("falls back to the saved or stock colours when there is no brand", () => {
    expect(colorsForLetter(GREEN, null)).toEqual(GREEN);
    expect(colorsForLetter(null, null)).toEqual(DEFAULT_COLORS);
  });
});

describe("colour comparisons", () => {
  it("ignore letter case", () => {
    expect(isDefaultColors({ primary_color: "#0067EC", accent_color: "#011B43" })).toBe(true);
    expect(isDefaultColors(RED)).toBe(false);
    expect(sameColors(RED, { primary_color: "#AE1E1E", accent_color: "#000000" })).toBe(true);
    expect(sameColors(RED, GREEN)).toBe(false);
  });
});
