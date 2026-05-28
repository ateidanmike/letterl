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

function geminiText(data: GeminiResponse): string {
  return (
    data.candidates?.[0]?.content?.parts
      ?.map((part) => part.text ?? "")
      .join("")
      .trim() ?? ""
  );
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text } = await req.json();
    if (typeof text !== "string" || !text.trim()) {
      return json({ error: "Missing text" }, 400);
    }

    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) return json({ error: "Gemini API key is not configured" }, 500);

    const res = await fetch(GEMINI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [
            {
              text:
                "You are a copy editor. Fix only grammar, spelling, and punctuation. Preserve the original tone, meaning, paragraph breaks, and line breaks exactly. Do not add commentary, do not rewrite for style, do not add or remove content. Return only the corrected text with no surrounding quotes or labels.",
            },
          ],
        },
        contents: [
          {
            role: "user",
            parts: [{ text }],
          },
        ],
        generationConfig: {
          temperature: 0.2,
        },
      }),
    });

    if (res.status === 429) return json({ error: "Rate limit reached. Try again shortly." }, 429);
    if (res.status === 401 || res.status === 403) {
      return json({ error: "Gemini API key was rejected." }, 500);
    }
    if (!res.ok) {
      const errText = await res.text();
      console.error("Gemini API error", res.status, errText);
      return json({ error: "Gemini API error" }, 500);
    }

    const data = (await res.json()) as GeminiResponse;
    const cleaned = geminiText(data);
    if (!cleaned) return json({ error: "Gemini returned no text" }, 500);
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
