export type TemplateId =
  | "classic"
  | "left-modern"
  | "minimal"
  | "bold-banner"
  | "corporate"
  | "legal"
  | "executive"
  | "monogram";

export type Brand = {
  company_name: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  logo_url: string | null;
  primary_color: string;
  accent_color: string;
  watermark_text?: string | null;
  name?: string;
};

export type Letterhead = {
  title: string;
  template: TemplateId;
  font_family: string;
  font_size: number;
  primary_color: string;
  accent_color: string;
  letter_date: string | null;
  recipient: string;
  subject: string;
  body: string;
  signature_name: string;
  signature_title: string;
  signature_data?: string | null;
  folder?: string;
  page_format?: PageFormat;
  page_orientation?: PageOrientation;
  margin_mm?: number;
  show_qr?: boolean;
  brand_id?: string | null;
};

export type PageFormat = "a4" | "letter" | "legal";
export type PageOrientation = "portrait" | "landscape";

export const PAGE_FORMATS: { id: PageFormat; name: string; mm: [number, number] }[] = [
  { id: "a4", name: "A4 (210 × 297 mm)", mm: [210, 297] },
  { id: "letter", name: "US Letter (216 × 279 mm)", mm: [216, 279] },
  { id: "legal", name: "US Legal (216 × 356 mm)", mm: [216, 356] },
];

export type ThemePreset = {
  id: string;
  name: string;
  template: TemplateId;
  font_family: string;
  primary_color: string;
  accent_color: string;
};

export const THEME_PRESETS: ThemePreset[] = [
  { id: "classic", name: "Classic", template: "classic", font_family: "Lora", primary_color: "#1E3A8A", accent_color: "#16A34A" },
  { id: "modern", name: "Modern", template: "left-modern", font_family: "Inter", primary_color: "#0F172A", accent_color: "#F59E0B" },
  { id: "minimal", name: "Minimal", template: "minimal", font_family: "Inter", primary_color: "#0F172A", accent_color: "#64748B" },
  { id: "executive", name: "Executive", template: "executive", font_family: "Playfair Display", primary_color: "#111827", accent_color: "#B45309" },
  { id: "creative", name: "Creative", template: "bold-banner", font_family: "Montserrat", primary_color: "#7C3AED", accent_color: "#EC4899" },
];

export const TEMPLATES: { id: TemplateId; name: string; description: string }[] = [
  { id: "classic", name: "Classic Centered", description: "Centered logo with chevron footer" },
  { id: "left-modern", name: "Left Modern", description: "Logo left, contact right" },
  { id: "minimal", name: "Minimal", description: "Thin rule, footer line" },
  { id: "bold-banner", name: "Bold Banner", description: "Full-width colored header band" },
  { id: "corporate", name: "Corporate", description: "Two-tone side bar with bold heading" },
  { id: "legal", name: "Legal", description: "Serif heading, double rule, formal layout" },
  { id: "executive", name: "Executive", description: "Top monoline rule, refined contact strip" },
  { id: "monogram", name: "Monogram", description: "Initials disc + clean stationery feel" },
];

export const FONTS = [
  "Inter",
  "Roboto",
  "Lora",
  "Merriweather",
  "Montserrat",
  "Playfair Display",
  "Georgia",
  "Arial",
];

export const DEFAULT_LETTERHEAD: Letterhead = {
  title: "Untitled letterhead",
  template: "classic",
  font_family: "Inter",
  font_size: 11,
  primary_color: "#1E40AF",
  accent_color: "#16A34A",
  letter_date: new Date().toISOString().slice(0, 10),
  recipient: "",
  subject: "",
  body: "",
  signature_name: "",
  signature_title: "",
  page_format: "a4",
  page_orientation: "portrait",
  margin_mm: 18,
  show_qr: false,
  brand_id: null,
};