// @vitest-environment node
import { createHmac } from "node:crypto";
import { describe, expect, it, vi } from "vitest";
import {
  buildAuthEmails,
  confirmUrl,
  firstName,
  sendWithResend,
  verifyHookSignature,
} from "./auth-email";

const user = { email: "jane@example.com" };
const data = {
  token: "123456",
  token_hash: "hash-abc",
  redirect_to: "https://www.zuridoc.com/auth/confirm",
  site_url: "https://zuridoc.com",
};

describe("buildAuthEmails", () => {
  it("sends sign-up confirmations with the verify template", () => {
    expect(buildAuthEmails(user, { ...data, email_action_type: "signup" })).toEqual([
      {
        to: "jane@example.com",
        template: {
          id: "zuridoc-verify",
          variables: {
            VERIFY_CODE: "123456",
            VERIFY_URL:
              "https://www.zuridoc.com/auth/confirm?token_hash=hash-abc&type=email&next=%2Fdashboard",
          },
        },
      },
    ]);
  });

  it("sends password resets with the reset template", () => {
    expect(buildAuthEmails(user, { ...data, email_action_type: "recovery" })).toEqual([
      {
        to: "jane@example.com",
        template: {
          id: "zuridoc-reset",
          variables: {
            RESET_CODE: "123456",
            RESET_URL: "https://www.zuridoc.com/auth/confirm?token_hash=hash-abc&type=recovery",
          },
        },
      },
    ]);
  });

  it("never mixes a template with its own subject or HTML", () => {
    for (const type of ["signup", "recovery"]) {
      const [email] = buildAuthEmails(user, { ...data, email_action_type: type });
      expect(email).not.toHaveProperty("html");
      expect(email).not.toHaveProperty("subject");
    }
  });

  it("still delivers the code for email types that have no template", () => {
    for (const type of ["magiclink", "invite", "reauthentication"]) {
      const [email] = buildAuthEmails(user, { ...data, email_action_type: type });
      expect(email).toMatchObject({ to: "jane@example.com" });
      expect((email as { html: string }).html).toContain("123456");
    }
  });

  it("sends each address its own code when an email change needs both confirmed", () => {
    const emails = buildAuthEmails(
      { ...user, new_email: "new@example.com" },
      { ...data, token_new: "654321", email_action_type: "email_change" },
    ) as { to: string; html: string }[];
    expect(emails.map((e) => e.to)).toEqual(["jane@example.com", "new@example.com"]);
    expect(emails[0].html).toContain("123456");
    expect(emails[1].html).toContain("654321");
  });

  it("sends a single email-change code to the new address", () => {
    const emails = buildAuthEmails(
      { ...user, new_email: "new@example.com" },
      { ...data, email_action_type: "email_change" },
    );
    expect(emails).toHaveLength(1);
    expect(emails[0].to).toBe("new@example.com");
  });

  it("refuses a payload with no recipient or an unknown type", () => {
    expect(() => buildAuthEmails({}, { ...data, email_action_type: "signup" })).toThrow(
      /recipient/,
    );
    expect(() => buildAuthEmails(user, { ...data, email_action_type: "mystery" })).toThrow(
      /Unsupported/,
    );
  });
});

describe("confirmUrl", () => {
  it("falls back to the site's confirm page when no redirect is given", () => {
    expect(confirmUrl({ site_url: "https://zuridoc.com/" }, "h", "recovery")).toBe(
      "https://zuridoc.com/auth/confirm?token_hash=h&type=recovery",
    );
    expect(confirmUrl({ redirect_to: "not a url" }, "h", "email")).toBe(
      "https://zuridoc.com/auth/confirm?token_hash=h&type=email",
    );
  });

  it("escapes the token so it cannot add parameters", () => {
    expect(confirmUrl(data, "a&next=//evil.example", "email")).toContain(
      "token_hash=a%26next%3D%2F%2Fevil.example",
    );
  });
});

describe("firstName", () => {
  it("takes the first word of the sign-up name", () => {
    expect(firstName({ full_name: "  Jane Wanjiru Doe " })).toBe("Jane");
  });

  it("falls back to a neutral greeting", () => {
    expect(firstName({})).toBe("there");
    expect(firstName(null)).toBe("there");
    expect(firstName({ full_name: 42 })).toBe("there");
  });
});

describe("verifyHookSignature", () => {
  const rawKey = Buffer.from("a-test-signing-key-of-some-length");
  const secret = `v1,whsec_${rawKey.toString("base64")}`;
  const body = JSON.stringify({ user, email_data: data });
  const now = 1_800_000_000;

  function signed(overrides: Record<string, string> = {}, signedBody = body) {
    const id = "msg_1";
    const timestamp = String(now);
    const signature = createHmac("sha256", rawKey)
      .update(`${id}.${timestamp}.${signedBody}`)
      .digest("base64");
    return new Headers({
      "webhook-id": id,
      "webhook-timestamp": timestamp,
      "webhook-signature": `v1,${signature}`,
      ...overrides,
    });
  }

  it("accepts a correctly signed call", async () => {
    expect(await verifyHookSignature(secret, signed(), body, now)).toBe(true);
  });

  it("accepts the secret with or without its prefixes, and extra signatures", async () => {
    const bare = rawKey.toString("base64");
    expect(await verifyHookSignature(bare, signed(), body, now)).toBe(true);
    expect(await verifyHookSignature(`whsec_${bare}`, signed(), body, now)).toBe(true);
    const headers = signed();
    headers.set("webhook-signature", `v1,AAAA ${headers.get("webhook-signature")}`);
    expect(await verifyHookSignature(secret, headers, body, now)).toBe(true);
  });

  it("rejects a changed body, a wrong secret and a wrong signature", async () => {
    expect(await verifyHookSignature(secret, signed(), body + " ", now)).toBe(false);
    const other = `v1,whsec_${Buffer.from("another-key").toString("base64")}`;
    expect(await verifyHookSignature(other, signed(), body, now)).toBe(false);
    expect(
      await verifyHookSignature(secret, signed({ "webhook-signature": "v1,AAAA" }), body, now),
    ).toBe(false);
  });

  it("rejects missing headers and stale calls", async () => {
    expect(await verifyHookSignature(secret, new Headers(), body, now)).toBe(false);
    expect(await verifyHookSignature(secret, signed(), body, now + 301)).toBe(false);
    expect(await verifyHookSignature(secret, signed(), body, now - 301)).toBe(false);
  });

  it("rejects an empty or unreadable secret", async () => {
    expect(await verifyHookSignature("", signed(), body, now)).toBe(false);
    expect(await verifyHookSignature("v1,whsec_***", signed(), body, now)).toBe(false);
  });
});

describe("sendWithResend", () => {
  const email = { to: "jane@example.com", template: { id: "zuridoc-verify", variables: {} } };

  it("posts the template email with the key and idempotency key", async () => {
    const fetchFn = vi.fn().mockResolvedValue(Response.json({ id: "e1" }));
    await sendWithResend("re_key", "Zuridoc <noreply@zuridoc.com>", email, "call-0", fetchFn);

    const [url, init] = fetchFn.mock.calls[0];
    expect(url).toBe("https://api.resend.com/emails");
    expect(init.headers).toMatchObject({
      Authorization: "Bearer re_key",
      "Idempotency-Key": "call-0",
    });
    expect(JSON.parse(init.body)).toEqual({ from: "Zuridoc <noreply@zuridoc.com>", ...email });
  });

  it("throws with Resend's explanation when the send is refused", async () => {
    const fetchFn = vi
      .fn()
      .mockResolvedValue(Response.json({ message: "Template not found" }, { status: 404 }));
    await expect(sendWithResend("k", "f", email, undefined, fetchFn)).rejects.toThrow(
      "Resend returned 404: Template not found",
    );
  });
});
