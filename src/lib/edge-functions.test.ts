import { beforeEach, describe, expect, it, vi } from "vitest";

const { getSession, invoke } = vi.hoisted(() => ({ getSession: vi.fn(), invoke: vi.fn() }));

vi.mock("@/integrations/supabase/client", () => ({
  supabase: { auth: { getSession }, functions: { invoke } },
}));

import { invokeEdgeFunction } from "./edge-functions";

beforeEach(() => {
  getSession.mockReset().mockResolvedValue({ data: { session: { access_token: "tok" } } });
  invoke.mockReset();
});

describe("invokeEdgeFunction", () => {
  it("refuses to call the function without a session", async () => {
    getSession.mockResolvedValue({ data: { session: null } });
    await expect(invokeEdgeFunction("ai-assist", { body: {} })).rejects.toThrow(/sign in again/i);
    expect(invoke).not.toHaveBeenCalled();
  });

  it("sends the body with the user's token and returns the data", async () => {
    invoke.mockResolvedValue({ data: { text: "hi" }, error: null });
    const out = await invokeEdgeFunction("ai-assist", { body: { prompt: "x" } });
    expect(out).toEqual({ text: "hi" });
    expect(invoke).toHaveBeenCalledWith("ai-assist", {
      body: { prompt: "x" },
      headers: { Authorization: "Bearer tok" },
    });
  });

  it("surfaces the JSON error message from the function", async () => {
    invoke.mockResolvedValue({
      data: null,
      error: new Error("non-2xx"),
      response: Response.json({ error: "Rate limit reached" }, { status: 429 }),
    });
    await expect(invokeEdgeFunction("ai-assist", { body: {} })).rejects.toThrow(
      "Rate limit reached",
    );
  });

  it("surfaces a plain-text error body", async () => {
    invoke.mockResolvedValue({
      data: null,
      error: new Error("non-2xx"),
      response: new Response("Upstream down", { status: 502 }),
    });
    await expect(invokeEdgeFunction("ai-assist", { body: {} })).rejects.toThrow("Upstream down");
  });

  it("falls back to the client error when there is no usable response", async () => {
    invoke.mockResolvedValue({ data: null, error: new Error("Failed to fetch") });
    await expect(invokeEdgeFunction("ai-assist", { body: {} })).rejects.toThrow("Failed to fetch");

    invoke.mockResolvedValue({
      data: null,
      error: new Error("non-2xx"),
      response: new Response("{not json", {
        status: 500,
        headers: { "content-type": "application/json" },
      }),
    });
    await expect(invokeEdgeFunction("ai-assist", { body: {} })).rejects.toThrow("non-2xx");
  });
});
