export type DocType = "invoice" | "receipt" | "quotation" | "delivery_note";

export const DOC_TYPES: { id: DocType; name: string; label: string; description: string }[] = [
  { id: "invoice", name: "Invoice", label: "INVOICE", description: "Bill clients for products or services" },
  { id: "receipt", name: "Receipt", label: "RECEIPT", description: "Confirm payments received" },
  { id: "quotation", name: "Quotation", label: "QUOTATION", description: "Send price estimates and proposals" },
  { id: "delivery_note", name: "Delivery Note", label: "DELIVERY NOTE", description: "Confirm goods shipped or delivered" },
];

export type Party = {
  name: string;
  address: string;
  email: string;
  phone: string;
};

export type LineItem = {
  id: string;
  description: string;
  quantity: number;
  price: number;
};

export type DocTemplateId = "modern" | "classic" | "minimal" | "bold";

export const DOC_TEMPLATES: { id: DocTemplateId; name: string }[] = [
  { id: "modern", name: "Modern" },
  { id: "classic", name: "Classic" },
  { id: "minimal", name: "Minimal" },
  { id: "bold", name: "Bold" },
];

export type BusinessDoc = {
  id?: string;
  doc_type: DocType;
  doc_number: string;
  title: string;
  template: DocTemplateId;
  issue_date: string | null;
  due_date: string | null;
  currency: string;
  from_party: Party;
  to_party: Party;
  items: LineItem[];
  tax_rate: number;
  discount: number;
  notes: string;
  terms: string;
  primary_color: string;
  accent_color: string;
  signature_name: string;
  signature_title: string;
  signature_data?: string | null;
  status: string;
  logo_url?: string | null;
};

export const DEFAULT_DOC: BusinessDoc = {
  doc_type: "invoice",
  doc_number: "0001",
  title: "Untitled document",
  template: "modern",
  issue_date: new Date().toISOString().slice(0, 10),
  due_date: null,
  currency: "USD",
  from_party: { name: "", address: "", email: "", phone: "" },
  to_party: { name: "", address: "", email: "", phone: "" },
  items: [{ id: crypto.randomUUID(), description: "Service or product", quantity: 1, price: 0 }],
  tax_rate: 0,
  discount: 0,
  notes: "",
  terms: "Payment due within 30 days.",
  primary_color: "#0067ec",
  accent_color: "#011b43",
  signature_name: "",
  signature_title: "",
  status: "draft",
};

export function calcTotals(doc: Pick<BusinessDoc, "items" | "tax_rate" | "discount">) {
  const subtotal = doc.items.reduce((s, i) => s + i.quantity * i.price, 0);
  const discount = Number(doc.discount) || 0;
  const taxBase = Math.max(0, subtotal - discount);
  const tax = (taxBase * (Number(doc.tax_rate) || 0)) / 100;
  const total = taxBase + tax;
  return { subtotal, discount, tax, total };
}

export function formatMoney(n: number, currency = "USD") {
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(n);
  } catch {
    return `${currency} ${n.toFixed(2)}`;
  }
}

export const CURRENCIES = ["USD", "EUR", "GBP", "KES", "NGN", "ZAR", "INR", "CAD", "AUD", "JPY"];