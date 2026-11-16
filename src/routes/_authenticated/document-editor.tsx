import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, Save, Download, Plus, Trash2, Copy, Eraser, Upload } from "lucide-react";
import { DocumentPreview } from "@/components/documents/DocumentPreview";
import {
  DOC_TYPES,
  DOC_TEMPLATES,
  DOCUMENT_STATUSES,
  DEFAULT_DOC,
  CURRENCIES,
  type BusinessDoc,
  type DocType,
  type DocumentStatus,
  type DocTemplateId,
  type LineItem,
} from "@/lib/documents/types";
import { exportPdf } from "@/lib/letterhead/pdf-export";
import { documentSlug } from "@/lib/documents/slug";

const searchSchema = z.object({ id: z.string().optional() });
const DOCUMENT_ASSETS_KEY = "__document_assets";

export const Route = createFileRoute("/_authenticated/document-editor")({
  validateSearch: searchSchema,
  component: DocumentEditor,
  head: () => ({ meta: [{ title: "Document editor - Zuridoc" }] }),
});

function DocumentEditor() {
  const { id } = Route.useSearch();
  return <BusinessDocumentEditor documentId={id} />;
}

export function BusinessDocumentEditor({ documentId }: { documentId?: string }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const id = documentId;
  const [doc, setDoc] = useState<BusinessDoc>(DEFAULT_DOC);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [duplicating, setDuplicating] = useState(false);
  const [autosaveStatus, setAutosaveStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle",
  );
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [editingBrandDetails, setEditingBrandDetails] = useState(false);
  const [previewScale, setPreviewScale] = useState(1);
  const previewRef = useRef<HTMLDivElement>(null);
  const previewShellRef = useRef<HTMLDivElement>(null);
  const [missing, setMissing] = useState(false);
  const lastAutosavedRef = useRef("");
  /** updated_at of the server row our edits are based on. */
  const serverUpdatedAtRef = useRef<string | null>(null);
  const docRef = useRef(doc);
  docRef.current = doc;
  const autosaveTimerRef = useRef<number | null>(null);
  const draftKey = id ? `zuridoc:business-document-draft:${id}` : null;
  const availableTemplates = DOC_TEMPLATES.filter((template) =>
    doc.doc_type === "delivery_note" ? true : template.id !== "delivery_simple",
  );

  const fromPartyWithDocumentAssets = (currentDoc: BusinessDoc) => ({
    ...currentDoc.from_party,
    [DOCUMENT_ASSETS_KEY]: {
      show_qr: currentDoc.show_qr,
      qr_text: currentDoc.qr_text,
      show_company_stamp: currentDoc.show_company_stamp,
      company_stamp_data: currentDoc.company_stamp_data ?? null,
    },
  });

  const documentAssetsFromParty = (fromParty: Record<string, unknown>) => {
    const assets = fromParty[DOCUMENT_ASSETS_KEY] as Partial<BusinessDoc> | undefined;
    return {
      show_qr: Boolean(assets?.show_qr),
      qr_text: typeof assets?.qr_text === "string" ? assets.qr_text : "",
      show_company_stamp: Boolean(assets?.show_company_stamp),
      company_stamp_data:
        typeof assets?.company_stamp_data === "string" ? assets.company_stamp_data : null,
    };
  };

  const documentPayload = (currentDoc: BusinessDoc) => ({
    doc_type: currentDoc.doc_type,
    doc_number: currentDoc.doc_number,
    title: currentDoc.title,
    template: currentDoc.template,
    issue_date: currentDoc.issue_date,
    due_date: currentDoc.due_date,
    currency: currentDoc.currency,
    from_party: fromPartyWithDocumentAssets(currentDoc),
    to_party: currentDoc.to_party,
    items: currentDoc.items,
    tax_rate: currentDoc.tax_rate,
    discount: currentDoc.discount,
    notes: currentDoc.notes,
    terms: currentDoc.terms,
    primary_color: currentDoc.primary_color,
    accent_color: currentDoc.accent_color,
    signature_name: currentDoc.signature_name,
    signature_title: currentDoc.signature_title,
    status: currentDoc.status,
  });

  // ---- Local draft ---------------------------------------------------------
  // A draft exists in this browser only while there are edits the server has not
  // confirmed. It records which server version it was based on, so we never rely
  // on comparing the device clock with the server clock.
  const writeDraft = (currentDoc: BusinessDoc) => {
    if (!draftKey) return;
    // The logo link is short-lived and always re-issued on load; never store it.
    const { logo_url: _logoUrl, ...draftDoc } = currentDoc;
    try {
      window.localStorage.setItem(
        draftKey,
        JSON.stringify({ baseUpdatedAt: serverUpdatedAtRef.current, doc: draftDoc }),
      );
    } catch {
      // Storage is full or unavailable (large stamp images can do this). The
      // server autosave still runs, so carry on without a local copy.
    }
  };

  const clearDraft = () => {
    if (!draftKey) return;
    try {
      window.localStorage.removeItem(draftKey);
    } catch {
      // ignore
    }
  };

  const applyDraft = (serverDoc: BusinessDoc, draftDoc: Partial<BusinessDoc>): BusinessDoc => ({
    ...serverDoc,
    ...draftDoc,
    logo_url: serverDoc.logo_url,
    qr_text: isPrivateDocumentLink(draftDoc.qr_text)
      ? serverDoc.qr_text
      : (draftDoc.qr_text ?? serverDoc.qr_text),
    from_party: { ...serverDoc.from_party, ...(draftDoc.from_party ?? {}) },
    to_party: { ...serverDoc.to_party, ...(draftDoc.to_party ?? {}) },
    items: draftDoc.items?.length ? draftDoc.items : serverDoc.items,
  });

  const mergeStoredDraft = (serverDoc: BusinessDoc, serverUpdatedAt: string | null) => {
    if (!draftKey) return serverDoc;
    try {
      const stored = window.localStorage.getItem(draftKey);
      if (!stored) return serverDoc;
      const parsed = JSON.parse(stored) as {
        baseUpdatedAt?: string | null;
        doc?: Partial<BusinessDoc>;
      };
      if (!parsed.doc) {
        clearDraft();
        return serverDoc;
      }
      const candidate = applyDraft(serverDoc, parsed.doc);
      if (JSON.stringify(candidate) === JSON.stringify(serverDoc)) {
        clearDraft();
        return serverDoc;
      }
      // Based on exactly this server version: these are simply unsynced edits.
      if ("baseUpdatedAt" in parsed && parsed.baseUpdatedAt === serverUpdatedAt) {
        toast.success("Restored changes that hadn't finished saving.");
        return candidate;
      }
      // The document changed on the server since this draft was made (or the
      // draft predates version tracking). Keep the server copy and let the
      // person decide, instead of silently overwriting newer work.
      toast.message("This browser has an older unsaved draft of this document.", {
        description: "The latest saved version is shown.",
        duration: 20000,
        action: {
          label: "Use my draft",
          onClick: () => setDoc((current) => applyDraft(current, parsed.doc ?? {})),
        },
      });
      clearDraft();
      return serverDoc;
    } catch {
      return serverDoc;
    }
  };

  /** Write a snapshot to the server. True only if the row really was updated. */
  const pushToServer = async (snapshot: BusinessDoc) => {
    if (!id || missing) return false;
    const { data, error } = await supabase
      .from("business_documents")
      .update(documentPayload(snapshot))
      .eq("id", id)
      .select("updated_at");
    if (error || !data?.length) return false;
    serverUpdatedAtRef.current = (data[0] as { updated_at: string }).updated_at;
    lastAutosavedRef.current = JSON.stringify(snapshot);
    if (JSON.stringify(docRef.current) === lastAutosavedRef.current) clearDraft();
    else writeDraft(docRef.current);
    return true;
  };

  useEffect(() => {
    if (!id || !user) return;
    (async () => {
      const { data, error } = await supabase
        .from("business_documents")
        .select("*")
        .eq("id", id)
        .single();
      const raw = data as unknown as Record<string, unknown> | null;
      if (error || !raw) {
        // Don't open a blank editor for a document we couldn't load: it would
        // look editable while nothing could be saved.
        setMissing(true);
        setLoaded(true);
        return;
      }
      serverUpdatedAtRef.current = typeof raw.updated_at === "string" ? raw.updated_at : null;

      const { data: brand } = await supabase
        .from("brands")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      let logoUrl: string | null = null;
      if (brand?.logo_path) {
        const { data: signed } = await supabase.storage
          .from("logos")
          .createSignedUrl(brand.logo_path, 3600);
        logoUrl = signed?.signedUrl ?? null;
      }

      const brandFromParty = brand
        ? {
            name: brand.company_name ?? "",
            address: brand.address ?? "",
            email: brand.email ?? "",
            phone: brand.phone ?? "",
            website: brand.website ?? "",
          }
        : DEFAULT_DOC.from_party;

      if (raw) {
        const items = Array.isArray(raw.items) ? (raw.items as LineItem[]) : [];
        const fromParty = {
          ...DEFAULT_DOC.from_party,
          ...((raw.from_party as object) ?? {}),
        } as Record<string, unknown>;
        const rawDoc = {
          ...DEFAULT_DOC,
          ...(raw as unknown as BusinessDoc),
          items: items.length ? items : DEFAULT_DOC.items,
          ...documentAssetsFromParty(fromParty),
          from_party: fromParty as BusinessDoc["from_party"],
          to_party: { ...DEFAULT_DOC.to_party, ...((raw.to_party as object) ?? {}) },
        };
        const shouldUseBrandPrimary =
          !rawDoc.primary_color ||
          rawDoc.primary_color === DEFAULT_DOC.primary_color ||
          rawDoc.primary_color.toLowerCase() === "#2563eb";
        const shouldUseBrandAccent =
          !rawDoc.accent_color ||
          rawDoc.accent_color === DEFAULT_DOC.accent_color ||
          rawDoc.accent_color.toLowerCase() === "#0ea5e9";
        const preparedDoc: BusinessDoc = {
          ...rawDoc,
          logo_url: rawDoc.logo_url ?? logoUrl,
          primary_color: shouldUseBrandPrimary
            ? (brand?.primary_color ?? rawDoc.primary_color)
            : rawDoc.primary_color,
          accent_color: shouldUseBrandAccent
            ? (brand?.accent_color ?? rawDoc.accent_color)
            : rawDoc.accent_color,
          terms: rawDoc.terms || DEFAULT_DOC.terms,
          // Older documents defaulted the QR to this app's private editor link,
          // which a customer can't open. Fall back to the business website.
          qr_text: isPrivateDocumentLink(rawDoc.qr_text)
            ? websiteUrl(rawDoc.from_party.website || brandFromParty.website)
            : rawDoc.qr_text || websiteUrl(rawDoc.from_party.website || brandFromParty.website),
          from_party: {
            ...rawDoc.from_party,
            name: rawDoc.from_party.name || brandFromParty.name,
            address: rawDoc.from_party.address || brandFromParty.address,
            email: rawDoc.from_party.email || brandFromParty.email,
            phone: rawDoc.from_party.phone || brandFromParty.phone,
            website: rawDoc.from_party.website || brandFromParty.website,
          },
        };
        const nextDoc = mergeStoredDraft(preparedDoc, serverUpdatedAtRef.current);
        // Compare future edits against what the server holds, so a restored
        // draft counts as unsynced and gets pushed.
        lastAutosavedRef.current = JSON.stringify(preparedDoc);
        setDoc(nextDoc);
      } else if (brand) {
        setDoc((d) => ({
          ...d,
          logo_url: logoUrl,
          primary_color: brand.primary_color ?? d.primary_color,
          accent_color: brand.accent_color ?? d.accent_color,
          from_party: brandFromParty,
        }));
      }
      setLoaded(true);
    })();
  }, [id, user]);

  const save = async ({ quiet = false }: { quiet?: boolean } = {}) => {
    if (!id) return true;
    setSaving(true);
    const ok = await pushToServer(doc);
    setSaving(false);
    if (!ok) {
      setAutosaveStatus("error");
      toast.error("Couldn't save. Check your connection and try again.");
      return false;
    }
    setLastSavedAt(new Date());
    setAutosaveStatus("saved");
    if (!quiet) toast.success("Saved");
    return true;
  };

  useEffect(() => {
    if (!loaded || missing || !id || !draftKey) return;

    if (JSON.stringify(doc) === lastAutosavedRef.current) {
      setAutosaveStatus("saved");
      return;
    }

    // Keep a local copy until the server confirms these edits.
    writeDraft(doc);
    setAutosaveStatus("saving");
    if (autosaveTimerRef.current) window.clearTimeout(autosaveTimerRef.current);

    autosaveTimerRef.current = window.setTimeout(async () => {
      const ok = await pushToServer(doc);
      if (!ok) {
        setAutosaveStatus("error");
        return;
      }
      setAutosaveStatus("saved");
      setLastSavedAt(new Date());
    }, 900);

    return () => {
      if (autosaveTimerRef.current) window.clearTimeout(autosaveTimerRef.current);
    };
    // The helpers are recreated each render; only real document changes should restart the timer.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doc, draftKey, id, loaded, missing]);

  useEffect(() => {
    if (!loaded || missing || !id || !draftKey) return;

    const persistDraftBeforeExit = () => {
      if (autosaveTimerRef.current) window.clearTimeout(autosaveTimerRef.current);
      const current = docRef.current;
      if (JSON.stringify(current) !== lastAutosavedRef.current) {
        writeDraft(current);
        void pushToServer(current);
      }
    };

    const saveOnVisibilityChange = () => {
      if (document.visibilityState === "hidden") persistDraftBeforeExit();
    };

    window.addEventListener("pagehide", persistDraftBeforeExit);
    window.addEventListener("beforeunload", persistDraftBeforeExit);
    document.addEventListener("visibilitychange", saveOnVisibilityChange);
    return () => {
      window.removeEventListener("pagehide", persistDraftBeforeExit);
      window.removeEventListener("beforeunload", persistDraftBeforeExit);
      document.removeEventListener("visibilitychange", saveOnVisibilityChange);
      // Leaving the editor inside the app (Back, nav links) fires none of the
      // events above, so flush pending edits here too.
      persistDraftBeforeExit();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftKey, id, loaded, missing]);

  useEffect(() => {
    if (autosaveStatus !== "error") return;
    const warnOnLeave = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue =
        "Your latest changes are saved in this browser, but the online draft has not synced yet.";
    };
    window.addEventListener("beforeunload", warnOnLeave);
    return () => window.removeEventListener("beforeunload", warnOnLeave);
  }, [autosaveStatus]);

  const download = async () => {
    if (!previewRef.current) return;
    setDownloading(true);
    const saved = await save({ quiet: true });
    if (!saved) {
      setDownloading(false);
      return;
    }
    try {
      await exportPdf(previewRef.current, `${doc.title || "document"}.pdf`);
      toast.success("PDF downloaded");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "PDF export failed");
    } finally {
      setDownloading(false);
    }
  };

  const duplicateCurrent = async () => {
    if (!user) return;
    setDuplicating(true);
    const copyTitle = `${doc.title || "Document"} copy`;
    const copyNumber = `${doc.doc_number || "DOC"}-COPY-${Date.now().toString().slice(-4)}`;
    const { data, error } = await supabase
      .from("business_documents")
      .insert({
        ...documentPayload({ ...doc, title: copyTitle, doc_number: copyNumber }),
        user_id: user.id,
      })
      .select("id,title,doc_number")
      .single();
    setDuplicating(false);
    if (error) return toast.error(error.message);
    toast.success("Document duplicated");
    navigate({ to: "/document/$slug", params: { slug: documentSlug(data) } });
  };
  const updateItem = (idx: number, patch: Partial<LineItem>) => {
    setDoc((d) => ({
      ...d,
      items: d.items.map((it, i) => (i === idx ? { ...it, ...patch } : it)),
    }));
  };
  const addItem = () =>
    setDoc((d) => ({
      ...d,
      items: [...d.items, { id: crypto.randomUUID(), description: "", quantity: 1, price: 0 }],
    }));
  const removeItem = (idx: number) =>
    setDoc((d) => ({ ...d, items: d.items.filter((_, i) => i !== idx) }));

  useEffect(() => {
    const shell = previewShellRef.current;
    if (!shell) return;

    const updateScale = () => {
      const width = shell.clientWidth;
      if (!width) return;
      const padding = width < 640 ? 8 : 0;
      setPreviewScale(Math.min(1, Math.max(0.36, (width - padding) / 794)));
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(shell);
    window.addEventListener("orientationchange", updateScale);
    return () => {
      observer.disconnect();
      window.removeEventListener("orientationchange", updateScale);
    };
  }, []);

  if (!loaded) return <div className="p-10 text-muted-foreground">Loading…</div>;

  if (missing) {
    return (
      <div className="ambient-bg flex min-h-screen items-start justify-center px-4 py-16">
        <div className="glass w-full max-w-md space-y-4 p-6">
          <h1 className="text-2xl">Couldn't open this document</h1>
          <p className="text-sm text-muted-foreground">
            It may have been deleted, or the connection dropped while loading. Nothing has been
            changed.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => window.location.reload()}>Try again</Button>
            <Button variant="outline" onClick={() => navigate({ to: "/documents" })}>
              Back to documents
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ambient-bg min-h-screen">
      <div className="mx-auto grid w-full max-w-7xl gap-5 px-4 py-6 sm:px-6 sm:py-8 lg:grid-cols-[minmax(320px,420px)_1fr]">
        <aside className="min-w-0 space-y-4">
          <div className="sticky top-[73px] z-20 -mx-1 bg-background p-1 sm:static sm:bg-transparent sm:p-0 ">
            <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate({ to: "/documents" })}
                className="justify-center sm:justify-start"
              >
                <ArrowLeft className="mr-1 h-4 w-4" /> Back
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => void save()}
                disabled={saving}
                className="justify-center"
              >
                <Save className="mr-1 h-4 w-4" /> {saving ? "Saving" : "Save"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={duplicateCurrent}
                disabled={duplicating || saving}
                className="justify-center"
              >
                <Copy className="mr-1 h-4 w-4" /> {duplicating ? "Copying" : "Duplicate"}
              </Button>
              <Button
                size="sm"
                onClick={download}
                disabled={saving || downloading}
                className="justify-center"
              >
                <Download className="mr-1 h-4 w-4" /> {downloading ? "PDF..." : "PDF"}
              </Button>
            </div>
            <p className="mt-2 px-1 text-center text-[11px] text-muted-foreground sm:text-left">
              {autosaveStatus === "saving"
                ? "Saving..."
                : autosaveStatus === "error"
                  ? "Offline draft saved"
                  : lastSavedAt
                    ? `Draft saved at ${lastSavedAt.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`
                    : "Draft saved locally"}
            </p>
            {autosaveStatus === "error" ? (
              <div className="mt-3 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                Your latest changes are saved in this browser, but the online copy has not synced
                yet. Keep this tab open when possible and try Save again.
              </div>
            ) : null}
          </div>

          <Section title="Document">
            <Field label="Title">
              <Input
                value={doc.title}
                onChange={(e) => setDoc({ ...doc, title: e.target.value })}
              />
            </Field>
            <div className="grid gap-2 sm:grid-cols-2">
              <Field label="Type">
                <Select
                  value={doc.doc_type}
                  onValueChange={(v) => {
                    const nextType = v as DocType;
                    setDoc({
                      ...doc,
                      doc_type: nextType,
                      template:
                        nextType === "delivery_note"
                          ? "delivery_simple"
                          : doc.template === "delivery_simple"
                            ? "modern"
                            : doc.template,
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DOC_TYPES.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Template">
                <Select
                  value={doc.template}
                  onValueChange={(v) => setDoc({ ...doc, template: v as DocTemplateId })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTemplates.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <Field label="Number">
                <Input
                  value={doc.doc_number}
                  onChange={(e) => setDoc({ ...doc, doc_number: e.target.value })}
                />
              </Field>
              <Field label="Status">
                <Select
                  value={doc.status}
                  onValueChange={(v) => setDoc({ ...doc, status: v as DocumentStatus })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DOCUMENT_STATUSES.map((status) => (
                      <SelectItem key={status.id} value={status.id}>
                        {status.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Currency">
                <Select value={doc.currency} onValueChange={(v) => setDoc({ ...doc, currency: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <Field label="Issue date">
                <Input
                  type="date"
                  value={doc.issue_date ?? ""}
                  onChange={(e) => setDoc({ ...doc, issue_date: e.target.value })}
                />
              </Field>
              <Field label="Due date">
                <Input
                  type="date"
                  value={doc.due_date ?? ""}
                  onChange={(e) => setDoc({ ...doc, due_date: e.target.value })}
                />
              </Field>
            </div>
          </Section>
          <Section title="Brand & from details">
            <div className="rounded-lg border-2 border-[var(--nb-ink)] bg-background p-3 text-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 space-y-1">
                  <p className="font-medium text-foreground">
                    {doc.from_party.name || "Saved brand details"}
                  </p>
                  <p className="whitespace-pre-line text-xs text-muted-foreground">
                    {[doc.from_party.email, doc.from_party.phone, doc.from_party.website]
                      .filter(Boolean)
                      .join(" / ") || "Brand contact details will be used by default."}
                  </p>
                  {doc.from_party.address ? (
                    <p className="whitespace-pre-line text-xs text-muted-foreground">
                      {doc.from_party.address}
                    </p>
                  ) : null}
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setEditingBrandDetails((value) => !value)}
                >
                  {editingBrandDetails ? "Done" : "Edit"}
                </Button>
              </div>
              <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-2">
                  <span
                    className="h-4 w-4 rounded-full border"
                    style={{ backgroundColor: doc.primary_color }}
                  />{" "}
                  Primary
                </span>
                <span className="inline-flex items-center gap-2">
                  <span
                    className="h-4 w-4 rounded-full border"
                    style={{ backgroundColor: doc.accent_color }}
                  />{" "}
                  Accent
                </span>
              </div>
            </div>

            {editingBrandDetails ? (
              <div className="space-y-2">
                <div className="grid gap-2 sm:grid-cols-2">
                  <Field label="Primary color">
                    <Input
                      type="color"
                      value={doc.primary_color}
                      onChange={(e) => setDoc({ ...doc, primary_color: e.target.value })}
                    />
                  </Field>
                  <Field label="Accent color">
                    <Input
                      type="color"
                      value={doc.accent_color}
                      onChange={(e) => setDoc({ ...doc, accent_color: e.target.value })}
                    />
                  </Field>
                </div>
                <Input
                  placeholder="Company name"
                  value={doc.from_party.name}
                  onChange={(e) =>
                    setDoc({ ...doc, from_party: { ...doc.from_party, name: e.target.value } })
                  }
                />
                <Textarea
                  placeholder="Address"
                  value={doc.from_party.address}
                  onChange={(e) =>
                    setDoc({ ...doc, from_party: { ...doc.from_party, address: e.target.value } })
                  }
                />
                <div className="grid gap-2 sm:grid-cols-2">
                  <Input
                    placeholder="Email"
                    value={doc.from_party.email}
                    onChange={(e) =>
                      setDoc({ ...doc, from_party: { ...doc.from_party, email: e.target.value } })
                    }
                  />
                  <Input
                    placeholder="Phone"
                    value={doc.from_party.phone}
                    onChange={(e) =>
                      setDoc({ ...doc, from_party: { ...doc.from_party, phone: e.target.value } })
                    }
                  />
                </div>
                <Input
                  placeholder="Website"
                  value={doc.from_party.website ?? ""}
                  onChange={(e) =>
                    setDoc({ ...doc, from_party: { ...doc.from_party, website: e.target.value } })
                  }
                />
              </div>
            ) : null}
          </Section>

          <Section title="Client / customer">
            <Field label="Client name">
              <Input
                placeholder="Client or customer name"
                value={doc.to_party.name}
                onChange={(e) =>
                  setDoc({ ...doc, to_party: { ...doc.to_party, name: e.target.value } })
                }
              />
            </Field>
            <Field label="Client address">
              <Textarea
                placeholder="Address"
                value={doc.to_party.address}
                onChange={(e) =>
                  setDoc({ ...doc, to_party: { ...doc.to_party, address: e.target.value } })
                }
              />
            </Field>
            <div className="grid gap-2 sm:grid-cols-2">
              <Field label="Email">
                <Input
                  placeholder="Email"
                  value={doc.to_party.email}
                  onChange={(e) =>
                    setDoc({ ...doc, to_party: { ...doc.to_party, email: e.target.value } })
                  }
                />
              </Field>
              <Field label="Phone">
                <Input
                  placeholder="Phone"
                  value={doc.to_party.phone}
                  onChange={(e) =>
                    setDoc({ ...doc, to_party: { ...doc.to_party, phone: e.target.value } })
                  }
                />
              </Field>
            </div>
          </Section>

          <Section title="Line items">
            <div className="space-y-2">
              {doc.items.map((it, i) => (
                <div key={it.id} className="grid gap-1.5 sm:grid-cols-[1fr_60px_80px_28px]">
                  <Input
                    placeholder="Description"
                    value={it.description}
                    onChange={(e) => updateItem(i, { description: e.target.value })}
                  />
                  <Input
                    type="number"
                    min={0}
                    value={it.quantity}
                    onChange={(e) => updateItem(i, { quantity: Number(e.target.value) })}
                  />
                  <Input
                    type="number"
                    min={0}
                    step="0.01"
                    value={it.price}
                    onChange={(e) => updateItem(i, { price: Number(e.target.value) })}
                  />
                  <Button variant="ghost" size="icon" onClick={() => removeItem(i)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
              <Button size="sm" variant="outline" onClick={addItem}>
                <Plus className="mr-1 h-4 w-4" /> Add item
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Field label="Tax %">
                <Input
                  type="number"
                  min={0}
                  value={doc.tax_rate}
                  onChange={(e) => setDoc({ ...doc, tax_rate: Number(e.target.value) })}
                />
              </Field>
              <Field label="Discount">
                <Input
                  type="number"
                  min={0}
                  value={doc.discount}
                  onChange={(e) => setDoc({ ...doc, discount: Number(e.target.value) })}
                />
              </Field>
            </div>
          </Section>
          <Section title="Notes & fixed terms">
            <Textarea
              placeholder="Notes"
              value={doc.notes}
              onChange={(e) => setDoc({ ...doc, notes: e.target.value })}
            />
            <Field label="Terms & conditions">
              <Textarea
                placeholder="Terms & conditions"
                value={doc.terms}
                onChange={(e) => setDoc({ ...doc, terms: e.target.value })}
              />
            </Field>
            <div className="rounded-lg border-2 border-[var(--nb-ink)] bg-background p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Label className="text-xs">Company stamp</Label>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Optional image shown near the signature.
                  </p>
                </div>
                <label className="flex items-center gap-2 text-xs text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={doc.show_company_stamp}
                    onChange={(e) => setDoc({ ...doc, show_company_stamp: e.target.checked })}
                    className="h-4 w-4 rounded border-border accent-primary"
                  />
                  Use
                </label>
              </div>
              <DocumentImageUpload
                value={doc.company_stamp_data}
                onChange={(value) =>
                  setDoc({
                    ...doc,
                    company_stamp_data: value,
                    show_company_stamp: !!value || doc.show_company_stamp,
                  })
                }
                label="company stamp"
              />
            </div>
            <div className="rounded-lg border-2 border-[var(--nb-ink)] bg-background p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Label className="text-xs">QR code</Label>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Optional. Use a link your customer can open, such as your website or a payment
                    page.
                  </p>
                </div>
                <label className="flex items-center gap-2 text-xs text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={doc.show_qr}
                    onChange={(e) => setDoc({ ...doc, show_qr: e.target.checked })}
                    className="h-4 w-4 rounded border-border accent-primary"
                  />
                  Use
                </label>
              </div>
              <Input
                className="mt-2"
                placeholder="QR link or text"
                value={doc.qr_text}
                onChange={(e) => setDoc({ ...doc, qr_text: e.target.value })}
              />
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <Input
                placeholder="Signed by"
                value={doc.signature_name}
                onChange={(e) => setDoc({ ...doc, signature_name: e.target.value })}
              />
              <Input
                placeholder="Title"
                value={doc.signature_title}
                onChange={(e) => setDoc({ ...doc, signature_title: e.target.value })}
              />
            </div>
          </Section>
        </aside>

        <main className="min-w-0 glass p-2 sm:p-6">
          <div ref={previewShellRef} className="w-full overflow-x-auto overflow-y-hidden">
            <div className="mx-auto" style={{ width: 794 * previewScale }}>
              <DocumentPreview ref={previewRef} doc={doc} scale={previewScale} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl glass p-4 space-y-2">
      <h3 className="text-sm font-semibold">{title}</h3>
      {children}
    </div>
  );
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <Label className="text-xs">{label}</Label>
      {children}
    </div>
  );
}

/** True for links into this app's sign-in-only document editor. */
function isPrivateDocumentLink(value: string | null | undefined) {
  return /^https?:\/\/[^/]+\/document(-editor)?[/?]/i.test((value ?? "").trim());
}

function websiteUrl(value: string | null | undefined) {
  const site = (value ?? "").trim();
  if (!site) return "";
  return /^https?:\/\//i.test(site) ? site : `https://${site}`;
}

function DocumentImageUpload({
  value,
  onChange,
  label,
}: {
  value: string | null | undefined;
  onChange: (dataUrl: string | null) => void;
  label: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  const onUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="mt-3 space-y-2">
      {value ? (
        <div className="flex items-center gap-3 rounded-md border bg-white p-2">
          <img src={value} alt={label} className="h-16 max-w-32 object-contain" />
          <Button type="button" size="sm" variant="ghost" onClick={() => onChange(null)}>
            <Eraser className="mr-1 h-3 w-3" /> Clear
          </Button>
        </div>
      ) : null}
      <input
        ref={fileRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])}
      />
      <Button type="button" size="sm" variant="outline" onClick={() => fileRef.current?.click()}>
        <Upload className="mr-1 h-3 w-3" /> Upload {label}
      </Button>
    </div>
  );
}
