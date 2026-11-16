import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import type { ReactNode } from "react";
import { AnimatePresence, MotionConfig, motion, useAnimationControls } from "framer-motion";
import {
  ArrowRight,
  Banknote,
  Calculator,
  FileDown,
  Mail,
  Menu,
  Palette,
  PenLine,
  QrCode,
  ReceiptText,
  Send,
  Sparkles,
  Truck,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { GooglyEye } from "@/components/GooglyEye";

const FONT_HREF =
  "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..800&family=Caveat:wght@600;700&display=swap";

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

const INK = "#011B43";
const BLUE = "#0067EC";
const YELLOW = "#FFD43B";
const PINK = "#FF7AA2";
const MINT = "#6EE7B7";
const SKY = "#9CC8FF";

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

const documentTypes: {
  name: string;
  quip: string;
  body: string;
  icon: LucideIcon;
  color: string;
  tilt: number;
}[] = [
  {
    name: "Invoices",
    quip: "Ask for your money, beautifully.",
    body: "Bill clients for products or services, with tax, discounts and payment status.",
    icon: Banknote,
    color: YELLOW,
    tilt: -2,
  },
  {
    name: "Quotations",
    quip: "A price they can say yes to.",
    body: "Send a clear estimate before the work starts.",
    icon: Calculator,
    color: PINK,
    tilt: 1.5,
  },
  {
    name: "Receipts",
    quip: "Proof that it happened.",
    body: "Confirm a payment the moment it lands.",
    icon: ReceiptText,
    color: MINT,
    tilt: -1,
  },
  {
    name: "Delivery notes",
    quip: "It arrived. Here's who signed.",
    body: "List what shipped and leave room for a signature on arrival.",
    icon: Truck,
    color: SKY,
    tilt: 2,
  },
  {
    name: "Letterheads",
    quip: "Official letters that look official.",
    body: "Write on your own stationery, with AI help on the wording.",
    icon: Mail,
    color: "#FFFFFF",
    tilt: -1.5,
  },
];

const steps = [
  {
    word: "Create",
    color: YELLOW,
    body: "Pick a document type and a template. Your business details, logo and colours are already in place.",
  },
  {
    word: "Customize",
    color: PINK,
    body: "Add line items, terms and notes. Sign it, stamp it, drop in a QR code, or ask the AI assistant to draft the letter.",
  },
  {
    word: "Send",
    color: MINT,
    body: "Export to PDF, Word or PNG, copy it as an email, or send a share link. Mark it sent, then paid.",
  },
];

const badHabits = [
  "Opening Invoice_FINAL_final_v7.docx",
  "Copying last month's invoice and hoping you changed every number",
  "Printing a page just to sign it and scan it back",
  "Stretching your logo until it looks… like that",
];

const features: { icon: LucideIcon; title: string; body: string; color: string }[] = [
  {
    icon: Palette,
    title: "One brand kit",
    body: "Upload your logo once. Zuridoc picks up its colours and applies them to every document you make.",
    color: YELLOW,
  },
  {
    icon: Sparkles,
    title: "AI writing help",
    body: "Describe the letter you need and get a draft in your tone. Edit every word before it goes out.",
    color: PINK,
  },
  {
    icon: PenLine,
    title: "Signature and stamp",
    body: "Draw your signature on screen and add your company stamp. No printer was harmed.",
    color: MINT,
  },
  {
    icon: QrCode,
    title: "QR codes",
    body: "Add a QR code to any document, so whoever is holding the paper can scan it to check the details.",
    color: SKY,
  },
  {
    icon: FileDown,
    title: "Every format",
    body: "PDF for sending, Word for editing, PNG for chat apps, and HTML for pasting straight into an email.",
    color: YELLOW,
  },
  {
    icon: Send,
    title: "Share and track",
    body: "Send a link instead of an attachment, and keep each document's status: draft, sent, partial or paid.",
    color: PINK,
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

const mascotLines = [
  "Send me already!",
  "I look great in PDF.",
  "Please don't print me.",
  "Pay me. Politely.",
  "Nice logo. Is it new?",
];

const money = (value: number) => value.toLocaleString("en-KE");

function Index() {
  const { user } = useAuth();
  const primaryHref = user ? "/dashboard" : "/login";
  const primaryLabel = user ? "Open app" : "Start free";

  return (
    <MotionConfig reducedMotion="user">
      <div
        id="top"
        className="landing min-h-screen scroll-smooth overflow-x-clip bg-[#FFF7E3] text-[#011B43]"
      >
        <SiteHeader
          primaryHref={primaryHref}
          primaryLabel={primaryLabel}
          signedIn={Boolean(user)}
        />
        <main>
          <Hero primaryHref={primaryHref} primaryLabel={primaryLabel} />
          <Marquee
            items={["Invoices", "Quotations", "Receipts", "Delivery notes", "Letterheads"]}
            className="bg-[#0067EC] text-white"
          />
          <DocumentsSection />
          <StepsSection />
          <BadHabitsSection primaryHref={primaryHref} />
          <FeaturesSection />
          <FaqSection />
          <Marquee
            items={["Create", "Customize", "Send", "Get paid", "Repeat"]}
            className="bg-[#FF7AA2]"
            reverse
          />
          <FinalCta primaryHref={primaryHref} primaryLabel={primaryLabel} />
        </main>
        <Footer primaryHref={primaryHref} primaryLabel={primaryLabel} />
      </div>
    </MotionConfig>
  );
}

/* ------------------------------ Hand-drawn bits ------------------------------ */

function Squiggle({ className = "", color = BLUE }: { className?: string; color?: string }) {
  return (
    <svg
      viewBox="0 0 300 24"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden
      className={className}
    >
      <motion.path
        d="M4 14c22-12 34 10 56 0s34-12 56-1 34 10 56 0 34-11 56-1 40 8 68-3"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.9, delay: 0.5, ease: "easeInOut" }}
      />
    </svg>
  );
}

function DoodleArrow({ className = "", color = INK }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 120 80" fill="none" aria-hidden className={className}>
      <path
        d="M6 12c30-8 70 4 86 44"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="2 9"
      />
      <path
        d="M72 50l21 10 6-24"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DoodleStar({
  className = "",
  color = YELLOW,
  spin = false,
}: {
  className?: string;
  color?: string;
  spin?: boolean;
}) {
  return (
    <svg viewBox="0 0 60 60" aria-hidden className={`${className} ${spin ? "nb-spin" : ""}`}>
      <path
        d="M30 3c2 14 6 20 26 26-19 4-24 11-26 28-3-17-8-23-27-27C22 25 27 18 30 3z"
        fill={color}
        stroke={INK}
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Starburst({ className = "", children }: { className?: string; children: ReactNode }) {
  const points = Array.from({ length: 32 }, (_, index) => {
    const radius = index % 2 === 0 ? 48 : 38;
    const angle = (Math.PI * 2 * index) / 32;
    return `${(50 + radius * Math.cos(angle)).toFixed(2)},${(50 + radius * Math.sin(angle)).toFixed(2)}`;
  }).join(" ");
  return (
    <div className={className}>
      <svg viewBox="0 0 100 100" aria-hidden className="nb-spin h-full w-full">
        <polygon
          points={points}
          fill={YELLOW}
          stroke={INK}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
      </svg>
      <div className="absolute inset-0 flex -rotate-12 flex-col items-center justify-center text-center font-extrabold leading-none">
        {children}
      </div>
    </div>
  );
}

function Sticker({
  children,
  color = YELLOW,
  className = "",
}: {
  children: ReactNode;
  color?: string;
  className?: string;
}) {
  return (
    <span
      style={{ backgroundColor: color }}
      className={`nb-scribble nb-wiggle inline-block border-[3px] border-[#011B43] px-4 py-1.5 text-sm font-extrabold uppercase tracking-[0.12em] ${className}`}
    >
      {children}
    </span>
  );
}

function Mascot() {
  const [line, setLine] = useState(0);
  const controls = useAnimationControls();

  const poke = () => {
    setLine((value) => (value + 1) % mascotLines.length);
    void controls.start({
      y: [0, -34, 0, -10, 0],
      rotate: [-4, 6, -8, 2, -4],
      transition: { duration: 0.7, ease: "easeOut" },
    });
  };

  return (
    <div className="relative mx-auto w-fit pt-20">
      <AnimatePresence mode="wait">
        <motion.p
          key={line}
          initial={{ scale: 0.4, rotate: -12, opacity: 0 }}
          animate={{ scale: 1, rotate: -4, opacity: 1 }}
          exit={{ scale: 0.6, opacity: 0 }}
          transition={{ type: "spring", stiffness: 380, damping: 14 }}
          className="landing-hand nb-scribble absolute left-0 right-0 top-0 mx-auto w-max max-w-[15rem] border-[3px] border-[#011B43] bg-white px-5 py-2 text-center text-2xl leading-tight"
        >
          {mascotLines[line]}
        </motion.p>
      </AnimatePresence>
      <motion.button
        type="button"
        onClick={poke}
        aria-label="Poke the Zuridoc mascot for another line"
        animate={controls}
        initial={{ rotate: -4 }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.94 }}
        className="nb-focus relative block cursor-pointer"
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="relative"
        >
          <motion.svg
            viewBox="0 0 60 60"
            aria-hidden
            className="absolute -right-12 top-16 h-14 w-14 origin-bottom-left"
            animate={{ rotate: [0, -28, 8, -28, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 1.2 }}
          >
            <path
              d="M4 54C18 44 30 30 40 10"
              stroke={INK}
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="42" cy="9" r="7" fill="#fff" stroke={INK} strokeWidth="4" />
          </motion.svg>
          <svg viewBox="0 0 60 60" aria-hidden className="absolute -left-11 top-24 h-12 w-12">
            <path
              d="M56 6C40 14 24 30 14 50"
              stroke={INK}
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="12" cy="51" r="7" fill="#fff" stroke={INK} strokeWidth="4" />
          </svg>
          <div className="nb-box-lg relative h-60 w-44 bg-white px-5 pt-9">
            <span
              aria-hidden
              className="absolute -right-[3px] -top-[3px] h-9 w-9 border-b-[3px] border-l-[3px] border-[#011B43] bg-[#FFD43B]"
            />
            <div className="flex justify-center gap-2">
              <GooglyEye />
              <GooglyEye />
            </div>
            <svg viewBox="0 0 80 34" aria-hidden className="mx-auto mt-3 h-8 w-20">
              <path
                d="M8 8c10 22 54 22 64 0"
                stroke={INK}
                strokeWidth="5"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M30 22c4 8 16 8 20 0z"
                fill={PINK}
                stroke={INK}
                strokeWidth="3"
                strokeLinejoin="round"
              />
            </svg>
            <div className="mt-5 space-y-2.5" aria-hidden>
              <div className="h-2.5 w-full rounded-full bg-[#011B43]/20" />
              <div className="h-2.5 w-4/5 rounded-full bg-[#011B43]/20" />
              <div className="h-2.5 w-3/5 rounded-full bg-[#0067EC]" />
            </div>
          </div>
          <div className="flex justify-center gap-10" aria-hidden>
            <span className="h-7 w-[5px] rounded-b-full bg-[#011B43]" />
            <span className="h-7 w-[5px] rounded-b-full bg-[#011B43]" />
          </div>
        </motion.div>
      </motion.button>
    </div>
  );
}

function Marquee({
  items,
  className = "",
  reverse = false,
}: {
  items: string[];
  className?: string;
  reverse?: boolean;
}) {
  const run = [...items, ...items, ...items, ...items];
  return (
    <div
      aria-hidden
      className={`overflow-hidden border-y-[3px] border-[#011B43] py-3.5 ${className}`}
    >
      <div className={`nb-marquee ${reverse ? "nb-marquee-reverse" : ""}`}>
        {[0, 1].map((half) => (
          <div key={half} className="flex shrink-0 items-center">
            {run.map((item, index) => (
              <span
                key={`${half}-${index}`}
                className="flex items-center gap-6 pr-6 text-2xl font-extrabold uppercase tracking-tight sm:text-3xl"
              >
                {item}
                <DoodleStar className="h-7 w-7" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------- Header ---------------------------------- */

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
    <header className="sticky top-0 z-40 border-b-[3px] border-[#011B43] bg-[#FFF7E3]">
      <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link to="/" className="nb-focus flex shrink-0 items-center" aria-label="Zuridoc home">
          <img src="/logo to use.png" alt="Zuridoc" className="h-14 w-auto object-contain" />
        </Link>
        <nav className="hidden items-center gap-1 text-[15px] font-bold md:flex" aria-label="Main">
          {navItems.map((item, index) => (
            <a
              key={item.href}
              href={item.href}
              className={`nb-focus rounded-md border-[3px] border-transparent px-3 py-1.5 transition-transform hover:border-[#011B43] hover:bg-white ${
                index % 2 === 0 ? "hover:-rotate-2" : "hover:rotate-2"
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          {!signedIn && (
            <Link
              to="/login"
              className="nb-focus px-2 py-2 text-[15px] font-bold underline decoration-[3px] underline-offset-4 hover:decoration-[#FF7AA2]"
            >
              Sign in
            </Link>
          )}
          <Link
            to={primaryHref}
            className="nb-btn inline-flex items-center gap-2 bg-[#FFD43B] px-5 py-2 text-[15px] font-extrabold"
          >
            {primaryLabel}
            <ArrowRight className="h-4 w-4" strokeWidth={3} />
          </Link>
        </div>
        <button
          type="button"
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="nb-btn inline-flex h-11 w-11 items-center justify-center bg-[#FFD43B] md:hidden"
        >
          {open ? (
            <X className="h-5 w-5" strokeWidth={3} />
          ) : (
            <Menu className="h-5 w-5" strokeWidth={3} />
          )}
        </button>
      </div>
      {open && (
        <nav
          className="border-t-[3px] border-[#011B43] bg-[#FFF7E3] px-5 pb-6 pt-3 md:hidden"
          aria-label="Mobile"
        >
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={close}
              className="block border-b-[3px] border-dashed border-[#011B43]/30 py-3.5 text-lg font-extrabold"
            >
              {item.label}
            </a>
          ))}
          {!signedIn && (
            <Link
              to="/login"
              onClick={close}
              className="block border-b-[3px] border-dashed border-[#011B43]/30 py-3.5 text-lg font-extrabold"
            >
              Sign in
            </Link>
          )}
          <Link
            to={primaryHref}
            onClick={close}
            className="nb-btn mt-5 inline-flex w-full items-center justify-center gap-2 bg-[#FFD43B] py-3 text-lg font-extrabold"
          >
            {primaryLabel}
            <ArrowRight className="h-5 w-5" strokeWidth={3} />
          </Link>
        </nav>
      )}
    </header>
  );
}

/* ----------------------------------- Hero ----------------------------------- */

function Hero({ primaryHref, primaryLabel }: { primaryHref: string; primaryLabel: string }) {
  return (
    <section className="nb-dots relative">
      <div className="mx-auto grid max-w-7xl gap-20 px-5 pb-20 pt-12 sm:px-8 sm:pt-16 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-14 lg:pb-28 lg:pt-20">
        <div className="relative min-w-0">
          <motion.div
            initial={{ rotate: -14, scale: 0.6 }}
            animate={{ rotate: -3, scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 12 }}
            className="w-fit"
          >
            <Sticker>Create. Customize. Send.</Sticker>
          </motion.div>

          <h1 className="mt-6 text-[clamp(2.9rem,9vw,5.4rem)] font-extrabold leading-[0.97] tracking-[-0.035em]">
            <span className="relative inline-block">
              Paperwork
              <Squiggle className="absolute -bottom-2 left-0 h-4 w-full sm:-bottom-3 sm:h-5" />
            </span>{" "}
            that looks as good as{" "}
            <motion.span
              initial={{ rotate: 0 }}
              animate={{ rotate: -2 }}
              transition={{ type: "spring", stiffness: 200, damping: 8, delay: 0.3 }}
              className="mt-2 inline-block border-[3px] border-[#011B43] bg-[#FFD43B] px-3 pb-1 shadow-[5px_5px_0_0_#011B43]"
            >
              your work.
            </motion.span>
          </h1>

          <p className="mt-8 max-w-xl text-lg font-medium leading-8 sm:text-xl sm:leading-9">
            Set up your brand once. Zuridoc puts it on every invoice, quotation, receipt, delivery
            note and letter you send, ready as a PDF in minutes.
          </p>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              to={primaryHref}
              className="nb-btn group inline-flex h-16 items-center justify-center gap-3 bg-[#0067EC] px-9 text-lg font-extrabold text-white"
            >
              {primaryLabel}
              <ArrowRight
                className="h-6 w-6 transition-transform group-hover:translate-x-1.5"
                strokeWidth={3}
              />
            </Link>
            <a
              href="#how-it-works"
              className="nb-btn inline-flex h-16 items-center justify-center bg-white px-9 text-lg font-extrabold"
            >
              See how it works
            </a>
          </div>

          <ul className="mt-9 flex flex-wrap gap-3 text-sm font-extrabold">
            {[
              { text: "Free to start", color: MINT, tilt: "-rotate-2" },
              { text: "No design skills needed", color: PINK, tilt: "rotate-1" },
              { text: "Works on your phone", color: SKY, tilt: "-rotate-1" },
            ].map((item) => (
              <li
                key={item.text}
                style={{ backgroundColor: item.color }}
                className={`nb-wiggle border-[3px] border-[#011B43] px-3 py-1.5 ${item.tilt}`}
              >
                {item.text}
              </li>
            ))}
          </ul>

          <DoodleStar className="absolute -top-6 right-2 hidden h-12 w-12 sm:block" spin />
        </div>

        <div className="relative min-w-0">
          <p className="landing-hand absolute -top-12 left-2 z-10 -rotate-3 text-3xl sm:left-6">
            psst… click stuff!
          </p>
          <DoodleArrow className="absolute -top-10 left-48 z-10 h-14 w-20 sm:left-56" />
          <DocumentDemo />
        </div>
      </div>
    </section>
  );
}

function DocumentDemo() {
  const [sampleId, setSampleId] = useState<SampleId>("invoice");
  const [color, setColor] = useState(brandColors[0].value);
  const paper = useAnimationControls();
  const sample = samples.find((item) => item.id === sampleId) ?? samples[0];

  const pickColor = (value: string) => {
    setColor(value);
    void paper.start({
      rotate: [0, -2.5, 2, -1, 0],
      transition: { duration: 0.45 },
    });
  };

  return (
    <div className="nb-box-lg relative bg-[#0067EC] p-4 sm:p-6">
      <Starburst className="absolute -right-3 -top-20 z-20 h-24 w-24 sm:-right-12 sm:-top-24 sm:h-28 sm:w-28">
        <span className="text-[10px] uppercase tracking-wider sm:text-xs">done in</span>
        <span className="text-xl sm:text-2xl">5 min</span>
      </Starburst>

      <div
        role="tablist"
        aria-label="Document type"
        className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2 pt-1"
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
              className={`nb-focus shrink-0 border-[3px] border-[#011B43] px-3 py-1.5 text-[13px] font-extrabold transition-transform ${
                active
                  ? "-translate-y-0.5 -rotate-2 bg-[#FFD43B] shadow-[3px_3px_0_0_#011B43]"
                  : "bg-white hover:-translate-y-0.5 hover:rotate-1"
              }`}
            >
              {item.tab}
            </button>
          );
        })}
      </div>

      <div className="@container relative mx-auto mt-5 w-full max-w-[430px]">
        <div
          aria-hidden
          className="absolute inset-0 translate-x-3 translate-y-3 rotate-[3deg] border-[3px] border-[#011B43] bg-[#FF7AA2]"
        />
        <motion.div
          animate={paper}
          className="relative aspect-[1/1.38] overflow-hidden border-[3px] border-[#011B43] bg-white text-[2.55cqw] text-slate-800"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={sample.id}
              initial={{ y: "-105%", rotate: -5 }}
              animate={{ y: 0, rotate: 0 }}
              exit={{ y: "105%", rotate: 5 }}
              transition={{ type: "spring", stiffness: 240, damping: 22 }}
              className="absolute inset-0 flex flex-col bg-white"
            >
              <SamplePaper sample={sample} color={color} />
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="landing-hand -rotate-2 whitespace-nowrap text-2xl text-white">
            your colour →
          </span>
          <div className="flex gap-2">
            {brandColors.map((item) => (
              <button
                key={item.value}
                type="button"
                aria-label={item.name}
                aria-pressed={color === item.value}
                onClick={() => pickColor(item.value)}
                style={{ backgroundColor: item.value }}
                className={`nb-focus h-8 w-8 rounded-full border-[3px] border-white transition-transform hover:-rotate-12 hover:scale-125 ${
                  color === item.value ? "scale-125 shadow-[3px_3px_0_0_#011B43]" : ""
                }`}
              />
            ))}
          </div>
        </div>
        <div className="flex gap-2 text-xs font-extrabold">
          {["PDF", "DOCX", "PNG"].map((format, index) => (
            <span
              key={format}
              className={`border-[3px] border-[#011B43] bg-white px-2.5 py-1 ${
                index === 1 ? "rotate-2" : "-rotate-2"
              }`}
            >
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
              className="flex h-[2.6em] w-[2.6em] items-center justify-center rounded-full text-[1.3em] font-extrabold text-white transition-colors duration-300"
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
                className="text-[1.3em] font-extrabold tracking-[0.08em] transition-colors duration-300"
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
                  className="mt-[0.4em] flex justify-between border-t-2 pt-[0.5em] text-[1.15em] font-extrabold transition-colors duration-300"
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
                <motion.span
                  initial={{ scale: 3.2, rotate: -40, opacity: 0 }}
                  animate={{ scale: 1, rotate: -8, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 420, damping: 13, delay: 0.35 }}
                  className="rounded-[0.3em] border-[0.22em] px-[0.8em] py-[0.25em] text-[1.5em] font-extrabold uppercase tracking-[0.14em]"
                  style={{ borderColor: color, color }}
                >
                  Paid
                </motion.span>
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
      <motion.path
        d="M4 30c8-14 14-24 18-22 5 3-8 26-2 26 6 0 10-18 16-18 4 0-2 14 3 14 6 0 8-12 13-12 4 0 0 10 5 10 7 0 12-9 20-11 10-2 22 3 38-6"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.9, delay: 0.3, ease: "easeInOut" }}
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

/* --------------------------------- Sections --------------------------------- */

function SectionTitle({
  eyebrow,
  title,
  note,
  stickerColor = YELLOW,
}: {
  eyebrow: string;
  title: ReactNode;
  note?: string;
  stickerColor?: string;
}) {
  return (
    <div className="max-w-3xl">
      <Sticker color={stickerColor} className="-rotate-2">
        {eyebrow}
      </Sticker>
      <h2 className="mt-5 text-[clamp(2.2rem,6vw,4rem)] font-extrabold leading-[0.98] tracking-[-0.03em]">
        {title}
      </h2>
      {note && <p className="landing-hand mt-4 text-3xl leading-tight">{note}</p>}
    </div>
  );
}

function DocumentsSection() {
  return (
    <section id="documents" className="scroll-mt-20 px-5 py-20 sm:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <SectionTitle
          eyebrow="What you can make"
          title="The five documents every business sends."
          note="each one already wearing your logo ↓"
        />
        <ul className="mt-14 grid gap-7 sm:grid-cols-2 lg:grid-cols-6">
          {documentTypes.map((item, index) => (
            <motion.li
              key={item.name}
              initial={{ rotate: item.tilt * 3, y: 30 }}
              whileInView={{ rotate: item.tilt, y: 0 }}
              whileHover={{ rotate: -item.tilt, y: -10, scale: 1.03 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ type: "spring", stiffness: 260, damping: 14 }}
              style={{ backgroundColor: item.color }}
              className={`nb-box relative p-6 ${index < 3 ? "lg:col-span-2" : "lg:col-span-3"}`}
            >
              <span className="absolute -right-3 -top-4 flex h-11 w-11 rotate-6 items-center justify-center rounded-full border-[3px] border-[#011B43] bg-white text-lg font-extrabold">
                {index + 1}
              </span>
              <span className="nb-wiggle flex h-14 w-14 items-center justify-center border-[3px] border-[#011B43] bg-white">
                <item.icon className="h-7 w-7" strokeWidth={2.25} />
              </span>
              <h3 className="mt-5 text-3xl font-extrabold tracking-tight">{item.name}</h3>
              <p className="landing-hand mt-1 text-2xl leading-tight">{item.quip}</p>
              <p className="mt-3 font-medium leading-7">{item.body}</p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function StepDoodle({ index }: { index: number }) {
  if (index === 0) {
    return (
      <motion.div
        animate={{ rotate: [0, -14, 10, -14, 0], x: [0, 5, -5, 5, 0] }}
        transition={{ duration: 1.3, repeat: Infinity, repeatDelay: 0.9 }}
        className="origin-bottom-left"
      >
        <PenLine className="h-12 w-12" strokeWidth={2.25} />
      </motion.div>
    );
  }
  if (index === 1) {
    return (
      <div className="flex items-end gap-1.5">
        {[BLUE, YELLOW, "#FFFFFF"].map((color, dot) => (
          <motion.span
            key={color}
            animate={{ y: [0, -16, 0] }}
            transition={{ duration: 0.7, repeat: Infinity, repeatDelay: 0.9, delay: dot * 0.15 }}
            style={{ backgroundColor: color }}
            className="h-7 w-7 rounded-full border-[3px] border-[#011B43]"
          />
        ))}
      </div>
    );
  }
  return (
    <motion.div
      animate={{
        x: [0, 70, 70, 0],
        y: [0, -44, -44, 0],
        opacity: [1, 0, 0, 1],
        rotate: [0, -8, -8, 0],
      }}
      transition={{ duration: 2.2, repeat: Infinity, times: [0, 0.45, 0.55, 1], ease: "easeIn" }}
    >
      <Send className="h-12 w-12" strokeWidth={2.25} />
    </motion.div>
  );
}

function StepsSection() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-20 border-y-[3px] border-[#011B43] bg-[#9CC8FF] px-5 py-20 sm:px-8 lg:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <SectionTitle
          eyebrow="How it works"
          stickerColor="#FFFFFF"
          title="From blank page to sent, in three steps."
        />
        <ol className="mt-16 grid gap-12 md:grid-cols-3 md:gap-8">
          {steps.map((step, index) => (
            <motion.li
              key={step.word}
              initial={{ y: 40, rotate: index === 1 ? 3 : -3 }}
              whileInView={{ y: 0, rotate: index === 1 ? 1.5 : -1.5 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ type: "spring", stiffness: 220, damping: 13, delay: index * 0.1 }}
              style={{ backgroundColor: step.color }}
              className="nb-box-lg relative p-7 pt-12"
            >
              <span className="absolute -left-[3px] -top-[3px] bg-[#011B43] px-3 py-1.5 text-sm font-extrabold uppercase tracking-widest text-white">
                Step {index + 1}
              </span>
              <div className="absolute right-6 top-5" aria-hidden>
                <StepDoodle index={index} />
              </div>
              <h3 className="mt-8 text-5xl font-extrabold tracking-[-0.03em] lg:text-6xl">
                {step.word}.
              </h3>
              <p className="mt-5 text-lg font-medium leading-8">{step.body}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function BadHabitsSection({ primaryHref }: { primaryHref: string }) {
  return (
    <section className="bg-[#011B43] px-5 py-20 text-white sm:px-8 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-16">
        <div>
          <Sticker color={PINK} className="-rotate-2 text-[#011B43]">
            Retire these
          </Sticker>
          <h2 className="mt-5 text-[clamp(2.2rem,6vw,4rem)] font-extrabold leading-[0.98] tracking-[-0.03em]">
            Things you can{" "}
            <span className="inline-block -rotate-2 bg-[#FFD43B] px-2 text-[#011B43]">stop</span>{" "}
            doing.
          </h2>
          <p className="landing-hand mt-5 text-3xl leading-tight text-[#FFD43B]">
            we've all done at least two of these
          </p>
          <Link
            to={primaryHref}
            className="nb-btn mt-9 inline-flex h-14 items-center gap-3 bg-[#FFD43B] px-7 text-lg font-extrabold text-[#011B43] [--nb-ink:#ffffff]"
          >
            Do it the easy way
            <ArrowRight className="h-5 w-5" strokeWidth={3} />
          </Link>
        </div>
        <ul className="space-y-5">
          {badHabits.map((habit, index) => (
            <li
              key={habit}
              className={`relative border-[3px] border-white bg-white/5 px-5 py-4 text-xl font-bold sm:text-2xl ${
                index % 2 === 0 ? "-rotate-1" : "rotate-1"
              }`}
            >
              {habit}
              <svg
                viewBox="0 0 400 60"
                preserveAspectRatio="none"
                fill="none"
                aria-hidden
                className="pointer-events-none absolute inset-0 h-full w-full"
              >
                <motion.path
                  d="M6 50C70 46 96 30 150 34s96-6 150-12 60-6 94-14"
                  stroke={PINK}
                  strokeWidth="5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.5, delay: 0.25 + index * 0.25, ease: "easeOut" }}
                />
              </svg>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section id="features" className="nb-dots scroll-mt-20 px-5 py-20 sm:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <SectionTitle
          eyebrow="Features"
          stickerColor={MINT}
          title="Everything a document needs before it leaves."
          note="no design software required. promise."
        />
        <div className="mt-14 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              whileHover={{ y: -8, rotate: index % 2 === 0 ? -1.5 : 1.5 }}
              transition={{ type: "spring", stiffness: 320, damping: 12 }}
              className="nb-box group bg-white p-7"
            >
              <span
                style={{ backgroundColor: feature.color }}
                className="flex h-14 w-14 -rotate-3 items-center justify-center border-[3px] border-[#011B43] transition-transform duration-300 group-hover:rotate-[14deg] group-hover:scale-110"
              >
                <feature.icon className="h-7 w-7" strokeWidth={2.25} />
              </span>
              <h3 className="mt-5 text-2xl font-extrabold tracking-tight">{feature.title}</h3>
              <p className="mt-2.5 font-medium leading-7">{feature.body}</p>
            </motion.div>
          ))}
        </div>
        <div className="nb-box-lg mt-14 flex -rotate-1 flex-col gap-4 bg-[#6EE7B7] p-7 sm:flex-row sm:items-center sm:gap-6 sm:p-9">
          <span className="text-5xl" aria-hidden>
            🔒
          </span>
          <p className="text-2xl font-extrabold leading-snug tracking-tight sm:text-3xl">
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
      className="scroll-mt-20 border-t-[3px] border-[#011B43] bg-white px-5 py-20 sm:px-8 lg:py-28"
    >
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div>
          <SectionTitle
            eyebrow="FAQ"
            stickerColor={SKY}
            title="Questions, answered."
            note="go on, poke one →"
          />
          <DoodleStar className="mt-8 hidden h-16 w-16 lg:block" color={PINK} spin />
        </div>
        <div className="space-y-5">
          {faqs.map(([question, answer], index) => (
            <details
              key={question}
              className={`nb-box group bg-[#FFF7E3] transition-transform open:bg-[#FFD43B] ${
                index % 2 === 0 ? "open:-rotate-1" : "open:rotate-1"
              }`}
            >
              <summary className="nb-focus flex cursor-pointer list-none items-center justify-between gap-5 px-5 py-4 text-lg font-extrabold sm:text-xl [&::-webkit-details-marker]:hidden">
                {question}
                <span
                  aria-hidden
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-[3px] border-[#011B43] bg-white text-2xl leading-none transition-transform duration-300 group-open:rotate-[135deg]"
                >
                  +
                </span>
              </summary>
              <p className="max-w-2xl px-5 pb-5 text-lg font-medium leading-8">{answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCta({ primaryHref, primaryLabel }: { primaryHref: string; primaryLabel: string }) {
  return (
    <section className="nb-dots bg-[#FFD43B] px-5 py-20 sm:px-8 lg:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[auto_1fr] lg:gap-24">
        <div className="lg:pl-10">
          <Mascot />
          <p className="landing-hand mt-4 text-center text-2xl">(poke me)</p>
        </div>
        <div>
          <h2 className="text-[clamp(2.6rem,7vw,5rem)] font-extrabold leading-[0.97] tracking-[-0.035em]">
            Your next invoice could be out the door in{" "}
            <span className="mt-2 inline-block rotate-1 border-[3px] border-[#011B43] bg-white px-3 shadow-[5px_5px_0_0_#011B43]">
              five minutes.
            </span>
          </h2>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              to={primaryHref}
              className="nb-btn group inline-flex h-16 items-center justify-center gap-3 bg-[#0067EC] px-10 text-xl font-extrabold text-white"
            >
              {primaryLabel}
              <ArrowRight
                className="h-6 w-6 transition-transform group-hover:translate-x-1.5"
                strokeWidth={3}
              />
            </Link>
            <a
              href="mailto:hello@zuridoc.com"
              className="nb-btn inline-flex h-16 items-center justify-center bg-white px-10 text-xl font-extrabold"
            >
              Talk to us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer({ primaryHref, primaryLabel }: { primaryHref: string; primaryLabel: string }) {
  const linkClass = "underline-offset-4 hover:text-[#FFD43B] hover:underline";
  return (
    <footer className="border-t-[3px] border-[#011B43] bg-[#011B43] px-5 py-12 text-white sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div className="inline-flex w-fit -rotate-2 border-[3px] border-white bg-white px-3 shadow-[5px_5px_0_0_#FFD43B]">
          <img src="/logo to use.png" alt="Zuridoc" className="h-14 w-auto object-contain" />
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-3 text-[15px] font-bold" aria-label="Footer">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className={linkClass}>
              {item.label}
            </a>
          ))}
          <Link to={primaryHref} className={linkClass}>
            {primaryLabel}
          </Link>
          <Link to="/privacy-policy" className={linkClass}>
            Privacy Policy
          </Link>
          <Link to="/terms-of-service" className={linkClass}>
            Terms of Service
          </Link>
        </nav>
      </div>
      <p className="landing-hand mx-auto mt-8 max-w-7xl text-2xl text-white/70">
        made for people who'd rather be doing the actual work.
      </p>
    </footer>
  );
}
