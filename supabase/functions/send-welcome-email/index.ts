import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { firstName, sendWithResend, TEMPLATES } from "../_shared/auth-email.ts";

// Sends the welcome email once, after a person has confirmed their email. The
// app calls this right after confirmation; the "already sent" mark lives in
// app_metadata, which only the server can change.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const apiKey = Deno.env.get("RESEND_API_KEY");
  const url = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!apiKey || !url || !serviceKey)
    return json({ error: "Email sending is not configured." }, 500);

  const jwt = (req.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "");
  if (!jwt) return json({ error: "Not signed in." }, 401);

  const admin = createClient(url, serviceKey, { auth: { persistSession: false } });
  const { data, error } = await admin.auth.getUser(jwt);
  const user = data?.user;
  if (error || !user?.email) return json({ error: "Not signed in." }, 401);
  if (!user.email_confirmed_at) return json({ error: "Email not confirmed yet." }, 403);
  if (user.app_metadata?.welcome_email_sent) return json({ sent: false, reason: "already_sent" });

  try {
    await sendWithResend(
      apiKey,
      Deno.env.get("WELCOME_EMAIL_FROM") ?? "Zuridoc <hello@zuridoc.com>",
      {
        to: user.email,
        template: {
          id: TEMPLATES.welcome,
          variables: { USER_NAME: firstName(user.user_metadata) },
        },
      },
      // Two calls racing each other still produce one email.
      `welcome-${user.id}`,
    );
  } catch (sendError) {
    console.error("send-welcome-email failed:", sendError);
    return json({ error: "Could not send the welcome email." }, 502);
  }

  const { error: markError } = await admin.auth.admin.updateUserById(user.id, {
    app_metadata: { ...user.app_metadata, welcome_email_sent: true },
  });
  if (markError) console.error("Could not record the welcome email:", markError);

  return json({ sent: true });
});
