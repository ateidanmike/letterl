import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useAuth, s as supabase } from "./router-BZ24CEhc.mjs";
import { B as Button } from "./button-Cz8PAkJh.mjs";
import { I as Input } from "./input-DVeAuAgX.mjs";
import { L as Label } from "./label-DOAnQvhy.mjs";
import { T as Textarea } from "./textarea-CIfPmIKy.mjs";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent } from "./card-HxqUHXRA.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { k as Upload, W as WandSparkles } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/tanstack__react-router.mjs";
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
async function extractPalette(url) {
  try {
    const img = await loadImage(url);
    const canvas = document.createElement("canvas");
    const W = 60;
    const ratio = img.height / img.width;
    canvas.width = W;
    canvas.height = Math.max(1, Math.round(W * ratio));
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    const buckets = /* @__PURE__ */ new Map();
    for (let i = 0; i < data.length; i += 4) {
      const a = data[i + 3];
      if (a < 200) continue;
      const r = data[i], g = data[i + 1], b = data[i + 2];
      const max = Math.max(r, g, b), min = Math.min(r, g, b);
      if (max > 240 && min > 240) continue;
      if (max < 25) continue;
      const key = `${r >> 4},${g >> 4},${b >> 4}`;
      const e = buckets.get(key);
      if (e) {
        e.count++;
        e.r += r;
        e.g += g;
        e.b += b;
      } else buckets.set(key, { count: 1, r, g, b });
    }
    const sorted = [...buckets.values()].sort((a, b) => b.count - a.count);
    if (!sorted.length) return null;
    const top = (i) => {
      const e = sorted[Math.min(i, sorted.length - 1)];
      return rgbToHex(Math.round(e.r / e.count), Math.round(e.g / e.count), Math.round(e.b / e.count));
    };
    return { primary: top(0), accent: top(Math.min(2, sorted.length - 1)) };
  } catch {
    return null;
  }
}
function loadImage(url) {
  return new Promise((res, rej) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => res(img);
    img.onerror = rej;
    img.src = url;
  });
}
function rgbToHex(r, g, b) {
  return "#" + [r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("");
}
const empty = {
  company_name: "",
  phone: "",
  email: "",
  website: "",
  address: "",
  logo_path: null,
  primary_color: "#1E40AF",
  accent_color: "#16A34A",
  watermark_text: null
};
function BrandPage() {
  const {
    user
  } = useAuth();
  const [brand, setBrand] = reactExports.useState(empty);
  const [logoUrl, setLogoUrl] = reactExports.useState(null);
  const [saving, setSaving] = reactExports.useState(false);
  const fileRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (!user) return;
    (async () => {
      const {
        data
      } = await supabase.from("brands").select("*").eq("user_id", user.id).maybeSingle();
      if (data) {
        setBrand({
          company_name: data.company_name ?? "",
          phone: data.phone ?? "",
          email: data.email ?? "",
          website: data.website ?? "",
          address: data.address ?? "",
          logo_path: data.logo_path,
          primary_color: data.primary_color,
          accent_color: data.accent_color,
          watermark_text: data.watermark_text ?? null
        });
        if (data.logo_path) {
          const {
            data: signed
          } = await supabase.storage.from("logos").createSignedUrl(data.logo_path, 3600);
          setLogoUrl(signed?.signedUrl ?? null);
        }
      }
    })();
  }, [user]);
  const upload = async (file) => {
    if (!user) return;
    const ext = file.name.split(".").pop() || "png";
    const path = `${user.id}/logo-${Date.now()}.${ext}`;
    const {
      error
    } = await supabase.storage.from("logos").upload(path, file, {
      upsert: true
    });
    if (error) return toast.error(error.message);
    setBrand((b) => ({
      ...b,
      logo_path: path
    }));
    const {
      data: signed
    } = await supabase.storage.from("logos").createSignedUrl(path, 3600);
    setLogoUrl(signed?.signedUrl ?? null);
    toast.success("Logo uploaded");
    if (signed?.signedUrl) {
      const palette = await extractPalette(signed.signedUrl);
      if (palette) {
        setBrand((b) => ({
          ...b,
          primary_color: palette.primary,
          accent_color: palette.accent
        }));
        toast.success("Colors auto-updated from logo");
      }
    }
  };
  const autoExtractColors = async () => {
    if (!logoUrl) return toast.error("Upload a logo first");
    const palette = await extractPalette(logoUrl);
    if (!palette) return toast.error("Could not detect colors");
    setBrand((b) => ({
      ...b,
      primary_color: palette.primary,
      accent_color: palette.accent
    }));
    toast.success("Colors extracted from logo");
  };
  const save = async () => {
    if (!user) return;
    setSaving(true);
    const {
      error
    } = await supabase.from("brands").upsert({
      user_id: user.id,
      ...brand
    }, {
      onConflict: "user_id"
    });
    setSaving(false);
    if (error) toast.error(error.message);
    else toast.success("Brand saved");
  };
  const set = (k, v) => setBrand((b) => ({
    ...b,
    [k]: v
  }));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-3xl px-6 py-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold", children: "Brand" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "These details appear on every letterhead. You can override colors per letter in the editor." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "mt-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Logo" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-32 items-center justify-center rounded-lg border-2 border-dashed bg-muted/30", children: logoUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: logoUrl, alt: "logo", className: "max-h-28 object-contain" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No logo uploaded" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: fileRef, type: "file", accept: "image/*", className: "hidden", onChange: (e) => e.target.files?.[0] && upload(e.target.files[0]) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: () => fileRef.current?.click(), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "mr-2 h-4 w-4" }),
          " Upload logo"
        ] }),
        logoUrl && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", onClick: autoExtractColors, className: "ml-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(WandSparkles, { className: "mr-2 h-4 w-4" }),
          " Auto-extract colors"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "mt-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Company details" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "grid gap-4 md:grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Company name", value: brand.company_name, onChange: (v) => set("company_name", v) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Phone", value: brand.phone, onChange: (v) => set("phone", v) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Email", value: brand.email, onChange: (v) => set("email", v) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Website", value: brand.website, onChange: (v) => set("website", v) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Address" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { value: brand.address, onChange: (e) => set("address", e.target.value), rows: 2 })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ColorField, { label: "Primary color", value: brand.primary_color, onChange: (v) => set("primary_color", v) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ColorField, { label: "Accent color", value: brand.accent_color, onChange: (v) => set("accent_color", v) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Watermark text (optional)", value: brand.watermark_text ?? "", onChange: (v) => set("watermark_text", v || null) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: save, disabled: saving, children: saving ? "Saving…" : "Save brand" }) })
  ] });
}
function Field({
  label,
  value,
  onChange
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value, onChange: (e) => onChange(e.target.value) })
  ] });
}
function ColorField({
  label,
  value,
  onChange
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "color", value, onChange: (e) => onChange(e.target.value), className: "h-10 w-14 cursor-pointer rounded border" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value, onChange: (e) => onChange(e.target.value) })
    ] })
  ] });
}
export {
  BrandPage as component
};
