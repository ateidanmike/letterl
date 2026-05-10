import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Sparkles, Save, Download, ArrowLeft, RotateCcw } from "lucide-react";
import { LetterheadPreview } from "@/components/letterhead/LetterheadPreview";
import { AiPanel } from "@/components/letterhead/AiPanel";
import { SignaturePad } from "@/components/letterhead/SignaturePad";
import {
  DEFAULT_LETTERHEAD,
  FONTS,
  TEMPLATES,
  type Brand,
  type Letterhead,
  type TemplateId,
} from "@/lib/letterhead/types";
import { exportPdf } from "@/lib/letterhead/pdf-export";
import { exportDocx } from "@/lib/letterhead/docx-export";
import { exportPng } from "@/lib/letterhead/png-export";

const searchSchema = z.object({ id: z.string().optional() });

export const Route = createFileRoute("/_authenticated/editor")({
  validateSearch: searchSchema,
  component: Editor,
  head: () => ({ meta: [{ title: "Editor — Letterly" }] }),
});

const emptyBrand: Brand = {
  company_name: "Your Company",
  phone: "",
  email: "",
  website: "",
  address: "",
  logo_url: null,
  primary_color: "#1E40AF",
  accent_color: "#16A34A",
};

function Editor() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = Route.useSearch();

  const [brand, setBrand] = useState<Brand>(emptyBrand);
  const [letter, setLetter] = useState<Letterhead>(DEFAULT_LETTERHEAD);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [cleaning, setCleaning] = useState(false);
  const [previousBody, setPreviousBody] = useState<string | null>(null);

  const previewRef = useRef<HTMLDivElement>(null);

  // Load brand + letterhead
  useEffect(() => {
    if (!user) return;
    (async () => {
      const [{ data: brandRow }, { data: letterRow }] = await Promise.all([
        supabase.from("brands").select("*").eq("user_id", user.id).maybeSingle(),
        id
          ? supabase.from("letterheads").select("*").eq("id", id).maybeSingle()
          : Promise.resolve({ data: null }),
      ]);
      if (brandRow) {
        let logoUrl: string | null = null;
        if (brandRow.logo_path) {
          const { data: signed } = await supabase.storage
            .from("logos")
            .createSignedUrl(brandRow.logo_path, 3600);
          logoUrl = signed?.signedUrl ?? null;
        }
        setBrand({
          company_name: brandRow.company_name ?? "",
          phone: brandRow.phone ?? "",
          email: brandRow.email ?? "",
          website: brandRow.website ?? "",
          address: brandRow.address ?? "",
          logo_url: logoUrl,
          primary_color: brandRow.primary_color,
          accent_color: brandRow.accent_color,
        });
        setLetter((l) => ({
          ...l,
          primary_color: brandRow.primary_color,
          accent_color: brandRow.accent_color,
        }));
      }
      if (letterRow) {
        setLetter({
          title: letterRow.title,
          template: letterRow.template as TemplateId,
          font_family: letterRow.font_family,
          font_size: letterRow.font_size,
          primary_color: letterRow.primary_color,
          accent_color: letterRow.accent_color,
          letter_date: letterRow.letter_date,
          recipient: letterRow.recipient ?? "",
          subject: letterRow.subject ?? "",
          body: letterRow.body ?? "",
          signature_name: letterRow.signature_name ?? "",
          signature_title: letterRow.signature_title ?? "",
          signature_data: (letterRow as { signature_data?: string | null }).signature_data ?? null,
          folder: (letterRow as { folder?: string }).folder ?? "Inbox",
        });
      }
      setLoaded(true);
    })();
  }, [user, id]);

  const set = <K extends keyof Letterhead>(k: K, v: Letterhead[K]) =>
    setLetter((l) => ({ ...l, [k]: v }));

  const save = async () => {
    if (!user) return;
    setSaving(true);
    const payload = { user_id: user.id, ...letter };
    if (id) {
      const { error } = await supabase.from("letterheads").update(payload).eq("id", id);
      if (error) toast.error(error.message);
      else toast.success("Saved");
    } else {
      const { data, error } = await supabase
        .from("letterheads")
        .insert(payload)
        .select("id")
        .single();
      if (error) toast.error(error.message);
      else {
        toast.success("Saved");
        navigate({ to: "/editor", search: { id: data.id }, replace: true });
      }
    }
    setSaving(false);
  };

  const cleanText = async () => {
    if (!letter.body.trim()) return toast.error("Add some text first");
    setCleaning(true);
    const { data, error } = await supabase.functions.invoke("clean-text", {
      body: { text: letter.body },
    });
    setCleaning(false);
    if (error) {
      toast.error(error.message ?? "AI clean-up failed");
      return;
    }
    if (data?.error) {
      toast.error(data.error);
      return;
    }
    setPreviousBody(letter.body);
    set("body", data.cleaned);
    toast.success("Text cleaned. You can revert if needed.");
  };

  const revert = () => {
    if (previousBody === null) return;
    set("body", previousBody);
    setPreviousBody(null);
  };

  const downloadPdf = async () => {
    if (!previewRef.current) return;
    toast.message("Generating PDF…");
    try {
      await exportPdf(previewRef.current, letter.title || "letterhead");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "PDF export failed");
    }
  };

  const downloadDocx = async () => {
    toast.message("Generating Word document…");
    try {
      await exportDocx(brand, letter, letter.title || "letterhead");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "DOCX export failed");
    }
  };

  const downloadPng = async (mime: "image/png" | "image/jpeg") => {
    if (!previewRef.current) return;
    toast.message(`Generating ${mime === "image/jpeg" ? "JPG" : "PNG"}…`);
    try {
      await exportPng(previewRef.current, letter.title || "letterhead", mime);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Image export failed");
    }
  };

  const previewScale = 0.6;
  const previewKey = useMemo(() => JSON.stringify({ brand, letter }), [brand, letter]);

  if (!loaded) {
    return <p className="p-10 text-muted-foreground">Loading…</p>;
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-6 py-6 lg:grid-cols-[420px_1fr]">
      {/* Controls */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate({ to: "/dashboard" })}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <div className="flex gap-2">
            <Button size="sm" onClick={save} disabled={saving}>
              <Save className="mr-2 h-4 w-4" /> {saving ? "Saving…" : "Save"}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="default">
                  <Download className="mr-2 h-4 w-4" /> Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={downloadPdf}>Download PDF</DropdownMenuItem>
                <DropdownMenuItem onClick={downloadDocx}>Download DOCX</DropdownMenuItem>
                <DropdownMenuItem onClick={() => downloadPng("image/png")}>Download PNG</DropdownMenuItem>
                <DropdownMenuItem onClick={() => downloadPng("image/jpeg")}>Download JPG</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Input
          value={letter.title}
          onChange={(e) => set("title", e.target.value)}
          placeholder="Letterhead title"
          className="text-base font-semibold"
        />

        <Section title="AI assistant">
          <AiPanel
            body={letter.body}
            onApplyBody={(text) => { setPreviousBody(letter.body); set("body", text); }}
            onSubject={(s) => set("subject", s)}
          />
        </Section>

        <Section title="Template">
          <div className="grid grid-cols-2 gap-2">
            {TEMPLATES.map((t) => (
              <button
                key={t.id}
                onClick={() => set("template", t.id)}
                className={`rounded-md border p-3 text-left text-xs transition ${
                  letter.template === t.id
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "hover:border-foreground/30"
                }`}
              >
                <div className="font-semibold">{t.name}</div>
                <div className="text-muted-foreground">{t.description}</div>
              </button>
            ))}
          </div>
        </Section>

        <Section title="Typography">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">Font</Label>
              <Select value={letter.font_family} onValueChange={(v) => set("font_family", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {FONTS.map((f) => (
                    <SelectItem key={f} value={f} style={{ fontFamily: f }}>
                      {f}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Size: {letter.font_size}pt</Label>
              <Slider
                min={9}
                max={16}
                step={1}
                value={[letter.font_size]}
                onValueChange={(v) => set("font_size", v[0])}
              />
            </div>
          </div>
        </Section>

        <Section title="Colors">
          <div className="grid grid-cols-2 gap-2">
            <ColorRow label="Primary" value={letter.primary_color} onChange={(v) => set("primary_color", v)} />
            <ColorRow label="Accent" value={letter.accent_color} onChange={(v) => set("accent_color", v)} />
          </div>
        </Section>

        <Section title="Letter">
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Date</Label>
              <Input
                type="date"
                value={letter.letter_date ?? ""}
                onChange={(e) => set("letter_date", e.target.value || null)}
              />
            </div>
            <div>
              <Label className="text-xs">Recipient</Label>
              <Textarea
                rows={3}
                value={letter.recipient}
                onChange={(e) => set("recipient", e.target.value)}
                placeholder={"Jane Doe\nABC Ltd\nNairobi"}
              />
            </div>
            <div>
              <Label className="text-xs">Subject</Label>
              <Input
                value={letter.subject}
                onChange={(e) => set("subject", e.target.value)}
              />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <Label className="text-xs">Body</Label>
                <div className="flex gap-1">
                  {previousBody !== null && (
                    <Button size="sm" variant="ghost" onClick={revert}>
                      <RotateCcw className="mr-1 h-3 w-3" /> Revert
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={cleanText}
                    disabled={cleaning}
                  >
                    <Sparkles className="mr-1 h-3 w-3" />
                    {cleaning ? "Cleaning…" : "AI clean"}
                  </Button>
                </div>
              </div>
              <Textarea
                rows={10}
                value={letter.body}
                onChange={(e) => set("body", e.target.value)}
                placeholder="Dear Jane,&#10;&#10;..."
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">Signature name</Label>
                <Input
                  value={letter.signature_name}
                  onChange={(e) => set("signature_name", e.target.value)}
                />
              </div>
              <div>
                <Label className="text-xs">Title</Label>
                <Input
                  value={letter.signature_title}
                  onChange={(e) => set("signature_title", e.target.value)}
                />
              </div>
            </div>
          <div className="mt-3">
            <Label className="text-xs">Signature image</Label>
            <SignaturePad
              value={letter.signature_data ?? null}
              onChange={(v) => set("signature_data", v)}
            />
          </div>
          </div>
        </Section>
      </div>

      {/* Preview */}
      <div className="lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] lg:overflow-auto">
        <Card>
          <CardContent className="flex justify-center bg-muted/30 p-6">
            <LetterheadPreview
              key={previewKey}
              ref={previewRef}
              brand={brand}
              letter={letter}
              scale={previewScale}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="mb-3 text-sm font-semibold">{title}</h3>
        {children}
      </CardContent>
    </Card>
  );
}

function ColorRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <Label className="text-xs">{label}</Label>
      <div className="flex gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-12 cursor-pointer rounded border"
        />
        <Input value={value} onChange={(e) => onChange(e.target.value)} className="text-xs" />
      </div>
    </div>
  );
}