import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  CreditCard,
  Bot,
  CheckCircle2,
  Clock3,
  FileCheck2,
  FileText,
  FolderKanban,
  LayoutDashboard,
  Play,
  Settings,
  ShieldCheck,
  Sparkles,
  Users,
  WalletCards,
  Wand2,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Zuridoc - Generate Professional Documents in Minutes" },
      {
        name: "description",
        content:
          "Create contracts, proposals, invoices, agreements, HR documents, legal paperwork, and business documents instantly with AI-powered automation.",
      },
      { property: "og:title", content: "Zuridoc - Generate Professional Documents in Minutes" },
      {
        property: "og:description",
        content:
          "Create professional business and legal documents in minutes with Zuridoc's AI-powered document automation platform.",
      },
      { property: "og:url", content: "https://www.zuridoc.com" },
      { name: "twitter:title", content: "Zuridoc - Generate Professional Documents in Minutes" },
      {
        name: "twitter:description",
        content: "AI-powered document generation for modern teams, founders, HR, legal, and operations.",
      },
    ],
  }),
});

const sidebarItems = [
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "AI Generator", icon: Bot },
  { name: "Templates", icon: FileCheck2 },
  { name: "My Documents", icon: FileText },
  { name: "Team Workspace", icon: Users },
  { name: "Billing", icon: CreditCard },
  { name: "Settings", icon: Settings },
];

const recentDocuments = ["Employment Contract", "Business Proposal", "NDA Agreement", "Invoice Template", "Quotation Document"];

const stats = [
  { label: "Documents Generated", value: "12.8k" },
  { label: "Time Saved", value: "4,920h" },
  { label: "Active Projects", value: "286" },
  { label: "Team Members", value: "1,140" },
];

const features = [
  {
    icon: Wand2,
    title: "AI document generator",
    description: "Turn a short prompt into polished contracts, proposals, invoices, HR letters, and agreements.",
  },
  {
    icon: ShieldCheck,
    title: "Enterprise-ready trust",
    description: "A clean, professional workspace built for teams that care about accuracy, privacy, and brand consistency.",
  },
  {
    icon: Clock3,
    title: "Minutes, not hours",
    description: "Move from first draft to ready-to-send documents faster with reusable templates and smart automation.",
  },
];

function Index() {
  const { user } = useAuth();
  const primaryHref = user ? "/dashboard" : "/login";

  return (
    <div className="min-h-screen scroll-smooth bg-white text-[#111827]">
      <Hero primaryHref={primaryHref} user={Boolean(user)} />
      <main>
        <TrustBand />
        <FeatureSection />
        <WorkflowSection primaryHref={primaryHref} />
      </main>
      <Footer />
    </div>
  );
}

function Hero({ primaryHref, user }: { primaryHref: string; user: boolean }) {
  return (
    <section className="relative min-h-[92vh] overflow-hidden bg-[linear-gradient(135deg,#011B43_0%,#012B6D_50%,#0067EC_100%)] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(234,244,255,0.22),transparent_28%),radial-gradient(circle_at_82%_8%,rgba(255,255,255,0.2),transparent_24%),linear-gradient(180deg,transparent_72%,#ffffff_100%)]" />
      <div className="relative mx-auto flex min-h-[92vh] max-w-7xl flex-col px-5 py-5 sm:px-8 lg:px-10">
        <motion.header
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="flex items-center justify-between rounded-2xl border border-white/15 bg-white/10 px-4 py-3 shadow-2xl shadow-[#011B43]/20 backdrop-blur-xl"
        >
          <Link to="/" className="flex h-12 w-[170px] items-center rounded-xl bg-white px-3 py-1.5 shadow-lg shadow-[#0067EC]/25 sm:w-[190px]">
            <img src="/logo to use.png" alt="Zuridoc" className="h-10 w-full object-contain object-left sm:h-11" />
          </Link>
          <nav className="hidden items-center gap-7 text-sm text-white/80 md:flex">
            <a href="#platform" className="transition hover:text-white">Platform</a>
            <a href="#workflow" className="transition hover:text-white">Workflow</a>
            <a href="#footer" className="transition hover:text-white">Company</a>
          </nav>
          <div className="flex items-center gap-2">
            {!user && (
              <Link to="/login" className="hidden rounded-xl px-4 py-2 text-sm font-medium text-white/85 transition hover:text-white sm:inline-flex">
                Sign in
              </Link>
            )}
            <Link
              to={primaryHref}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-[#011B43] shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:shadow-white/25"
            >
              {user ? "Open App" : "Start Free"}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.header>

        <div className="grid flex-1 items-center gap-10 py-12 lg:grid-cols-[0.88fr_1.12fr] lg:py-10">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.1 }}
            className="max-w-3xl"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-[#EAF4FF] backdrop-blur-xl">
              <Sparkles className="h-4 w-4 text-white" />
              Create Professional Documents in Minutes with AI
            </div>
            <div className="mb-7 inline-flex rounded-2xl bg-white px-5 py-4 shadow-2xl shadow-[#011B43]/20">
              <img src="/secondary logo.png" alt="Zuridoc" className="h-14 w-auto max-w-[230px] object-contain sm:h-16" />
            </div>
            <h1 className="text-5xl font-semibold leading-[1.02] tracking-normal sm:text-6xl lg:text-7xl">
              Generate Professional Documents in Minutes
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#EAF4FF] sm:text-xl">
              Create contracts, proposals, invoices, agreements, HR documents, legal paperwork, and business documents instantly with AI-powered automation.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                to={primaryHref}
                className="group inline-flex h-13 items-center justify-center gap-2 rounded-2xl bg-[#0067EC] px-7 text-base font-semibold text-white shadow-[0_0_34px_rgba(0,103,236,0.55)] transition hover:-translate-y-1 hover:shadow-[0_0_46px_rgba(0,103,236,0.8)]"
              >
                Start Free
                <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
              </Link>
              <a
                href="#platform"
                className="inline-flex h-13 items-center justify-center gap-2 rounded-2xl border border-white bg-transparent px-7 text-base font-semibold text-white transition hover:-translate-y-1 hover:bg-white/10"
              >
                <Play className="h-4 w-4 fill-current" />
                Watch Demo
              </a>
            </div>
          </motion.div>

          <DashboardMockup />
        </div>
      </div>
    </section>
  );
}

function DashboardMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 36, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.75, delay: 0.22 }}
      className="relative mx-auto w-full max-w-3xl"
    >
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -left-3 top-16 z-20 hidden rounded-2xl border border-white/30 bg-white/85 p-4 text-[#011B43] shadow-2xl shadow-[#011B43]/20 backdrop-blur-xl sm:block"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF4FF] text-[#0067EC]">
            <Sparkles className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-semibold">AI draft ready</p>
            <p className="text-xs text-slate-500">NDA generated in 42s</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
        className="absolute -right-2 bottom-16 z-20 hidden rounded-2xl border border-white/30 bg-white/90 p-4 text-[#011B43] shadow-2xl shadow-[#011B43]/20 backdrop-blur-xl md:block"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF4FF] text-[#0067EC]">
            <BarChart3 className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-semibold">83% faster</p>
            <p className="text-xs text-slate-500">Average creation time</p>
          </div>
        </div>
      </motion.div>

      <div className="overflow-hidden rounded-[24px] border border-white/20 bg-white/95 shadow-[0_32px_100px_rgba(1,27,67,0.35)]">
        <div className="flex h-12 items-center gap-2 border-b border-slate-200 bg-[#F8FAFC] px-5">
          <span className="h-3 w-3 rounded-full bg-red-400" />
          <span className="h-3 w-3 rounded-full bg-[#F59E0B]" />
          <span className="h-3 w-3 rounded-full bg-[#22C55E]" />
          <span className="ml-4 rounded-full bg-white px-4 py-1 text-xs font-medium text-slate-500">zuridoc.ai/dashboard</span>
        </div>
        <div className="grid min-h-[520px] grid-cols-[168px_1fr] bg-white text-[#111827] sm:grid-cols-[210px_1fr]">
          <aside className="border-r border-slate-200 bg-[#011B43] p-4 text-white">
            <div className="mb-6 flex items-center gap-2 text-sm font-semibold">
              <FileText className="h-5 w-5 text-[#0067EC]" />
              Workspace
            </div>
            <div className="space-y-1.5">
              {sidebarItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: 0.45 + index * 0.05 }}
                  className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs sm:text-sm ${index === 1 ? "bg-[#0067EC] text-white" : "text-white/72"}`}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="truncate">{item.name}</span>
                </motion.div>
              ))}
            </div>
          </aside>
          <div className="bg-[#F8FAFC] p-4 sm:p-6">
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[#0067EC]">AI Document Generator</p>
                <h2 className="mt-1 text-xl font-semibold text-[#011B43] sm:text-2xl">Generate from a simple prompt</h2>
              </div>
              <span className="rounded-full bg-[#EAF4FF] px-3 py-1 text-xs font-semibold text-[#0067EC]">Live</span>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-sm text-slate-500">Create an employment contract for a senior product designer in Nairobi...</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {["Contract", "Legal", "HR", "Kenya"].map((tag) => (
                  <span key={tag} className="rounded-full bg-[#EAF4FF] px-3 py-1 text-xs font-medium text-[#0067EC]">{tag}</span>
                ))}
              </div>
              <button className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#0067EC] px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-[#0067EC]/25">
                Generate Document <Sparkles className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_0.8fr]">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <h3 className="mb-3 text-sm font-semibold text-[#011B43]">Recent Documents</h3>
                <div className="space-y-2">
                  {recentDocuments.map((document, index) => (
                    <motion.div
                      key={document}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: 0.75 + index * 0.05 }}
                      className="flex items-center justify-between rounded-xl border border-slate-100 px-3 py-2"
                    >
                      <span className="flex items-center gap-2 text-sm text-slate-700">
                        <FileText className="h-4 w-4 text-[#0067EC]" />
                        {document}
                      </span>
                      <CheckCircle2 className="h-4 w-4 text-[#22C55E]" />
                    </motion.div>
                  ))}
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.35, delay: 0.65 + index * 0.06 }}
                    className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    <p className="text-2xl font-semibold text-[#011B43]">{stat.value}</p>
                    <p className="text-xs text-slate-500">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function TrustBand() {
  return (
    <section className="bg-white px-5 py-16 sm:px-8" id="platform">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.55 }}
        className="mx-auto max-w-7xl"
      >
        <div className="grid gap-4 rounded-[24px] border border-slate-200 bg-[#F8FAFC] p-5 shadow-xl shadow-slate-200/60 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <p className="text-3xl font-semibold text-[#011B43]">{stat.value}</p>
              <p className="mt-1 text-sm text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function FeatureSection() {
  return (
    <section className="bg-[#F8FAFC] px-5 py-20 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55 }}
          className="max-w-3xl"
        >
          <p className="text-sm font-semibold uppercase text-[#0067EC]">Modern AI workspace</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-normal text-[#011B43] sm:text-5xl">
            Simplicity, polish, trust, and speed in one document platform.
          </h2>
        </motion.div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="rounded-[24px] border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#0067EC]/10"
            >
              <div className="mb-6 flex h-13 w-13 items-center justify-center rounded-2xl bg-[#EAF4FF] text-[#0067EC]">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-[#011B43]">{feature.title}</h3>
              <p className="mt-3 leading-7 text-slate-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WorkflowSection({ primaryHref }: { primaryHref: string }) {
  return (
    <section id="workflow" className="bg-white px-5 py-20 sm:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55 }}
        >
          <p className="text-sm font-semibold uppercase text-[#0067EC]">Conversion-focused workflow</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-normal text-[#011B43] sm:text-5xl">
            From prompt to professional document without the blank page.
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            Zuridoc combines Notion's simplicity, Linear's polish, Stripe's spacing, DocuSign's trust, and a modern AI feel so teams can create documents with confidence.
          </p>
          <Link
            to={primaryHref}
            className="mt-8 inline-flex h-13 items-center gap-2 rounded-2xl bg-[#0067EC] px-7 font-semibold text-white shadow-[0_0_34px_rgba(0,103,236,0.35)] transition hover:-translate-y-1"
          >
            Start Free <ArrowRight className="h-5 w-5" />
          </Link>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55 }}
          className="grid gap-4 sm:grid-cols-2"
        >
          {[
            { icon: FileText, title: "Contracts", body: "Employment, vendor, service, and partnership agreements." },
            { icon: FolderKanban, title: "Proposals", body: "Win-ready business proposals and quotations." },
            { icon: WalletCards, title: "Invoices", body: "Clean invoice templates for modern teams." },
            { icon: Users, title: "HR documents", body: "Offer letters, policies, notices, and team paperwork." },
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.45, delay: index * 0.07 }}
              className="rounded-[24px] border border-slate-200 bg-[#F8FAFC] p-6 transition hover:-translate-y-1 hover:bg-[#EAF4FF]"
            >
              <item.icon className="h-7 w-7 text-[#0067EC]" />
              <h3 className="mt-5 text-lg font-semibold text-[#011B43]">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.body}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer id="footer" className="bg-[#011B43] px-5 py-12 text-white sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="inline-flex rounded-2xl bg-white px-4 py-3">
            <img src="/primary logo.png" alt="Zuridoc" className="h-10 w-auto object-contain" />
          </div>
          <p className="mt-3 max-w-md text-sm leading-6 text-white/70">
            Create Professional Documents in Minutes with AI.
          </p>
        </div>
        <div className="flex flex-wrap gap-5 text-sm text-white/75">
          <a href="#platform" className="transition hover:text-[#0067EC]">Platform</a>
          <a href="#workflow" className="transition hover:text-[#0067EC]">Workflow</a>
          <Link to="/login" className="transition hover:text-[#0067EC]">Sign in</Link>
          <Link to="/login" className="transition hover:text-[#0067EC]">Start Free</Link>
        </div>
      </div>
    </footer>
  );
}