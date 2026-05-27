import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { u as useAuth, a as Route$2, s as supabase } from "./router-BZ24CEhc.mjs";
import { B as Button } from "./button-Cz8PAkJh.mjs";
import { I as Input } from "./input-DVeAuAgX.mjs";
import { L as Label } from "./label-DOAnQvhy.mjs";
import { T as Textarea } from "./textarea-CIfPmIKy.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem, e as exportPdf } from "./pdf-export-BQBqsHJC.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { a as DEFAULT_DOC, D as DOC_TYPES, b as DOC_TEMPLATES, C as CURRENCIES, c as calcTotals, f as formatMoney } from "./types-C8IlZ62M.mjs";
import "../_libs/jspdf.mjs";
import "../_libs/html2canvas.mjs";
import { A as ArrowLeft, e as Save, D as Download, r as Trash2, q as Plus } from "../_libs/lucide-react.mjs";
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
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-arrow.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/react-remove-scroll.mjs";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "fs";
import "path";
import "../_libs/fflate.mjs";
import "../_libs/fast-png.mjs";
import "../_libs/iobuffer.mjs";
import "../_libs/pako.mjs";
import "../_libs/dompurify.mjs";
import "../_libs/canvg.mjs";
import "../_libs/core-js.mjs";
import "../_libs/babel__runtime.mjs";
import "../_libs/raf.mjs";
import "../_libs/performance-now.mjs";
import "../_libs/rgbcolor.mjs";
import "../_libs/svg-pathdata.mjs";
import "../_libs/stackblur-canvas.mjs";
const A4_W = 794;
const A4_H = 1123;
const DocumentPreview = reactExports.forwardRef(function DocumentPreview2({ doc, scale = 1 }, ref) {
  const label = DOC_TYPES.find((t) => t.id === doc.doc_type)?.label ?? "DOCUMENT";
  const totals = calcTotals(doc);
  const fmt = (n) => formatMoney(n, doc.currency);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: A4_W * scale, minHeight: A4_H * scale }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      ref,
      id: "letterhead-page",
      style: {
        width: A4_W,
        minHeight: A4_H,
        transform: `scale(${scale})`,
        transformOrigin: "top left",
        background: "#ffffff",
        color: "#0f172a",
        fontFamily: "Inter, system-ui, sans-serif",
        fontSize: 12,
        position: "relative",
        boxShadow: "0 10px 40px rgba(0,0,0,0.08)"
      },
      children: [
        doc.template === "modern" && /* @__PURE__ */ jsxRuntimeExports.jsx(ModernTemplate, { doc, label, totals, fmt }),
        doc.template === "classic" && /* @__PURE__ */ jsxRuntimeExports.jsx(ClassicTemplate, { doc, label, totals, fmt }),
        doc.template === "minimal" && /* @__PURE__ */ jsxRuntimeExports.jsx(MinimalTemplate, { doc, label, totals, fmt }),
        doc.template === "bold" && /* @__PURE__ */ jsxRuntimeExports.jsx(BoldTemplate, { doc, label, totals, fmt })
      ]
    }
  ) });
});
function Header({ doc }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 12 }, children: [
    doc.logo_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: doc.logo_url, alt: "", style: { maxHeight: 56, maxWidth: 160, objectFit: "contain" } }) : null,
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontWeight: 700, fontSize: 18 }, children: doc.from_party.name || "Your Company" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, color: "#64748b", whiteSpace: "pre-line" }, children: doc.from_party.address })
    ] })
  ] });
}
function Meta({ doc, label, color }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "right" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 36, fontWeight: 800, letterSpacing: 1, color }, children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 11, color: "#475569", marginTop: 6 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "No." }),
        " ",
        doc.doc_number
      ] }),
      doc.issue_date && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "Date:" }),
        " ",
        doc.issue_date
      ] }),
      doc.due_date && doc.doc_type === "invoice" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "Due:" }),
        " ",
        doc.due_date
      ] })
    ] })
  ] });
}
function ItemsTable({ doc, fmt, color }) {
  const showQty = doc.doc_type !== "receipt";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { style: { width: "100%", borderCollapse: "collapse", fontSize: 11, marginTop: 16 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { style: { background: color, color: "#fff" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: th, children: "#" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { ...th, textAlign: "left" }, children: "Description" }),
      showQty && /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: th, children: "Qty" }),
      showQty && /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: th, children: "Price" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { ...th, textAlign: "right" }, children: "Amount" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: doc.items.map((it, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { style: { borderBottom: "1px solid #e2e8f0" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: td, children: String(i + 1).padStart(2, "0") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { ...td, textAlign: "left" }, children: it.description }),
      showQty && /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: td, children: it.quantity }),
      showQty && /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: td, children: fmt(it.price) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { ...td, textAlign: "right", fontWeight: 600 }, children: fmt(it.quantity * it.price) })
    ] }, it.id)) })
  ] });
}
function Totals({ doc, totals, fmt, color }) {
  if (doc.doc_type === "delivery_note") return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginTop: 16, marginLeft: "auto", width: 280, fontSize: 12 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Subtotal", value: fmt(totals.subtotal) }),
    totals.discount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Discount", value: `- ${fmt(totals.discount)}` }),
    doc.tax_rate > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: `Tax (${doc.tax_rate}%)`, value: fmt(totals.tax) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: color, color: "#fff", padding: "10px 12px", borderRadius: 6, marginTop: 6, display: "flex", justifyContent: "space-between", fontWeight: 700 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Total" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: fmt(totals.total) })
    ] })
  ] });
}
function Row({ label, value }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px dashed #e2e8f0" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#64748b" }, children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontWeight: 600 }, children: value })
  ] });
}
function BillTo({ doc }) {
  const heading = doc.doc_type === "delivery_note" ? "Deliver To" : doc.doc_type === "quotation" ? "Prepared For" : "Bill To";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 10, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1 }, children: heading }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontWeight: 700, fontSize: 14, marginTop: 4 }, children: doc.to_party.name || "Recipient name" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, color: "#64748b", whiteSpace: "pre-line" }, children: doc.to_party.address }),
    doc.to_party.email && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, color: "#64748b" }, children: doc.to_party.email }),
    doc.to_party.phone && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, color: "#64748b" }, children: doc.to_party.phone })
  ] });
}
function Footer({ doc }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginTop: 28, fontSize: 10.5, color: "#475569" }, children: [
    doc.notes && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "Notes:" }),
      " ",
      doc.notes
    ] }),
    doc.terms && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginTop: 4 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "Terms:" }),
      " ",
      doc.terms
    ] }),
    (doc.signature_name || doc.signature_data) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginTop: 30, textAlign: "right" }, children: [
      doc.signature_data && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: doc.signature_data, alt: "signature", style: { height: 40, display: "inline-block" } }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { borderTop: "1px solid #94a3b8", display: "inline-block", paddingTop: 4, marginTop: 4, minWidth: 180 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontWeight: 700 }, children: doc.signature_name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#64748b" }, children: doc.signature_title })
      ] })
    ] })
  ] });
}
const th = { padding: "10px 8px", fontSize: 10.5, textAlign: "center", textTransform: "uppercase", letterSpacing: 0.5 };
const td = { padding: "10px 8px", textAlign: "center" };
function ModernTemplate({ doc, label, totals, fmt }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: 48 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Header, { doc }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Meta, { doc, label, color: doc.primary_color })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginTop: 28 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(BillTo, { doc }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ItemsTable, { doc, fmt, color: doc.primary_color }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Totals, { doc, label, totals, fmt, color: doc.primary_color }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, { doc })
  ] });
}
function ClassicTemplate({ doc, label, totals, fmt }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: 48 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center", borderBottom: `3px double ${doc.primary_color}`, paddingBottom: 16 }, children: [
      doc.logo_url && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: doc.logo_url, alt: "", style: { maxHeight: 64, maxWidth: 200, objectFit: "contain" } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontWeight: 700, fontSize: 22, marginTop: 8 }, children: doc.from_party.name || "Your Company" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, color: "#64748b" }, children: doc.from_party.address })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginTop: 24 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(BillTo, { doc }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Meta, { doc, label, color: doc.primary_color })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ItemsTable, { doc, fmt, color: doc.primary_color }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Totals, { doc, label, totals, fmt, color: doc.primary_color }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, { doc })
  ] });
}
function MinimalTemplate({ doc, label, totals, fmt }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: 56 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-end" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 28, fontWeight: 300, letterSpacing: 4, color: doc.primary_color }, children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 11, color: "#64748b", textAlign: "right" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: doc.from_party.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: doc.from_party.email })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { borderTop: `1px solid ${doc.primary_color}`, marginTop: 8 } }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 28 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(BillTo, { doc }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 11, color: "#475569" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "No." }),
          " ",
          doc.doc_number
        ] }),
        doc.issue_date && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "Date:" }),
          " ",
          doc.issue_date
        ] }),
        doc.due_date && doc.doc_type === "invoice" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "Due:" }),
          " ",
          doc.due_date
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ItemsTable, { doc, fmt, color: "#0f172a" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Totals, { doc, label, totals, fmt, color: doc.primary_color }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, { doc })
  ] });
}
function BoldTemplate({ doc, label, totals, fmt }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: doc.primary_color, color: "#fff", padding: "32px 48px", display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        doc.logo_url && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: doc.logo_url, alt: "", style: { maxHeight: 48, filter: "brightness(0) invert(1)" } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontWeight: 700, fontSize: 18, marginTop: 6 }, children: doc.from_party.name || "Your Company" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 11, opacity: 0.85 }, children: [
          doc.from_party.email,
          " · ",
          doc.from_party.phone
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "right" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 38, fontWeight: 800, letterSpacing: 1 }, children: label }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 11, opacity: 0.9, marginTop: 6 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            "No. ",
            doc.doc_number
          ] }),
          doc.issue_date && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            "Date: ",
            doc.issue_date
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: 48 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(BillTo, { doc }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ItemsTable, { doc, fmt, color: doc.accent_color }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Totals, { doc, label, totals, fmt, color: doc.accent_color }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, { doc })
    ] })
  ] });
}
function DocumentEditor() {
  const {
    user
  } = useAuth();
  const navigate = useNavigate();
  const {
    id
  } = Route$2.useSearch();
  const [doc, setDoc] = reactExports.useState(DEFAULT_DOC);
  const [loaded, setLoaded] = reactExports.useState(false);
  const [saving, setSaving] = reactExports.useState(false);
  const previewRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (!id || !user) return;
    (async () => {
      const {
        data,
        error
      } = await supabase.from("business_documents").select("*").eq("id", id).single();
      if (error) toast.error(error.message);
      const raw = data;
      if (raw) {
        const items = Array.isArray(raw.items) ? raw.items : [];
        setDoc({
          ...DEFAULT_DOC,
          ...raw,
          items: items.length ? items : DEFAULT_DOC.items,
          from_party: {
            ...DEFAULT_DOC.from_party,
            ...raw.from_party ?? {}
          },
          to_party: {
            ...DEFAULT_DOC.to_party,
            ...raw.to_party ?? {}
          }
        });
      }
      const {
        data: brand
      } = await supabase.from("brands").select("*").eq("user_id", user.id).maybeSingle();
      let logoUrl = null;
      if (brand?.logo_path) {
        const {
          data: signed
        } = await supabase.storage.from("logos").createSignedUrl(brand.logo_path, 3600);
        logoUrl = signed?.signedUrl ?? null;
      }
      if (brand && !raw) {
        setDoc((d) => ({
          ...d,
          logo_url: logoUrl,
          primary_color: brand.primary_color ?? d.primary_color,
          accent_color: brand.accent_color ?? d.accent_color,
          from_party: {
            name: brand.company_name ?? "",
            address: brand.address ?? "",
            email: brand.email ?? "",
            phone: brand.phone ?? ""
          }
        }));
      } else if (brand && raw) {
        setDoc((d) => ({
          ...d,
          logo_url: d.logo_url ?? logoUrl
        }));
      }
      setLoaded(true);
    })();
  }, [id, user]);
  const save = async () => {
    if (!id) return;
    setSaving(true);
    const {
      error
    } = await supabase.from("business_documents").update({
      doc_type: doc.doc_type,
      doc_number: doc.doc_number,
      title: doc.title,
      template: doc.template,
      issue_date: doc.issue_date,
      due_date: doc.due_date,
      currency: doc.currency,
      from_party: doc.from_party,
      to_party: doc.to_party,
      items: doc.items,
      tax_rate: doc.tax_rate,
      discount: doc.discount,
      notes: doc.notes,
      terms: doc.terms,
      primary_color: doc.primary_color,
      accent_color: doc.accent_color,
      signature_name: doc.signature_name,
      signature_title: doc.signature_title
    }).eq("id", id);
    setSaving(false);
    if (error) toast.error(error.message);
    else toast.success("Saved");
  };
  const download = async () => {
    if (!previewRef.current) return;
    await exportPdf(previewRef.current, `${doc.title || "document"}.pdf`);
  };
  const updateItem = (idx, patch) => {
    setDoc((d) => ({
      ...d,
      items: d.items.map((it, i) => i === idx ? {
        ...it,
        ...patch
      } : it)
    }));
  };
  const addItem = () => setDoc((d) => ({
    ...d,
    items: [...d.items, {
      id: crypto.randomUUID(),
      description: "",
      quantity: 1,
      price: 0
    }]
  }));
  const removeItem = (idx) => setDoc((d) => ({
    ...d,
    items: d.items.filter((_, i) => i !== idx)
  }));
  if (!loaded) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-10 text-muted-foreground", children: "Loading…" });
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ambient-bg min-h-screen", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[420px_1fr]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", size: "sm", onClick: () => navigate({
          to: "/documents"
        }), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "mr-1 h-4 w-4" }),
          " Back"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", onClick: save, disabled: saving, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "mr-1 h-4 w-4" }),
            " ",
            saving ? "Saving…" : "Save"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", onClick: download, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "mr-1 h-4 w-4" }),
            " PDF"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { title: "Document", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Title", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: doc.title, onChange: (e) => setDoc({
          ...doc,
          title: e.target.value
        }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Type", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: doc.doc_type, onValueChange: (v) => setDoc({
            ...doc,
            doc_type: v
          }), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: DOC_TYPES.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: t.id, children: t.name }, t.id)) })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Template", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: doc.template, onValueChange: (v) => setDoc({
            ...doc,
            template: v
          }), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: DOC_TEMPLATES.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: t.id, children: t.name }, t.id)) })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Number", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: doc.doc_number, onChange: (e) => setDoc({
            ...doc,
            doc_number: e.target.value
          }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Currency", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: doc.currency, onValueChange: (v) => setDoc({
            ...doc,
            currency: v
          }), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: CURRENCIES.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c, children: c }, c)) })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Issue date", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: doc.issue_date ?? "", onChange: (e) => setDoc({
            ...doc,
            issue_date: e.target.value
          }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Due date", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: doc.due_date ?? "", onChange: (e) => setDoc({
            ...doc,
            due_date: e.target.value
          }) }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Primary color", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "color", value: doc.primary_color, onChange: (e) => setDoc({
            ...doc,
            primary_color: e.target.value
          }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Accent color", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "color", value: doc.accent_color, onChange: (e) => setDoc({
            ...doc,
            accent_color: e.target.value
          }) }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { title: "From", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Company name", value: doc.from_party.name, onChange: (e) => setDoc({
          ...doc,
          from_party: {
            ...doc.from_party,
            name: e.target.value
          }
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { placeholder: "Address", value: doc.from_party.address, onChange: (e) => setDoc({
          ...doc,
          from_party: {
            ...doc.from_party,
            address: e.target.value
          }
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Email", value: doc.from_party.email, onChange: (e) => setDoc({
            ...doc,
            from_party: {
              ...doc.from_party,
              email: e.target.value
            }
          }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Phone", value: doc.from_party.phone, onChange: (e) => setDoc({
            ...doc,
            from_party: {
              ...doc.from_party,
              phone: e.target.value
            }
          }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { title: "To", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Recipient name", value: doc.to_party.name, onChange: (e) => setDoc({
          ...doc,
          to_party: {
            ...doc.to_party,
            name: e.target.value
          }
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { placeholder: "Address", value: doc.to_party.address, onChange: (e) => setDoc({
          ...doc,
          to_party: {
            ...doc.to_party,
            address: e.target.value
          }
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Email", value: doc.to_party.email, onChange: (e) => setDoc({
            ...doc,
            to_party: {
              ...doc.to_party,
              email: e.target.value
            }
          }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Phone", value: doc.to_party.phone, onChange: (e) => setDoc({
            ...doc,
            to_party: {
              ...doc.to_party,
              phone: e.target.value
            }
          }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { title: "Line items", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          doc.items.map((it, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-[1fr_60px_80px_28px] gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Description", value: it.description, onChange: (e) => updateItem(i, {
              description: e.target.value
            }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", min: 0, value: it.quantity, onChange: (e) => updateItem(i, {
              quantity: Number(e.target.value)
            }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", min: 0, step: "0.01", value: it.price, onChange: (e) => updateItem(i, {
              price: Number(e.target.value)
            }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", onClick: () => removeItem(i), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4 text-destructive" }) })
          ] }, it.id)),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", onClick: addItem, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-1 h-4 w-4" }),
            " Add item"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2 pt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Tax %", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", min: 0, value: doc.tax_rate, onChange: (e) => setDoc({
            ...doc,
            tax_rate: Number(e.target.value)
          }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Discount", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", min: 0, value: doc.discount, onChange: (e) => setDoc({
            ...doc,
            discount: Number(e.target.value)
          }) }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { title: "Notes & terms", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { placeholder: "Notes", value: doc.notes, onChange: (e) => setDoc({
          ...doc,
          notes: e.target.value
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { placeholder: "Terms & conditions", value: doc.terms, onChange: (e) => setDoc({
          ...doc,
          terms: e.target.value
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Signed by", value: doc.signature_name, onChange: (e) => setDoc({
            ...doc,
            signature_name: e.target.value
          }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Title", value: doc.signature_title, onChange: (e) => setDoc({
            ...doc,
            signature_title: e.target.value
          }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "overflow-auto rounded-2xl glass p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto", style: {
      width: 794
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(DocumentPreview, { ref: previewRef, doc }) }) })
  ] }) });
}
function Section({
  title,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl glass p-4 space-y-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold", children: title }),
    children
  ] });
}
function Field({
  label,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: label }),
    children
  ] });
}
export {
  DocumentEditor as component
};
