import { beforeEach, describe, expect, it, vi } from "vitest";

const { insert, from } = vi.hoisted(() => {
  const insert = vi.fn();
  return { insert, from: vi.fn(() => ({ insert })) };
});

vi.mock("@/integrations/supabase/client", () => ({ supabase: { from } }));

import { createShareLink, shareUrl } from "./share";

const opts = { letterheadId: "letter-1", userId: "user-1", allowDownload: true };

beforeEach(() => {
  insert.mockReset().mockResolvedValue({ error: null });
  from.mockClear();
});

describe("shareUrl", () => {
  it("points at the public share route on the current origin", () => {
    expect(shareUrl("abc")).toBe(`${window.location.origin}/share/abc`);
  });
});

describe("createShareLink", () => {
  it("stores the share and returns the link for the stored token", async () => {
    const url = await createShareLink({ ...opts, expiresAt: "2027-01-01T00:00:00Z" });

    expect(from).toHaveBeenCalledWith("letterhead_shares");
    const row = insert.mock.calls[0][0];
    expect(row).toMatchObject({
      letterhead_id: "letter-1",
      user_id: "user-1",
      expires_at: "2027-01-01T00:00:00Z",
      allow_download: true,
    });
    expect(url).toBe(shareUrl(row.token));
  });

  it("stores no expiry when none is given", async () => {
    await createShareLink({ ...opts, allowDownload: false });
    expect(insert.mock.calls[0][0]).toMatchObject({ expires_at: null, allow_download: false });
  });

  it("generates a 20-character URL-safe token that differs per link", async () => {
    const tokens = new Set<string>();
    for (let i = 0; i < 50; i++) {
      await createShareLink(opts);
      tokens.add(insert.mock.calls[i][0].token);
    }
    expect(tokens.size).toBe(50);
    for (const token of tokens) expect(token).toMatch(/^[a-z0-9]{20}$/);
  });

  it("throws instead of returning a link when the share could not be saved", async () => {
    const error = new Error("row-level security");
    insert.mockResolvedValue({ error });
    await expect(createShareLink(opts)).rejects.toBe(error);
  });
});
