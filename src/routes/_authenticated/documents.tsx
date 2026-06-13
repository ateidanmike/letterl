import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Copy, Download, Edit, FilePlus2, FileText, Pencil, Plus, Receipt, Trash2, FileSpreadsheet, Truck } from "lucide-react";
import { toast } from "sonner";
import {
  DOC_TYPES,
  DEFAULT_DOC,
  calcTotals,
  formatMoney,
  type BusinessDoc,
  type DocType,
  type LineItem,
} from "@/lib/documents/types";
import { DocumentPreview } from "@/components/documents/DocumentPreview";
import { documentSlug } from "@/lib/documents/slug";
import { exportPdf } from "@/lib/letterhead/pdf-export";

export const Route = createFileRoute("/_authenticated/documents")({
  component: DocumentsPage,
  head: () => ({ meta: [{ title: "Business documents - Zuridoc" }] }),
});

type Row = { id: string; title: string; doc_type: DocType; doc_number: string; updated_at: string; status: string };

const TYPE_ICON: Record<DocType, typeof FileText> = {
  invoice: FileText,
  receipt: Receipt,
  quotation: FileSpreadsheet,
  delivery_note: Truck,
};

function companyPrefix(companyName?: string | null) {
  const compact = (companyName ?? "").toUpperCase().replace(/[^A-Z0-9]/g, "");
  return (compact || "DOC").slice(0, 8);
}

function localDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}

async function nextDocumentNumber(userId: string) {
  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const end = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
  const dateKey = localDateKey(today);

  const [{ data: brand }, { data: docs, error }] = await Promise.all([
    supabase.from("brands").select("company_name").eq("user_id", userId).maybeSingle(),
    supabase
      .from("business_documents")
      .select("doc_number")
      .eq("user_id", userId)
      .gte("created_at", start.toISOString())
      .lt("created_at", end.toISOString()),
  ]);

  if (error) throw error;

  const prefix = companyPrefix(brand?.company_name);
  const maxSequence = ((docs as { doc_number: string }[] | null) ?? []).reduce((max, doc) => {
    const match = doc.doc_number?.match(new RegExp(`^[A-Z0-9]+-${dateKey}-(\\d+)$`));
    return match ? Math.max(max, Number(match[1])) : max;
  }, 0);

  return `${prefix}-${dateKey}-${String(maxSequence + 1).padStart(4, "0")}`;
}

function normalizeDocument(raw: Record<string, unknown>): BusinessDoc {
  const items = Array.isArray(raw.items) ? (raw.items as LineItem[]) : [];
  return {
    ...DEFAULT_DOC,
    ...(raw as unknown as BusinessDoc),
    items: items.length ? items : DEFAULT_DOC.items,
    from_party: { ...DEFAULT_DOC.from_party, ...((raw.from_party as object) ?? {}) },
    to_party: { ...DEFAULT_DOC.to_party, ...((raw.to_party as object) ?? {}) },
  };
}

function DocumentsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<DocType | "all">("all");
  const [downloadDoc, setDownloadDoc] = useState<BusinessDoc | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [receiptingId, setReceiptingId] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const load = async () => {
    const { data, error } = await supabase
      .from("business_documents")
      .select("id,title,doc_type,doc_number,updated_at,status")
      .order("updated_at", { ascending: false });
    if (error) toast.error(error.message);
    else setRows((data as Row[]) ?? []);
    setLoading(false);
  };
  useEffect(() => { if (user) load(); }, [user]);

  useEffect(() => {
    if (!downloadDoc || !previewRef.current) return;
    const filename = `${downloadDoc.title || "document"}.pdf`;
    exportPdf(previewRef.current, filename)
      .catch((error) => toast.error(error instanceof Error ? error.message : "PDF export failed"))
      .finally(() => {
        setDownloadDoc(null);
        setDownloadingId(null);
      });
  }, [downloadDoc]);

  const create = async (doc_type: DocType) => {
    const meta = DOC_TYPES.find((t) => t.id === doc_type)!;
    let docNumber = DEFAULT_DOC.doc_number;
    try {
      docNumber = await nextDocumentNumber(user!.id);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not generate document number");
      return;
    }

    const { data, error } = await supabase
      .from("business_documents")
      .insert({
        user_id: user!.id,
        doc_type,
        title: `New ${meta.name}`,
        doc_number: docNumber,
      })
      .select("id,title,doc_number").single();
    if (error) return toast.error(error.message);
    navigate({ to: "/document/$slug", params: { slug: documentSlug(data) } });
  };

  const fetchDocument = async (id: string) => {
    const { data, error } = await supabase.from("business_documents").select("*").eq("id", id).single();
    if (error) {
      toast.error(error.message);
      return null;
    }
    return normalizeDocument(data as unknown as Record<string, unknown>);
  };

  const downloadSaved = async (row: Row) => {
    setDownloadingId(row.id);
    const doc = await fetchDocument(row.id);
    if (!doc) {
      setDownloadingId(null);
      return;
    }
    setDownloadDoc(doc);
  };

  const createReceiptFromInvoice = async (row: Row) => {
    if (!user) return;
    setReceiptingId(row.id);
    const invoice = await fetchDocument(row.id);
    if (!invoice) {
      setReceiptingId(null);
      return;
    }

    const totals = calcTotals(invoice);
    const defaultAmount = totals.total.toFixed(2);
    const answer = window.prompt(
      `Amount received for invoice #${invoice.doc_number}?\nInvoice total: ${formatMoney(totals.total, invoice.currency)}`,
      defaultAmount,
    );
    if (answer === null) { setReceiptingId(null); return; }

    const amountPaid = Number(answer.replace(/,/g, ""));
    if (!Number.isFinite(amountPaid) || amountPaid <= 0) {
      toast.error("Enter a valid payment amount");
      setReceiptingId(null);
      return;
    }

    const balance = Math.max(0, totals.total - amountPaid);
    const status = balance > 0 ? "partial" : "paid";
    let receiptNumber = `RCPT-${invoice.doc_number || new Date().getTime()}`;
    try {
      receiptNumber = await nextDocumentNumber(user.id);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not generate receipt number");
      setReceiptingId(null);
      return;
    }
    const paymentSummary =
      `Payment for invoice #${invoice.doc_number}. Amount received: ${formatMoney(amountPaid, invoice.currency)}.`;
    const balanceSummary =
      balance > 0
        ? `Partial payment. Original invoice total: ${formatMoney(totals.total, invoice.currency)}. Balance due: ${formatMoney(balance, invoice.currency)}.`
        : `Full payment. Original invoice total: ${formatMoney(totals.total, invoice.currency)}. Balance due: ${formatMoney(0, invoice.currency)}.`;

    const { data, error } = await supabase
      .from("business_documents")
      .insert({
        user_id: user.id,
        doc_type: "receipt",
        title: `Receipt for ${invoice.title || `Invoice ${invoice.doc_number}`}`,
        doc_number: receiptNumber,
        template: invoice.template === "delivery_simple" ? "modern" : invoice.template,
        issue_date: new Date().toISOString().slice(0, 10),
        currency: invoice.currency,
        from_party: invoice.from_party,
        to_party: invoice.to_party,
        items: [{ id: crypto.randomUUID(), description: `Payment for invoice #${invoice.doc_number}`, quantity: 1, price: amountPaid }],
        tax_rate: 0,
        discount: 0,
        notes: [paymentSummary, invoice.notes].filter(Boolean).join("\n"),
        terms: balanceSummary,
        primary_color: invoice.primary_color,
        accent_color: invoice.accent_color,
        signature_name: invoice.signature_name,
        signature_title: invoice.signature_title,
        status,
      })
      .select("id,title,doc_number").single();

    setReceiptingId(null);
    if (error) return toast.error(error.message);
    toast.success(status === "partial" ? "Partial receipt created" : "Receipt created");
    navigate({ to: "/document/$slug", params: { slug: documentSlug(data) } });
  };
  const rename = async (row: Row) => {
    const title = window.prompt("Rename document", row.title)?.trim();
    if (!title || title === row.title) return;
    setRenamingId(row.id);
    const { error } = await supabase.from("business_documents").update({ title }).eq("id", row.id);
    setRenamingId(null);
    if (error) return toast.error(error.message);
    setRows((current) => current.map((item) => item.id === row.id ? { ...item, title } : item));
    toast.success("Document renamed");
  };

  const duplicate = async (row: Row) => {
    if (!user) return;
    setDuplicatingId(row.id);
    const source = await fetchDocument(row.id);
    if (!source) { setDuplicatingId(null); return; }
    let docNumber = DEFAULT_DOC.doc_number;
    try {
      docNumber = await nextDocumentNumber(user.id);
    } catch (error) {
      setDuplicatingId(null);
      return toast.error(error instanceof Error ? error.message : "Could not generate document number");
    }
    const { error } = await supabase.from("business_documents").insert({
      user_id: user.id,
      doc_type: source.doc_type,
      title: `${source.title} copy`,
      doc_number: docNumber,
      template: source.template,
      issue_date: source.issue_date,
      due_date: source.due_date,
      currency: source.currency,
      from_party: source.from_party,
      to_party: source.to_party,
      items: source.items,
      tax_rate: source.tax_rate,
      discount: source.discount,
      notes: source.notes,
      terms: source.terms,
      primary_color: source.primary_color,
      accent_color: source.accent_color,
      signature_name: source.signature_name,
      signature_title: source.signature_title,
      status: "draft",
    });
    setDuplicatingId(null);
    if (error) return toast.error(error.message);
    toast.success("Document duplicated");
    await load();
  };

  const remove = async (id: string) => {
    if (!window.confirm("Delete this document? This cannot be undone.")) return;
    setDeletingId(id);
    const { error } = await supabase.from("business_documents").delete().eq("id", id);
    setDeletingId(null);
    if (error) toast.error(error.message);
    else setRows((r) => r.filter((x) => x.id !== id));
  };

  const filtered = rows.filter((r) => filter === "all" || r.doc_type === filter);
  const createFromFilter = () => create(filter === "all" ? "invoice" : filter);

  return (
    <div className="ambient-bg min-h-screen">
      {downloadDoc && (
        <div className="pointer-events-none fixed -left-[9999px] top-0 opacity-0" aria-hidden="true">
          <DocumentPreview ref={previewRef} doc={downloadDoc} />
        </div>
      )}
      <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-10">
        <div className="rounded-2xl glass px-4 py-5 sm:px-6">
          <h1 className="text-2xl font-bold leading-tight sm:text-3xl">Business documents</h1>
          <p className="mt-1 text-sm text-muted-foreground">Create stunning invoices, receipts, quotations and delivery notes in seconds.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {DOC_TYPES.map((t) => {
              const Icon = TYPE_ICON[t.id];
              return (
                <button
                  key={t.id}
                  onClick={() => create(t.id)}
                  className="group flex flex-col items-start gap-2 rounded-xl glass-subtle p-4 text-left transition hover:-translate-y-0.5 hover:glass"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-semibold">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.description}</div>
                  </div>
                  <span className="mt-1 inline-flex items-center gap-1 text-xs text-primary transition">
                    <Plus className="h-3 w-3" /> Create
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="sticky top-[73px] z-20 mt-6 flex flex-wrap gap-2 rounded-xl bg-background/85 py-2 backdrop-blur sm:static sm:bg-transparent sm:py-0 sm:backdrop-blur-none">
          {(["all", ...DOC_TYPES.map((t) => t.id)] as const).map((id) => (
            <button
              key={id}
              onClick={() => setFilter(id as DocType | "all")}
              className={`min-h-9 flex-1 rounded-full px-3 py-1 text-xs transition sm:flex-none ${filter === id ? "bg-primary text-primary-foreground" : "glass-subtle hover:glass"}`}
            >
              {id === "all" ? "All" : DOC_TYPES.find((t) => t.id === id)?.name}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="mt-8 text-muted-foreground">Loading...</p>
        ) : filtered.length === 0 ? (
          <Card className="mt-6 glass border-0">
            <CardContent className="flex flex-col items-center gap-3 px-4 py-10 text-center sm:py-14">
              <FileText className="h-10 w-10 text-muted-foreground" />
              <p className="text-muted-foreground">No documents match this view.</p>
              <div className="grid w-full max-w-sm grid-cols-2 gap-2">
                <Button onClick={createFromFilter}><Plus className="h-4 w-4" /> Create</Button>
                <Button variant="outline" onClick={() => setFilter("all")} disabled={filter === "all"}>Clear</Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="mt-4 grid gap-3">
            {filtered.map((r) => {
              const Icon = TYPE_ICON[r.doc_type];
              return (
                <Card key={r.id} className="glass border-0 transition hover:-translate-y-0.5">
                  <CardContent className="grid min-w-0 gap-3 px-3 py-4 sm:px-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
                    <Link to="/document/$slug" params={{ slug: documentSlug(r) }} className="grid min-w-0 grid-cols-[36px_minmax(0,1fr)] items-start gap-3 text-left">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 space-y-0.5">
                        <div className="break-words font-medium leading-snug text-foreground">{r.title}</div>
                        <div className="break-all text-[11px] font-medium text-muted-foreground sm:text-xs">#{r.doc_number}</div>
                        <div className="text-xs leading-relaxed text-muted-foreground">
                          {DOC_TYPES.find((t) => t.id === r.doc_type)?.name} · {r.status} · updated {new Date(r.updated_at).toLocaleString()}
                        </div>
                      </div>
                    </Link>
                    <div className="grid w-full grid-cols-2 gap-2 sm:grid-cols-4 lg:w-auto lg:grid-cols-none lg:auto-cols-max lg:grid-flow-col">
                      {r.doc_type === "invoice" && (
                        <Button variant="outline" size="sm" onClick={() => createReceiptFromInvoice(r)} disabled={receiptingId === r.id} className="min-w-0 justify-center px-2 text-xs sm:text-sm">
                          <FilePlus2 className="h-4 w-4 shrink-0" /> <span>{receiptingId === r.id ? "Creating" : "Receipt"}</span>
                        </Button>
                      )}
                      <Button asChild variant="outline" size="sm" className="min-w-0 justify-center px-2 text-xs sm:text-sm">
                        <Link to="/document/$slug" params={{ slug: documentSlug(r) }}>
                          <Edit className="h-4 w-4 shrink-0" /> <span>Edit</span>
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => downloadSaved(r)} disabled={downloadingId === r.id} className="min-w-0 justify-center px-2 text-xs sm:text-sm">
                        <Download className="h-4 w-4 shrink-0" /> <span>{downloadingId === r.id ? "PDF..." : "PDF"}</span>
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => rename(r)} disabled={renamingId === r.id} className="min-w-0 justify-center px-2 text-xs sm:text-sm">
                        <Pencil className="h-4 w-4 shrink-0" /> <span>{renamingId === r.id ? "Saving" : "Rename"}</span>
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => duplicate(r)} disabled={duplicatingId === r.id} className="min-w-0 justify-center px-2 text-xs sm:text-sm">
                        <Copy className="h-4 w-4 shrink-0" /> <span>{duplicatingId === r.id ? "Copying" : "Duplicate"}</span>
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => remove(r.id)} disabled={deletingId === r.id} aria-label="Delete document" className="min-w-0 justify-center px-2 text-xs sm:text-sm">
                        <Trash2 className="h-4 w-4 shrink-0 text-destructive" /> <span>{deletingId === r.id ? "Deleting" : "Delete"}</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

