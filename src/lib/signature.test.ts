import { describe, expect, it } from "vitest";
import { containRect, fitWithin, signatureFromFile } from "./signature";

describe("fitWithin", () => {
  it("shrinks a large image to the box, keeping its proportions", () => {
    expect(fitWithin(3000, 1000, 600, 240)).toEqual({ width: 600, height: 200 });
    expect(fitWithin(1000, 2000, 600, 240)).toEqual({ width: 120, height: 240 });
  });

  it("never enlarges a small image", () => {
    expect(fitWithin(200, 80, 600, 240)).toEqual({ width: 200, height: 80 });
  });

  it("handles an image with no size", () => {
    expect(fitWithin(0, 0, 600, 240)).toEqual({ width: 0, height: 0 });
  });
});

describe("containRect", () => {
  it("centres a wide image vertically", () => {
    expect(containRect(500, 100, 1000, 280)).toEqual({ x: 0, y: 40, width: 1000, height: 200 });
  });

  it("centres a tall image horizontally", () => {
    expect(containRect(100, 280, 1000, 280)).toEqual({ x: 450, y: 0, width: 100, height: 280 });
  });
});

describe("signatureFromFile", () => {
  it("rejects files that are not images", async () => {
    const file = new File(["%PDF"], "scan.pdf", { type: "application/pdf" });
    await expect(signatureFromFile(file)).rejects.toThrow(/image file/i);
  });
});
