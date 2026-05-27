import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useAuth, s as supabase } from "./router-BZ24CEhc.mjs";
import { B as Button } from "./button-Cz8PAkJh.mjs";
import { C as Card, c as CardContent } from "./card-HxqUHXRA.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { D as DOC_TYPES, a as DEFAULT_DOC } from "./types-C8IlZ62M.mjs";
import { T as Truck, a as FileSpreadsheet, R as Receipt, F as FileText, q as Plus, r as Trash2 } from "../_libs/lucide-react.mjs";
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
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
const TYPE_ICON = {
  invoice: FileText,
  receipt: Receipt,
  quotation: FileSpreadsheet,
  delivery_note: Truck
};
function DocumentsPage() {
  const {
    user
  } = useAuth();
  const navigate = useNavigate();
  const [rows, setRows] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [filter, setFilter] = reactExports.useState("all");
  const load = async () => {
    const {
      data,
      error
    } = await supabase.from("business_documents").select("id,title,doc_type,doc_number,updated_at,status").order("updated_at", {
      ascending: false
    });
    if (error) toast.error(error.message);
    else setRows(data ?? []);
    setLoading(false);
  };
  reactExports.useEffect(() => {
    if (user) load();
  }, [user]);
  const create = async (doc_type) => {
    const meta = DOC_TYPES.find((t) => t.id === doc_type);
    const {
      data,
      error
    } = await supabase.from("business_documents").insert({
      user_id: user.id,
      doc_type,
      title: `New ${meta.name}`,
      doc_number: DEFAULT_DOC.doc_number
    }).select("id").single();
    if (error) return toast.error(error.message);
    navigate({
      to: "/document-editor",
      search: {
        id: data.id
      }
    });
  };
  const remove = async (id) => {
    const {
      error
    } = await supabase.from("business_documents").delete().eq("id", id);
    if (error) toast.error(error.message);
    else setRows((r) => r.filter((x) => x.id !== id));
  };
  const filtered = rows.filter((r) => filter === "all" || r.doc_type === filter);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ambient-bg min-h-screen", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-5xl px-6 py-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl glass px-6 py-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold", children: "Business documents" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Create stunning invoices, receipts, quotations and delivery notes in seconds." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-4", children: DOC_TYPES.map((t) => {
        const Icon = TYPE_ICON[t.id];
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => create(t.id), className: "group flex flex-col items-start gap-2 rounded-xl glass-subtle p-4 text-left transition hover:-translate-y-0.5 hover:glass", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: t.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: t.description })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "mt-1 inline-flex items-center gap-1 text-xs text-primary opacity-0 transition group-hover:opacity-100", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3 w-3" }),
            " Create"
          ] })
        ] }, t.id);
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 flex flex-wrap items-center gap-2", children: ["all", ...DOC_TYPES.map((t) => t.id)].map((id) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setFilter(id), className: `rounded-full px-3 py-1 text-xs transition ${filter === id ? "bg-primary text-primary-foreground" : "glass-subtle hover:glass"}`, children: id === "all" ? "All" : DOC_TYPES.find((t) => t.id === id)?.name }, id)) }),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-8 text-muted-foreground", children: "Loading…" }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "mt-6 glass border-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex flex-col items-center gap-3 py-16 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-10 w-10 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "No documents yet — pick a type above to start." })
    ] }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 grid gap-3", children: filtered.map((r) => {
      const Icon = TYPE_ICON[r.doc_type];
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "glass border-0 transition hover:-translate-y-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex items-center justify-between gap-4 py-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/document-editor", search: {
          id: r.id
        }, className: "flex flex-1 items-center gap-3 text-left", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-medium", children: [
              r.title,
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                "#",
                r.doc_number
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
              DOC_TYPES.find((t) => t.id === r.doc_type)?.name,
              " · ",
              r.status,
              " · updated ",
              new Date(r.updated_at).toLocaleString()
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", onClick: () => remove(r.id), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4 text-destructive" }) })
      ] }) }, r.id);
    }) })
  ] }) });
}
export {
  DocumentsPage as component
};
