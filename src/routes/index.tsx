import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
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
  Menu,
  Settings,
  ShieldCheck,
  Sparkles,
  Users,
  WalletCards,
  Wand2,
  X,
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

const landingNavItems = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Templates", href: "#templates" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

const stats = [
  { label: "Documents Generated", value: "12.8k" },
  { label: "Time Saved", value: "4,920h" },
  { label: "Active Projects", value: "286" },
  { label: "Team Members", value: "1,140" },
];


const trustLogos = ["Safaricom", "KCB", "Jade Empire", "Atei DevOps", "Vitu IT"];
const readyTemplates = ["Employment Contracts", "NDAs", "Business Proposals", "Quotations", "Invoices", "HR Policies", "Service Agreements", "Company Profiles", "Partnership Agreements", "Business Plans"];
const testimonials = [
  { quote: "Reduced our document creation time by 90%.", name: "Operations Lead", company: "Atei DevOps" },
  { quote: "Generated client proposals in minutes instead of hours.", name: "Founder", company: "Jade Empire" },
  { quote: "Saved our HR team hours every week.", name: "HR Manager", company: "Vitu IT" },
];
const pricingPlans = [
  { name: "Free", price: "$0", body: "Start creating simple documents.", perks: ["5 documents/month", "PDF exports", "Basic templates"] },
  { name: "Starter", price: "$9/mo", body: "For solo professionals and founders.", perks: ["50 documents/month", "PDF and DOCX", "Share links"] },
  { name: "Pro", price: "$29/mo", body: "For growing teams and agencies.", perks: ["Unlimited documents", "Team members", "Custom branding"], featured: true },
  { name: "Enterprise", price: "Custom", body: "For organizations with advanced needs.", perks: ["Role permissions", "Shared templates", "Dedicated support"] },
];
const faqs = [
  ["Is my data secure?", "Zuridoc is designed around private workspaces, secure authentication, and document ownership."],
  ["Can I export to PDF?", "Yes. You can export polished documents to PDF and other business-ready formats."],
  ["Can I edit generated documents?", "Yes. Every draft can be customized, branded, edited, exported, and reused."],
  ["Do you support Kenya legal documents?", "Zuridoc supports business and legal drafting workflows useful for Kenyan teams and professionals."],
  ["Can teams collaborate?", "Team workspaces, shared templates, role permissions, comments, and version history are part of the business workflow."],
  ["Do you store my documents?", "Documents are saved to your workspace so you can return, edit, export, and share when needed."],
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
        <HowItWorksSection />
        <TemplatesShowcase primaryHref={primaryHref} />
        <LivePreviewSection />
        <FeatureSection />
        <WorkflowSection primaryHref={primaryHref} />
        <SecurityFaqSection />
        <FinalCtaSection primaryHref={primaryHref} />
      </main>
      <Footer />
    </div>
  );
}

function Hero({ primaryHref, user }: { primaryHref: string; user: boolean }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const primaryLabel = user ? "Open App" : "Start Free";

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <section className="relative min-h-[92vh] overflow-hidden bg-[linear-gradient(135deg,#011B43_0%,#012B6D_50%,#0067EC_100%)] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(234,244,255,0.22),transparent_28%),radial-gradient(circle_at_82%_8%,rgba(255,255,255,0.2),transparent_24%),linear-gradient(180deg,transparent_72%,#ffffff_100%)]" />
      <div className="relative mx-auto flex min-h-[92vh] max-w-7xl flex-col px-4 py-4 sm:px-8 sm:py-5 lg:px-10">
        <motion.header
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="relative z-30 flex items-center justify-between gap-3 rounded-2xl border border-white/15 bg-white/10 px-3 py-3 shadow-2xl shadow-[#011B43]/20 backdrop-blur-xl sm:px-4"
        >
          <Link to="/" className="flex h-12 w-[170px] shrink-0 items-center justify-center rounded-xl bg-white px-3 py-1.5 shadow-lg shadow-[#0067EC]/25 sm:w-[190px]">
            <img src="/logo to use.png" alt="Zuridoc" className="h-10 w-full object-contain object-center sm:h-11" />
          </Link>
          <nav className="hidden items-center gap-7 text-sm text-white/80 md:flex">
            {landingNavItems.map((item) => (
              <a key={item.href} href={item.href} className="transition hover:text-white">{item.label}</a>
            ))}
          </nav>
          <div className="hidden items-center gap-2 md:flex">
            {!user && (
              <Link to="/login" className="hidden rounded-xl px-4 py-2 text-sm font-medium text-white/85 transition hover:text-white sm:inline-flex">
                Sign in
              </Link>
            )}
            <Link
              to={primaryHref}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-[#011B43] shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:shadow-white/25"
            >
              {primaryLabel}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <button
            type="button"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white text-[#011B43] shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:bg-[#EAF4FF] md:hidden"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </motion.header>

        <motion.div
          initial={false}
          animate={mobileMenuOpen ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: -10, scale: 0.98 }}
          transition={{ duration: 0.18 }}
          className={`relative z-20 mt-3 overflow-hidden rounded-2xl border border-white/15 bg-white p-2 text-[#011B43] shadow-2xl shadow-[#011B43]/25 md:hidden ${mobileMenuOpen ? "pointer-events-auto" : "pointer-events-none hidden"}`}
        >
          <nav className="grid gap-1" aria-label="Mobile navigation">
            {landingNavItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={closeMobileMenu}
                className="rounded-xl px-4 py-3 text-base font-semibold transition hover:bg-[#EAF4FF] hover:text-[#0067EC]"
              >
                {item.label}
              </a>
            ))}
            {!user && (
              <Link
                to="/login"
                onClick={closeMobileMenu}
                className="rounded-xl px-4 py-3 text-base font-semibold transition hover:bg-[#EAF4FF] hover:text-[#0067EC]"
              >
                Sign in
              </Link>
            )}
            <Link
              to={primaryHref}
              onClick={closeMobileMenu}
              className="mt-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#0067EC] px-4 py-3 text-base font-semibold text-white shadow-lg shadow-[#0067EC]/25"
            >
              {primaryLabel}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </nav>
        </motion.div>

        <div className="grid flex-1 items-center gap-10 py-10 sm:py-12 lg:grid-cols-[0.88fr_1.12fr] lg:py-10">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.1 }}
            className="max-w-3xl"
          >
            <div className="mb-5 inline-flex max-w-full items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-[#EAF4FF] backdrop-blur-xl">
              <Sparkles className="h-4 w-4 shrink-0 text-white" />
              <span className="min-w-0 whitespace-normal leading-5">Create Professional Documents in Minutes with AI</span>
            </div>
            <div className="mb-7 inline-flex max-w-full rounded-2xl bg-white px-5 py-4 shadow-2xl shadow-[#011B43]/20">
              <img src="/secondary logo.png" alt="Zuridoc" className="h-14 w-auto max-w-[min(230px,100%)] object-contain sm:h-16" />
            </div>
            <h1 className="text-[clamp(2.35rem,13.5vw,4.2rem)] font-semibold leading-[1.04] tracking-normal sm:text-6xl lg:text-7xl">
              Generate Professional Documents in Minutes
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#EAF4FF] sm:text-xl">
              Create contracts, proposals, invoices, agreements, HR documents, legal paperwork, and business documents instantly with AI-powered automation.
            </p>
            <div className="mt-8 flex flex-wrap gap-4 sm:mt-9">
              <Link
                to={primaryHref}
                className="group inline-flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-[#0067EC] px-7 text-base font-semibold text-white shadow-[0_0_34px_rgba(0,103,236,0.55)] transition hover:-translate-y-1 hover:shadow-[0_0_46px_rgba(0,103,236,0.8)] sm:w-auto"
              >
                Start Free
                <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
              </Link>
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
      className="relative mx-auto w-full max-w-3xl overflow-hidden sm:overflow-visible"
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
        <div className="flex h-11 items-center gap-2 border-b border-slate-200 bg-[#F8FAFC] px-3 sm:h-12 sm:px-5">
          <span className="h-3 w-3 rounded-full bg-red-400" />
          <span className="h-3 w-3 rounded-full bg-[#F59E0B]" />
          <span className="h-3 w-3 rounded-full bg-[#22C55E]" />
          <span className="ml-2 min-w-0 flex-1 rounded-full bg-white px-3 py-1 text-center text-[10px] font-medium text-slate-500 sm:ml-4 sm:px-4 sm:text-xs">zuridoc.ai/dashboard</span>
        </div>
        <div className="grid min-h-0 grid-cols-1 bg-white text-[#111827] sm:min-h-[520px] sm:grid-cols-[210px_1fr]">
          <aside className="hidden border-r border-slate-200 bg-[#011B43] p-4 text-white sm:block">
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
          <div className="min-w-0 bg-[#F8FAFC] p-3 sm:p-6">
            <div className="mb-4 flex items-start justify-between gap-3 sm:mb-5">
              <div>
                <p className="text-xs font-semibold uppercase text-[#0067EC]">AI Document Generator</p>
                <h2 className="mt-1 text-lg font-semibold leading-tight text-[#011B43] sm:text-2xl">Generate from a simple prompt</h2>
              </div>
              <span className="shrink-0 rounded-full bg-[#EAF4FF] px-3 py-1 text-xs font-semibold text-[#0067EC]">Live</span>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
              <p className="text-sm text-slate-500">Create an employment contract for a senior product designer in Nairobi...</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {["Contract", "Legal", "HR", "Kenya"].map((tag) => (
                  <span key={tag} className="rounded-full bg-[#EAF4FF] px-3 py-1 text-xs font-medium text-[#0067EC]">{tag}</span>
                ))}
              </div>
              <button className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0067EC] px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-[#0067EC]/25 sm:w-auto">
                Generate Document <Sparkles className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 grid gap-3 sm:mt-5 sm:gap-4 lg:grid-cols-[1fr_0.8fr]">
              <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
                <h3 className="mb-3 text-sm font-semibold text-[#011B43]">Recent Documents</h3>
                <div className="space-y-2">
                  {recentDocuments.map((document, index) => (
                    <motion.div
                      key={document}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: 0.75 + index * 0.05 }}
                      className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 px-3 py-2"
                    >
                      <span className="flex min-w-0 items-center gap-2 text-sm text-slate-700">
                        <FileText className="h-4 w-4 shrink-0 text-[#0067EC]" />
                        <span className="min-w-0 truncate">{document}</span>
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

function HowItWorksSection() {
  const steps = [
    { icon: FileText, title: "Describe your document", body: "Tell Zuridoc what you need in plain language." },
    { icon: Sparkles, title: "AI generates a draft", body: "Get a structured first version with business-ready wording." },
    { icon: Wand2, title: "Customize and edit", body: "Adjust tone, details, branding, parties, and sections." },
    { icon: FileCheck2, title: "Download or share", body: "Export to PDF, DOCX, image, print, or share link." },
  ];
  return (
    <section id="how-it-works" className="bg-[#F8FAFC] px-5 py-20 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader eyebrow="How it works" title="Prompt, generate, edit, export." body="A clear process helps visitors understand exactly how Zuridoc turns an idea into a professional document." />
        <div className="mt-10 grid gap-4 md:grid-cols-4">
          {steps.map((step, index) => (
            <div key={step.title} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#EAF4FF] text-[#0067EC]"><step.icon className="h-5 w-5" /></span>
                <span className="text-sm font-semibold text-slate-300">0{index + 1}</span>
              </div>
              <h3 className="mt-6 text-lg font-semibold text-[#011B43]">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TemplatesShowcase({ primaryHref }: { primaryHref: string }) {
  return (
    <section id="templates" className="bg-white px-5 py-20 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader eyebrow="100+ ready-made templates" title="Show visitors exactly what they can create." body="Cover everyday business, HR, legal, finance, and operations documents with reusable AI-ready templates." />
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {readyTemplates.map((template) => (
            <div key={template} className="rounded-lg border border-slate-200 bg-[#F8FAFC] p-4 text-sm font-semibold text-[#011B43]"><CheckCircle2 className="mb-3 h-4 w-4 text-[#0067EC]" />{template}</div>
          ))}
        </div>
        <div className="mt-8 text-center"><Link to={primaryHref} className="inline-flex h-12 items-center gap-2 rounded-lg bg-[#0067EC] px-6 font-semibold text-white shadow-lg shadow-[#0067EC]/20 transition hover:-translate-y-1">Explore Templates <ArrowRight className="h-5 w-5" /></Link></div>
      </div>
    </section>
  );
}

function LivePreviewSection() {
  return (
    <section className="bg-[#F8FAFC] px-5 py-20 sm:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase text-[#0067EC]">Live document preview</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-normal text-[#011B43] sm:text-5xl">Make the product tangible before signup.</h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">Show contracts, invoices, proposals, and HR letters as real outputs so visitors know what Zuridoc creates.</p>
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {["PDF", "DOCX", "Google Docs", "Share Link", "Print Ready"].map((item) => <div key={item} className="rounded-lg border border-slate-200 bg-white p-4 font-semibold text-[#011B43]"><FileCheck2 className="mb-2 h-5 w-5 text-[#0067EC]" />{item}</div>)}
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-200/70">
          <div className="rounded-lg border border-slate-200 bg-[#F8FAFC] p-6">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-5"><div><p className="text-xs font-semibold uppercase text-[#0067EC]">Proposal Preview</p><h3 className="mt-2 text-2xl font-semibold text-[#011B43]">Digital Transformation Proposal</h3></div><FileText className="h-10 w-10 text-[#0067EC]" /></div>
            <div className="mt-5 space-y-3"><div className="h-3 w-2/3 rounded-full bg-slate-300" /><div className="h-3 w-full rounded-full bg-slate-200" /><div className="h-3 w-11/12 rounded-full bg-slate-200" /><div className="h-3 w-4/5 rounded-full bg-slate-200" /></div>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">{["Contract", "Invoice", "HR Letter"].map((item) => <div key={item} className="rounded-lg bg-white p-4 text-sm font-semibold text-[#011B43] shadow-sm">{item}</div>)}</div>
            <button className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#011B43] px-5 py-3 font-semibold text-white"><Sparkles className="h-5 w-5" /> Watch 60-second demo</button>
          </div>
        </div>
      </div>
    </section>
  );
}
function SectionHeader({ eyebrow, title, body }: { eyebrow: string; title: string; body?: string }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="text-sm font-semibold uppercase text-[#0067EC]">{eyebrow}</p>
      <h2 className="mt-3 text-4xl font-semibold tracking-normal text-[#011B43] sm:text-5xl">{title}</h2>
      {body && <p className="mt-5 text-lg leading-8 text-slate-600">{body}</p>}
    </div>
  );
}

function TrustProofSection() {
  return (
    <section className="bg-[#F8FAFC] px-5 py-20 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader eyebrow="Trust and proof" title="Give visitors reasons to believe." body="Company logos, testimonials, and clear security language make Zuridoc feel more mature and reliable." />
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {trustLogos.map((logo) => <div key={logo} className="rounded-lg border border-slate-200 bg-white px-5 py-4 text-center font-semibold text-[#011B43]">{logo}</div>)}
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {testimonials.map((item) => (
            <div key={item.company} className="rounded-lg border border-slate-200 bg-white p-7 shadow-sm">
              <Sparkles className="h-8 w-8 text-[#0067EC]" />
              <p className="mt-5 text-xl font-semibold leading-8 text-[#011B43]">"{item.quote}"</p>
              <p className="mt-6 text-sm font-semibold text-slate-700">{item.name}</p>
              <p className="text-sm text-slate-500">{item.company}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingSection({ primaryHref }: { primaryHref: string }) {
  return (
    <section id="pricing" className="bg-white px-5 py-20 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader eyebrow="Pricing" title="Clear plans before signup." body="Visitors should not have to create an account to understand the value." />
        <div className="mt-10 grid gap-5 lg:grid-cols-4">
          {pricingPlans.map((plan) => (
            <div key={plan.name} className={`rounded-lg border p-6 shadow-sm ${plan.featured ? "border-[#0067EC] bg-[#011B43] text-white" : "border-slate-200 bg-[#F8FAFC] text-[#011B43]"}`}>
              <h3 className="text-xl font-semibold">{plan.name}</h3>
              <p className={`mt-2 text-sm ${plan.featured ? "text-white/70" : "text-slate-600"}`}>{plan.body}</p>
              <p className="mt-6 text-4xl font-semibold">{plan.price}</p>
              <ul className="mt-6 space-y-3">{plan.perks.map((perk) => <li key={perk} className="flex items-center gap-3 text-sm"><CheckCircle2 className={`h-4 w-4 ${plan.featured ? "text-white" : "text-[#0067EC]"}`} />{perk}</li>)}</ul>
              <Link to={primaryHref} className={`mt-7 inline-flex h-11 w-full items-center justify-center rounded-lg font-semibold ${plan.featured ? "bg-white text-[#011B43]" : "bg-[#0067EC] text-white"}`}>Get Started</Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SecurityFaqSection() {
  const securityItems = ["Encrypted Storage", "GDPR Ready", "Secure Authentication", "Data Ownership", "Private Documents"];
  const integrations = ["Google Drive", "Dropbox", "OneDrive", "Slack", "Notion", "Zapier", "Supabase"];
  return (
    <section id="faq" className="bg-[#F8FAFC] px-5 py-20 sm:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-7 shadow-sm">
          <ShieldCheck className="h-10 w-10 text-[#0067EC]" />
          <h2 className="mt-5 text-3xl font-semibold text-[#011B43]">Security, privacy, and integrations.</h2>
          <div className="mt-6 grid gap-3">{securityItems.map((item) => <div key={item} className="flex items-center gap-3 rounded-lg bg-[#F8FAFC] p-4 font-semibold text-[#011B43]"><ShieldCheck className="h-5 w-5 text-[#0067EC]" />{item}</div>)}</div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">{integrations.map((item) => <div key={item} className="rounded-lg border border-slate-200 p-3 text-sm font-semibold text-[#011B43]">{item}<span className="ml-2 text-xs font-medium text-slate-500">Coming soon</span></div>)}</div>
        </div>
        <div>
          <SectionHeader eyebrow="FAQ" title="Remove objections before signup." />
          <div className="mt-8 divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white">
            {faqs.map(([q, a]) => (
              <details key={q} className="group p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-[#011B43]">{q}<span className="text-[#0067EC] transition group-open:rotate-45">+</span></summary>
                <p className="mt-3 leading-7 text-slate-600">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FinalCtaSection({ primaryHref }: { primaryHref: string }) {
  return (
    <section className="bg-white px-5 py-20 sm:px-8">
      <div className="mx-auto max-w-7xl rounded-lg bg-[#011B43] p-8 text-white shadow-2xl shadow-[#011B43]/25 sm:p-12 lg:flex lg:items-center lg:justify-between lg:gap-10">
        <div className="max-w-3xl"><p className="text-sm font-semibold uppercase text-[#8EC5FF]">Ready to create professional documents in minutes?</p><h2 className="mt-3 text-4xl font-semibold tracking-normal sm:text-5xl">Generate contracts, proposals, invoices, and business documents instantly with AI.</h2></div>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:mt-0"><Link to={primaryHref} className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#0067EC] px-6 font-semibold text-white">Start Free <ArrowRight className="h-5 w-5" /></Link><a href="mailto:hello@zuridoc.com" className="inline-flex h-12 items-center justify-center rounded-lg border border-white/20 px-6 font-semibold text-white">Book Demo</a></div>
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
          <a href="#how-it-works" className="transition hover:text-[#0067EC]">How it works</a>
          <a href="#templates" className="transition hover:text-[#0067EC]">Templates</a>          <a href="#faq" className="transition hover:text-[#0067EC]">FAQ</a>
          <Link to="/login" className="transition hover:text-[#0067EC]">Sign in</Link>
          <Link to="/login" className="transition hover:text-[#0067EC]">Start Free</Link>
          <Link to="/privacy-policy" className="transition hover:text-[#0067EC]">Privacy Policy</Link>
          <Link to="/terms-of-service" className="transition hover:text-[#0067EC]">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}