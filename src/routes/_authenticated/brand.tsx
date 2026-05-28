import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Upload, Wand2 } from "lucide-react";
import { extractPalette } from "@/lib/letterhead/color-extract";

export const Route = createFileRoute("/_authenticated/brand")({
  component: BrandPage,
  head: () => ({ meta: [{ title: "Brand — Zuridoc" }] }),
});

type BrandRow = {
  company_name: string; phone: string; email: string; website: string;
  address: string; logo_path: string | null; primary_color: string; accent_color: string;
  watermark_text: string | null;
};
const empty: BrandRow = {
  company_name: "", phone: "", email: "", website: "", address: "",
  logo_path: null, primary_color: "#1E40AF", accent_color: "#16A34A", watermark_text: null,
};

function BrandPage() {
  const { user } = useAuth();
  const [brand, setBrand] = useState<BrandRow>(empty);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase.from("brands").select("*").eq("user_id", user.id).maybeSingle();
      if (data) {
        setBrand({
          company_name: data.company_name ?? "", phone: data.phone ?? "",
          email: data.email ?? "", website: data.website ?? "",
          address: data.address ?? "", logo_path: data.logo_path,
          primary_color: data.primary_color, accent_color: data.accent_color,
          watermark_text: (data as { watermark_text?: string | null }).watermark_text ?? null,
        });
        if (data.logo_path) {
          const { data: signed } = await supabase.storage.from("logos").createSignedUrl(data.logo_path, 3600);
          setLogoUrl(signed?.signedUrl ?? null);
        }
      }
    })();
  }, [user]);

  const upload = async (file: File) => {
    if (!user) return;
    const ext = file.name.split(".").pop() || "png";
    const path = `${user.id}/logo-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("logos").upload(path, file, { upsert: true });
    if (error) return toast.error(error.message);
    setBrand((b) => ({ ...b, logo_path: path }));
    const { data: signed } = await supabase.storage.from("logos").createSignedUrl(path, 3600);
    setLogoUrl(signed?.signedUrl ?? null);
    toast.success("Logo uploaded");
    if (signed?.signedUrl) {
      const palette = await extractPalette(signed.signedUrl);
      if (palette) {
        setBrand((b) => ({ ...b, primary_color: palette.primary, accent_color: palette.accent }));
        toast.success("Colors auto-updated from logo");
      }
    }
  };

  const autoExtractColors = async () => {
    if (!logoUrl) return toast.error("Upload a logo first");
    const palette = await extractPalette(logoUrl);
    if (!palette) return toast.error("Could not detect colors");
    setBrand((b) => ({ ...b, primary_color: palette.primary, accent_color: palette.accent }));
    toast.success("Colors extracted from logo");
  };

  const save = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("brands").upsert(
      { user_id: user.id, ...brand }, { onConflict: "user_id" });
    setSaving(false);
    if (error) toast.error(error.message); else toast.success("Brand saved");
  };

  const set = <K extends keyof BrandRow>(k: K, v: BrandRow[K]) => setBrand((b) => ({ ...b, [k]: v }));

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-2xl font-bold">Brand</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        These details appear on every letterhead. You can override colors per letter in the editor.
      </p>
      <Card className="mt-6">
        <CardHeader><CardTitle>Logo</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed bg-muted/30">
            {logoUrl ? (
              <img src={logoUrl} alt="logo" className="max-h-28 object-contain" />
            ) : (
              <p className="text-sm text-muted-foreground">No logo uploaded</p>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden"
            onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
          <Button variant="outline" onClick={() => fileRef.current?.click()}>
            <Upload className="mr-2 h-4 w-4" /> Upload logo
          </Button>
          {logoUrl && (
            <Button variant="ghost" onClick={autoExtractColors} className="ml-2">
              <Wand2 className="mr-2 h-4 w-4" /> Auto-extract colors
            </Button>
          )}
        </CardContent>
      </Card>
      <Card className="mt-6">
        <CardHeader><CardTitle>Company details</CardTitle></CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <Field label="Company name" value={brand.company_name} onChange={(v) => set("company_name", v)} />
          <Field label="Phone" value={brand.phone} onChange={(v) => set("phone", v)} />
          <Field label="Email" value={brand.email} onChange={(v) => set("email", v)} />
          <Field label="Website" value={brand.website} onChange={(v) => set("website", v)} />
          <div className="md:col-span-2">
            <Label>Address</Label>
            <Textarea value={brand.address} onChange={(e) => set("address", e.target.value)} rows={2} />
          </div>
          <ColorField label="Primary color" value={brand.primary_color} onChange={(v) => set("primary_color", v)} />
          <ColorField label="Accent color" value={brand.accent_color} onChange={(v) => set("accent_color", v)} />
          <Field label="Watermark text (optional)" value={brand.watermark_text ?? ""} onChange={(v) => set("watermark_text", v || null)} />
        </CardContent>
      </Card>
      <div className="mt-6 flex justify-end">
        <Button onClick={save} disabled={saving}>{saving ? "Saving…" : "Save brand"}</Button>
      </div>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <Label>{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="flex gap-2">
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)}
          className="h-10 w-14 cursor-pointer rounded border" />
        <Input value={value} onChange={(e) => onChange(e.target.value)} />
      </div>
    </div>
  );
}
