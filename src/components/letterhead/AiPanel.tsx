import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Sparkles, Wand2, Type, Minimize2, Maximize2, Languages } from "lucide-react";
import { toast } from "sonner";
import { invokeEdgeFunction } from "@/lib/edge-functions";

const TONES = ["formal", "friendly", "executive", "legal", "apologetic", "persuasive", "concise"];
const LANGS = ["English", "Spanish", "French", "German", "Portuguese", "Italian", "Arabic", "Swahili", "Hindi", "Chinese"];

type Props = {
  body: string;
  onApplyBody: (text: string) => void;
  onSubject: (subject: string) => void;
};

export function AiPanel({ body, onApplyBody, onSubject }: Props) {
  const [prompt, setPrompt] = useState("");
  const [tone, setTone] = useState("formal");
  const [language, setLanguage] = useState("English");
  const [busy, setBusy] = useState<string | null>(null);
  const [subjects, setSubjects] = useState<string[]>([]);

  const call = async (action: string, payload: Record<string, unknown> = {}) => {
    setBusy(action);
    try {
      const data = await invokeEdgeFunction<{ error?: string } & Record<string, unknown>>(
        "ai-assist",
        {
          body: { action, tone, language, text: body, ...payload },
        },
      );
      if (data?.error) {
        toast.error(data.error);
        return null;
      }
      return data;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "AI failed");
      return null;
    } finally {
      setBusy(null);
    }
  };

  const generate = async () => {
    if (!prompt.trim()) return toast.error("Describe the letter you want");
    const data = await call("generate", { prompt });
    if (data?.result) { onApplyBody(data.result); toast.success("Letter drafted"); }
  };
  const transform = async (action: string) => {
    if (!body.trim()) return toast.error("Add some text first");
    const data = await call(action);
    if (data?.result) { onApplyBody(data.result); toast.success(`Text ${action}ed`); }
  };
  const suggestSubjects = async () => {
    if (!body.trim()) return toast.error("Add some text first");
    const data = await call("subject");
    if (data?.suggestions) setSubjects(data.suggestions);
  };

  return (
    <div className="min-w-0 space-y-3">
      <div className="grid min-w-0 grid-cols-1 gap-2 min-[360px]:grid-cols-2">
        <div>
          <Label className="text-xs">Tone</Label>
          <Select value={tone} onValueChange={setTone}>
            <SelectTrigger className="w-full min-w-0"><SelectValue /></SelectTrigger>
            <SelectContent>
              {TONES.map((t) => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs">Language</Label>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-full min-w-0"><SelectValue /></SelectTrigger>
            <SelectContent>
              {LANGS.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label className="text-xs">Describe the letter</Label>
        <Textarea
          rows={3}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder='e.g. "Apology to a supplier for a 14-day payment delay; promise full payment Friday."'
        />
        <Button size="sm" onClick={generate} disabled={busy !== null} className="mt-2 w-full min-w-0">
          <Sparkles className="mr-2 h-3 w-3 shrink-0" />
          <span className="truncate">{busy === "generate" ? "Drafting…" : "Generate letter"}</span>
        </Button>
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-2 min-[360px]:grid-cols-2">
        <Button size="sm" variant="secondary" onClick={() => transform("tone")} disabled={busy !== null} className="min-w-0">
          <Type className="mr-1 h-3 w-3 shrink-0" /> <span className="truncate">Apply tone</span>
        </Button>
        <Button size="sm" variant="secondary" onClick={() => transform("rewrite")} disabled={busy !== null} className="min-w-0">
          <Wand2 className="mr-1 h-3 w-3 shrink-0" /> <span className="truncate">Rewrite</span>
        </Button>
        <Button size="sm" variant="secondary" onClick={() => transform("shorten")} disabled={busy !== null} className="min-w-0">
          <Minimize2 className="mr-1 h-3 w-3 shrink-0" /> <span className="truncate">Shorten</span>
        </Button>
        <Button size="sm" variant="secondary" onClick={() => transform("expand")} disabled={busy !== null} className="min-w-0">
          <Maximize2 className="mr-1 h-3 w-3 shrink-0" /> <span className="truncate">Expand</span>
        </Button>
        <Button size="sm" variant="secondary" onClick={() => transform("simplify")} disabled={busy !== null} className="min-w-0">
          Simplify
        </Button>
        <Button size="sm" variant="secondary" onClick={() => transform("translate")} disabled={busy !== null} className="min-w-0">
          <Languages className="mr-1 h-3 w-3 shrink-0" /> <span className="truncate">Translate</span>
        </Button>
      </div>

      <div>
        <Button size="sm" variant="outline" onClick={suggestSubjects} disabled={busy !== null} className="w-full">
          Suggest subject lines
        </Button>
        {subjects.length > 0 && (
          <ul className="mt-2 space-y-1">
            {subjects.map((s, i) => (
              <li key={i}>
                <button
                  onClick={() => onSubject(s)}
                  className="w-full rounded border px-2 py-1 text-left text-xs hover:bg-accent"
                >
                  {s}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
