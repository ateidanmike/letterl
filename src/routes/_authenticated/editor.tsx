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
import { Sparkles, Save, Download, ArrowLeft, RotateCcw, Share2, BookmarkPlus } from "lucide-react";
import { LetterheadPreview } from "@/components/letterhead/LetterheadPreview";
import { AiPanel } from "@/components/letterhead/AiPanel";
import { SignaturePad } from "@/components/letterhead/SignaturePad";
import {
  DEFAULT_LETTERHEAD,
  FONTS,
  TEMPLATES,
  PAGE_FORMATS,
  THEME_PRESETS,
  type Brand,
  type Letterhead,
  type TemplateId,
  type PageFormat,
  type PageOrientation,
} from "@/lib/letterhead/types";
import { exportPdf } from "@/lib/letterhead/pdf-export";
import { exportDocx } from "@/lib/letterhead/docx-export";
import { exportPng } from "@/lib/letterhead/png-export";
import { downloadHtmlEmail } from "@/lib/letterhead/html-email";
import { createShareLink, shareUrl } from "@/lib/letterhead/share";

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
  watermark_text: null,
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
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [shareExpiry, setShareExpiry] = useState<string>("");
  const [shareAllowDl, setShareAllowDl] = useState(true);

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
          watermark_text: (brandRow as { watermark_text?: string | null }).watermark_text ?? null,
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
          page_format: ((letterRow as { page_format?: PageFormat }).page_format ?? "a4"),
          page_orientation: ((letterRow as { page_orientation?: PageOrientation }).page_orientation ?? "portrait"),
          margin_mm: (letterRow as { margin_mm?: number }).margin_mm ?? 18,
          show_qr: (letterRow as { show_qr?: boolean }).show_qr ?? false,
          brand_id: (letterRow as { brand_id?: string | null }).brand_id ?? null,
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
      await exportPdf(previewRef.current, letter.title || "letterhead", letter);
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

  const downloadHtml = () => {
    try {
      downloadHtmlEmail(brand, letter, letter.title || "letterhead");
      toast.success("HTML email downloaded");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "HTML export failed");
    }
  };

  const saveAsTemplate = async () => {
    if (!user) return;
    const name = window.prompt("Template name", letter.title || "My template");
    if (!name) return;
    const { error } = await supabase.from("user_templates").insert({
      user_id: user.id,
      name,
      snapshot: letter as unknown as Record<string, unknown>,
    });
    if (error) toast.error(error.message);
    else toast.success("Template saved");
  };

  const generateShare = async () => {
    if (!user || !id) return toast.error("Save the letter first");
    try {
      const url = await createShareLink({
        letterheadId: id,
        userId: user.id,
        expiresAt: shareExpiry ? new Date(shareExpiry).toISOString() : null,
        allowDownload: shareAllowDl,
      });
      setShareLink(url);
      await navigator.clipboard.writeText(url).catch(() => {});
      toast.success("Share link copied to clipboard");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not create share link");
    }
  };

  const applyTheme = (themeId: string) => {
    const t = THEME_PRESETS.find((x) => x.id === themeId);
    if (!t) return;
    setLetter((l) => ({
      ...l,
      template: t.template,
      font_family: t.font_family,
      primary_color: t.primary_color,
      accent_color: t.accent_color,
    }));
  };

  const previewScale = 0.6;
  const previewKey = useMemo(() => JSON.stringify({ brand, letter }), [brand, letter]);

  if (!loaded) {
    return <p className="p-10 text-muted-foreground">Loading…</p>;
  }

  return (
    <div className="ambient-bg min-h-screen">
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
                <DropdownMenuItem onClick={downloadHtml}>Download HTML email</DropdownMenuItem>
                <DropdownMenuItem onClick={saveAsTemplate}>
                  <BookmarkPlus className="mr-2 h-4 w-4" /> Save as template
                </DropdownMenuItem>
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

        <Section title="Themes">
          <div className="flex flex-wrap gap-2">
            {THEME_PRESETS.map((t) => (
              <button
                key={t.id}
                onClick={() => applyTheme(t.id)}
                className="rounded-full border px-3 py-1 text-xs hover:border-foreground/40"
                style={{ borderColor: t.primary_color, color: t.primary_color }}
              >
                {t.name}
              </button>
            ))}
          </div>
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

        <Section title="Page setup">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">Format</Label>
              <Select value={letter.page_format ?? "a4"} onValueChange={(v) => set("page_format", v as PageFormat)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PAGE_FORMATS.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Orientation</Label>
              <Select value={letter.page_orientation ?? "portrait"} onValueChange={(v) => set("page_orientation", v as PageOrientation)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="portrait">Portrait</SelectItem>
                  <SelectItem value="landscape">Landscape</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <Label className="text-xs">Margin: {letter.margin_mm ?? 18} mm</Label>
              <Slider min={0} max={40} step={1} value={[letter.margin_mm ?? 18]} onValueChange={(v) => set("margin_mm", v[0])} />
            </div>
            <label className="col-span-2 flex items-center gap-2 text-xs">
              <input
                type="checkbox"
                checked={!!letter.show_qr}
                onChange={(e) => set("show_qr", e.target.checked)}
              />
              Show QR code linking to share URL
            </label>
          </div>
        </Section>

        <Section title="Share link">
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">Expires (optional)</Label>
                <Input type="datetime-local" value={shareExpiry} onChange={(e) => setShareExpiry(e.target.value)} />
              </div>
              <label className="flex items-end gap-2 text-xs">
                <input type="checkbox" checked={shareAllowDl} onChange={(e) => setShareAllowDl(e.target.checked)} />
                Allow PDF download
              </label>
            </div>
            <Button size="sm" variant="secondary" onClick={generateShare} className="w-full">
              <Share2 className="mr-2 h-4 w-4" /> Generate share link
            </Button>
            {shareLink && (
              <Input readOnly value={shareLink} onClick={(e) => (e.target as HTMLInputElement).select()} className="text-xs" />
            )}
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
        <Card className="glass border-0">
          <CardContent className="flex justify-center bg-muted/30 p-6">
            <LetterheadPreview
              key={previewKey}
              ref={previewRef}
              brand={brand}
              letter={letter}
              scale={previewScale}
              qrUrl={id ? shareUrl("preview") : null}
            />
          </CardContent>
        </Card>
      </div>
    </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="glass border-0">
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