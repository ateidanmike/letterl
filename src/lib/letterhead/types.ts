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
};

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
};