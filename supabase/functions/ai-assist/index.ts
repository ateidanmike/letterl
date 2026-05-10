import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

type Action =
  | "clean"
  | "generate"
  | "tone"
  | "rewrite"
  | "shorten"
  | "expand"
  | "simplify"
  | "translate"
  | "subject";

const SYSTEM: Record<Action, (opts: Record<string, string>) => string> = {
  clean: () =>
    "You are a copy editor. Fix only grammar, spelling, and punctuation. Preserve tone, meaning, paragraph and line breaks exactly. Return only the corrected text — no quotes, no commentary.",
  generate: ({ tone = "formal", language = "English" }) =>
    `You write professional business letters in ${language}. Tone: ${tone}. Output ONLY the letter body (no salutation block, no signature block, no subject line). Use clean paragraphs. No markdown.`,
  tone: ({ tone = "formal", language = "English" }) =>
    `Rewrite the following letter in a ${tone} tone, in ${language}. Preserve all facts and intent. Return only the rewritten body. No commentary.`,
  rewrite: ({ language = "English" }) =>
    `Rewrite the following text more clearly and professionally in ${language}. Preserve meaning. Return only the rewritten text.`,
  shorten: () =>
    "Shorten the following text to be roughly half its length while preserving every key point. Return only the shortened text.",
  expand: () =>
    "Expand the following text with more detail and supporting context, keeping the same tone. Return only the expanded text.",
  simplify: () =>
    "Rewrite the following text using plain, simple language a general audience can understand. Return only the simplified text.",
  translate: ({ language = "English" }) =>
    `Translate the following text into ${language} using natural, professional phrasing. Return only the translation.`,
  subject: () =>
    "Suggest 5 concise, professional subject lines for the following business letter. Return ONLY a JSON array of 5 strings, no commentary.",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    const action = (body.action ?? "clean") as Action;
    const text: string = body.text ?? "";
    const prompt: string = body.prompt ?? "";
    const tone: string = body.tone ?? "formal";
    const language: string = body.language ?? "English";

    if (!SYSTEM[action]) return json({ error: "Unknown action" }, 400);

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) return json({ error: "AI not configured" }, 500);

    const userContent =
      action === "generate"
        ? `Write a letter for this request:\n\n${prompt}`
        : text;
    if (!userContent.trim()) return json({ error: "Missing input" }, 400);

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM[action]({ tone, language }) },
          { role: "user", content: userContent },
        ],
      }),
    });

    if (res.status === 429) return json({ error: "Rate limit reached. Try again shortly." }, 429);
    if (res.status === 402) return json({ error: "AI credits exhausted." }, 402);
    if (!res.ok) {
      console.error("AI gateway error", res.status, await res.text());
      return json({ error: "AI gateway error" }, 500);
    }

    const data = await res.json();
    const content: string = data?.choices?.[0]?.message?.content?.trim() ?? "";

    if (action === "subject") {
      try {
        const match = content.match(/\[[\s\S]*\]/);
        const arr = JSON.parse(match ? match[0] : content);
        return json({ suggestions: Array.isArray(arr) ? arr.slice(0, 5) : [] }, 200);
      } catch {
        return json({ suggestions: content.split("\n").filter(Boolean).slice(0, 5) }, 200);
      }
    }

    return json({ result: content }, 200);
  } catch (e) {
    console.error("ai-assist error", e);
    return json({ error: e instanceof Error ? e.message : "Unknown error" }, 500);
  }
});

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}