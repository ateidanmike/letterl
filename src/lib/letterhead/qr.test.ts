// @vitest-environment node
import { describe, expect, it } from "vitest";
import { makeQrDataUrl } from "./qr";

describe("makeQrDataUrl", () => {
  it("returns a PNG data URL", async () => {
    const url = await makeQrDataUrl("https://example.com/share/abc123");
    expect(url).toMatch(/^data:image\/png;base64,[A-Za-z0-9+/=]+$/);
  });

  it("encodes different text as a different image", async () => {
    const a = await makeQrDataUrl("https://example.com/share/one");
    const b = await makeQrDataUrl("https://example.com/share/two");
    expect(a).not.toBe(b);
  });

  it("rejects when there is nothing to encode", async () => {
    await expect(makeQrDataUrl("")).rejects.toThrow();
  });
});
