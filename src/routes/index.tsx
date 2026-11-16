import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  FileDown,
  Menu,
  Palette,
  PenLine,
  QrCode,
  Send,
  Sparkles,
  Stamp,
  X,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const FONT_HREF =
  "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Zuridoc - Invoices, quotations and letterheads, ready to send" },
      {
        name: "description",
        content:
          "Set up your brand once, then create invoices, receipts, quotations, delivery notes and letterheads in minutes. Export to PDF, Word or PNG, or send a share link.",
      },
      {
        property: "og:title",
        content: "Zuridoc - Invoices, quotations and letterheads, ready to send",
      },
      {
        property: "og:description",
        content:
          "Branded business documents in minutes, with AI writing help and export to PDF, Word and PNG.",
      },
      { property: "og:url", content: "https://www.zuridoc.com" },
      {
        name: "twitter:title",
        content: "Zuridoc - Invoices, quotations and letterheads, ready to send",
      },
      {
        name: "twitter:description",
        content: "Create, customize and send branded business documents in minutes.",
      },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: FONT_HREF },
    ],
  }),
});

const navItems = [
  { label: "Documents", href: "#documents" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "FAQ", href: "#faq" },
];

type SampleId = "invoice" | "quotation" | "receipt" | "delivery" | "letter";

const samples: { id: SampleId; tab: string; label: string; number: string; note: string }[] = [
  { id: "invoice", tab: "Invoice", label: "INVOICE", number: "INV-0042", note: "Due 30 Nov 2026" },
  {
    id: "quotation",
    tab: "Quotation",
    label: "QUOTATION",
    number: "QT-0118",
    note: "Valid for 14 days",
  },
  { id: "receipt", tab: "Receipt", label: "RECEIPT", number: "RC-0307", note: "Paid in full" },
  {
    id: "delivery",
    tab: "Delivery note",
    label: "DELIVERY NOTE",
    number: "DN-0076",
    note: "3 packages",
  },
  { id: "letter", tab: "Letterhead", label: "", number: "", note: "" },
];

const brandColors = [
  { name: "Zuridoc blue", value: "#0067EC" },
  { name: "Forest", value: "#0F766E" },
  { name: "Terracotta", value: "#C2410C" },
  { name: "Plum", value: "#7E22CE" },
  { name: "Ink", value: "#111827" },
];

const lineItems = [
  { description: "Office chairs, mesh back", qty: 6, price: 14500 },
  { description: "Standing desk, 140 cm", qty: 2, price: 38000 },
  { description: "Delivery and assembly", qty: 1, price: 6500 },
];

const documentTypes = [
  {
    name: "Invoices",
    body: "Bill clients for products or services, with tax, discounts and payment status.",
    href: "#top",
  },
  { name: "Quotations", body: "Send a price estimate your client can say yes to.", href: "#top" },
  { name: "Receipts", body: "Confirm a payment the moment it lands.", href: "#top" },
  {
    name: "Delivery notes",
    body: "List what shipped and leave room for a signature on arrival.",
    href: "#top",
  },
  {
    name: "Letterheads",
    body: "Write official letters on your own stationery, with AI help on the wording.",
    href: "#top",
  },
];

const steps = [
  {
    word: "Create",
    body: "Pick a document type and a template. Your business details, logo and colours are already in place.",
  },
  {
    word: "Customize",
    body: "Add line items, terms and notes. Sign it, stamp it, drop in a QR code, or ask the AI assistant to draft the letter.",
  },
  {
    word: "Send",
    body: "Export to PDF, Word or PNG, copy it as an email, or send a share link. Mark it sent, then paid.",
  },
];

const features = [
  {
    icon: Palette,
    title: "One brand kit",
    body: "Upload your logo once. Zuridoc picks up its colours and applies them to every document you make.",
  },
  {
    icon: Sparkles,
    title: "AI writing help",
    body: "Describe the letter you need and get a draft in your tone. Edit every word before it goes out.",
  },
  {
    icon: PenLine,
    title: "Signature and stamp",
    body: "Draw your signature on screen and add your company stamp, so nothing has to be printed to be signed.",
  },
  {
    icon: QrCode,
    title: "QR codes",
    body: "Add a QR code to any document, so whoever is holding the paper can scan it to check the details.",
  },
  {
    icon: FileDown,
    title: "Every format",
    body: "PDF for sending, Word for editing, PNG for chat apps, and HTML for pasting straight into an email.",
  },
  {
    icon: Send,
    title: "Share and track",
    body: "Send a link instead of an attachment, and keep each document's status: draft, sent, partial or paid.",
  },
];

const faqs = [
  [
    "What can I make with Zuridoc?",
    "Invoices, receipts, quotations, delivery notes and letterheads. Each comes with several templates that use your logo and colours.",
  ],
  [
    "Can I edit a document after I create it?",
    "Yes. Documents are saved to your account, so you can reopen, change, duplicate and export them whenever you need.",
  ],
  [
    "Which formats can I export?",
    "PDF, Word (DOCX) and PNG. You can also copy a document as email-ready HTML or send a share link.",
  ],
  [
    "Does the AI write the whole document?",
    "The AI assistant drafts and rewrites letter text from a short description. Figures, parties and terms stay under your control.",
  ],
  [
    "Who can see my documents?",
    "Only you, after signing in. A document becomes visible to someone else only when you send them its share link.",
  ],
  [
    "Does it work on my phone?",
    "Yes. You can create, sign and send documents from a phone browser.",
  ],
];

const money = (value: number) => value.toLocaleString("en-KE");

function Index() {
  const { user } = useAuth();
  const primaryHref = user ? "/dashboard" : "/login";
  const primaryLabel = user ? "Open app" : "Start free";

  return (
    <MotionConfig reducedMotion="user">
      <div id="top" className="landing min-h-screen scroll-smooth bg-[#F6F4EE] text-[#011B43]">
        <SiteHeader
          primaryHref={primaryHref}
          primaryLabel={primaryLabel}
          signedIn={Boolean(user)}
        />
        <main>
          <Hero primaryHref={primaryHref} primaryLabel={primaryLabel} />
          <DocumentsSection />
          <StepsSection />
          <FeaturesSection />
          <FaqSection />
          <FinalCta primaryHref={primaryHref} primaryLabel={primaryLabel} />
        </main>
        <Footer primaryHref={primaryHref} primaryLabel={primaryLabel} />
      </div>
    </MotionConfig>
  );
}

function SiteHeader({
  primaryHref,
  primaryLabel,
  signedIn,
}: {
  primaryHref: string;
  primaryLabel: string;
  signedIn: boolean;
}) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="sticky top-0 z-40 border-b border-[#011B43]/10 bg-[#F6F4EE]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link to="/" className="flex shrink-0 items-center" aria-label="Zuridoc home">
          <img src="/logo to use.png" alt="Zuridoc" className="h-14 w-auto object-contain" />
        </Link>
        <nav
          className="hidden items-center gap-8 text-sm font-medium text-[#011B43]/70 md:flex"
          aria-label="Main"
        >
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="transition-colors hover:text-[#011B43]">
              {item.label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          {!signedIn && (
            <Link
              to="/login"
              className="rounded-full px-4 py-2 text-sm font-semibold text-[#011B43]/80 transition-colors hover:text-[#011B43]"
            >
              Sign in
            </Link>
          )}
          <Link
            to={primaryHref}
            className="inline-flex items-center gap-2 rounded-full bg-[#011B43] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0067EC]"
          >
            {primaryLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <button
          type="button"
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#011B43]/15 text-[#011B43] md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <nav
          className="border-t border-[#011B43]/10 bg-[#F6F4EE] px-5 pb-5 pt-2 md:hidden"
          aria-label="Mobile"
        >
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={close}
              className="block border-b border-[#011B43]/10 py-3.5 text-base font-semibold"
            >
              {item.label}
            </a>
          ))}
          {!signedIn && (
            <Link
              to="/login"
              onClick={close}
              className="block border-b border-[#011B43]/10 py-3.5 text-base font-semibold"
            >
              Sign in
            </Link>
          )}
          <Link
            to={primaryHref}
            onClick={close}
            className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#011B43] text-base font-semibold text-white"
          >
            {primaryLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </nav>
      )}
    </header>
  );
}

function Hero({ primaryHref, primaryLabel }: { primaryHref: string; primaryLabel: string }) {
  return (
    <section className="mx-auto grid max-w-7xl gap-12 px-5 pb-16 pt-12 sm:px-8 sm:pt-16 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-14 lg:pb-24 lg:pt-20">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="min-w-0"
      >
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#0067EC]">
          Create. Customize. Send.
        </p>
        <h1 className="landing-display mt-5 text-[clamp(2.6rem,7.2vw,4.75rem)] font-medium leading-[1.02] tracking-[-0.02em]">
          Paperwork that looks as good as <em className="font-normal text-[#0067EC]">your work.</em>
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-8 text-[#011B43]/75">
          Set up your brand once. Zuridoc puts it on every invoice, quotation, receipt, delivery
          note and letter you send, ready as a PDF in minutes.
        </p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            to={primaryHref}
            className="group inline-flex h-14 items-center justify-center gap-2 rounded-full bg-[#0067EC] px-8 text-base font-semibold text-white transition-colors hover:bg-[#011B43]"
          >
            {primaryLabel}
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
          <a
            href="#how-it-works"
            className="inline-flex h-14 items-center justify-center rounded-full border border-[#011B43]/20 px-8 text-base font-semibold transition-colors hover:border-[#011B43]"
          >
            See how it works
          </a>
        </div>
        <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-[#011B43]/70">
          {["Free to start", "No design skills needed", "Works on your phone"].map((item) => (
            <li key={item} className="flex items-center gap-2">
              <Check className="h-4 w-4 text-[#0067EC]" />
              {item}
            </li>
          ))}
        </ul>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.12, ease: "easeOut" }}
        className="min-w-0"
      >
        <DocumentDemo />
      </motion.div>
    </section>
  );
}

function DocumentDemo() {
  const [sampleId, setSampleId] = useState<SampleId>("invoice");
  const [color, setColor] = useState(brandColors[0].value);
  const sample = samples.find((item) => item.id === sampleId) ?? samples[0];

  return (
    <div className="rounded-[28px] bg-[#011B43] p-4 sm:p-7">
      <div
        role="tablist"
        aria-label="Document type"
        className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1"
      >
        {samples.map((item) => {
          const active = item.id === sampleId;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setSampleId(item.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                active
                  ? "bg-white text-[#011B43]"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              {item.tab}
            </button>
          );
        })}
      </div>

      <div className="@container relative mx-auto mt-6 w-full max-w-[430px]">
        <div
          aria-hidden
          className="absolute inset-0 translate-x-3 translate-y-3 rotate-[2.5deg] rounded-[3px] bg-white/25"
        />
        <div className="relative aspect-[1/1.38] overflow-hidden rounded-[3px] bg-white text-[2.55cqw] text-slate-800 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={sample.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22 }}
              className="absolute inset-0 flex flex-col"
            >
              <SamplePaper sample={sample} color={color} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-white/60">
            Brand colour
          </span>
          <div className="flex gap-2">
            {brandColors.map((item) => (
              <button
                key={item.value}
                type="button"
                aria-label={item.name}
                aria-pressed={color === item.value}
                onClick={() => setColor(item.value)}
                style={{ backgroundColor: item.value }}
                className={`h-7 w-7 rounded-full border-2 transition-transform focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                  color === item.value
                    ? "scale-110 border-white"
                    : "border-white/25 hover:scale-105"
                }`}
              />
            ))}
          </div>
        </div>
        <div className="flex gap-1.5 text-xs font-semibold text-white/80">
          {["PDF", "DOCX", "PNG"].map((format) => (
            <span key={format} className="rounded-full border border-white/20 px-3 py-1">
              {format}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function SamplePaper({ sample, color }: { sample: (typeof samples)[number]; color: string }) {
  const isLetter = sample.id === "letter";
  const isDelivery = sample.id === "delivery";
  const subtotal = lineItems.reduce((sum, item) => sum + item.qty * item.price, 0);
  const tax = Math.round(subtotal * 0.16);

  return (
    <>
      <div
        className="h-[1.2em] transition-colors duration-300"
        style={{ backgroundColor: color }}
      />
      <div className="flex flex-1 flex-col px-[3.4em] pb-[2.6em] pt-[2.6em]">
        <div className="flex items-start justify-between gap-[1em]">
          <div className="flex items-center gap-[0.9em]">
            <span
              className="landing-display flex h-[2.6em] w-[2.6em] items-center justify-center rounded-full text-[1.3em] font-semibold text-white transition-colors duration-300"
              style={{ backgroundColor: color }}
            >
              B
            </span>
            <div>
              <p className="text-[1.25em] font-bold leading-tight text-slate-900">
                Baraka Supplies Ltd
              </p>
              <p className="text-[0.82em] text-slate-500">Mombasa Road, Nairobi</p>
            </div>
          </div>
          {!isLetter && (
            <div className="text-right">
              <p
                className="text-[1.3em] font-bold tracking-[0.08em] transition-colors duration-300"
                style={{ color }}
              >
                {sample.label}
              </p>
              <p className="text-[0.85em] text-slate-500">{sample.number}</p>
            </div>
          )}
        </div>

        {isLetter ? (
          <div className="mt-[3em] flex flex-1 flex-col text-[0.95em] leading-[1.65] text-slate-700">
            <p className="text-slate-500">16 November 2026</p>
            <p className="mt-[1.4em]">Dear Ms. Wanjiru,</p>
            <p className="mt-[0.9em] font-bold text-slate-900">
              Re: Confirmation of supply agreement
            </p>
            <p className="mt-[0.9em]">
              Thank you for choosing Baraka Supplies for your new office. This letter confirms the
              furniture order agreed on 12 November and our delivery to your premises within ten
              working days.
            </p>
            <p className="mt-[0.9em]">
              Assembly is included, and every item carries a twelve-month warranty. Please reach out
              if anything in the schedule needs to change.
            </p>
            <p className="mt-[0.9em]">Yours sincerely,</p>
            <Signature color={color} />
            <p className="font-bold text-slate-900">Daniel Otieno</p>
            <p className="text-[0.88em] text-slate-500">Managing Director</p>
            <div
              className="mt-auto border-t pt-[0.9em] text-[0.8em] text-slate-500 transition-colors duration-300"
              style={{ borderColor: color }}
            >
              +254 700 000 000 · hello@barakasupplies.example · barakasupplies.example
            </div>
          </div>
        ) : (
          <>
            <div className="mt-[2.4em] grid grid-cols-2 gap-[1em] text-[0.85em]">
              <div>
                <p className="font-bold uppercase tracking-[0.1em] text-slate-400">
                  {isDelivery ? "Deliver to" : "Bill to"}
                </p>
                <p className="mt-[0.3em] font-bold text-slate-900">Wanjiru &amp; Co. Advocates</p>
                <p className="text-slate-500">Westlands, Nairobi</p>
              </div>
              <div className="text-right">
                <p className="font-bold uppercase tracking-[0.1em] text-slate-400">Date</p>
                <p className="mt-[0.3em] font-bold text-slate-900">16 Nov 2026</p>
                <p className="text-slate-500">{sample.note}</p>
              </div>
            </div>

            <table className="mt-[2em] w-full text-left text-[0.88em]">
              <thead>
                <tr
                  className="text-white transition-colors duration-300"
                  style={{ backgroundColor: color }}
                >
                  <th className="px-[0.8em] py-[0.6em] font-semibold">Description</th>
                  <th className="px-[0.8em] py-[0.6em] text-right font-semibold">Qty</th>
                  {!isDelivery && (
                    <th className="px-[0.8em] py-[0.6em] text-right font-semibold">Amount</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {lineItems.map((item) => (
                  <tr key={item.description} className="border-b border-slate-200">
                    <td className="px-[0.8em] py-[0.7em] text-slate-800">{item.description}</td>
                    <td className="px-[0.8em] py-[0.7em] text-right tabular-nums text-slate-600">
                      {item.qty}
                    </td>
                    {!isDelivery && (
                      <td className="px-[0.8em] py-[0.7em] text-right tabular-nums text-slate-800">
                        {money(item.qty * item.price)}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>

            {isDelivery ? (
              <p className="mt-[1.4em] text-[0.85em] text-slate-500">
                Goods received in good order and condition.
              </p>
            ) : (
              <div className="ml-auto mt-[1.2em] w-[55%] text-[0.88em]">
                <div className="flex justify-between py-[0.25em] text-slate-600">
                  <span>Subtotal</span>
                  <span className="tabular-nums">{money(subtotal)}</span>
                </div>
                <div className="flex justify-between py-[0.25em] text-slate-600">
                  <span>VAT 16%</span>
                  <span className="tabular-nums">{money(tax)}</span>
                </div>
                <div
                  className="mt-[0.4em] flex justify-between border-t-2 pt-[0.5em] text-[1.15em] font-bold transition-colors duration-300"
                  style={{ borderColor: color, color }}
                >
                  <span>Total KES</span>
                  <span className="tabular-nums">{money(subtotal + tax)}</span>
                </div>
              </div>
            )}

            <div className="mt-auto flex items-end justify-between gap-[1em]">
              <div>
                <Signature color={color} />
                <p className="border-t border-slate-300 pt-[0.4em] text-[0.8em] text-slate-500">
                  {isDelivery ? "Received by" : "Authorised signature"}
                </p>
              </div>
              {sample.id === "receipt" ? (
                <span
                  className="-rotate-6 rounded-[0.3em] border-2 px-[0.8em] py-[0.3em] text-[1.05em] font-bold uppercase tracking-[0.14em] transition-colors duration-300"
                  style={{ borderColor: color, color }}
                >
                  Paid
                </span>
              ) : (
                <MiniQr />
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}

function Signature({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 120 40" className="my-[0.4em] h-[3em] w-[9em]" fill="none" aria-hidden>
      <path
        d="M4 30c8-14 14-24 18-22 5 3-8 26-2 26 6 0 10-18 16-18 4 0-2 14 3 14 6 0 8-12 13-12 4 0 0 10 5 10 7 0 12-9 20-11 10-2 22 3 38-6"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition-colors duration-300"
      />
    </svg>
  );
}

const qrCells = [
  "111011101",
  "101001101",
  "111010111",
  "000110010",
  "110101101",
  "010011000",
  "111010111",
  "101011001",
  "111001101",
];

function MiniQr() {
  return (
    <svg viewBox="0 0 9 9" className="h-[4.4em] w-[4.4em]" aria-hidden shapeRendering="crispEdges">
      {qrCells.flatMap((row, y) =>
        row
          .split("")
          .map((cell, x) =>
            cell === "1" ? (
              <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="#0f172a" />
            ) : null,
          ),
      )}
    </svg>
  );
}

function SectionIntro({
  eyebrow,
  title,
  body,
  dark = false,
}: {
  eyebrow: string;
  title: string;
  body?: string;
  dark?: boolean;
}) {
  return (
    <div className="max-w-2xl">
      <p
        className={`text-sm font-semibold uppercase tracking-[0.18em] ${dark ? "text-[#8EC5FF]" : "text-[#0067EC]"}`}
      >
        {eyebrow}
      </p>
      <h2 className="landing-display mt-4 text-4xl font-medium leading-[1.08] tracking-[-0.015em] sm:text-5xl">
        {title}
      </h2>
      {body && (
        <p className={`mt-5 text-lg leading-8 ${dark ? "text-white/70" : "text-[#011B43]/70"}`}>
          {body}
        </p>
      )}
    </div>
  );
}

function DocumentsSection() {
  return (
    <section
      id="documents"
      className="scroll-mt-16 border-t border-[#011B43]/10 px-5 py-20 sm:px-8 lg:py-28"
    >
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <SectionIntro
          eyebrow="What you can make"
          title="The five documents every business sends."
          body="Each one starts from a template that already carries your logo, colours and contact details."
        />
        <ul className="border-t border-[#011B43]/15">
          {documentTypes.map((item, index) => (
            <li
              key={item.name}
              className="group grid grid-cols-[2.5rem_1fr] gap-x-4 border-b border-[#011B43]/15 py-6 sm:grid-cols-[3rem_14rem_1fr] sm:items-baseline"
            >
              <span className="pt-1.5 text-sm font-semibold tabular-nums text-[#011B43]/40 sm:pt-0">
                0{index + 1}
              </span>
              <h3 className="landing-display text-2xl font-medium sm:text-[1.75rem]">
                {item.name}
              </h3>
              <p className="col-start-2 mt-1.5 leading-7 text-[#011B43]/70 sm:col-start-3 sm:mt-0">
                {item.body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function StepsSection() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-16 bg-[#011B43] px-5 py-20 text-white sm:px-8 lg:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <SectionIntro
          dark
          eyebrow="How it works"
          title="From blank page to sent, in three steps."
        />
        <ol className="mt-14 grid gap-10 md:grid-cols-3 md:gap-0">
          {steps.map((step, index) => (
            <li
              key={step.word}
              className="border-t border-white/20 pt-7 md:border-l md:border-t-0 md:px-8 md:pt-0 md:first:border-l-0 md:first:pl-0"
            >
              <span className="text-sm font-semibold tabular-nums text-[#8EC5FF]">
                Step {index + 1}
              </span>
              <h3 className="landing-display mt-3 text-5xl font-normal italic sm:text-6xl">
                {step.word}.
              </h3>
              <p className="mt-5 max-w-sm leading-7 text-white/70">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section id="features" className="scroll-mt-16 px-5 py-20 sm:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <SectionIntro
          eyebrow="Features"
          title="Everything a document needs before it leaves."
          body="No design software, no copying last month's file and hoping you changed every number."
        />
        <div className="mt-14 grid gap-x-12 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="border-t border-[#011B43]/15 pt-6">
              <feature.icon className="h-6 w-6 text-[#0067EC]" strokeWidth={1.75} />
              <h3 className="mt-5 text-xl font-bold">{feature.title}</h3>
              <p className="mt-2.5 leading-7 text-[#011B43]/70">{feature.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-16 flex flex-col gap-5 rounded-[20px] bg-white p-7 sm:flex-row sm:items-center sm:gap-7 sm:p-9">
          <Stamp className="h-9 w-9 shrink-0 text-[#0067EC]" strokeWidth={1.5} />
          <p className="landing-display text-2xl font-medium leading-snug sm:text-[1.75rem]">
            Your documents stay in your account. Nobody else sees one until you send them the link.
          </p>
        </div>
      </div>
    </section>
  );
}

function FaqSection() {
  return (
    <section
      id="faq"
      className="scroll-mt-16 border-t border-[#011B43]/10 bg-white px-5 py-20 sm:px-8 lg:py-28"
    >
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <SectionIntro eyebrow="FAQ" title="Questions, answered." />
        <div className="border-t border-[#011B43]/15">
          {faqs.map(([question, answer]) => (
            <details key={question} className="group border-b border-[#011B43]/15">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-lg font-semibold [&::-webkit-details-marker]:hidden">
                {question}
                <span
                  aria-hidden
                  className="text-2xl font-normal leading-none text-[#0067EC] transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="max-w-2xl pb-6 leading-7 text-[#011B43]/70">{answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCta({ primaryHref, primaryLabel }: { primaryHref: string; primaryLabel: string }) {
  return (
    <section className="bg-[#0067EC] px-5 py-20 text-white sm:px-8 lg:py-24">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
        <h2 className="landing-display max-w-3xl text-[clamp(2.4rem,6vw,4.25rem)] font-medium leading-[1.04] tracking-[-0.02em]">
          Your next invoice could be out the door <em className="font-normal">in five minutes.</em>
        </h2>
        <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
          <Link
            to={primaryHref}
            className="group inline-flex h-14 items-center justify-center gap-2 rounded-full bg-white px-8 text-base font-semibold text-[#011B43] transition-colors hover:bg-[#011B43] hover:text-white"
          >
            {primaryLabel}
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
          <a
            href="mailto:hello@zuridoc.com"
            className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-white/40 px-8 text-base font-semibold transition-colors hover:border-white"
          >
            Talk to us
            <ArrowUpRight className="h-5 w-5" />
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer({ primaryHref, primaryLabel }: { primaryHref: string; primaryLabel: string }) {
  return (
    <footer className="bg-[#011B43] px-5 py-12 text-white sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div className="inline-flex w-fit rounded-xl bg-white px-3">
          <img src="/logo to use.png" alt="Zuridoc" className="h-14 w-auto object-contain" />
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/70" aria-label="Footer">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="transition-colors hover:text-white">
              {item.label}
            </a>
          ))}
          <Link to={primaryHref} className="transition-colors hover:text-white">
            {primaryLabel}
          </Link>
          <Link to="/privacy-policy" className="transition-colors hover:text-white">
            Privacy Policy
          </Link>
          <Link to="/terms-of-service" className="transition-colors hover:text-white">
            Terms of Service
          </Link>
        </nav>
      </div>
    </footer>
  );
}
