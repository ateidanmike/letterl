// Shared by the email edge functions. Plain TypeScript with no Deno-only APIs,
// so it also runs under the project's unit tests.

/** Aliases of the published Resend templates. */
export const TEMPLATES = {
  verify: "zuridoc-verify",
  reset: "zuridoc-reset",
  welcome: "zuridoc-welcome",
} as const;

export type EmailData = {
  token?: string;
  token_hash?: string;
  token_new?: string;
  token_hash_new?: string;
  redirect_to?: string;
  site_url?: string;
  email_action_type?: string;
};

export type HookUser = {
  email?: string;
  new_email?: string;
  user_metadata?: Record<string, unknown> | null;
};

export type OutgoingEmail =
  | { to: string; template: { id: string; variables: Record<string, string> } }
  | { to: string; subject: string; html: string };

/** The app page that finishes a link from an email (see src/routes/auth/confirm.tsx). */
export function confirmUrl(data: EmailData, tokenHash: string, type: string, next?: string) {
  const fallback = `${(data.site_url || "https://zuridoc.com").replace(/\/$/, "")}/auth/confirm`;
  let url: URL;
  try {
    url = new URL(data.redirect_to || fallback);
  } catch {
    url = new URL(fallback);
  }
  url.searchParams.set("token_hash", tokenHash);
  url.searchParams.set("type", type);
  if (next) url.searchParams.set("next", next);
  return url.toString();
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** A plain email for the auth emails that have no designed template. */
function plainCodeEmail(to: string, subject: string, intro: string, code: string): OutgoingEmail {
  return {
    to,
    subject,
    html: `<div style="max-width:520px;margin:0 auto;padding:32px 20px;font-family:Arial,sans-serif;color:#111827">
  <h1 style="margin:0 0 12px;font-size:24px">${escapeHtml(subject)}</h1>
  <p style="font-size:16px;line-height:1.6">${escapeHtml(intro)}</p>
  <p style="letter-spacing:8px;font-size:32px;font-weight:700;margin:24px 0">${escapeHtml(code)}</p>
  <p style="font-size:14px;color:#4b5563">If you did not ask for this, you can ignore this email.</p>
</div>`,
  };
}

/** Turn one Supabase "send email" hook call into the emails to send. */
export function buildAuthEmails(user: HookUser, data: EmailData): OutgoingEmail[] {
  const to = user.email;
  const token = data.token ?? "";
  const tokenHash = data.token_hash ?? "";
  if (!to) throw new Error("The hook payload has no recipient email.");

  switch (data.email_action_type) {
    case "signup":
      return [
        {
          to,
          template: {
            id: TEMPLATES.verify,
            variables: {
              VERIFY_CODE: token,
              VERIFY_URL: confirmUrl(data, tokenHash, "email", "/dashboard"),
            },
          },
        },
      ];
    case "recovery":
      return [
        {
          to,
          template: {
            id: TEMPLATES.reset,
            variables: {
              RESET_CODE: token,
              RESET_URL: confirmUrl(data, tokenHash, "recovery"),
            },
          },
        },
      ];
    case "email_change": {
      // With "confirm on both addresses" on, Supabase issues two codes: `token`
      // for the current address and `token_new` for the new one. With it off,
      // the single `token` goes to the new address.
      const subject = "Confirm your new Zuridoc email";
      const intro = "Enter this code in Zuridoc to confirm the change of email address:";
      const emails: OutgoingEmail[] = [];
      if (data.token_new) {
        emails.push(plainCodeEmail(to, subject, intro, token));
        if (user.new_email) {
          emails.push(plainCodeEmail(user.new_email, subject, intro, data.token_new));
        }
      } else {
        emails.push(plainCodeEmail(user.new_email || to, subject, intro, token));
      }
      return emails;
    }
    case "magiclink":
    case "email":
      return [
        plainCodeEmail(to, "Your Zuridoc sign-in code", "Enter this code to sign in:", token),
      ];
    case "invite":
      return [
        plainCodeEmail(to, "You have been invited to Zuridoc", "Enter this code to accept:", token),
      ];
    case "reauthentication":
      return [
        plainCodeEmail(to, "Your Zuridoc security code", "Enter this code to continue:", token),
      ];
    default:
      throw new Error(`Unsupported email type: ${data.email_action_type ?? "none"}`);
  }
}

/** First name for the welcome email, from the name given at sign-up. */
export function firstName(metadata: Record<string, unknown> | null | undefined) {
  const full = typeof metadata?.full_name === "string" ? metadata.full_name.trim() : "";
  return full.split(/\s+/)[0] || "there";
}

function bytesFromBase64(value: string) {
  return Uint8Array.from(atob(value), (c) => c.charCodeAt(0));
}

function timingSafeEqual(a: Uint8Array, b: Uint8Array) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

/**
 * Check a Standard Webhooks signature, which Supabase puts on every auth hook
 * call. `secret` is the hook secret as shown by Supabase ("v1,whsec_...").
 */
export async function verifyHookSignature(
  secret: string,
  headers: Headers,
  body: string,
  nowSeconds = Math.floor(Date.now() / 1000),
): Promise<boolean> {
  const id = headers.get("webhook-id");
  const timestamp = headers.get("webhook-timestamp");
  const signatures = headers.get("webhook-signature");
  if (!id || !timestamp || !signatures) return false;

  // Refuse stale or future-dated calls, so a captured request can't be replayed.
  const sent = Number(timestamp);
  if (!Number.isFinite(sent) || Math.abs(nowSeconds - sent) > 300) return false;

  let key: Uint8Array;
  try {
    key = bytesFromBase64(
      secret
        .trim()
        .replace(/^v1,/, "")
        .replace(/^whsec_/, ""),
    );
  } catch {
    return false;
  }
  if (!key.length) return false;

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    key,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const expected = new Uint8Array(
    await crypto.subtle.sign(
      "HMAC",
      cryptoKey,
      new TextEncoder().encode(`${id}.${timestamp}.${body}`),
    ),
  );

  for (const entry of signatures.split(" ")) {
    const [version, signature] = entry.split(",");
    if (version !== "v1" || !signature) continue;
    try {
      if (timingSafeEqual(bytesFromBase64(signature), expected)) return true;
    } catch {
      // Not valid base64; try the next signature.
    }
  }
  return false;
}

/** Send one email through Resend. Throws with Resend's message on failure. */
export async function sendWithResend(
  apiKey: string,
  from: string,
  email: OutgoingEmail,
  idempotencyKey?: string,
  fetchFn: typeof fetch = fetch,
) {
  const res = await fetchFn("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      ...(idempotencyKey ? { "Idempotency-Key": idempotencyKey } : {}),
    },
    // A template email carries no subject or body: Resend fills those in.
    body: JSON.stringify({ from, ...email }),
  });
  if (!res.ok) {
    let message = `Resend returned ${res.status}`;
    try {
      const body = (await res.json()) as { message?: string };
      if (body.message) message = `${message}: ${body.message}`;
    } catch {
      // Keep the status-only message.
    }
    throw new Error(message);
  }
}
