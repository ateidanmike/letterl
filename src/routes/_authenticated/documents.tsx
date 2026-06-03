import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Archive,
  Bot,
  Copy,
  Download,
  FileSignature,
  FileSpreadsheet,
  FileText,
  Mail,
  Plus,
  Printer,
  Receipt,
  Share2,
  Sparkles,
  Trash2,
  Truck,
  Users,
  Workflow,
} from "lucide-react";
import { toast } from "sonner";
import { DOC_TYPES, DEFAULT_DOC, type DocType } from "@/lib/documents/types";

export const Route = createFileRoute("/_authenticated/documents")({
  component: DocumentsPage,
  head: () => ({ meta: [{ title: "Document workspace - Zuridoc" }] }),
});

type Row = { id: string; title: string; doc_type: DocType; doc_number: string; updated_at: string; status: string };
type TemplateAction = DocType | "letter" | "soon";
type Template = { name: string; category: string; description: string; action: TemplateAction };

const TYPE_ICON: Record<DocType, typeof FileText> = {
  invoice: FileText,
  receipt: Receipt,
  quotation: FileSpreadsheet,
  delivery_note: Truck,
};

const templates: Template[] = [
  { name: "Invoice", category: "Finance", description: "Bill clients with tax, discounts, notes, and payment terms.", action: "invoice" },
  { name: "Contract", category: "Legal", description: "Generate service, vendor, partnership, and custom agreements.", action: "soon" },
  { name: "Proposal", category: "Business", description: "Create polished proposals from scope, pricing, and timelines.", action: "quotation" },
  { name: "Quotation", category: "Sales", description: "Send clear price estimates and convert them into invoices.", action: "quotation" },
  { name: "Employment Letter", category: "Human Resource", description: "Draft offer letters, confirmations, policies, and notices.", action: "letter" },
  { name: "Business Plan", category: "Education", description: "Structure market, finance, operations, and growth sections.", action: "soon" },
  { name: "NDA", category: "Legal", description: "Prepare confidentiality documents for teams and clients.", action: "soon" },
  { name: "Custom Document", category: "AI Assistant", description: "Start from a blank prompt and shape the final document.", action: "letter" },
];

const creationSteps = ["Select template", "Fill required fields", "AI generates document", "Preview", "Edit & customize", "Save draft"];
const managementActions = [
  { label: "Duplicate", icon: Copy },
  { label: "Share", icon: Share2 },
  { label: "Collaborate", icon: Users },
  { label: "Version history", icon: Workflow },
  { label: "Archive", icon: Archive },
];
const exportActions = [
  { label: "Download PDF", icon: Download },
  { label: "Download DOCX", icon: FileText },
  { label: "Print", icon: Printer },
  { label: "Email document", icon: Mail },
  { label: "Generate share link", icon: Share2 },
  { label: "E-signature request", icon: FileSignature },
];

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

  useEffect(() => {
    if (user) load();
  }, [user]);

  const create = async (doc_type: DocType) => {
    const meta = DOC_TYPES.find((type) => type.id === doc_type)!;
    const { data, error } = await supabase
      .from("business_documents")
      .insert({ user_id: user!.id, doc_type, title: `New ${meta.name}`, doc_number: DEFAULT_DOC.doc_number })
      .select("id")
      .single();
    if (error) return toast.error(error.message);
    navigate({ to: "/document-editor", search: { id: data.id } });
  };

  const createLetter = async () => {
    const { data, error } = await supabase
      .from("letterheads")
      .insert({ user_id: user!.id, title: "Custom document draft" })
      .select("id")
      .single();
    if (error) return toast.error(error.message);
    navigate({ to: "/editor", search: { id: data.id } });
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("business_documents").delete().eq("id", id);
    if (error) toast.error(error.message);
    else setRows((items) => items.filter((item) => item.id !== id));
  };

  const handleTemplate = (template: Template) => {
    if (template.action === "letter") return createLetter();
    if (template.action === "soon") return toast.info(`${template.name} generation is coming soon. Use Custom Document for now.`);
    return create(template.action);
  };

  const filtered = rows.filter((row) => filter === "all" || row.doc_type === filter);

  return (
    <div className="ambient-bg min-h-screen">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <section className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#EAF4FF] px-3 py-1 text-xs font-semibold text-[#0067EC]"><Sparkles className="h-3.5 w-3.5" /> Document creation</div>
              <h1 className="text-3xl font-semibold tracking-normal text-[#011B43]">Create professional documents in minutes.</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">Select a template, fill required fields, let AI generate the document, preview it, edit branding, save a draft, and deliver it as PDF, DOCX, print, email, share link, or e-signature request.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => toast.info("AI assistant opens from the document editor after template selection.")}><Bot className="h-4 w-4" /> AI Assistant</Button>
              <Button onClick={() => create("invoice")}><Plus className="h-4 w-4" /> Create new document</Button>
            </div>
          </div>
          <div className="mt-5 grid gap-2 md:grid-cols-6">
            {creationSteps.map((step, index) => (
              <div key={step} className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm">
                <span className="mb-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#0067EC] text-xs font-semibold text-white">{index + 1}</span>
                <span className="font-medium text-[#011B43]">{step}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-[#011B43]">Select template</h2>
              <p className="text-sm text-slate-500">Choose from invoices, contracts, proposals, quotations, employment letters, business plans, NDAs, and custom documents.</p>
            </div>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {templates.map((template) => (
              <button key={template.name} onClick={() => handleTemplate(template)} className="group flex min-h-44 flex-col justify-between rounded-xl border border-slate-200 bg-[#F8FAFC] p-4 text-left transition hover:-translate-y-1 hover:border-[#0067EC]/40 hover:bg-white hover:shadow-lg">
                <div>
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[#EAF4FF] text-[#0067EC]"><FileText className="h-5 w-5" /></div>
                  <p className="font-semibold text-[#011B43]">{template.name}</p>
                  <p className="mt-1 text-xs font-semibold uppercase text-[#0067EC]">{template.category}</p>
                  <p className="mt-2 text-sm leading-5 text-slate-600">{template.description}</p>
                </div>
                <span className="mt-4 text-xs font-semibold text-[#0067EC] opacity-0 transition group-hover:opacity-100">Use template</span>
              </button>
            ))}
          </div>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[0.68fr_0.32fr]">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-[#011B43]">Document management</h2>
                <p className="text-sm text-slate-500">Save, duplicate, share, collaborate, review versions, archive, or continue editing.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {(["all", ...DOC_TYPES.map((type) => type.id)] as const).map((id) => (
                  <button key={id} onClick={() => setFilter(id as DocType | "all")} className={`rounded-full px-3 py-1 text-xs transition ${filter === id ? "bg-[#0067EC] text-white" : "bg-slate-100 text-slate-600 hover:bg-[#EAF4FF]"}`}>
                    {id === "all" ? "All" : DOC_TYPES.find((type) => type.id === id)?.name}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <p className="mt-8 text-slate-500">Loading documents...</p>
            ) : filtered.length === 0 ? (
              <Card className="mt-6 border border-dashed border-slate-300 bg-slate-50">
                <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
                  <FileText className="h-10 w-10 text-slate-400" />
                  <p className="text-sm text-slate-500">No documents yet. Pick a template above to start.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="mt-4 grid gap-3">
                {filtered.map((row) => {
                  const Icon = TYPE_ICON[row.doc_type];
                  return (
                    <Card key={row.id} className="border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                      <CardContent className="flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:justify-between">
                        <Link to="/document-editor" search={{ id: row.id }} className="flex flex-1 items-center gap-3 text-left">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#EAF4FF] text-[#0067EC]"><Icon className="h-5 w-5" /></div>
                          <div>
                            <div className="font-semibold text-[#011B43]">{row.title} <span className="text-xs text-slate-500">#{row.doc_number}</span></div>
                            <div className="text-xs text-slate-500">{DOC_TYPES.find((type) => type.id === row.doc_type)?.name} · {row.status} · updated {new Date(row.updated_at).toLocaleString()}</div>
                          </div>
                        </Link>
                        <div className="flex flex-wrap gap-1.5">
                          {managementActions.map((action) => <IconButton key={action.label} label={action.label} icon={action.icon} />)}
                          <Button variant="ghost" size="icon" onClick={() => remove(row.id)} title="Delete"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </section>

          <aside className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-[#011B43]">Export & delivery</h2>
              <p className="mt-1 text-sm text-slate-500">Available from the document editor after preview.</p>
              <div className="mt-4 grid gap-2">
                {exportActions.map((action) => <ActionRow key={action.label} label={action.label} icon={action.icon} />)}
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-[#011B43] p-5 text-white shadow-sm">
              <h2 className="text-lg font-semibold">Success</h2>
              <p className="mt-2 text-sm leading-6 text-white/70">When a document is saved and exported, Zuridoc confirms: Your document is ready.</p>
              <Button className="mt-4 bg-white text-[#011B43] hover:bg-[#EAF4FF]" onClick={() => toast.success("Your document is ready.")}>Preview success state</Button>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}

function IconButton({ label, icon: Icon }: { label: string; icon: typeof FileText }) {
  return <Button variant="outline" size="icon" onClick={() => toast.info(`${label} will be available from the full document workspace.`)} title={label}><Icon className="h-4 w-4" /></Button>;
}

function ActionRow({ label, icon: Icon }: { label: string; icon: typeof FileText }) {
  return (
    <button onClick={() => toast.info(`${label} is available after saving a document.`)} className="flex items-center gap-3 rounded-xl border border-slate-100 px-3 py-2 text-left text-sm transition hover:bg-slate-50">
      <Icon className="h-4 w-4 text-[#0067EC]" />
      <span>{label}</span>
    </button>
  );
}
