import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const GEMINI_MODEL = "gemini-2.5-flash";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

type GeminiPart = { text?: string };
type GeminiResponse = {
  candidates?: { content?: { parts?: GeminiPart[] } }[];
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

function geminiText(data: GeminiResponse): string {
  return (
    data.candidates?.[0]?.content?.parts
      ?.map((part) => part.text ?? "")
      .join("")
      .trim() ?? ""
  );
}

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

    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) return json({ error: "Gemini API key is not configured" }, 500);

    const userContent =
      action === "generate"
        ? `Write a letter for this request:\n\n${prompt}`
        : text;
    if (!userContent.trim()) return json({ error: "Missing input" }, 400);

    const res = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: SYSTEM[action]({ tone, language }) }],
        },
        contents: [
          {
            role: "user",
            parts: [{ text: userContent }],
          },
        ],
        generationConfig: {
          temperature: action === "generate" ? 0.7 : 0.2,
        },
      }),
    });

    if (res.status === 429) return json({ error: "Rate limit reached. Try again shortly." }, 429);
    if (res.status === 401 || res.status === 403) {
      return json({ error: "Gemini API key was rejected." }, 500);
    }
    if (!res.ok) {
      console.error("Gemini API error", res.status, await res.text());
      return json({ error: "Gemini API error" }, 500);
    }

    const data = (await res.json()) as GeminiResponse;
    const content = geminiText(data);
    if (!content) return json({ error: "Gemini returned no text" }, 500);

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
