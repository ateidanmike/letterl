import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Archive, Copy, Download, Edit, FilePlus2, FileText, Pencil, Plus, Receipt, Trash2, FileSpreadsheet, Truck } from "lucide-react";
import { toast } from "sonner";
import {
  DOC_TYPES,
  DOCUMENT_STATUSES,
  DEFAULT_DOC,
  calcTotals,
  formatMoney,
  type BusinessDoc,
  type DocType,
  type DocumentStatus,
  type LineItem,
  type Party,
} from "@/lib/documents/types";
import { DocumentPreview } from "@/components/documents/DocumentPreview";
import { documentSlug } from "@/lib/documents/slug";
import { exportPdf } from "@/lib/letterhead/pdf-export";

export const Route = createFileRoute("/_authenticated/documents")({
  component: DocumentsPage,
  head: () => ({ meta: [{ title: "Business documents - Zuridoc" }] }),
});

type Row = {
  id: string;
  title: string;
  doc_type: DocType;
  doc_number: string;
  updated_at: string;
  status: DocumentStatus;
  to_party: Party | null;
};

const DOCUMENT_ASSETS_KEY = "__document_assets";

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
  const fromParty = { ...DEFAULT_DOC.from_party, ...((raw.from_party as object) ?? {}) } as Record<string, unknown>;
  const assets = fromParty[DOCUMENT_ASSETS_KEY] as Partial<BusinessDoc> | undefined;
  return {
    ...DEFAULT_DOC,
    ...(raw as unknown as BusinessDoc),
    status: ((raw.status as DocumentStatus | undefined) ?? "draft"),
    items: items.length ? items : DEFAULT_DOC.items,
    show_qr: Boolean(assets?.show_qr),
    qr_text: typeof assets?.qr_text === "string" ? assets.qr_text : "",
    show_company_stamp: Boolean(assets?.show_company_stamp),
    company_stamp_data: typeof assets?.company_stamp_data === "string" ? assets.company_stamp_data : null,
    from_party: fromParty as BusinessDoc["from_party"],
    to_party: { ...DEFAULT_DOC.to_party, ...((raw.to_party as object) ?? {}) },
  };
}

function fromPartyWithDocumentAssets(doc: BusinessDoc) {
  return {
    ...doc.from_party,
    [DOCUMENT_ASSETS_KEY]: {
      show_qr: doc.show_qr,
      qr_text: doc.qr_text,
      show_company_stamp: doc.show_company_stamp,
      company_stamp_data: doc.company_stamp_data ?? null,
    },
  };
}

function DocumentsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<DocType | "all">("all");
  const [search, setSearch] = useState("");
  const [downloadDoc, setDownloadDoc] = useState<BusinessDoc | null>(null);
  const [exportQueue, setExportQueue] = useState<BusinessDoc[]>([]);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [receiptingId, setReceiptingId] = useState<string | null>(null);
  const [bulkBusy, setBulkBusy] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const previewRef = useRef<HTMLDivElement>(null);

  const load = async () => {
    const { data, error } = await supabase
      .from("business_documents")
      .select("id,title,doc_type,doc_number,updated_at,status,to_party")
      .order("updated_at", { ascending: false });
    if (error) toast.error(error.message);
    else setRows(((data as Row[]) ?? []).map((row) => ({ ...row, status: row.status ?? "draft" })));
    setLoading(false);
  };
  useEffect(() => { if (user) load(); }, [user]);

  useEffect(() => {
    if (downloadDoc || exportQueue.length === 0) return;
    const [next, ...rest] = exportQueue;
    setExportQueue(rest);
    setDownloadDoc(next);
  }, [downloadDoc, exportQueue]);

  useEffect(() => {
    if (!downloadDoc || !previewRef.current) return;
    const filename = `${downloadDoc.title || "document"}.pdf`;
    exportPdf(previewRef.current, filename)
      .then(() => toast.success("PDF downloaded"))
      .catch((error) => toast.error(error instanceof Error ? error.message : "PDF export failed"))
      .finally(() => {
        setDownloadDoc(null);
        setDownloadingId(null);
        setBulkBusy(false);
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
      .insert({ user_id: user!.id, doc_type, title: `New ${meta.name}`, doc_number: docNumber })
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

  const selectedRows = useMemo(() => rows.filter((row) => selectedIds.has(row.id)), [rows, selectedIds]);
  const latestDraft = useMemo(() => rows.find((row) => row.status === "draft"), [rows]);
  const filtered = useMemo(() => rows
    .filter((r) => filter === "all" || r.doc_type === filter)
    .filter((r) => {
      const query = search.trim().toLowerCase();
      if (!query) return true;
      const typeName = DOC_TYPES.find((t) => t.id === r.doc_type)?.name ?? r.doc_type;
      const customer = r.to_party?.name ?? "";
      const customerEmail = r.to_party?.email ?? "";
      return [r.title, r.doc_number, r.status, typeName, customer, customerEmail].some((value) => value.toLowerCase().includes(query));
    }), [filter, rows, search]);

  const toggleSelected = (id: string) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectVisible = () => setSelectedIds(new Set(filtered.map((row) => row.id)));
  const clearSelected = () => setSelectedIds(new Set());

  const updateStatus = async (row: Row, status: DocumentStatus) => {
    const { error } = await supabase.from("business_documents").update({ status }).eq("id", row.id);
    if (error) return toast.error(error.message);
    setRows((current) => current.map((item) => item.id === row.id ? { ...item, status } : item));
    toast.success("Status updated");
  };

  const bulkUpdateStatus = async (status: DocumentStatus) => {
    if (selectedRows.length === 0) return;
    setBulkBusy(true);
    const ids = selectedRows.map((row) => row.id);
    const { error } = await supabase.from("business_documents").update({ status }).in("id", ids);
    setBulkBusy(false);
    if (error) return toast.error(error.message);
    setRows((current) => current.map((row) => ids.includes(row.id) ? { ...row, status } : row));
    clearSelected();
    toast.success(`${ids.length} document${ids.length === 1 ? "" : "s"} updated`);
  };

  const bulkDelete = async () => {
    if (selectedRows.length === 0) return;
    if (!window.confirm(`Delete ${selectedRows.length} selected document${selectedRows.length === 1 ? "" : "s"}? This cannot be undone.`)) return;
    setBulkBusy(true);
    const ids = selectedRows.map((row) => row.id);
    const { error } = await supabase.from("business_documents").delete().in("id", ids);
    setBulkBusy(false);
    if (error) return toast.error(error.message);
    setRows((current) => current.filter((row) => !ids.includes(row.id)));
    clearSelected();
    toast.success("Selected documents deleted");
  };

  const bulkExport = async () => {
    if (selectedRows.length === 0) return;
    setBulkBusy(true);
    const docs = (await Promise.all(selectedRows.map((row) => fetchDocument(row.id)))).filter(Boolean) as BusinessDoc[];
    if (docs.length === 0) {
      setBulkBusy(false);
      return;
    }
    toast.message(`Exporting ${docs.length} PDF${docs.length === 1 ? "" : "s"}...`);
    setExportQueue(docs);
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
    const status: DocumentStatus = balance > 0 ? "partial" : "paid";
    let receiptNumber = `RCPT-${invoice.doc_number || new Date().getTime()}`;
    try {
      receiptNumber = await nextDocumentNumber(user.id);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not generate receipt number");
      setReceiptingId(null);
      return;
    }
    const paymentSummary = `Payment for invoice #${invoice.doc_number}. Amount received: ${formatMoney(amountPaid, invoice.currency)}.`;
    const balanceSummary = balance > 0
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
        from_party: fromPartyWithDocumentAssets(invoice),
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
      from_party: fromPartyWithDocumentAssets(source),
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

  const remove = async (row: Row) => {
    if (!window.confirm(`Delete "${row.title || row.doc_number}"? This cannot be undone.`)) return;
    setDeletingId(row.id);
    const { error } = await supabase.from("business_documents").delete().eq("id", row.id);
    setDeletingId(null);
    if (error) return toast.error(error.message);
    setRows((current) => current.filter((item) => item.id !== row.id));
    setSelectedIds((current) => {
      const next = new Set(current);
      next.delete(row.id);
      return next;
    });
    toast.success("Document deleted");
  };

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
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold leading-tight sm:text-3xl">Business documents</h1>
              <p className="mt-1 text-sm text-muted-foreground">Create stunning invoices, receipts, quotations and delivery notes in seconds.</p>
            </div>
            {latestDraft ? (
              <Button asChild variant="outline" className="w-full sm:w-auto">
                <Link to="/document/$slug" params={{ slug: documentSlug(latestDraft) }}>
                  Continue latest draft
                </Link>
              </Button>
            ) : null}
          </div>
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

        <div className="sticky top-[73px] z-20 mt-6 flex flex-col gap-3 rounded-xl bg-background/90 py-2 backdrop-blur sm:static sm:bg-transparent sm:py-0 sm:backdrop-blur-none">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search title, number, client, status..."
            className="w-full glass-subtle border-0 sm:max-w-sm"
          />
          <div className="flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible sm:pb-0">
            {(["all", ...DOC_TYPES.map((t) => t.id)] as const).map((id) => (
              <button
                key={id}
                onClick={() => setFilter(id as DocType | "all")}
                className={`min-h-9 shrink-0 rounded-full px-4 py-1 text-xs transition ${filter === id ? "bg-primary text-primary-foreground" : "glass-subtle hover:glass"}`}
              >
                {id === "all" ? "All" : DOC_TYPES.find((t) => t.id === id)?.name}
              </button>
            ))}
          </div>
        </div>

        {!loading && filtered.length > 0 ? (
          <div className="mt-4 flex flex-col gap-2 rounded-xl glass-subtle p-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <Button variant="outline" size="sm" onClick={selectVisible}>Select visible</Button>
              <Button variant="ghost" size="sm" onClick={clearSelected} disabled={selectedIds.size === 0}>Clear</Button>
              <span>{selectedIds.size} selected</span>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:flex">
              <Button variant="outline" size="sm" onClick={bulkExport} disabled={selectedIds.size === 0 || bulkBusy}><Download className="h-4 w-4" /> Export</Button>
              <Button variant="outline" size="sm" onClick={() => bulkUpdateStatus("archived")} disabled={selectedIds.size === 0 || bulkBusy}><Archive className="h-4 w-4" /> Archive</Button>
              <Select onValueChange={(value) => bulkUpdateStatus(value as DocumentStatus)} disabled={selectedIds.size === 0 || bulkBusy}>
                <SelectTrigger className="h-9 min-w-32"><SelectValue placeholder="Set status" /></SelectTrigger>
                <SelectContent>
                  {DOCUMENT_STATUSES.map((status) => <SelectItem key={status.id} value={status.id}>{status.name}</SelectItem>)}
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={bulkDelete} disabled={selectedIds.size === 0 || bulkBusy}><Trash2 className="h-4 w-4 text-destructive" /> Delete</Button>
            </div>
          </div>
        ) : null}

        {loading ? (
          <p className="mt-8 text-muted-foreground">Loading...</p>
        ) : filtered.length === 0 ? (
          <Card className="mt-6 glass border-0">
            <CardContent className="flex flex-col items-center gap-3 px-4 py-10 text-center sm:py-14">
              <FileText className="h-10 w-10 text-muted-foreground" />
              <p className="text-muted-foreground">No documents match this view.</p>
              <div className="grid w-full max-w-sm grid-cols-2 gap-2">
                <Button onClick={createFromFilter}><Plus className="h-4 w-4" /> Create</Button>
                <Button variant="outline" onClick={() => { setFilter("all"); setSearch(""); }} disabled={filter === "all" && !search}>Clear</Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="mt-4 grid gap-3">
            {filtered.map((r) => {
              const Icon = TYPE_ICON[r.doc_type];
              const customer = r.to_party?.name || "No client yet";
              return (
                <Card key={r.id} className="glass border-0 transition hover:-translate-y-0.5">
                  <CardContent className="grid min-w-0 gap-3 px-3 py-4 sm:px-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
                    <div className="grid min-w-0 grid-cols-[24px_36px_minmax(0,1fr)] items-start gap-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(r.id)}
                        onChange={() => toggleSelected(r.id)}
                        className="mt-2 h-4 w-4 rounded border-border accent-primary"
                        aria-label={`Select ${r.title}`}
                      />
                      <Link to="/document/$slug" params={{ slug: documentSlug(r) }} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-4 w-4" />
                      </Link>
                      <Link to="/document/$slug" params={{ slug: documentSlug(r) }} className="min-w-0 space-y-0.5 text-left">
                        <div className="break-words font-medium leading-snug text-foreground">{r.title}</div>
                        <div className="break-all text-[11px] font-medium text-muted-foreground sm:text-xs">#{r.doc_number}</div>
                        <div className="text-xs leading-relaxed text-muted-foreground">
                          {DOC_TYPES.find((t) => t.id === r.doc_type)?.name} · {customer} · updated {new Date(r.updated_at).toLocaleString()}
                        </div>
                      </Link>
                    </div>
                    <div className="grid w-full grid-cols-2 gap-2 sm:grid-cols-4 lg:w-auto lg:grid-cols-none lg:auto-cols-max lg:grid-flow-col">
                      <Select value={r.status} onValueChange={(value) => updateStatus(r, value as DocumentStatus)}>
                        <SelectTrigger className="h-9 min-w-28 text-xs sm:text-sm"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {DOCUMENT_STATUSES.map((status) => <SelectItem key={status.id} value={status.id}>{status.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      {r.doc_type === "invoice" && (
                        <Button variant="outline" size="sm" onClick={() => createReceiptFromInvoice(r)} disabled={receiptingId === r.id} className="min-w-0 justify-center px-2 text-xs sm:text-sm">
                          <FilePlus2 className="h-4 w-4 shrink-0" /> <span>{receiptingId === r.id ? "Creating" : "Receipt"}</span>
                        </Button>
                      )}
                      <Button asChild variant="outline" size="sm" className="min-w-0 justify-center px-2 text-xs sm:text-sm">
                        <Link to="/document/$slug" params={{ slug: documentSlug(r) }}><Edit className="h-4 w-4 shrink-0" /> <span>Edit</span></Link>
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
                      <Button variant="outline" size="sm" onClick={() => remove(r)} disabled={deletingId === r.id} aria-label="Delete document" className="min-w-0 justify-center px-2 text-xs sm:text-sm">
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
