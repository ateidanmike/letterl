import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Bot,
  Building2,
  CheckCircle2,
  FileText,
  FolderOpen,
  Heart,
  LayoutDashboard,
  Plus,
  Receipt,
  Search,
  Settings,
  Sparkles,
  Star,
  Trash2,
  Users,
  WalletCards,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/ThemeToggle";
import { DOC_TYPES, DEFAULT_DOC, type DocType } from "@/lib/documents/types";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: Dashboard,
  head: () => ({ meta: [{ title: "Dashboard - Zuridoc" }] }),
});

type LetterRow = { id: string; title: string; template: string; updated_at: string; folder: string };
type DocRow = { id: string; title: string; doc_type: DocType; doc_number: string; updated_at: string; status: string };

type TemplateCard = {
  title: string;
  category: string;
  description: string;
  action: "invoice" | "quotation" | "letterhead" | "soon";
};

const industries = ["Business", "Legal", "Human Resource", "Real Estate", "Finance", "Education"];

const templates: TemplateCard[] = [
  { title: "Invoice", category: "Finance", description: "Bill clients and track totals, tax, and discounts.", action: "invoice" },
  { title: "Contract", category: "Legal", description: "Structure service, vendor, and partnership agreements.", action: "soon" },
  { title: "Proposal", category: "Business", description: "Turn project scope into a polished client proposal.", action: "quotation" },
  { title: "Quotation", category: "Sales", description: "Send price estimates with reusable line items.", action: "quotation" },
  { title: "Employment Letter", category: "Human Resource", description: "Create branded HR letters and notices.", action: "letterhead" },
  { title: "Business Plan", category: "Business", description: "Draft an investor-ready business plan outline.", action: "soon" },
  { title: "NDA", category: "Legal", description: "Prepare confidentiality agreements for teams and clients.", action: "soon" },
  { title: "Custom Document", category: "AI Assistant", description: "Start with a prompt and shape the result yourself.", action: "letterhead" },
];

const billingStats = [
  { label: "Current plan", value: "Free" },
  { label: "Documents this month", value: "3 / 10" },
  { label: "Team members", value: "1" },
];

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [letters, setLetters] = useState<LetterRow[]>([]);
  const [docs, setDocs] = useState<DocRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [industry, setIndustry] = useState("Business");

  const load = async () => {
    const [{ data: letterData, error: letterError }, { data: docData, error: docError }] = await Promise.all([
      supabase.from("letterheads").select("id,title,template,updated_at,folder").order("updated_at", { ascending: false }),
      supabase.from("business_documents").select("id,title,doc_type,doc_number,updated_at,status").order("updated_at", { ascending: false }),
    ]);

    if (letterError) toast.error(letterError.message);
    else setLetters((letterData as LetterRow[]) ?? []);

    if (docError) toast.error(docError.message);
    else setDocs((docData as DocRow[]) ?? []);

    setLoading(false);
  };

  useEffect(() => {
    if (user) load();
  }, [user]);

  const recent = useMemo(
    () => [
      ...docs.map((doc) => ({ id: doc.id, title: doc.title, kind: DOC_TYPES.find((type) => type.id === doc.doc_type)?.name ?? "Document", updated_at: doc.updated_at, href: "/document-editor" as const })),
      ...letters.map((letter) => ({ id: letter.id, title: letter.title, kind: "Letterhead", updated_at: letter.updated_at, href: "/editor" as const })),
    ].sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()).slice(0, 5),
    [docs, letters],
  );

  const drafts = docs.filter((doc) => doc.status === "draft").slice(0, 4);

  const createLetterhead = async () => {
    const { data, error } = await supabase
      .from("letterheads")
      .insert({ user_id: user!.id, title: "Untitled letterhead" })
      .select("id")
      .single();
    if (error) return toast.error(error.message);
    navigate({ to: "/editor", search: { id: data.id } });
  };

  const createDocument = async (doc_type: DocType) => {
    const meta = DOC_TYPES.find((type) => type.id === doc_type)!;
    const { data, error } = await supabase
      .from("business_documents")
      .insert({ user_id: user!.id, doc_type, title: `New ${meta.name}`, doc_number: DEFAULT_DOC.doc_number })
      .select("id")
      .single();
    if (error) return toast.error(error.message);
    navigate({ to: "/document-editor", search: { id: data.id } });
  };

  const handleTemplate = (template: TemplateCard) => {
    if (template.action === "invoice") return createDocument("invoice");
    if (template.action === "quotation") return createDocument("quotation");
    if (template.action === "letterhead") return createLetterhead();
    toast.info(`${template.title} generation is on the roadmap. Start with Custom Document for now.`);
  };

  const removeLetter = async (id: string) => {
    const { error } = await supabase.from("letterheads").delete().eq("id", id);
    if (error) toast.error(error.message);
    else setLetters((items) => items.filter((item) => item.id !== id));
  };

  const filteredTemplates = templates.filter((template) =>
    [template.title, template.category, template.description].join(" ").toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="ambient-bg min-h-screen">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <section className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#EAF4FF] px-3 py-1 text-xs font-semibold text-[#0067EC]">
                <Sparkles className="h-3.5 w-3.5" /> What would you like to create?
              </div>
              <h1 className="text-3xl font-semibold tracking-normal text-[#011B43]">Create, manage, and deliver professional documents.</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Choose an industry, add your company details, generate a draft with AI, then preview, edit, share, export, or request signatures.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <ThemeToggle />
              <Button variant="outline" asChild><Link to="/brand"><Building2 className="h-4 w-4" /> Company setup</Link></Button>
              <Button onClick={() => createDocument("invoice")}><Plus className="h-4 w-4" /> Create new document</Button>
            </div>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <OnboardingStep icon={LayoutDashboard} title="1. Select industry" body={industry} done />
            <OnboardingStep icon={Building2} title="2. Company information" body="Business name, logo, address, contacts, tax" done={false} href="/brand" />
            <OnboardingStep icon={CheckCircle2} title="3. Complete setup" body="Ready to generate documents" done={docs.length + letters.length > 0} />
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[0.72fr_0.28fr]">
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-[#011B43]">Select industry</h2>
                  <p className="text-sm text-slate-500">The assistant uses this context when drafting documents.</p>
                </div>
                <div className="relative w-full max-w-xs">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search templates..." className="pl-9" />
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {industries.map((item) => (
                  <button key={item} onClick={() => setIndustry(item)} className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${industry === item ? "bg-[#0067EC] text-white" : "bg-slate-100 text-slate-600 hover:bg-[#EAF4FF] hover:text-[#0067EC]"}`}>
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-[#011B43]">Templates library</h2>
                  <p className="text-sm text-slate-500">Invoice, contract, proposal, quotation, employment letter, business plan, NDA, or custom document.</p>
                </div>
                <Link to="/documents" className="text-sm font-semibold text-[#0067EC]">View all</Link>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                {filteredTemplates.map((template) => (
                  <button key={template.title} onClick={() => handleTemplate(template)} className="group flex min-h-44 flex-col justify-between rounded-xl border border-slate-200 bg-[#F8FAFC] p-4 text-left transition hover:-translate-y-1 hover:border-[#0067EC]/40 hover:bg-white hover:shadow-lg">
                    <div>
                      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[#EAF4FF] text-[#0067EC]"><FileText className="h-5 w-5" /></div>
                      <p className="text-sm font-semibold text-[#011B43]">{template.title}</p>
                      <p className="mt-1 text-xs font-medium uppercase text-[#0067EC]">{template.category}</p>
                      <p className="mt-2 text-sm leading-5 text-slate-600">{template.description}</p>
                    </div>
                    <span className="mt-4 text-xs font-semibold text-[#0067EC] opacity-0 transition group-hover:opacity-100">Create from template</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <WorkspacePanel title="Recent documents" icon={FolderOpen} action={<Link to="/documents" className="text-sm font-semibold text-[#0067EC]">Manage</Link>}>
                {loading ? <EmptyText text="Loading recent work..." /> : recent.length === 0 ? <EmptyText text="No documents yet. Create your first one above." /> : recent.map((item) => (
                  <Link key={`${item.kind}-${item.id}`} to={item.href} search={{ id: item.id }} className="flex items-center justify-between rounded-xl border border-slate-100 px-3 py-2 text-sm transition hover:bg-slate-50">
                    <span><span className="font-medium text-[#011B43]">{item.title}</span><span className="ml-2 text-xs text-slate-500">{item.kind}</span></span>
                    <span className="text-xs text-slate-400">{new Date(item.updated_at).toLocaleDateString()}</span>
                  </Link>
                ))}
              </WorkspacePanel>

              <WorkspacePanel title="Saved drafts" icon={FileText} action={<Button size="sm" variant="outline" onClick={() => createDocument("invoice")}>New draft</Button>}>
                {drafts.length === 0 ? <EmptyText text="Drafts you save appear here." /> : drafts.map((draft) => (
                  <Link key={draft.id} to="/document-editor" search={{ id: draft.id }} className="flex items-center justify-between rounded-xl border border-slate-100 px-3 py-2 text-sm transition hover:bg-slate-50">
                    <span className="font-medium text-[#011B43]">{draft.title}</span>
                    <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs text-amber-700">Draft</span>
                  </Link>
                ))}
              </WorkspacePanel>
            </div>
          </div>

          <aside className="space-y-6">
            <WorkspacePanel title="AI assistant" icon={Bot}>
              <div className="rounded-xl bg-[#011B43] p-4 text-white">
                <p className="text-sm font-semibold">Prompt starter</p>
                <p className="mt-2 text-sm leading-6 text-white/70">Generate a service proposal for a Nairobi client with pricing, timelines, terms, and a signature section.</p>
                <Button className="mt-4 bg-white text-[#011B43] hover:bg-[#EAF4FF]" onClick={() => toast.info("AI drafting workspace coming soon. Use Custom Document for now.")}>Open assistant</Button>
              </div>
            </WorkspacePanel>

            <WorkspacePanel title="Favorites" icon={Heart}>
              {templates.slice(0, 3).map((template) => (
                <button key={template.title} onClick={() => handleTemplate(template)} className="flex w-full items-center gap-2 rounded-xl border border-slate-100 px-3 py-2 text-left text-sm transition hover:bg-slate-50">
                  <Star className="h-4 w-4 text-amber-500" /> {template.title}
                </button>
              ))}
            </WorkspacePanel>

            <WorkspacePanel title="Account & billing" icon={WalletCards} action={<button onClick={() => toast.info("Upgrade and payment management are coming soon.")} className="text-sm font-semibold text-[#0067EC]">Upgrade</button>}>
              <div className="grid gap-2">
                {billingStats.map((stat) => (
                  <div key={stat.label} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-sm">
                    <span className="text-slate-500">{stat.label}</span>
                    <span className="font-semibold text-[#011B43]">{stat.value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex gap-2">
                <Button size="sm" variant="outline" onClick={() => toast.info("Payment methods will be available after plan upgrade.")}>Payment methods</Button>
                <Button size="sm" variant="outline" onClick={() => toast.info("Invite team members from billing settings soon.")}><Users className="h-4 w-4" /> Team</Button>
              </div>
            </WorkspacePanel>

            {letters.length > 0 && (
              <WorkspacePanel title="Letterheads" icon={Receipt}>
                {letters.slice(0, 3).map((letter) => (
                  <div key={letter.id} className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 px-3 py-2 text-sm">
                    <Link to="/editor" search={{ id: letter.id }} className="truncate font-medium text-[#011B43]">{letter.title}</Link>
                    <Button variant="ghost" size="icon" onClick={() => removeLetter(letter.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                ))}
              </WorkspacePanel>
            )}
          </aside>
        </section>
      </div>
    </div>
  );
}

function OnboardingStep({ icon: Icon, title, body, done, href }: { icon: typeof FileText; title: string; body: string; done: boolean; href?: string }) {
  const content = (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
      <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${done ? "bg-emerald-50 text-emerald-600" : "bg-[#EAF4FF] text-[#0067EC]"}`}>
        <Icon className="h-5 w-5" />
      </span>
      <span>
        <span className="block text-sm font-semibold text-[#011B43]">{title}</span>
        <span className="block text-xs text-slate-500">{body}</span>
      </span>
    </div>
  );

  return href ? <Link to={href}>{content}</Link> : content;
}

function WorkspacePanel({ title, icon: Icon, action, children }: { title: string; icon: typeof FileText; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-[#011B43]"><Icon className="h-5 w-5 text-[#0067EC]" /> {title}</h2>
        {action}
      </div>
      <div className="space-y-2">{children}</div>
    </section>
  );
}

function EmptyText({ text }: { text: string }) {
  return <p className="rounded-xl bg-slate-50 px-3 py-4 text-sm text-slate-500">{text}</p>;
}
