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
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, Save, Download, Plus, Trash2, Copy } from "lucide-react";
import { DocumentPreview } from "@/components/documents/DocumentPreview";
import {
  DOC_TYPES, DOC_TEMPLATES, DEFAULT_DOC, CURRENCIES,
  type BusinessDoc, type DocType, type DocTemplateId, type LineItem,
} from "@/lib/documents/types";
import { exportPdf } from "@/lib/letterhead/pdf-export";
import { documentSlug } from "@/lib/documents/slug";

const searchSchema = z.object({ id: z.string().optional() });

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
  const [autosaveStatus, setAutosaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [editingBrandDetails, setEditingBrandDetails] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const lastAutosavedRef = useRef("");
  const autosaveTimerRef = useRef<number | null>(null);
  const draftKey = id ? `zuridoc:business-document-draft:${id}` : null;
  const availableTemplates = DOC_TEMPLATES.filter((template) =>
    doc.doc_type === "delivery_note" ? true : template.id !== "delivery_simple",
  );


  const documentPayload = (currentDoc: BusinessDoc) => ({
    doc_type: currentDoc.doc_type,
    doc_number: currentDoc.doc_number,
    title: currentDoc.title,
    template: currentDoc.template,
    issue_date: currentDoc.issue_date,
    due_date: currentDoc.due_date,
    currency: currentDoc.currency,
    from_party: currentDoc.from_party,
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
    status: "draft",
  });

  const mergeStoredDraft = (serverDoc: BusinessDoc, serverUpdatedAt?: unknown) => {
    if (!draftKey) return serverDoc;
    try {
      const stored = window.localStorage.getItem(draftKey);
      if (!stored) return serverDoc;
      const parsed = JSON.parse(stored) as { updatedAt?: string; doc?: Partial<BusinessDoc> };
      if (!parsed.doc || !parsed.updatedAt) return serverDoc;
      const localTime = new Date(parsed.updatedAt).getTime();
      const serverTime = typeof serverUpdatedAt === "string" ? new Date(serverUpdatedAt).getTime() : 0;
      if (!Number.isFinite(localTime) || localTime <= serverTime) return serverDoc;
      toast.success("Restored your latest draft.");
      return {
        ...serverDoc,
        ...parsed.doc,
        from_party: { ...serverDoc.from_party, ...(parsed.doc.from_party ?? {}) },
        to_party: { ...serverDoc.to_party, ...(parsed.doc.to_party ?? {}) },
        items: parsed.doc.items?.length ? parsed.doc.items : serverDoc.items,
      };
    } catch {
      return serverDoc;
    }
  };

  useEffect(() => {
    if (!id || !user) return;
    (async () => {
      const { data, error } = await supabase
        .from("business_documents").select("*").eq("id", id).single();
      if (error) toast.error(error.message);
      const raw = data as unknown as Record<string, unknown> | null;

      const { data: brand } = await supabase.from("brands").select("*").eq("user_id", user.id).maybeSingle();
      let logoUrl: string | null = null;
      if (brand?.logo_path) {
        const { data: signed } = await supabase.storage.from("logos").createSignedUrl(brand.logo_path, 3600);
        logoUrl = signed?.signedUrl ?? null;
      }

      const brandFromParty = brand ? {
        name: brand.company_name ?? "",
        address: brand.address ?? "",
        email: brand.email ?? "",
        phone: brand.phone ?? "",
        website: brand.website ?? "",
      } : DEFAULT_DOC.from_party;

      if (raw) {
        const items = Array.isArray(raw.items) ? (raw.items as LineItem[]) : [];
        const rawDoc = {
          ...DEFAULT_DOC,
          ...(raw as unknown as BusinessDoc),
          items: items.length ? items : DEFAULT_DOC.items,
          from_party: { ...DEFAULT_DOC.from_party, ...((raw.from_party as object) ?? {}) },
          to_party: { ...DEFAULT_DOC.to_party, ...((raw.to_party as object) ?? {}) },
        };
        const shouldUseBrandPrimary = !rawDoc.primary_color || rawDoc.primary_color === DEFAULT_DOC.primary_color || rawDoc.primary_color.toLowerCase() === "#2563eb";
        const shouldUseBrandAccent = !rawDoc.accent_color || rawDoc.accent_color === DEFAULT_DOC.accent_color || rawDoc.accent_color.toLowerCase() === "#0ea5e9";
        const nextDoc = mergeStoredDraft({
          ...rawDoc,
          logo_url: rawDoc.logo_url ?? logoUrl,
          primary_color: shouldUseBrandPrimary ? brand?.primary_color ?? rawDoc.primary_color : rawDoc.primary_color,
          accent_color: shouldUseBrandAccent ? brand?.accent_color ?? rawDoc.accent_color : rawDoc.accent_color,
          terms: rawDoc.terms || DEFAULT_DOC.terms,
          from_party: {
            ...rawDoc.from_party,
            name: rawDoc.from_party.name || brandFromParty.name,
            address: rawDoc.from_party.address || brandFromParty.address,
            email: rawDoc.from_party.email || brandFromParty.email,
            phone: rawDoc.from_party.phone || brandFromParty.phone,
            website: rawDoc.from_party.website || brandFromParty.website,
          },
        }, raw.updated_at);
        lastAutosavedRef.current = JSON.stringify(nextDoc);
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
    const { error } = await supabase.from("business_documents").update(documentPayload(doc)).eq("id", id);
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return false;
    }
    const savedAt = new Date();
    setLastSavedAt(savedAt);
    setAutosaveStatus("saved");
    lastAutosavedRef.current = JSON.stringify(doc);
    if (!quiet) toast.success("Saved");
    return true;
  };

  useEffect(() => {
    if (!loaded || !id || !draftKey) return;

    const serialized = JSON.stringify(doc);
    const updatedAt = new Date().toISOString();
    window.localStorage.setItem(draftKey, JSON.stringify({ updatedAt, doc }));

    if (serialized === lastAutosavedRef.current) {
      setAutosaveStatus("saved");
      return;
    }

    setAutosaveStatus("saving");
    if (autosaveTimerRef.current) window.clearTimeout(autosaveTimerRef.current);

    autosaveTimerRef.current = window.setTimeout(async () => {
      const snapshot = doc;
      const snapshotJson = JSON.stringify(snapshot);
      const { error } = await supabase.from("business_documents").update(documentPayload(snapshot)).eq("id", id);
      if (error) {
        setAutosaveStatus("error");
        return;
      }
      lastAutosavedRef.current = snapshotJson;
      setAutosaveStatus("saved");
      setLastSavedAt(new Date());
      setLastSavedAt(new Date());
      window.localStorage.setItem(draftKey, JSON.stringify({ updatedAt: new Date().toISOString(), doc: snapshot }));
    }, 900);

    return () => {
      if (autosaveTimerRef.current) window.clearTimeout(autosaveTimerRef.current);
    };
  }, [doc, draftKey, id, loaded]);

  useEffect(() => {
    if (!loaded || !id || !draftKey) return;

    const persistDraftBeforeExit = () => {
      window.localStorage.setItem(draftKey, JSON.stringify({ updatedAt: new Date().toISOString(), doc }));
      if (autosaveTimerRef.current) window.clearTimeout(autosaveTimerRef.current);
      if (JSON.stringify(doc) !== lastAutosavedRef.current) {
        void supabase.from("business_documents").update(documentPayload(doc)).eq("id", id);
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
    };
  }, [doc, draftKey, id, loaded]);

  useEffect(() => {
    if (autosaveStatus !== "error") return;
    const warnOnLeave = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "Your latest changes are saved in this browser, but the online draft has not synced yet.";
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
      .insert({ ...documentPayload({ ...doc, title: copyTitle, doc_number: copyNumber }), user_id: user.id })
      .select("id,title,doc_number")
      .single();
    setDuplicating(false);
    if (error) return toast.error(error.message);
    toast.success("Document duplicated");
    navigate({ to: "/document/$slug", params: { slug: documentSlug(data) } });
  };
  const updateItem = (idx: number, patch: Partial<LineItem>) => {
    setDoc((d) => ({ ...d, items: d.items.map((it, i) => (i === idx ? { ...it, ...patch } : it)) }));
  };
  const addItem = () => setDoc((d) => ({
    ...d, items: [...d.items, { id: crypto.randomUUID(), description: "", quantity: 1, price: 0 }],
  }));
  const removeItem = (idx: number) =>
    setDoc((d) => ({ ...d, items: d.items.filter((_, i) => i !== idx) }));

  if (!loaded) return <div className="p-10 text-muted-foreground">Loading…</div>;

  return (
    <div className="ambient-bg min-h-screen">
      <div className="mx-auto grid w-full max-w-7xl gap-5 px-4 py-6 sm:px-6 sm:py-8 lg:grid-cols-[minmax(320px,420px)_1fr]">
        <aside className="space-y-4">
          <div className="sticky top-[73px] z-20 -mx-1 rounded-xl bg-background/90 p-1 backdrop-blur sm:static sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
            <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:justify-between">
              <Button variant="ghost" size="sm" onClick={() => navigate({ to: "/documents" })} className="justify-center sm:justify-start">
                <ArrowLeft className="mr-1 h-4 w-4" /> Back
              </Button>
              <Button size="sm" variant="outline" onClick={() => void save()} disabled={saving} className="justify-center">
                <Save className="mr-1 h-4 w-4" /> {saving ? "Saving" : "Save"}
              </Button>
              <Button size="sm" variant="outline" onClick={duplicateCurrent} disabled={duplicating || saving} className="justify-center">
                <Copy className="mr-1 h-4 w-4" /> {duplicating ? "Copying" : "Duplicate"}
              </Button>
              <Button size="sm" onClick={download} disabled={saving || downloading} className="justify-center">
                <Download className="mr-1 h-4 w-4" /> {downloading ? "PDF..." : "PDF"}
              </Button>
            </div>
            <p className="mt-2 px-1 text-center text-[11px] text-muted-foreground sm:text-left">
              {autosaveStatus === "saving" ? "Saving..." : autosaveStatus === "error" ? "Offline draft saved" : lastSavedAt ? `Draft saved at ${lastSavedAt.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}` : "Draft saved locally"}
            </p>
          </div>

          <Section title="Document">
            <Field label="Title">
              <Input value={doc.title} onChange={(e) => setDoc({ ...doc, title: e.target.value })} />
            </Field>
            <div className="grid gap-2 sm:grid-cols-2">
              <Field label="Type">
                <Select value={doc.doc_type} onValueChange={(v) => {
                  const nextType = v as DocType;
                  setDoc({
                    ...doc,
                    doc_type: nextType,
                    template: nextType === "delivery_note" ? "delivery_simple" : doc.template === "delivery_simple" ? "modern" : doc.template,
                  });
                }}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {DOC_TYPES.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Template">
                <Select value={doc.template} onValueChange={(v) => setDoc({ ...doc, template: v as DocTemplateId })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {availableTemplates.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <Field label="Number"><Input value={doc.doc_number} onChange={(e) => setDoc({ ...doc, doc_number: e.target.value })} /></Field>
              <Field label="Currency">
                <Select value={doc.currency} onValueChange={(v) => setDoc({ ...doc, currency: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CURRENCIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <Field label="Issue date"><Input type="date" value={doc.issue_date ?? ""} onChange={(e) => setDoc({ ...doc, issue_date: e.target.value })} /></Field>
              <Field label="Due date"><Input type="date" value={doc.due_date ?? ""} onChange={(e) => setDoc({ ...doc, due_date: e.target.value })} /></Field>
            </div>
          </Section>
          <Section title="Brand & from details">
            <div className="rounded-lg border border-border/70 bg-background/60 p-3 text-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 space-y-1">
                  <p className="font-medium text-foreground">{doc.from_party.name || "Saved brand details"}</p>
                  <p className="whitespace-pre-line text-xs text-muted-foreground">
                    {[doc.from_party.email, doc.from_party.phone, doc.from_party.website].filter(Boolean).join(" / ") || "Brand contact details will be used by default."}
                  </p>
                  {doc.from_party.address ? <p className="whitespace-pre-line text-xs text-muted-foreground">{doc.from_party.address}</p> : null}
                </div>
                <Button type="button" size="sm" variant="outline" onClick={() => setEditingBrandDetails((value) => !value)}>
                  {editingBrandDetails ? "Done" : "Edit"}
                </Button>
              </div>
              <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-2"><span className="h-4 w-4 rounded-full border" style={{ backgroundColor: doc.primary_color }} /> Primary</span>
                <span className="inline-flex items-center gap-2"><span className="h-4 w-4 rounded-full border" style={{ backgroundColor: doc.accent_color }} /> Accent</span>
              </div>
            </div>

            {editingBrandDetails ? (
              <div className="space-y-2">
                <div className="grid gap-2 sm:grid-cols-2">
                  <Field label="Primary color"><Input type="color" value={doc.primary_color} onChange={(e) => setDoc({ ...doc, primary_color: e.target.value })} /></Field>
                  <Field label="Accent color"><Input type="color" value={doc.accent_color} onChange={(e) => setDoc({ ...doc, accent_color: e.target.value })} /></Field>
                </div>
                <Input placeholder="Company name" value={doc.from_party.name} onChange={(e) => setDoc({ ...doc, from_party: { ...doc.from_party, name: e.target.value } })} />
                <Textarea placeholder="Address" value={doc.from_party.address} onChange={(e) => setDoc({ ...doc, from_party: { ...doc.from_party, address: e.target.value } })} />
                <div className="grid gap-2 sm:grid-cols-2">
                  <Input placeholder="Email" value={doc.from_party.email} onChange={(e) => setDoc({ ...doc, from_party: { ...doc.from_party, email: e.target.value } })} />
                  <Input placeholder="Phone" value={doc.from_party.phone} onChange={(e) => setDoc({ ...doc, from_party: { ...doc.from_party, phone: e.target.value } })} />
                </div>
                <Input placeholder="Website" value={doc.from_party.website ?? ""} onChange={(e) => setDoc({ ...doc, from_party: { ...doc.from_party, website: e.target.value } })} />
              </div>
            ) : null}
          </Section>

          <Section title="To">
            <Input placeholder="Recipient name" value={doc.to_party.name} onChange={(e) => setDoc({ ...doc, to_party: { ...doc.to_party, name: e.target.value } })} />
            <Textarea placeholder="Address" value={doc.to_party.address} onChange={(e) => setDoc({ ...doc, to_party: { ...doc.to_party, address: e.target.value } })} />
            <div className="grid gap-2 sm:grid-cols-2">
              <Input placeholder="Email" value={doc.to_party.email} onChange={(e) => setDoc({ ...doc, to_party: { ...doc.to_party, email: e.target.value } })} />
              <Input placeholder="Phone" value={doc.to_party.phone} onChange={(e) => setDoc({ ...doc, to_party: { ...doc.to_party, phone: e.target.value } })} />
            </div>
          </Section>

          <Section title="Line items">
            <div className="space-y-2">
              {doc.items.map((it, i) => (
                <div key={it.id} className="grid gap-1.5 sm:grid-cols-[1fr_60px_80px_28px]">
                  <Input placeholder="Description" value={it.description} onChange={(e) => updateItem(i, { description: e.target.value })} />
                  <Input type="number" min={0} value={it.quantity} onChange={(e) => updateItem(i, { quantity: Number(e.target.value) })} />
                  <Input type="number" min={0} step="0.01" value={it.price} onChange={(e) => updateItem(i, { price: Number(e.target.value) })} />
                  <Button variant="ghost" size="icon" onClick={() => removeItem(i)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              ))}
              <Button size="sm" variant="outline" onClick={addItem}><Plus className="mr-1 h-4 w-4" /> Add item</Button>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Field label="Tax %"><Input type="number" min={0} value={doc.tax_rate} onChange={(e) => setDoc({ ...doc, tax_rate: Number(e.target.value) })} /></Field>
              <Field label="Discount"><Input type="number" min={0} value={doc.discount} onChange={(e) => setDoc({ ...doc, discount: Number(e.target.value) })} /></Field>
            </div>
          </Section>
          <Section title="Notes & fixed terms">
            <Textarea placeholder="Notes" value={doc.notes} onChange={(e) => setDoc({ ...doc, notes: e.target.value })} />
            <div className="rounded-lg border border-border/70 bg-background/60 p-3 text-sm">
              <Label className="text-xs">Terms & conditions</Label>
              <p className="mt-1 whitespace-pre-line text-muted-foreground">{doc.terms || DEFAULT_DOC.terms}</p>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <Input placeholder="Signed by" value={doc.signature_name} onChange={(e) => setDoc({ ...doc, signature_name: e.target.value })} />
              <Input placeholder="Title" value={doc.signature_title} onChange={(e) => setDoc({ ...doc, signature_title: e.target.value })} />
            </div>
          </Section>
        </aside>

        <main className="overflow-auto rounded-2xl glass p-6">
          <div className="mx-auto" style={{ width: 794 }}>
            <DocumentPreview ref={previewRef} doc={doc} />
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




