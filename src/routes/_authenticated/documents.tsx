import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2, FileText, Receipt, FileSpreadsheet, Truck } from "lucide-react";
import { toast } from "sonner";
import { DOC_TYPES, DEFAULT_DOC, type DocType } from "@/lib/documents/types";

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

function DocumentsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<DocType | "all">("all");

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

  const create = async (doc_type: DocType) => {
    const meta = DOC_TYPES.find((t) => t.id === doc_type)!;
    const { data, error } = await supabase
      .from("business_documents")
      .insert({
        user_id: user!.id,
        doc_type,
        title: `New ${meta.name}`,
        doc_number: DEFAULT_DOC.doc_number,
      })
      .select("id").single();
    if (error) return toast.error(error.message);
    navigate({ to: "/document-editor", search: { id: data.id } });
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("business_documents").delete().eq("id", id);
    if (error) toast.error(error.message);
    else setRows((r) => r.filter((x) => x.id !== id));
  };

  const filtered = rows.filter((r) => filter === "all" || r.doc_type === filter);

  return (
    <div className="ambient-bg min-h-screen">
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
                  <span className="mt-1 inline-flex items-center gap-1 text-xs text-primary opacity-0 transition group-hover:opacity-100">
                    <Plus className="h-3 w-3" /> Create
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible">
          {(["all", ...DOC_TYPES.map((t) => t.id)] as const).map((id) => (
            <button
              key={id}
              onClick={() => setFilter(id as DocType | "all")}
              className={`min-h-9 shrink-0 rounded-full px-3 py-1 text-xs transition ${filter === id ? "bg-primary text-primary-foreground" : "glass-subtle hover:glass"}`}
            >
              {id === "all" ? "All" : DOC_TYPES.find((t) => t.id === id)?.name}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="mt-8 text-muted-foreground">Loading…</p>
        ) : filtered.length === 0 ? (
          <Card className="mt-6 glass border-0">
            <CardContent className="flex flex-col items-center gap-3 px-4 py-12 text-center sm:py-16">
              <FileText className="h-10 w-10 text-muted-foreground" />
              <p className="text-muted-foreground">No documents yet — pick a type above to start.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="mt-4 grid gap-3">
            {filtered.map((r) => {
              const Icon = TYPE_ICON[r.doc_type];
              return (
                <Card key={r.id} className="glass border-0 transition hover:-translate-y-0.5">
                  <CardContent className="flex flex-col items-start gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <Link to="/document-editor" search={{ id: r.id }} className="flex min-w-0 flex-1 items-center gap-3 text-left">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-medium">{r.title} <span className="text-xs text-muted-foreground">#{r.doc_number}</span></div>
                        <div className="text-xs text-muted-foreground">
                          {DOC_TYPES.find((t) => t.id === r.doc_type)?.name} · {r.status} · updated {new Date(r.updated_at).toLocaleString()}
                        </div>
                      </div>
                    </Link>
                    <Button variant="ghost" size="icon" className="self-end sm:self-center" onClick={() => remove(r.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
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
