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
import { ArrowLeft, Save, Download, Plus, Trash2 } from "lucide-react";
import { DocumentPreview } from "@/components/documents/DocumentPreview";
import {
  DOC_TYPES, DOC_TEMPLATES, DEFAULT_DOC, CURRENCIES,
  type BusinessDoc, type DocType, type DocTemplateId, type LineItem,
} from "@/lib/documents/types";
import { exportPdf } from "@/lib/letterhead/pdf-export";

const searchSchema = z.object({ id: z.string().optional() });

export const Route = createFileRoute("/_authenticated/document-editor")({
  validateSearch: searchSchema,
  component: DocumentEditor,
  head: () => ({ meta: [{ title: "Document editor — Letterly" }] }),
});

function DocumentEditor() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = Route.useSearch();
  const [doc, setDoc] = useState<BusinessDoc>(DEFAULT_DOC);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id || !user) return;
    (async () => {
      const { data, error } = await supabase
        .from("business_documents").select("*").eq("id", id).single();
      if (error) toast.error(error.message);
      const raw = data as unknown as Record<string, unknown> | null;
      if (raw) {
        const items = Array.isArray(raw.items) ? (raw.items as LineItem[]) : [];
        setDoc({
          ...DEFAULT_DOC,
          ...(raw as unknown as BusinessDoc),
          items: items.length ? items : DEFAULT_DOC.items,
          from_party: { ...DEFAULT_DOC.from_party, ...((raw.from_party as object) ?? {}) },
          to_party: { ...DEFAULT_DOC.to_party, ...((raw.to_party as object) ?? {}) },
        });
      }
      // load brand for logo + defaults
      const { data: brand } = await supabase.from("brands").select("*").eq("user_id", user.id).maybeSingle();
      let logoUrl: string | null = null;
      if (brand?.logo_path) {
        const { data: signed } = await supabase.storage.from("logos").createSignedUrl(brand.logo_path, 3600);
        logoUrl = signed?.signedUrl ?? null;
      }
      if (brand && !raw) {
        setDoc((d) => ({
          ...d,
          logo_url: logoUrl,
          primary_color: brand.primary_color ?? d.primary_color,
          accent_color: brand.accent_color ?? d.accent_color,
          from_party: {
            name: brand.company_name ?? "",
            address: brand.address ?? "",
            email: brand.email ?? "",
            phone: brand.phone ?? "",
          },
        }));
      } else if (brand && raw) {
        setDoc((d) => ({ ...d, logo_url: d.logo_url ?? logoUrl }));
      }
      setLoaded(true);
    })();
  }, [id, user]);

  const save = async () => {
    if (!id) return;
    setSaving(true);
    const { error } = await supabase.from("business_documents").update({
      doc_type: doc.doc_type,
      doc_number: doc.doc_number,
      title: doc.title,
      template: doc.template,
      issue_date: doc.issue_date,
      due_date: doc.due_date,
      currency: doc.currency,
      from_party: doc.from_party,
      to_party: doc.to_party,
      items: doc.items,
      tax_rate: doc.tax_rate,
      discount: doc.discount,
      notes: doc.notes,
      terms: doc.terms,
      primary_color: doc.primary_color,
      accent_color: doc.accent_color,
      signature_name: doc.signature_name,
      signature_title: doc.signature_title,
    }).eq("id", id);
    setSaving(false);
    if (error) toast.error(error.message); else toast.success("Saved");
  };

  const download = async () => {
    if (!previewRef.current) return;
    await exportPdf(previewRef.current, `${doc.title || "document"}.pdf`);
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
      <div className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[420px_1fr]">
        <aside className="space-y-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => navigate({ to: "/documents" })}>
              <ArrowLeft className="mr-1 h-4 w-4" /> Back
            </Button>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={save} disabled={saving}>
                <Save className="mr-1 h-4 w-4" /> {saving ? "Saving…" : "Save"}
              </Button>
              <Button size="sm" onClick={download}>
                <Download className="mr-1 h-4 w-4" /> PDF
              </Button>
            </div>
          </div>

          <Section title="Document">
            <Field label="Title">
              <Input value={doc.title} onChange={(e) => setDoc({ ...doc, title: e.target.value })} />
            </Field>
            <div className="grid grid-cols-2 gap-2">
              <Field label="Type">
                <Select value={doc.doc_type} onValueChange={(v) => setDoc({ ...doc, doc_type: v as DocType })}>
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
                    {DOC_TEMPLATES.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-2">
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
            <div className="grid grid-cols-2 gap-2">
              <Field label="Issue date"><Input type="date" value={doc.issue_date ?? ""} onChange={(e) => setDoc({ ...doc, issue_date: e.target.value })} /></Field>
              <Field label="Due date"><Input type="date" value={doc.due_date ?? ""} onChange={(e) => setDoc({ ...doc, due_date: e.target.value })} /></Field>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Field label="Primary color"><Input type="color" value={doc.primary_color} onChange={(e) => setDoc({ ...doc, primary_color: e.target.value })} /></Field>
              <Field label="Accent color"><Input type="color" value={doc.accent_color} onChange={(e) => setDoc({ ...doc, accent_color: e.target.value })} /></Field>
            </div>
          </Section>

          <Section title="From">
            <Input placeholder="Company name" value={doc.from_party.name} onChange={(e) => setDoc({ ...doc, from_party: { ...doc.from_party, name: e.target.value } })} />
            <Textarea placeholder="Address" value={doc.from_party.address} onChange={(e) => setDoc({ ...doc, from_party: { ...doc.from_party, address: e.target.value } })} />
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="Email" value={doc.from_party.email} onChange={(e) => setDoc({ ...doc, from_party: { ...doc.from_party, email: e.target.value } })} />
              <Input placeholder="Phone" value={doc.from_party.phone} onChange={(e) => setDoc({ ...doc, from_party: { ...doc.from_party, phone: e.target.value } })} />
            </div>
          </Section>

          <Section title="To">
            <Input placeholder="Recipient name" value={doc.to_party.name} onChange={(e) => setDoc({ ...doc, to_party: { ...doc.to_party, name: e.target.value } })} />
            <Textarea placeholder="Address" value={doc.to_party.address} onChange={(e) => setDoc({ ...doc, to_party: { ...doc.to_party, address: e.target.value } })} />
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="Email" value={doc.to_party.email} onChange={(e) => setDoc({ ...doc, to_party: { ...doc.to_party, email: e.target.value } })} />
              <Input placeholder="Phone" value={doc.to_party.phone} onChange={(e) => setDoc({ ...doc, to_party: { ...doc.to_party, phone: e.target.value } })} />
            </div>
          </Section>

          <Section title="Line items">
            <div className="space-y-2">
              {doc.items.map((it, i) => (
                <div key={it.id} className="grid grid-cols-[1fr_60px_80px_28px] gap-1.5">
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

          <Section title="Notes & terms">
            <Textarea placeholder="Notes" value={doc.notes} onChange={(e) => setDoc({ ...doc, notes: e.target.value })} />
            <Textarea placeholder="Terms & conditions" value={doc.terms} onChange={(e) => setDoc({ ...doc, terms: e.target.value })} />
            <div className="grid grid-cols-2 gap-2">
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