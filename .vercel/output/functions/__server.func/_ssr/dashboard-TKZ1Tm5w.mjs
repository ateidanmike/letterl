import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useAuth, s as supabase } from "./router-BZ24CEhc.mjs";
import { B as Button } from "./button-Cz8PAkJh.mjs";
import { C as Card, c as CardContent } from "./card-HxqUHXRA.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { I as Input } from "./input-DVeAuAgX.mjs";
import { T as ThemeToggle } from "./ThemeToggle-B9LpvJlv.mjs";
import { q as Plus, F as FileText, r as Trash2 } from "../_libs/lucide-react.mjs";
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
function Dashboard() {
  const {
    user
  } = useAuth();
  const navigate = useNavigate();
  const [rows, setRows] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [search, setSearch] = reactExports.useState("");
  const [folder, setFolder] = reactExports.useState("All");
  const load = async () => {
    const {
      data,
      error
    } = await supabase.from("letterheads").select("id,title,template,updated_at,folder").order("updated_at", {
      ascending: false
    });
    if (error) toast.error(error.message);
    else setRows(data ?? []);
    setLoading(false);
  };
  reactExports.useEffect(() => {
    if (user) load();
  }, [user]);
  const create = async () => {
    const {
      data,
      error
    } = await supabase.from("letterheads").insert({
      user_id: user.id,
      title: "Untitled letterhead"
    }).select("id").single();
    if (error) return toast.error(error.message);
    navigate({
      to: "/editor",
      search: {
        id: data.id
      }
    });
  };
  const remove = async (id) => {
    const {
      error
    } = await supabase.from("letterheads").delete().eq("id", id);
    if (error) toast.error(error.message);
    else setRows((r) => r.filter((x) => x.id !== id));
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ambient-bg min-h-screen", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-5xl px-6 py-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between rounded-2xl glass px-5 py-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold", children: "My letterheads" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeToggle, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: create, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-2 h-4 w-4" }),
          " New letterhead"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex flex-wrap items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: search, onChange: (e) => setSearch(e.target.value), placeholder: "Search letterheads…", className: "max-w-xs glass-subtle border-0" }),
      ["All", ...Array.from(new Set(rows.map((r) => r.folder).filter(Boolean)))].map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setFolder(f), className: `rounded-full px-3 py-1 text-xs transition ${folder === f ? "bg-primary text-primary-foreground" : "glass-subtle hover:glass"}`, children: f }, f))
    ] }),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-8 text-muted-foreground", children: "Loading…" }) : rows.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "mt-8 glass border-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex flex-col items-center gap-3 py-16 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-10 w-10 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "No letterheads yet." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: create, children: "Create your first one" })
    ] }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 grid gap-3", children: rows.filter((r) => folder === "All" || r.folder === folder).filter((r) => r.title.toLowerCase().includes(search.toLowerCase())).map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "glass border-0 transition hover:-translate-y-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex items-center justify-between gap-4 py-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/editor", search: {
        id: r.id
      }, className: "flex-1 text-left", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: r.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
          r.folder,
          " · ",
          r.template,
          " · updated ",
          new Date(r.updated_at).toLocaleString()
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", onClick: () => remove(r.id), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4 text-destructive" }) })
    ] }) }, r.id)) })
  ] }) });
}
export {
  Dashboard as component
};
