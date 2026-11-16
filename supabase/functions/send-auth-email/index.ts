import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import {
  buildAuthEmails,
  sendWithResend,
  verifyHookSignature,
  type EmailData,
  type HookUser,
} from "../_shared/auth-email.ts";

// Supabase Auth "Send Email" hook. Supabase calls this instead of sending its
// own email; sign-up and password-reset emails go out through the published
// Resend templates.

function fail(status: number, message: string) {
  return new Response(JSON.stringify({ error: { http_code: status, message } }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return fail(405, "Method not allowed");

  const hookSecret = Deno.env.get("SEND_EMAIL_HOOK_SECRET");
  const apiKey = Deno.env.get("RESEND_API_KEY");
  if (!hookSecret || !apiKey) return fail(500, "Email sending is not configured.");

  const body = await req.text();
  if (!(await verifyHookSignature(hookSecret, req.headers, body))) {
    return fail(401, "Invalid signature");
  }

  try {
    const payload = JSON.parse(body) as { user?: HookUser; email_data?: EmailData };
    const emails = buildAuthEmails(payload.user ?? {}, payload.email_data ?? {});
    const from = Deno.env.get("AUTH_EMAIL_FROM") ?? "Zuridoc <noreply@zuridoc.com>";
    // Supabase retries a failed call with the same id; the key stops duplicates.
    const callId = req.headers.get("webhook-id") ?? crypto.randomUUID();
    for (const [index, email] of emails.entries()) {
      await sendWithResend(apiKey, from, email, `${callId}-${index}`);
    }
  } catch (error) {
    console.error("send-auth-email failed:", error);
    return fail(500, "We couldn't send the email. Please try again in a minute.");
  }

  return new Response("{}", { status: 200, headers: { "Content-Type": "application/json" } });
});
