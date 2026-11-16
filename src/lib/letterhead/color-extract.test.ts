import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { extractPalette } from "./color-extract";

type Rgba = [number, number, number, number];

/** Make the next "loaded" logo consist of the given pixels, repeated by count. */
function stubLogo(pixels: [Rgba, number][], { fail = false } = {}) {
  const flat: number[] = [];
  for (const [rgba, count] of pixels) for (let i = 0; i < count; i++) flat.push(...rgba);

  vi.stubGlobal(
    "Image",
    class {
      width = 10;
      height = 10;
      crossOrigin = "";
      onload: (() => void) | null = null;
      onerror: ((e: unknown) => void) | null = null;
      set src(_url: string) {
        queueMicrotask(() => (fail ? this.onerror?.(new Error("blocked")) : this.onload?.()));
      }
    },
  );
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({
    drawImage: vi.fn(),
    getImageData: () => ({ data: new Uint8ClampedArray(flat) }),
  } as unknown as CanvasRenderingContext2D);
}

const RED: Rgba = [200, 20, 20, 255];
const BLUE: Rgba = [20, 40, 200, 255];
const WHITE: Rgba = [255, 255, 255, 255];
const BLACK: Rgba = [0, 0, 0, 255];
const GREY: Rgba = [128, 128, 128, 255];

beforeEach(() => vi.unstubAllGlobals());
afterEach(() => vi.unstubAllGlobals());

describe("extractPalette", () => {
  it("picks the dominant colour as primary and a distinct one as accent", async () => {
    stubLogo([
      [RED, 60],
      [BLUE, 30],
    ]);
    expect(await extractPalette("logo.png")).toEqual({ primary: "#c81414", accent: "#1428c8" });
  });

  it("ignores white, black, grey and transparent pixels", async () => {
    stubLogo([
      [WHITE, 500],
      [BLACK, 300],
      [GREY, 300],
      [[20, 200, 20, 10], 400],
      [BLUE, 5],
    ]);
    expect(await extractPalette("logo.png")).toEqual({ primary: "#1428c8", accent: "#1428c8" });
  });

  it("skips near-identical shades when choosing the accent", async () => {
    stubLogo([
      [RED, 60],
      [[208, 28, 28, 255], 40],
      [BLUE, 10],
    ]);
    expect(await extractPalette("logo.png")).toEqual({ primary: "#c81414", accent: "#1428c8" });
  });

  it("returns null for a logo with no usable colour", async () => {
    stubLogo([
      [WHITE, 50],
      [BLACK, 50],
    ]);
    expect(await extractPalette("logo.png")).toBeNull();
  });

  it("returns null when the image cannot be loaded", async () => {
    stubLogo([[RED, 10]], { fail: true });
    expect(await extractPalette("logo.png")).toBeNull();
  });
});
