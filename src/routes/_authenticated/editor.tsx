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
import {
  colorsForLetter,
  resolveBrandColors,
  sameColors,
  type ColorPair,
} from "@/lib/letterhead/brand-colors";
import { invokeEdgeFunction } from "@/lib/edge-functions";

const searchSchema = z.object({ id: z.string().optional() });

export const Route = createFileRoute("/_authenticated/editor")({
  validateSearch: searchSchema,
  component: Editor,
  head: () => ({ meta: [{ title: "Letterhead editor - Zuridoc" }] }),
});

const emptyBrand: Brand = {
  company_name: "Your Company",
  phone: "",
  email: "",
  website: "",
  address: "",
  logo_url: null,
  primary_color: "#0067ec",
  accent_color: "#011b43",
  watermark_text: null,
};

function Editor() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = Route.useSearch();

  const [brand, setBrand] = useState<Brand>(emptyBrand);
  const [letter, setLetter] = useState<Letterhead>(DEFAULT_LETTERHEAD);
  /** The brand's colours, taken from its logo; null when there is no brand yet. */
  const [brandColors, setBrandColors] = useState<ColorPair | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [cleaning, setCleaning] = useState(false);
  const [previousBody, setPreviousBody] = useState<string | null>(null);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [shareExpiry, setShareExpiry] = useState<string>("");
  const [shareAllowDl, setShareAllowDl] = useState(true);

  const [loadError, setLoadError] = useState<string | null>(null);
  const [reloadCount, setReloadCount] = useState(0);
  const [saveState, setSaveState] = useState<"saved" | "dirty" | "saving" | "error">("saved");
  /** JSON of the letter as last written to the server; "" for a letter never saved. */
  const savedSnapshotRef = useRef("");

  const previewRef = useRef<HTMLDivElement>(null);

  // Load brand + letterhead. A failed load must never leave a blank form that
  // could then be saved over the real record, so errors stop the editor.
  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    setLoaded(false);
    setLoadError(null);
    (async () => {
      const [brandRes, letterRes] = await Promise.all([
        supabase.from("brands").select("*").eq("user_id", user.id).maybeSingle(),
        id
          ? supabase.from("letterheads").select("*").eq("id", id).maybeSingle()
          : Promise.resolve({ data: null, error: null }),
      ]);
      if (cancelled) return;

      if (brandRes.error || letterRes.error) {
        setLoadError(
          (brandRes.error ?? letterRes.error)?.message ?? "Could not load this letterhead.",
        );
        setLoaded(true);
        return;
      }
      const brandRow = brandRes.data;
      const letterRow = letterRes.data;
      if (id && !letterRow) {
        setLoadError("This letterhead could not be found. It may have been deleted.");
        setLoaded(true);
        return;
      }

      let next: Letterhead = DEFAULT_LETTERHEAD;
      let fromBrand: ColorPair | null = null;
      if (brandRow) {
        let logoUrl: string | null = null;
        if (brandRow.logo_path) {
          const { data: signed } = await supabase.storage
            .from("logos")
            .createSignedUrl(brandRow.logo_path, 3600);
          logoUrl = signed?.signedUrl ?? null;
        }
        fromBrand = await resolveBrandColors({
          primary_color: brandRow.primary_color,
          accent_color: brandRow.accent_color,
          logo_url: logoUrl,
        });
        if (cancelled) return;
        setBrand({
          company_name: brandRow.company_name ?? "",
          phone: brandRow.phone ?? "",
          email: brandRow.email ?? "",
          website: brandRow.website ?? "",
          address: brandRow.address ?? "",
          logo_url: logoUrl,
          ...fromBrand,
          watermark_text: (brandRow as { watermark_text?: string | null }).watermark_text ?? null,
        });
        next = { ...next, ...fromBrand };
      }
      setBrandColors(fromBrand);
      if (letterRow) {
        next = {
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
          page_format: (letterRow as { page_format?: PageFormat }).page_format ?? "a4",
          page_orientation:
            (letterRow as { page_orientation?: PageOrientation }).page_orientation ?? "portrait",
          margin_mm: (letterRow as { margin_mm?: number }).margin_mm ?? 18,
          show_qr: (letterRow as { show_qr?: boolean }).show_qr ?? false,
          brand_id: (letterRow as { brand_id?: string | null }).brand_id ?? null,
        };
      }

      // The QR code points at this letter's newest working share link, if any.
      if (id) {
        const { data: shares } = await supabase
          .from("letterhead_shares")
          .select("token,expires_at")
          .eq("letterhead_id", id)
          .order("created_at", { ascending: false })
          .limit(5);
        if (cancelled) return;
        const live = (shares ?? []).find(
          (share) => !share.expires_at || new Date(share.expires_at).getTime() > Date.now(),
        );
        setShareLink(live ? shareUrl(live.token) : null);
      }

      // The snapshot is the letter as stored, so a saved letter that picks up
      // the brand colours below is written back by the autosave.
      savedSnapshotRef.current = id ? JSON.stringify(next) : "";
      if (letterRow) next = { ...next, ...colorsForLetter(next, fromBrand) };
      setLetter(next);
      setSaveState("saved");
      setLoaded(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [user, id, reloadCount]);

  const set = <K extends keyof Letterhead>(k: K, v: Letterhead[K]) =>
    setLetter((l) => ({ ...l, [k]: v }));

  /** Write a snapshot to the server. Returns true only if a row was really saved. */
  const persist = async (snapshot: Letterhead, { quiet = false } = {}) => {
    if (!user || loadError) return false;
    setSaveState("saving");
    const payload = { user_id: user.id, ...snapshot };
    if (id) {
      const { data, error } = await supabase
        .from("letterheads")
        .update(payload)
        .eq("id", id)
        .select("id");
      if (error || !data?.length) {
        setSaveState("error");
        if (!quiet) toast.error(error?.message ?? "This letterhead no longer exists.");
        return false;
      }
    } else {
      const { data, error } = await supabase
        .from("letterheads")
        .insert(payload)
        .select("id")
        .single();
      if (error) {
        setSaveState("error");
        if (!quiet) toast.error(error.message);
        return false;
      }
      savedSnapshotRef.current = JSON.stringify(snapshot);
      setSaveState("saved");
      if (!quiet) toast.success("Saved");
      navigate({ to: "/editor", search: { id: data.id }, replace: true });
      return true;
    }
    savedSnapshotRef.current = JSON.stringify(snapshot);
    // Only report "saved" if nothing changed while the request was in flight.
    setSaveState(
      JSON.stringify(letterRef.current) === savedSnapshotRef.current ? "saved" : "dirty",
    );
    if (!quiet) toast.success("Saved");
    return true;
  };

  const save = async () => {
    setSaving(true);
    await persist(letter);
    setSaving(false);
  };

  const letterRef = useRef(letter);
  letterRef.current = letter;
  const isDirty = () => JSON.stringify(letterRef.current) !== savedSnapshotRef.current;

  // Autosave an existing letterhead shortly after the last change.
  useEffect(() => {
    if (!loaded || loadError) return;
    if (JSON.stringify(letter) === savedSnapshotRef.current) return;
    setSaveState((state) => (state === "saving" ? state : "dirty"));
    if (!id) return;
    const timer = window.setTimeout(() => {
      void persist(letter, { quiet: true });
    }, 1500);
    return () => window.clearTimeout(timer);
    // persist is recreated each render; depending on it would restart the timer for no reason.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [letter, loaded, loadError, id]);

  // Warn before closing or reloading the tab with changes that have not reached the server.
  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (!loaded || loadError || !isDirty()) return;
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [loaded, loadError]);

  const goBack = async () => {
    if (loaded && !loadError && isDirty()) {
      const saved = id ? await persist(letterRef.current, { quiet: true }) : false;
      if (!saved && !window.confirm("Your latest changes are not saved. Leave anyway?")) return;
    }
    navigate({ to: "/dashboard" });
  };

  const cleanText = async () => {
    if (!letter.body.trim()) return toast.error("Add some text first");
    setCleaning(true);
    try {
      const data = await invokeEdgeFunction<{ cleaned?: string; error?: string }>("clean-text", {
        body: { text: letter.body },
      });
      if (data?.error) {
        toast.error(data.error);
        return;
      }
      if (!data?.cleaned) {
        toast.error("AI clean-up returned no text.");
        return;
      }
      setPreviousBody(letter.body);
      set("body", data.cleaned);
      toast.success("Text cleaned. You can revert if needed.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "AI clean-up failed");
    } finally {
      setCleaning(false);
    }
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
      snapshot: JSON.parse(JSON.stringify(letter)),
    });
    if (error) toast.error(error.message);
    else toast.success("Template saved");
  };

  const generateShare = async () => {
    if (!user || !id) return toast.error("Save the letter first");
    // The shared page shows what is on the server, so sync pending edits first.
    if (isDirty() && !(await persist(letterRef.current, { quiet: true }))) {
      return toast.error("Couldn't save your latest changes, so no link was created.");
    }
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
      // A theme sets the layout and font; the colours stay with the brand's logo.
      ...(brandColors ?? { primary_color: t.primary_color, accent_color: t.accent_color }),
    }));
  };

  const followsBrand = brandColors ? sameColors(letter, brandColors) : false;

  const previewScale = 0.6;
  const previewKey = useMemo(() => JSON.stringify({ brand, letter }), [brand, letter]);

  if (!loaded) {
    return <p className="p-10 text-muted-foreground">Loading…</p>;
  }

  if (loadError) {
    return (
      <div className="ambient-bg flex min-h-screen items-start justify-center px-4 py-16">
        <Card className="w-full max-w-md">
          <CardContent className="space-y-4 p-6">
            <h1 className="text-2xl">Couldn't open this letterhead</h1>
            <p className="text-sm text-muted-foreground">{loadError}</p>
            <p className="text-sm text-muted-foreground">
              Nothing has been changed. Editing is paused so a blank page can't be saved over your
              letter.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => setReloadCount((count) => count + 1)}>Try again</Button>
              <Button variant="outline" onClick={() => navigate({ to: "/dashboard" })}>
                Back to letterheads
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="ambient-bg min-h-screen overflow-x-hidden">
      <div className="mx-auto grid w-full max-w-7xl gap-4 px-3 py-4 sm:gap-5 sm:px-6 sm:py-8 lg:grid-cols-[minmax(320px,420px)_1fr]">
        {/* Controls */}
        <div className="min-w-0 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button variant="ghost" size="sm" onClick={() => void goBack()}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <div className="grid min-w-0 grid-cols-1 gap-2 min-[360px]:grid-cols-2 sm:flex">
              <Button size="sm" onClick={save} disabled={saving} className="min-w-0">
                <Save className="mr-2 h-4 w-4 shrink-0" />{" "}
                <span className="truncate">{saving ? "Saving…" : "Save"}</span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" variant="default" className="min-w-0">
                    <Download className="mr-2 h-4 w-4 shrink-0" />{" "}
                    <span className="truncate">Export</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={downloadPdf}>Download PDF</DropdownMenuItem>
                  <DropdownMenuItem onClick={downloadDocx}>Download DOCX</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => downloadPng("image/png")}>
                    Download PNG
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => downloadPng("image/jpeg")}>
                    Download JPG
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={downloadHtml}>Download HTML email</DropdownMenuItem>
                  <DropdownMenuItem onClick={saveAsTemplate}>
                    <BookmarkPlus className="mr-2 h-4 w-4" /> Save as template
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <p className="text-xs text-muted-foreground" aria-live="polite">
            {saveState === "saving"
              ? "Saving…"
              : saveState === "error"
                ? "Couldn't save. Check your connection and press Save."
                : saveState === "dirty"
                  ? id
                    ? "Unsaved changes…"
                    : "Not saved yet. Press Save to keep this letterhead."
                  : "All changes saved"}
          </p>

          <Input
            value={letter.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="Letterhead title"
            className="text-base font-semibold"
          />

          <Section title="AI assistant">
            <AiPanel
              body={letter.body}
              onApplyBody={(text) => {
                setPreviousBody(letter.body);
                set("body", text);
              }}
              onSubject={(s) => set("subject", s)}
            />
          </Section>

          <Section title="Themes">
            <div className="flex flex-wrap gap-2">
              {THEME_PRESETS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => applyTheme(t.id)}
                  className="border-2 border-[var(--nb-ink)] bg-card px-3 py-1 text-xs font-bold transition-transform hover:-rotate-2 hover:bg-accent hover:text-accent-foreground"
                  style={{
                    borderColor: brandColors?.primary_color ?? t.primary_color,
                    color: brandColors?.primary_color ?? t.primary_color,
                  }}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </Section>

          <Section title="Template">
            <div className="grid gap-2 sm:grid-cols-2">
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
            <div className="grid gap-2 sm:grid-cols-2">
              <div>
                <Label className="text-xs">Format</Label>
                <Select
                  value={letter.page_format ?? "a4"}
                  onValueChange={(v) => set("page_format", v as PageFormat)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PAGE_FORMATS.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Orientation</Label>
                <Select
                  value={letter.page_orientation ?? "portrait"}
                  onValueChange={(v) => set("page_orientation", v as PageOrientation)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="portrait">Portrait</SelectItem>
                    <SelectItem value="landscape">Landscape</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="sm:col-span-2">
                <Label className="text-xs">Margin: {letter.margin_mm ?? 18} mm</Label>
                <Slider
                  min={0}
                  max={40}
                  step={1}
                  value={[letter.margin_mm ?? 18]}
                  onValueChange={(v) => set("margin_mm", v[0])}
                />
              </div>
              <label className="flex items-center gap-2 text-xs sm:col-span-2">
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
              <div className="grid gap-2 sm:grid-cols-2">
                <div>
                  <Label className="text-xs">Expires (optional)</Label>
                  <Input
                    type="datetime-local"
                    value={shareExpiry}
                    onChange={(e) => setShareExpiry(e.target.value)}
                  />
                </div>
                <label className="flex items-end gap-2 text-xs">
                  <input
                    type="checkbox"
                    checked={shareAllowDl}
                    onChange={(e) => setShareAllowDl(e.target.checked)}
                  />
                  Allow PDF download
                </label>
              </div>
              <Button size="sm" variant="secondary" onClick={generateShare} className="w-full">
                <Share2 className="mr-2 h-4 w-4" /> Generate share link
              </Button>
              <p className="text-xs text-muted-foreground">
                {shareLink
                  ? "Anyone with this link can view the letter. The QR code on the letter opens the same link."
                  : "Create a share link to let someone view this letter online. The QR code needs one too."}
              </p>
              {shareLink && (
                <Input
                  readOnly
                  value={shareLink}
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                  className="text-xs"
                />
              )}
            </div>
          </Section>

          <Section title="Typography">
            <div className="grid gap-2 sm:grid-cols-2">
              <div>
                <Label className="text-xs">Font</Label>
                <Select value={letter.font_family} onValueChange={(v) => set("font_family", v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
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
            <div className="grid gap-2 sm:grid-cols-2">
              <ColorRow
                label="Primary"
                value={letter.primary_color}
                onChange={(v) => set("primary_color", v)}
              />
              <ColorRow
                label="Accent"
                value={letter.accent_color}
                onChange={(v) => set("accent_color", v)}
              />
            </div>
            {brandColors && (
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs text-muted-foreground">
                  {followsBrand
                    ? brand.logo_url
                      ? "Matched to your brand logo."
                      : "Matched to your brand colors."
                    : "Custom colors for this letter."}
                </p>
                {!followsBrand && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setLetter((l) => ({ ...l, ...brandColors }))}
                  >
                    <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                    {brand.logo_url ? "Use logo colors" : "Use brand colors"}
                  </Button>
                )}
              </div>
            )}
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
                <Input value={letter.subject} onChange={(e) => set("subject", e.target.value)} />
              </div>
              <div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <Label className="text-xs">Body</Label>
                  <div className="flex gap-1">
                    {previousBody !== null && (
                      <Button size="sm" variant="ghost" onClick={revert}>
                        <RotateCcw className="mr-1 h-3 w-3" /> Revert
                      </Button>
                    )}
                    <Button size="sm" variant="secondary" onClick={cleanText} disabled={cleaning}>
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
              <div className="grid gap-2 sm:grid-cols-2">
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
        <div className="min-w-0 lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] lg:overflow-auto">
          <Card className="glass">
            <CardContent className="overflow-auto bg-muted/30 p-3 sm:flex sm:justify-center sm:p-6">
              <LetterheadPreview
                key={previewKey}
                ref={previewRef}
                brand={brand}
                letter={letter}
                scale={previewScale}
                qrUrl={shareLink}
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
    <Card className="glass">
      <CardContent className="min-w-0 p-3 sm:p-4">
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
      <div className="grid min-w-0 grid-cols-1 gap-2 min-[360px]:grid-cols-2 sm:flex">
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
