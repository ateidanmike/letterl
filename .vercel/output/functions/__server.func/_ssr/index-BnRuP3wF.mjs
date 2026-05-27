import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { B as Button } from "./button-Cz8PAkJh.mjs";
import { u as useAuth } from "./router-BZ24CEhc.mjs";
import { T as ThemeToggle } from "./ThemeToggle-B9LpvJlv.mjs";
import "../_libs/sonner.mjs";
import { F as FileText, S as Sparkles, R as Receipt, a as FileSpreadsheet, T as Truck, W as WandSparkles, P as Palette, D as Download, U as Users, B as Briefcase, b as Rocket, G as GraduationCap, c as Scale, H as HeartHandshake, d as Star, C as Check } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/zod.mjs";
function Index() {
  const {
    user
  } = useAuth();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ambient-bg min-h-screen", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "sticky top-3 z-40 mx-auto mt-3 flex max-w-6xl items-center justify-between rounded-2xl px-6 py-3 glass", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-lg font-bold", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-6 w-6 text-primary" }),
        " Letterly"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeToggle, {}),
        user ? /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/dashboard", children: "Open dashboard" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", children: "Sign in" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", children: "Get started" }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "mx-auto max-w-6xl px-6 pb-24 pt-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs text-muted-foreground glass", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3 w-3 text-primary" }),
        " The modern AI workspace for business correspondence"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "max-w-3xl text-5xl font-extrabold tracking-tight md:text-6xl", children: [
        "Create stunning business documents",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent", children: "in seconds" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 max-w-2xl text-lg text-muted-foreground", children: "Letterheads, invoices, receipts, quotations and delivery notes — beautifully branded with your logo and colors. Drafted by AI, ready to send as PDF, Word, PNG or JPG." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 flex flex-wrap gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "lg", asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: user ? "/dashboard" : "/login", children: [
          "Start creating ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "ml-2 h-4 w-4" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "lg", variant: "outline", asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#documents", children: "See document types" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { id: "documents", className: "mt-20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-bold", children: "Every document your business needs" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-muted-foreground", children: "One workspace. Letterheads plus four polished business document types." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-4", children: [{
          icon: FileText,
          name: "Letters",
          desc: "AI-drafted letterheads with your brand."
        }, {
          icon: Receipt,
          name: "Invoices",
          desc: "Bill clients with auto-calculated totals & tax."
        }, {
          icon: FileSpreadsheet,
          name: "Quotations",
          desc: "Send price estimates that win deals."
        }, {
          icon: Truck,
          name: "Delivery notes",
          desc: "Confirm shipments with itemised lists."
        }].map((d) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl p-5 glass transition hover:-translate-y-0.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(d.icon, { className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold", children: d.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: d.desc })
        ] }, d.name)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 text-sm text-muted-foreground", children: "Plus receipts to confirm payments — all under one roof." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-20 grid gap-6 md:grid-cols-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Feature, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(WandSparkles, {}), title: "AI writing assistant", children: "Generate, rewrite, shorten, expand, simplify or translate any letter — with tones from formal to friendly." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Feature, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Palette, {}), title: "Branded templates", children: "Eight polished templates auto-styled with your logo, colors, watermark and signature." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Feature, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Download, {}), title: "Export anywhere", children: "Print-ready PDF, editable Word, or PNG/JPG image for email and chat." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { id: "use-cases", className: "mt-24", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-bold", children: "Built for every team that writes letters" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-3", children: [{
          name: "HR teams",
          icon: Users
        }, {
          name: "Agencies",
          icon: Briefcase
        }, {
          name: "Startups",
          icon: Rocket
        }, {
          name: "Schools",
          icon: GraduationCap
        }, {
          name: "Law firms",
          icon: Scale
        }, {
          name: "NGOs",
          icon: HeartHandshake
        }].map((u) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 rounded-xl p-4 glass", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(u.icon, { className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: u.name })
        ] }, u.name)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-24", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-bold", children: "Trusted by professionals" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 grid gap-4 md:grid-cols-3", children: [{
          q: "Cuts our HR letter time from an hour to two minutes.",
          a: "Amina, People Lead"
        }, {
          q: "Looks like we paid a designer. We didn't.",
          a: "Daniel, Founder"
        }, {
          q: "Finally — letters that match our brand without Word fights.",
          a: "Priya, Ops Manager"
        }].map((t, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl p-5 glass", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-2 flex gap-1 text-amber-500", children: Array.from({
            length: 5
          }).map((_, j) => /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-3 w-3 fill-current" }, j)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm", children: [
            '"',
            t.q,
            '"'
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-3 text-xs text-muted-foreground", children: [
            "— ",
            t.a
          ] })
        ] }, i)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-24", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-bold", children: "Simple pricing" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 grid gap-4 md:grid-cols-3", children: [{
          name: "Free",
          price: "$0",
          items: ["3 letters / month", "All templates", "PDF export"]
        }, {
          name: "Pro",
          price: "$9",
          items: ["Unlimited letters", "AI assistant", "PDF + DOCX + PNG", "Multiple brands"],
          featured: true
        }, {
          name: "Team",
          price: "$29",
          items: ["Everything in Pro", "Shared brand kit", "Priority support"]
        }].map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `rounded-2xl p-6 ${p.featured ? "glass-strong ring-2 ring-primary" : "glass"}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: p.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-3xl font-bold", children: [
            p.price,
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-normal text-muted-foreground", children: "/mo" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-4 space-y-2 text-sm", children: p.items.map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3 w-3 text-primary" }),
            " ",
            i
          ] }, i)) })
        ] }, p.name)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-24", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-bold", children: "Frequently asked questions" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 grid gap-4 md:grid-cols-2", children: [{
          q: "Does AI replace my writing?",
          a: "No — it drafts, polishes, or translates on demand. You stay in full control."
        }, {
          q: "Is my data private?",
          a: "Letters and brand assets are scoped to your account. Logos are stored privately."
        }, {
          q: "Can I export to Word?",
          a: "Yes — every letter exports to PDF, DOCX, PNG, or JPG."
        }, {
          q: "Do I need design skills?",
          a: "Pick a template, drop in your logo, and Letterly handles the layout."
        }].map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl p-5 glass", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold", children: f.q }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: f.a })
        ] }, f.q)) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: "border-t py-8 text-center text-xs text-muted-foreground", children: [
      "© ",
      (/* @__PURE__ */ new Date()).getFullYear(),
      " Letterly · Crafted for teams that care about how they write."
    ] })
  ] });
}
function Feature({
  icon,
  title,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl p-6 glass transition hover:-translate-y-0.5 hover:glass-strong", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary", children: icon }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold", children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children })
  ] });
}
export {
  Index as component
};
