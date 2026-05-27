import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { u as useAuth, R as Route$4, s as supabase } from "./router-BZ24CEhc.mjs";
import { B as Button, c as cn } from "./button-Cz8PAkJh.mjs";
import { I as Input } from "./input-DVeAuAgX.mjs";
import { L as Label } from "./label-DOAnQvhy.mjs";
import { T as Textarea } from "./textarea-CIfPmIKy.mjs";
import { C as Card, c as CardContent } from "./card-HxqUHXRA.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem, e as exportPdf } from "./pdf-export-BQBqsHJC.mjs";
import { R as Root, T as Track, a as Range, b as Thumb } from "../_libs/radix-ui__react-slider.mjs";
import { R as Root2, T as Trigger, P as Portal2, C as Content2, I as Item2, S as SubTrigger2, a as SubContent2, b as CheckboxItem2, c as ItemIndicator2, d as RadioItem2, L as Label2, e as Separator2 } from "../_libs/radix-ui__react-dropdown-menu.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { Q as QRCode } from "../_libs/qrcode.mjs";
import { P as Paragraph, I as ImageRun, A as AlignmentType, T as TextRun, B as BorderStyle, F as File, a as Footer2, H as Header2, b as Packer } from "../_libs/docx.mjs";
import { h as html2canvas } from "../_libs/html2canvas.mjs";
import "../_libs/jspdf.mjs";
import { A as ArrowLeft, e as Save, D as Download, f as BookmarkPlus, g as Share2, h as RotateCcw, S as Sparkles, i as Type, W as WandSparkles, M as Minimize2, j as Maximize2, L as Languages, E as Eraser, k as Upload, l as Phone, m as Mail, n as Globe, o as ChevronRight, C as Check, p as Circle } from "../_libs/lucide-react.mjs";
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
import "../_libs/radix-ui__react-menu.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "../_libs/dijkstrajs.mjs";
import "fs";
import "../_libs/pngjs.mjs";
import "zlib";
import "assert";
import "buffer";
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
const Slider = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  Root,
  {
    ref,
    className: cn("relative flex w-full touch-none select-none items-center", className),
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Track, { className: "relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Range, { className: "absolute h-full bg-primary" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Thumb, { className: "block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" })
    ]
  }
));
Slider.displayName = Root.displayName;
const DropdownMenu = Root2;
const DropdownMenuTrigger = Trigger;
const DropdownMenuSubTrigger = reactExports.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  SubTrigger2,
  {
    ref,
    className: cn(
      "flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      inset && "pl-8",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "ml-auto" })
    ]
  }
));
DropdownMenuSubTrigger.displayName = SubTrigger2.displayName;
const DropdownMenuSubContent = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  SubContent2,
  {
    ref,
    className: cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)",
      className
    ),
    ...props
  }
));
DropdownMenuSubContent.displayName = SubContent2.displayName;
const DropdownMenuContent = reactExports.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(Portal2, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
  Content2,
  {
    ref,
    sideOffset,
    className: cn(
      "z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)",
      className
    ),
    ...props
  }
) }));
DropdownMenuContent.displayName = Content2.displayName;
const DropdownMenuItem = reactExports.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Item2,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0",
      inset && "pl-8",
      className
    ),
    ...props
  }
));
DropdownMenuItem.displayName = Item2.displayName;
const DropdownMenuCheckboxItem = reactExports.forwardRef(({ className, children, checked, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  CheckboxItem2,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    checked,
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ItemIndicator2, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4" }) }) }),
      children
    ]
  }
));
DropdownMenuCheckboxItem.displayName = CheckboxItem2.displayName;
const DropdownMenuRadioItem = reactExports.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  RadioItem2,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ItemIndicator2, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Circle, { className: "h-2 w-2 fill-current" }) }) }),
      children
    ]
  }
));
DropdownMenuRadioItem.displayName = RadioItem2.displayName;
const DropdownMenuLabel = reactExports.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Label2,
  {
    ref,
    className: cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className),
    ...props
  }
));
DropdownMenuLabel.displayName = Label2.displayName;
const DropdownMenuSeparator = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Separator2,
  {
    ref,
    className: cn("-mx-1 my-1 h-px bg-muted", className),
    ...props
  }
));
DropdownMenuSeparator.displayName = Separator2.displayName;
async function makeQrDataUrl(text, size = 96) {
  return QRCode.toDataURL(text, {
    width: size,
    margin: 0,
    color: { dark: "#0f172a", light: "#ffffff" }
  });
}
const A4_W = 794;
const A4_H = 1123;
const LetterheadPreview = reactExports.forwardRef(
  function LetterheadPreview2({ brand, letter, scale = 1, qrUrl }, ref) {
    const [qrData, setQrData] = reactExports.useState(null);
    reactExports.useEffect(() => {
      let cancelled = false;
      if (letter.show_qr && qrUrl) {
        makeQrDataUrl(qrUrl, 96).then((d) => {
          if (!cancelled) setQrData(d);
        });
      } else {
        setQrData(null);
      }
      return () => {
        cancelled = true;
      };
    }, [letter.show_qr, qrUrl]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        style: {
          width: A4_W * scale,
          minHeight: A4_H * scale
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            ref,
            id: "letterhead-page",
            style: {
              width: A4_W,
              minHeight: A4_H,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
              background: "white",
              color: "#0f172a",
              fontFamily: letter.font_family,
              fontSize: letter.font_size,
              lineHeight: 1.55,
              position: "relative",
              boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
              overflow: "visible"
            },
            children: [
              letter.template === "classic" && /* @__PURE__ */ jsxRuntimeExports.jsx(ClassicTemplate, { brand, letter }),
              letter.template === "left-modern" && /* @__PURE__ */ jsxRuntimeExports.jsx(LeftModernTemplate, { brand, letter }),
              letter.template === "minimal" && /* @__PURE__ */ jsxRuntimeExports.jsx(MinimalTemplate, { brand, letter }),
              letter.template === "bold-banner" && /* @__PURE__ */ jsxRuntimeExports.jsx(BoldBannerTemplate, { brand, letter }),
              letter.template === "corporate" && /* @__PURE__ */ jsxRuntimeExports.jsx(CorporateTemplate, { brand, letter }),
              letter.template === "legal" && /* @__PURE__ */ jsxRuntimeExports.jsx(LegalTemplate, { brand, letter }),
              letter.template === "executive" && /* @__PURE__ */ jsxRuntimeExports.jsx(ExecutiveTemplate, { brand, letter }),
              letter.template === "monogram" && /* @__PURE__ */ jsxRuntimeExports.jsx(MonogramTemplate, { brand, letter }),
              brand.watermark_text && /* @__PURE__ */ jsxRuntimeExports.jsx(Watermark, { text: brand.watermark_text }),
              qrData && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "absolute", bottom: 16, right: 16, background: "white", padding: 4, border: "1px solid #e2e8f0", borderRadius: 4, zIndex: 2 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: qrData, alt: "QR", style: { width: 64, height: 64, display: "block" } }) })
            ]
          }
        )
      }
    );
  }
);
function Body({ letter }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { whiteSpace: "pre-wrap" }, children: [
    letter.letter_date && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { marginBottom: 16 }, children: new Date(letter.letter_date).toLocaleDateString(void 0, {
      year: "numeric",
      month: "long",
      day: "numeric"
    }) }),
    letter.recipient && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { marginBottom: 16, whiteSpace: "pre-wrap" }, children: letter.recipient }),
    letter.subject && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { style: { marginBottom: 16, fontWeight: 600 }, children: [
      "Re: ",
      letter.subject
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { whiteSpace: "pre-wrap" }, children: letter.body || /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#94a3b8" }, children: "Start typing your letter…" }) }),
    (letter.signature_name || letter.signature_title) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginTop: 40 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { marginBottom: 0 }, children: "Sincerely," }),
      letter.signature_data ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "img",
        {
          src: letter.signature_data,
          alt: "Signature",
          style: { height: 56, marginTop: 8, marginBottom: -4 }
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: 28 } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { marginTop: 4, fontWeight: 600 }, children: letter.signature_name }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { color: "#475569" }, children: letter.signature_title })
    ] })
  ] });
}
function ClassicTemplate({ brand, letter }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "48px 64px 0", textAlign: "center" }, children: [
      brand.logo_url ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "img",
        {
          src: brand.logo_url,
          alt: "Logo",
          crossOrigin: "anonymous",
          style: { height: 96, objectFit: "contain", margin: "0 auto" }
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 28, fontWeight: 700, color: letter.primary_color }, children: brand.company_name || "Your Company" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          style: {
            display: "flex",
            justifyContent: "center",
            marginTop: 16
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1, height: 2, background: letter.primary_color } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1, height: 2, background: letter.accent_color } })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { padding: "40px 64px", minHeight: A4_H - 320 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Body, { letter }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ClassicFooter, { brand, letter })
  ] });
}
function ClassicFooter({ brand, letter }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "absolute", bottom: 0, left: 0, right: 0 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        style: {
          display: "flex",
          justifyContent: "space-around",
          padding: "16px 64px",
          fontSize: 11,
          color: letter.primary_color,
          fontWeight: 600
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ContactItem, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { size: 12 }), text: brand.phone, color: letter.accent_color }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ContactItem, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { size: 12 }), text: brand.email, color: letter.accent_color }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ContactItem, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { size: 12 }), text: brand.website, color: letter.accent_color })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { viewBox: "0 0 794 60", style: { display: "block", width: "100%" }, preserveAspectRatio: "none", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("polygon", { points: "0,0 794,0 794,60 0,60", fill: letter.primary_color }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("polygon", { points: "280,60 397,0 514,60", fill: "white" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("polygon", { points: "320,60 397,20 474,60", fill: letter.accent_color })
    ] })
  ] });
}
function ContactItem({
  icon,
  text,
  color
}) {
  if (!text) return /* @__PURE__ */ jsxRuntimeExports.jsx("span", {});
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 6 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        style: {
          background: color,
          color: "white",
          width: 18,
          height: 18,
          borderRadius: 999,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center"
        },
        children: icon
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: text })
  ] });
}
function LeftModernTemplate({ brand, letter }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "48px 64px 24px",
          borderBottom: `3px solid ${letter.primary_color}`
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 16 }, children: [
            brand.logo_url && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: brand.logo_url, crossOrigin: "anonymous", alt: "", style: { height: 64 } }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 20, fontWeight: 700, color: letter.primary_color }, children: brand.company_name }),
              brand.address && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 10, color: "#475569", maxWidth: 240 }, children: brand.address })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 10, textAlign: "right", color: "#334155" }, children: [
            brand.phone && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: brand.phone }),
            brand.email && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: brand.email }),
            brand.website && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: letter.accent_color }, children: brand.website })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { padding: "40px 64px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Body, { letter }) })
  ] });
}
function MinimalTemplate({ brand, letter }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "48px 64px 16px", display: "flex", alignItems: "center", gap: 12 }, children: [
      brand.logo_url && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: brand.logo_url, crossOrigin: "anonymous", alt: "", style: { height: 40 } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 14, fontWeight: 600, color: letter.primary_color }, children: brand.company_name })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: 1, background: "#e2e8f0", margin: "0 64px" } }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { padding: "32px 64px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Body, { letter }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        style: {
          position: "absolute",
          bottom: 32,
          left: 64,
          right: 64,
          fontSize: 10,
          color: "#64748b",
          textAlign: "center",
          borderTop: `1px solid ${letter.accent_color}`,
          paddingTop: 8
        },
        children: [brand.phone, brand.email, brand.website, brand.address].filter(Boolean).join("  •  ")
      }
    )
  ] });
}
function BoldBannerTemplate({ brand, letter }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        style: {
          background: letter.primary_color,
          color: "white",
          padding: "32px 64px",
          display: "flex",
          alignItems: "center",
          gap: 20
        },
        children: [
          brand.logo_url && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: brand.logo_url,
              crossOrigin: "anonymous",
              alt: "",
              style: { height: 64, background: "white", padding: 6, borderRadius: 6 }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 24, fontWeight: 800 }, children: brand.company_name || "Your Company" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, opacity: 0.9 }, children: brand.address })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: 6, background: letter.accent_color } }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { padding: "40px 64px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Body, { letter }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        style: {
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "16px 64px",
          background: letter.primary_color,
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          fontSize: 10
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { size: 10, style: { display: "inline", marginRight: 4 } }),
            brand.phone
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { size: 10, style: { display: "inline", marginRight: 4 } }),
            brand.email
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { size: 10, style: { display: "inline", marginRight: 4 } }),
            brand.website
          ] })
        ]
      }
    )
  ] });
}
function Watermark({ text }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      style: {
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        zIndex: 1
      },
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          style: {
            fontSize: 96,
            fontWeight: 800,
            color: "rgba(15, 23, 42, 0.06)",
            transform: "rotate(-30deg)",
            letterSpacing: 4,
            textTransform: "uppercase",
            whiteSpace: "nowrap"
          },
          children: text
        }
      )
    }
  );
}
function Initials(name) {
  return (name || "Y C").split(/\s+/).filter(Boolean).slice(0, 2).map((s) => s[0]?.toUpperCase() ?? "").join("");
}
function CorporateTemplate({ brand, letter }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", height: "100%" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        style: {
          width: 14,
          background: `linear-gradient(180deg, ${letter.primary_color} 0%, ${letter.accent_color} 100%)`
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, padding: "48px 56px", position: "relative" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 14 }, children: [
          brand.logo_url && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: brand.logo_url, crossOrigin: "anonymous", alt: "", style: { height: 56 } }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 22, fontWeight: 800, color: letter.primary_color, letterSpacing: 0.5 }, children: brand.company_name || "Your Company" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: 2 }, children: "Official Correspondence" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 10, textAlign: "right", color: "#334155", lineHeight: 1.6 }, children: [
          brand.phone && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: brand.phone }),
          brand.email && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: brand.email }),
          brand.website && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: brand.website })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: 1, background: "#e2e8f0", margin: "24px 0" } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Body, { letter })
    ] })
  ] });
}
function LegalTemplate({ brand, letter }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "56px 72px 16px", textAlign: "center", fontFamily: "Georgia, serif" }, children: [
      brand.logo_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: brand.logo_url, crossOrigin: "anonymous", alt: "", style: { height: 64, margin: "0 auto" } }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 26, fontWeight: 700, color: letter.primary_color, letterSpacing: 3, textTransform: "uppercase" }, children: brand.company_name || "Your Firm" }),
      brand.address && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 10, color: "#475569", marginTop: 6 }, children: brand.address }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { borderTop: `2px solid ${letter.primary_color}`, marginTop: 14 } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { borderTop: `1px solid ${letter.primary_color}`, marginTop: 2 } })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { padding: "32px 80px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Body, { letter }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        style: {
          position: "absolute",
          bottom: 32,
          left: 80,
          right: 80,
          fontSize: 9,
          color: "#64748b",
          textAlign: "center",
          fontFamily: "Georgia, serif",
          fontStyle: "italic"
        },
        children: [brand.phone, brand.email, brand.website].filter(Boolean).join("  ·  ")
      }
    )
  ] });
}
function ExecutiveTemplate({ brand, letter }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: 4, background: letter.primary_color } }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "32px 64px 12px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: brand.logo_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: brand.logo_url, crossOrigin: "anonymous", alt: "", style: { height: 52 } }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 24, fontWeight: 300, color: letter.primary_color, letterSpacing: 4, textTransform: "uppercase" }, children: brand.company_name || "Your Company" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 9, color: "#64748b", textAlign: "right", letterSpacing: 1, textTransform: "uppercase" }, children: brand.address })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: 1, background: "#cbd5e1", margin: "0 64px" } }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { padding: "36px 64px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Body, { letter }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        style: {
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "14px 64px",
          background: "#f8fafc",
          borderTop: `2px solid ${letter.accent_color}`,
          display: "flex",
          justifyContent: "space-between",
          fontSize: 10,
          color: "#334155"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: brand.phone }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: brand.email }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: letter.primary_color, fontWeight: 600 }, children: brand.website })
        ]
      }
    )
  ] });
}
function MonogramTemplate({ brand, letter }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "56px 64px 24px", display: "flex", alignItems: "center", gap: 18 }, children: [
      brand.logo_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: brand.logo_url, crossOrigin: "anonymous", alt: "", style: { height: 64 } }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          style: {
            width: 64,
            height: 64,
            borderRadius: 999,
            background: letter.primary_color,
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: 1
          },
          children: Initials(brand.company_name)
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 20, fontWeight: 700, color: "#0f172a" }, children: brand.company_name || "Your Company" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 10, color: "#64748b" }, children: [brand.phone, brand.email, brand.website].filter(Boolean).join(" · ") })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { padding: "8px 64px 24px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Body, { letter }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        style: {
          position: "absolute",
          bottom: 24,
          left: 64,
          right: 64,
          fontSize: 9,
          color: "#94a3b8",
          textAlign: "center",
          letterSpacing: 2,
          textTransform: "uppercase"
        },
        children: brand.address
      }
    )
  ] });
}
const TONES = ["formal", "friendly", "executive", "legal", "apologetic", "persuasive", "concise"];
const LANGS = ["English", "Spanish", "French", "German", "Portuguese", "Italian", "Arabic", "Swahili", "Hindi", "Chinese"];
function AiPanel({ body, onApplyBody, onSubject }) {
  const [prompt, setPrompt] = reactExports.useState("");
  const [tone, setTone] = reactExports.useState("formal");
  const [language, setLanguage] = reactExports.useState("English");
  const [busy, setBusy] = reactExports.useState(null);
  const [subjects, setSubjects] = reactExports.useState([]);
  const call = async (action, payload = {}) => {
    setBusy(action);
    const { data, error } = await supabase.functions.invoke("ai-assist", {
      body: { action, tone, language, text: body, ...payload }
    });
    setBusy(null);
    if (error || data?.error) {
      toast.error(data?.error ?? error?.message ?? "AI failed");
      return null;
    }
    return data;
  };
  const generate = async () => {
    if (!prompt.trim()) return toast.error("Describe the letter you want");
    const data = await call("generate", { prompt });
    if (data?.result) {
      onApplyBody(data.result);
      toast.success("Letter drafted");
    }
  };
  const transform = async (action) => {
    if (!body.trim()) return toast.error("Add some text first");
    const data = await call(action);
    if (data?.result) {
      onApplyBody(data.result);
      toast.success(`Text ${action}ed`);
    }
  };
  const suggestSubjects = async () => {
    if (!body.trim()) return toast.error("Add some text first");
    const data = await call("subject");
    if (data?.suggestions) setSubjects(data.suggestions);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Tone" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: tone, onValueChange: setTone, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: TONES.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: t, className: "capitalize", children: t }, t)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Language" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: language, onValueChange: setLanguage, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: LANGS.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: l, children: l }, l)) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Describe the letter" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Textarea,
        {
          rows: 3,
          value: prompt,
          onChange: (e) => setPrompt(e.target.value),
          placeholder: 'e.g. "Apology to a supplier for a 14-day payment delay; promise full payment Friday."'
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", onClick: generate, disabled: busy !== null, className: "mt-2 w-full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "mr-2 h-3 w-3" }),
        busy === "generate" ? "Drafting…" : "Generate letter"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "secondary", onClick: () => transform("tone"), disabled: busy !== null, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Type, { className: "mr-1 h-3 w-3" }),
        " Apply tone"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "secondary", onClick: () => transform("rewrite"), disabled: busy !== null, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(WandSparkles, { className: "mr-1 h-3 w-3" }),
        " Rewrite"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "secondary", onClick: () => transform("shorten"), disabled: busy !== null, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Minimize2, { className: "mr-1 h-3 w-3" }),
        " Shorten"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "secondary", onClick: () => transform("expand"), disabled: busy !== null, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Maximize2, { className: "mr-1 h-3 w-3" }),
        " Expand"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "secondary", onClick: () => transform("simplify"), disabled: busy !== null, children: "Simplify" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "secondary", onClick: () => transform("translate"), disabled: busy !== null, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Languages, { className: "mr-1 h-3 w-3" }),
        " Translate"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", onClick: suggestSubjects, disabled: busy !== null, className: "w-full", children: "Suggest subject lines" }),
      subjects.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-2 space-y-1", children: subjects.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => onSubject(s),
          className: "w-full rounded border px-2 py-1 text-left text-xs hover:bg-accent",
          children: s
        }
      ) }, i)) })
    ] })
  ] });
}
function SignaturePad({ value, onChange }) {
  const canvasRef = reactExports.useRef(null);
  const [drawing, setDrawing] = reactExports.useState(false);
  const fileRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, c.width, c.height);
    if (value) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0, c.width, c.height);
      img.src = value;
    }
  }, [value]);
  const pos = (e) => {
    const c = canvasRef.current;
    const r = c.getBoundingClientRect();
    return { x: (e.clientX - r.left) * c.width / r.width, y: (e.clientY - r.top) * c.height / r.height };
  };
  const start = (e) => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    setDrawing(true);
    const { x, y } = pos(e);
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#0f172a";
    ctx.beginPath();
    ctx.moveTo(x, y);
  };
  const move = (e) => {
    if (!drawing) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const { x, y } = pos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };
  const end = () => {
    if (!drawing) return;
    setDrawing(false);
    const c = canvasRef.current;
    if (!c) return;
    onChange(c.toDataURL("image/png"));
  };
  const clear = () => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, c.width, c.height);
    onChange(null);
  };
  const onUpload = async (file) => {
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result);
    reader.readAsDataURL(file);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "canvas",
      {
        ref: canvasRef,
        width: 500,
        height: 140,
        className: "w-full rounded border bg-white touch-none cursor-crosshair",
        onPointerDown: start,
        onPointerMove: move,
        onPointerUp: end,
        onPointerLeave: end
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "ghost", onClick: clear, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Eraser, { className: "mr-1 h-3 w-3" }),
        " Clear"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          ref: fileRef,
          type: "file",
          accept: "image/png,image/jpeg",
          className: "hidden",
          onChange: (e) => e.target.files?.[0] && onUpload(e.target.files[0])
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "ghost", onClick: () => fileRef.current?.click(), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "mr-1 h-3 w-3" }),
        " Upload"
      ] })
    ] })
  ] });
}
const PAGE_FORMATS = [
  { id: "a4", name: "A4 (210 × 297 mm)", mm: [210, 297] },
  { id: "letter", name: "US Letter (216 × 279 mm)", mm: [216, 279] },
  { id: "legal", name: "US Legal (216 × 356 mm)", mm: [216, 356] }
];
const THEME_PRESETS = [
  { id: "classic", name: "Classic", template: "classic", font_family: "Lora", primary_color: "#1E3A8A", accent_color: "#16A34A" },
  { id: "modern", name: "Modern", template: "left-modern", font_family: "Inter", primary_color: "#0F172A", accent_color: "#F59E0B" },
  { id: "minimal", name: "Minimal", template: "minimal", font_family: "Inter", primary_color: "#0F172A", accent_color: "#64748B" },
  { id: "executive", name: "Executive", template: "executive", font_family: "Playfair Display", primary_color: "#111827", accent_color: "#B45309" },
  { id: "creative", name: "Creative", template: "bold-banner", font_family: "Montserrat", primary_color: "#7C3AED", accent_color: "#EC4899" }
];
const TEMPLATES = [
  { id: "classic", name: "Classic Centered", description: "Centered logo with chevron footer" },
  { id: "left-modern", name: "Left Modern", description: "Logo left, contact right" },
  { id: "minimal", name: "Minimal", description: "Thin rule, footer line" },
  { id: "bold-banner", name: "Bold Banner", description: "Full-width colored header band" },
  { id: "corporate", name: "Corporate", description: "Two-tone side bar with bold heading" },
  { id: "legal", name: "Legal", description: "Serif heading, double rule, formal layout" },
  { id: "executive", name: "Executive", description: "Top monoline rule, refined contact strip" },
  { id: "monogram", name: "Monogram", description: "Initials disc + clean stationery feel" }
];
const FONTS = [
  "Inter",
  "Roboto",
  "Lora",
  "Merriweather",
  "Montserrat",
  "Playfair Display",
  "Georgia",
  "Arial"
];
const DEFAULT_LETTERHEAD = {
  title: "Untitled letterhead",
  template: "classic",
  font_family: "Inter",
  font_size: 11,
  primary_color: "#1E40AF",
  accent_color: "#16A34A",
  letter_date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
  recipient: "",
  subject: "",
  body: "",
  signature_name: "",
  signature_title: "",
  page_format: "a4",
  page_orientation: "portrait",
  margin_mm: 18,
  show_qr: false,
  brand_id: null
};
async function fetchLogoBytes(url) {
  if (!url) return null;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return new Uint8Array(await res.arrayBuffer());
  } catch {
    return null;
  }
}
function detectImageType(url) {
  return /\.jpe?g($|\?)/i.test(url) ? "jpg" : "png";
}
function bodyParagraphs(letter) {
  const sizeHp = letter.font_size * 2;
  const font = letter.font_family;
  const out = [];
  if (letter.letter_date) {
    out.push(
      new Paragraph({
        spacing: { after: 240 },
        children: [
          new TextRun({
            text: new Date(letter.letter_date).toLocaleDateString(void 0, {
              year: "numeric",
              month: "long",
              day: "numeric"
            }),
            font,
            size: sizeHp
          })
        ]
      })
    );
  }
  if (letter.recipient) {
    letter.recipient.split("\n").forEach((line) => {
      out.push(
        new Paragraph({
          children: [new TextRun({ text: line || " ", font, size: sizeHp })]
        })
      );
    });
    out.push(new Paragraph({ children: [new TextRun(" ")] }));
  }
  if (letter.subject) {
    out.push(
      new Paragraph({
        spacing: { after: 240 },
        children: [
          new TextRun({ text: `Re: ${letter.subject}`, bold: true, font, size: sizeHp })
        ]
      })
    );
  }
  (letter.body || "").split("\n").forEach((line) => {
    out.push(
      new Paragraph({
        spacing: { after: 120 },
        children: [new TextRun({ text: line || " ", font, size: sizeHp })]
      })
    );
  });
  if (letter.signature_name || letter.signature_title) {
    out.push(new Paragraph({ children: [new TextRun(" ")] }));
    out.push(
      new Paragraph({
        children: [new TextRun({ text: "Sincerely,", font, size: sizeHp })]
      })
    );
    out.push(new Paragraph({ children: [new TextRun(" ")] }));
    out.push(new Paragraph({ children: [new TextRun(" ")] }));
    if (letter.signature_name)
      out.push(
        new Paragraph({
          children: [
            new TextRun({ text: letter.signature_name, bold: true, font, size: sizeHp })
          ]
        })
      );
    if (letter.signature_title)
      out.push(
        new Paragraph({
          children: [
            new TextRun({ text: letter.signature_title, font, size: sizeHp, color: "475569" })
          ]
        })
      );
  }
  return out;
}
async function exportDocx(brand, letter, filename) {
  const logoBytes = await fetchLogoBytes(brand.logo_url);
  const logoType = brand.logo_url ? detectImageType(brand.logo_url) : "png";
  const primary = letter.primary_color.replace("#", "");
  const accent = letter.accent_color.replace("#", "");
  const headerChildren = [];
  if (logoBytes) {
    headerChildren.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new ImageRun({
            type: logoType,
            data: logoBytes,
            transformation: { width: 120, height: 80 },
            altText: { title: "Logo", description: brand.company_name, name: "logo" }
          })
        ]
      })
    );
  } else if (brand.company_name) {
    headerChildren.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: brand.company_name,
            bold: true,
            size: 32,
            color: primary,
            font: letter.font_family
          })
        ]
      })
    );
  }
  headerChildren.push(
    new Paragraph({
      border: {
        bottom: { style: BorderStyle.SINGLE, size: 12, color: primary, space: 1 }
      },
      children: [new TextRun(" ")]
    })
  );
  const footerLine = [brand.phone, brand.email, brand.website].filter(Boolean).join("   |   ");
  const footerChildren = [
    new Paragraph({
      border: {
        top: { style: BorderStyle.SINGLE, size: 12, color: accent, space: 4 }
      },
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: footerLine,
          size: 18,
          color: primary,
          font: letter.font_family
        })
      ]
    })
  ];
  const doc = new File({
    styles: {
      default: {
        document: { run: { font: letter.font_family, size: letter.font_size * 2 } }
      }
    },
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1080, bottom: 1080, left: 1440, right: 1440 }
          }
        },
        headers: { default: new Header2({ children: headerChildren }) },
        footers: { default: new Footer2({ children: footerChildren }) },
        children: bodyParagraphs(letter)
      }
    ]
  });
  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".docx") ? filename : `${filename}.docx`;
  a.click();
  URL.revokeObjectURL(url);
}
async function exportPng(node, filename, mime = "image/png") {
  const prevTransform = node.style.transform;
  const prevOrigin = node.style.transformOrigin;
  node.style.transform = "none";
  node.style.transformOrigin = "top left";
  const overrideStyle = document.createElement("style");
  overrideStyle.textContent = `#letterhead-page, #letterhead-page * {
    border-color: #e2e8f0 !important;
    outline-color: #e2e8f0 !important;
  }`;
  document.head.appendChild(overrideStyle);
  try {
    const canvas = await html2canvas(node, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      logging: false,
      width: node.offsetWidth,
      height: node.offsetHeight,
      onclone: (doc) => {
        const props = ["color", "backgroundColor", "borderTopColor", "borderRightColor", "borderBottomColor", "borderLeftColor", "outlineColor", "fill", "stroke"];
        doc.querySelectorAll("*").forEach((el) => {
          const cs = doc.defaultView?.getComputedStyle(el);
          if (!cs) return;
          props.forEach((p) => {
            const v = cs[p];
            if (v && v.includes("oklch")) {
              const fb = p === "color" ? "#0f172a" : p === "backgroundColor" ? "transparent" : "#e2e8f0";
              el.style[p] = fb;
            }
          });
        });
      }
    });
    const ext = mime === "image/jpeg" ? "jpg" : "png";
    const dataUrl = canvas.toDataURL(mime, 0.95);
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = filename.endsWith(`.${ext}`) ? filename : `${filename}.${ext}`;
    a.click();
  } finally {
    node.style.transform = prevTransform;
    node.style.transformOrigin = prevOrigin;
    overrideStyle.remove();
  }
}
function esc(s) {
  return (s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function buildHtmlEmail(brand, letter) {
  const primary = letter.primary_color;
  const accent = letter.accent_color;
  const font = letter.font_family;
  const dateStr = letter.letter_date ? new Date(letter.letter_date).toLocaleDateString(void 0, {
    year: "numeric",
    month: "long",
    day: "numeric"
  }) : "";
  const bodyHtml = esc(letter.body).replace(/\n/g, "<br/>");
  const recipientHtml = esc(letter.recipient).replace(/\n/g, "<br/>");
  const logo = brand.logo_url ? `<img src="${esc(brand.logo_url)}" alt="${esc(brand.company_name)}" style="height:80px;display:block;margin:0 auto;" />` : `<div style="font-size:24px;font-weight:700;color:${primary};text-align:center;">${esc(brand.company_name) || "Your Company"}</div>`;
  const contact = [brand.phone, brand.email, brand.website].filter(Boolean).map(esc).join(" &nbsp;·&nbsp; ");
  return `<!doctype html>
<html><head><meta charset="utf-8"><title>${esc(letter.title)}</title></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:${font},Arial,sans-serif;color:#0f172a;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:24px 0;">
    <tr><td align="center">
      <table role="presentation" width="640" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.06);">
        <tr><td style="padding:32px 40px 16px;text-align:center;border-bottom:3px solid ${primary};">${logo}</td></tr>
        <tr><td style="padding:32px 40px;font-size:${letter.font_size}pt;line-height:1.55;">
          ${dateStr ? `<p style="margin:0 0 16px;">${esc(dateStr)}</p>` : ""}
          ${recipientHtml ? `<p style="margin:0 0 16px;">${recipientHtml}</p>` : ""}
          ${letter.subject ? `<p style="margin:0 0 16px;font-weight:600;">Re: ${esc(letter.subject)}</p>` : ""}
          <div>${bodyHtml}</div>
          ${letter.signature_name || letter.signature_title ? `
            <div style="margin-top:36px;">
              <p style="margin:0;">Sincerely,</p>
              <div style="height:32px;"></div>
              <p style="margin:0;font-weight:600;">${esc(letter.signature_name)}</p>
              <p style="margin:0;color:#475569;">${esc(letter.signature_title)}</p>
            </div>` : ""}
        </td></tr>
        <tr><td style="padding:14px 40px;background:${primary};color:#ffffff;text-align:center;font-size:11px;">${contact}</td></tr>
        <tr><td style="height:6px;background:${accent};"></td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}
function downloadHtmlEmail(brand, letter, filename) {
  const html = buildHtmlEmail(brand, letter);
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".html") ? filename : `${filename}.html`;
  a.click();
  URL.revokeObjectURL(url);
}
function randomToken(len = 24) {
  const bytes = new Uint8Array(len);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(36).padStart(2, "0")).join("").slice(0, len);
}
async function createShareLink(opts) {
  const token = randomToken(20);
  const { error } = await supabase.from("letterhead_shares").insert({
    token,
    letterhead_id: opts.letterheadId,
    user_id: opts.userId,
    expires_at: opts.expiresAt ?? null,
    allow_download: opts.allowDownload
  });
  if (error) throw error;
  return shareUrl(token);
}
function shareUrl(token) {
  return `${window.location.origin}/share/${token}`;
}
const emptyBrand = {
  company_name: "Your Company",
  phone: "",
  email: "",
  website: "",
  address: "",
  logo_url: null,
  primary_color: "#1E40AF",
  accent_color: "#16A34A",
  watermark_text: null
};
function Editor() {
  const {
    user
  } = useAuth();
  const navigate = useNavigate();
  const {
    id
  } = Route$4.useSearch();
  const [brand, setBrand] = reactExports.useState(emptyBrand);
  const [letter, setLetter] = reactExports.useState(DEFAULT_LETTERHEAD);
  const [loaded, setLoaded] = reactExports.useState(false);
  const [saving, setSaving] = reactExports.useState(false);
  const [cleaning, setCleaning] = reactExports.useState(false);
  const [previousBody, setPreviousBody] = reactExports.useState(null);
  const [shareLink, setShareLink] = reactExports.useState(null);
  const [shareExpiry, setShareExpiry] = reactExports.useState("");
  const [shareAllowDl, setShareAllowDl] = reactExports.useState(true);
  const previewRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (!user) return;
    (async () => {
      const [{
        data: brandRow
      }, {
        data: letterRow
      }] = await Promise.all([supabase.from("brands").select("*").eq("user_id", user.id).maybeSingle(), id ? supabase.from("letterheads").select("*").eq("id", id).maybeSingle() : Promise.resolve({
        data: null
      })]);
      if (brandRow) {
        let logoUrl = null;
        if (brandRow.logo_path) {
          const {
            data: signed
          } = await supabase.storage.from("logos").createSignedUrl(brandRow.logo_path, 3600);
          logoUrl = signed?.signedUrl ?? null;
        }
        setBrand({
          company_name: brandRow.company_name ?? "",
          phone: brandRow.phone ?? "",
          email: brandRow.email ?? "",
          website: brandRow.website ?? "",
          address: brandRow.address ?? "",
          logo_url: logoUrl,
          primary_color: brandRow.primary_color,
          accent_color: brandRow.accent_color,
          watermark_text: brandRow.watermark_text ?? null
        });
        setLetter((l) => ({
          ...l,
          primary_color: brandRow.primary_color,
          accent_color: brandRow.accent_color
        }));
      }
      if (letterRow) {
        setLetter({
          title: letterRow.title,
          template: letterRow.template,
          font_family: letterRow.font_family,
          font_size: letterRow.font_size,
          primary_color: letterRow.primary_color,
          accent_color: letterRow.accent_color,
          letter_date: letterRow.letter_date,
          recipient: letterRow.recipient ?? "",
          subject: letterRow.subject ?? "",
          body: letterRow.body ?? "",
          signature_name: letterRow.signature_name ?? "",
          signature_title: letterRow.signature_title ?? "",
          signature_data: letterRow.signature_data ?? null,
          folder: letterRow.folder ?? "Inbox",
          page_format: letterRow.page_format ?? "a4",
          page_orientation: letterRow.page_orientation ?? "portrait",
          margin_mm: letterRow.margin_mm ?? 18,
          show_qr: letterRow.show_qr ?? false,
          brand_id: letterRow.brand_id ?? null
        });
      }
      setLoaded(true);
    })();
  }, [user, id]);
  const set = (k, v) => setLetter((l) => ({
    ...l,
    [k]: v
  }));
  const save = async () => {
    if (!user) return;
    setSaving(true);
    const payload = {
      user_id: user.id,
      ...letter
    };
    if (id) {
      const {
        error
      } = await supabase.from("letterheads").update(payload).eq("id", id);
      if (error) toast.error(error.message);
      else toast.success("Saved");
    } else {
      const {
        data,
        error
      } = await supabase.from("letterheads").insert(payload).select("id").single();
      if (error) toast.error(error.message);
      else {
        toast.success("Saved");
        navigate({
          to: "/editor",
          search: {
            id: data.id
          },
          replace: true
        });
      }
    }
    setSaving(false);
  };
  const cleanText = async () => {
    if (!letter.body.trim()) return toast.error("Add some text first");
    setCleaning(true);
    const {
      data,
      error
    } = await supabase.functions.invoke("clean-text", {
      body: {
        text: letter.body
      }
    });
    setCleaning(false);
    if (error) {
      toast.error(error.message ?? "AI clean-up failed");
      return;
    }
    if (data?.error) {
      toast.error(data.error);
      return;
    }
    setPreviousBody(letter.body);
    set("body", data.cleaned);
    toast.success("Text cleaned. You can revert if needed.");
  };
  const revert = () => {
    if (previousBody === null) return;
    set("body", previousBody);
    setPreviousBody(null);
  };
  const downloadPdf = async () => {
    if (!previewRef.current) return;
    toast.message("Generating PDF…");
    try {
      await exportPdf(previewRef.current, letter.title || "letterhead", letter);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "PDF export failed");
    }
  };
  const downloadDocx = async () => {
    toast.message("Generating Word document…");
    try {
      await exportDocx(brand, letter, letter.title || "letterhead");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "DOCX export failed");
    }
  };
  const downloadPng = async (mime) => {
    if (!previewRef.current) return;
    toast.message(`Generating ${mime === "image/jpeg" ? "JPG" : "PNG"}…`);
    try {
      await exportPng(previewRef.current, letter.title || "letterhead", mime);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Image export failed");
    }
  };
  const downloadHtml = () => {
    try {
      downloadHtmlEmail(brand, letter, letter.title || "letterhead");
      toast.success("HTML email downloaded");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "HTML export failed");
    }
  };
  const saveAsTemplate = async () => {
    if (!user) return;
    const name = window.prompt("Template name", letter.title || "My template");
    if (!name) return;
    const {
      error
    } = await supabase.from("user_templates").insert({
      user_id: user.id,
      name,
      snapshot: JSON.parse(JSON.stringify(letter))
    });
    if (error) toast.error(error.message);
    else toast.success("Template saved");
  };
  const generateShare = async () => {
    if (!user || !id) return toast.error("Save the letter first");
    try {
      const url = await createShareLink({
        letterheadId: id,
        userId: user.id,
        expiresAt: shareExpiry ? new Date(shareExpiry).toISOString() : null,
        allowDownload: shareAllowDl
      });
      setShareLink(url);
      await navigator.clipboard.writeText(url).catch(() => {
      });
      toast.success("Share link copied to clipboard");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not create share link");
    }
  };
  const applyTheme = (themeId) => {
    const t = THEME_PRESETS.find((x) => x.id === themeId);
    if (!t) return;
    setLetter((l) => ({
      ...l,
      template: t.template,
      font_family: t.font_family,
      primary_color: t.primary_color,
      accent_color: t.accent_color
    }));
  };
  const previewScale = 0.6;
  const previewKey = reactExports.useMemo(() => JSON.stringify({
    brand,
    letter
  }), [brand, letter]);
  if (!loaded) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "p-10 text-muted-foreground", children: "Loading…" });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ambient-bg min-h-screen", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto grid max-w-7xl gap-6 px-6 py-6 lg:grid-cols-[420px_1fr]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", size: "sm", onClick: () => navigate({
          to: "/dashboard"
        }), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "mr-2 h-4 w-4" }),
          " Back"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", onClick: save, disabled: saving, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "mr-2 h-4 w-4" }),
            " ",
            saving ? "Saving…" : "Save"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenu, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "default", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "mr-2 h-4 w-4" }),
              " Export"
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuItem, { onClick: downloadPdf, children: "Download PDF" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuItem, { onClick: downloadDocx, children: "Download DOCX" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuItem, { onClick: () => downloadPng("image/png"), children: "Download PNG" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuItem, { onClick: () => downloadPng("image/jpeg"), children: "Download JPG" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuItem, { onClick: downloadHtml, children: "Download HTML email" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { onClick: saveAsTemplate, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(BookmarkPlus, { className: "mr-2 h-4 w-4" }),
                " Save as template"
              ] })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: letter.title, onChange: (e) => set("title", e.target.value), placeholder: "Letterhead title", className: "text-base font-semibold" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "AI assistant", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AiPanel, { body: letter.body, onApplyBody: (text) => {
        setPreviousBody(letter.body);
        set("body", text);
      }, onSubject: (s) => set("subject", s) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Themes", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: THEME_PRESETS.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => applyTheme(t.id), className: "rounded-full border px-3 py-1 text-xs hover:border-foreground/40", style: {
        borderColor: t.primary_color,
        color: t.primary_color
      }, children: t.name }, t.id)) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Template", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: TEMPLATES.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => set("template", t.id), className: `rounded-md border p-3 text-left text-xs transition ${letter.template === t.id ? "border-primary bg-primary/5 ring-1 ring-primary" : "hover:border-foreground/30"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: t.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground", children: t.description })
      ] }, t.id)) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Page setup", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Format" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: letter.page_format ?? "a4", onValueChange: (v) => set("page_format", v), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: PAGE_FORMATS.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: p.id, children: p.name }, p.id)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Orientation" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: letter.page_orientation ?? "portrait", onValueChange: (v) => set("page_orientation", v), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "portrait", children: "Portrait" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "landscape", children: "Landscape" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs", children: [
            "Margin: ",
            letter.margin_mm ?? 18,
            " mm"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Slider, { min: 0, max: 40, step: 1, value: [letter.margin_mm ?? 18], onValueChange: (v) => set("margin_mm", v[0]) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "col-span-2 flex items-center gap-2 text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: !!letter.show_qr, onChange: (e) => set("show_qr", e.target.checked) }),
          "Show QR code linking to share URL"
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Share link", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Expires (optional)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "datetime-local", value: shareExpiry, onChange: (e) => setShareExpiry(e.target.value) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-end gap-2 text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: shareAllowDl, onChange: (e) => setShareAllowDl(e.target.checked) }),
            "Allow PDF download"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "secondary", onClick: generateShare, className: "w-full", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "mr-2 h-4 w-4" }),
          " Generate share link"
        ] }),
        shareLink && /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { readOnly: true, value: shareLink, onClick: (e) => e.target.select(), className: "text-xs" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Typography", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Font" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: letter.font_family, onValueChange: (v) => set("font_family", v), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: FONTS.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: f, style: {
              fontFamily: f
            }, children: f }, f)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs", children: [
            "Size: ",
            letter.font_size,
            "pt"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Slider, { min: 9, max: 16, step: 1, value: [letter.font_size], onValueChange: (v) => set("font_size", v[0]) })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Colors", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ColorRow, { label: "Primary", value: letter.primary_color, onChange: (v) => set("primary_color", v) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ColorRow, { label: "Accent", value: letter.accent_color, onChange: (v) => set("accent_color", v) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Letter", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: letter.letter_date ?? "", onChange: (e) => set("letter_date", e.target.value || null) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Recipient" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 3, value: letter.recipient, onChange: (e) => set("recipient", e.target.value), placeholder: "Jane Doe\nABC Ltd\nNairobi" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Subject" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: letter.subject, onChange: (e) => set("subject", e.target.value) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Body" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1", children: [
              previousBody !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "ghost", onClick: revert, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "mr-1 h-3 w-3" }),
                " Revert"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "secondary", onClick: cleanText, disabled: cleaning, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "mr-1 h-3 w-3" }),
                cleaning ? "Cleaning…" : "AI clean"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 10, value: letter.body, onChange: (e) => set("body", e.target.value), placeholder: "Dear Jane,\n\n..." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Signature name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: letter.signature_name, onChange: (e) => set("signature_name", e.target.value) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Title" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: letter.signature_title, onChange: (e) => set("signature_title", e.target.value) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Signature image" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SignaturePad, { value: letter.signature_data ?? null, onChange: (v) => set("signature_data", v) })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] lg:overflow-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "glass border-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "flex justify-center bg-muted/30 p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LetterheadPreview, { ref: previewRef, brand, letter, scale: previewScale, qrUrl: id ? shareUrl("preview") : null }, previewKey) }) }) })
  ] }) });
}
function Section({
  title,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "glass border-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mb-3 text-sm font-semibold", children: title }),
    children
  ] }) });
}
function ColorRow({
  label,
  value,
  onChange
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "color", value, onChange: (e) => onChange(e.target.value), className: "h-9 w-12 cursor-pointer rounded border" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value, onChange: (e) => onChange(e.target.value), className: "text-xs" })
    ] })
  ] });
}
export {
  Editor as component
};
