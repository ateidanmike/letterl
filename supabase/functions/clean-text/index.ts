import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text } = await req.json();
    if (typeof text !== "string" || !text.trim()) {
      return json({ error: "Missing text" }, 400);
    }

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) return json({ error: "AI not configured" }, 500);

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content:
              "You are a copy editor. Fix only grammar, spelling, and punctuation. Preserve the original tone, meaning, paragraph breaks, and line breaks exactly. Do not add commentary, do not rewrite for style, do not add or remove content. Return only the corrected text with no surrounding quotes or labels.",
          },
          { role: "user", content: text },
        ],
      }),
    });

    if (res.status === 429) return json({ error: "Rate limit reached. Try again shortly." }, 429);
    if (res.status === 402) return json({ error: "AI credits exhausted. Add funds in Lovable Cloud usage." }, 402);
    if (!res.ok) {
      const errText = await res.text();
      console.error("AI gateway error", res.status, errText);
      return json({ error: "AI gateway error" }, 500);
    }

    const data = await res.json();
    const cleaned: string = data?.choices?.[0]?.message?.content ?? "";
    return json({ cleaned: cleaned.trim() }, 200);
  } catch (e) {
    console.error("clean-text error", e);
    return json({ error: e instanceof Error ? e.message : "Unknown error" }, 500);
  }
});

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}