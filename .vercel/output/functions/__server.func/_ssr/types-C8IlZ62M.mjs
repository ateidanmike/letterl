const DOC_TYPES = [
  { id: "invoice", name: "Invoice", label: "INVOICE", description: "Bill clients for products or services" },
  { id: "receipt", name: "Receipt", label: "RECEIPT", description: "Confirm payments received" },
  { id: "quotation", name: "Quotation", label: "QUOTATION", description: "Send price estimates and proposals" },
  { id: "delivery_note", name: "Delivery Note", label: "DELIVERY NOTE", description: "Confirm goods shipped or delivered" }
];
const DOC_TEMPLATES = [
  { id: "modern", name: "Modern" },
  { id: "classic", name: "Classic" },
  { id: "minimal", name: "Minimal" },
  { id: "bold", name: "Bold" }
];
const DEFAULT_DOC = {
  doc_type: "invoice",
  doc_number: "0001",
  title: "Untitled document",
  template: "modern",
  issue_date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
  due_date: null,
  currency: "USD",
  from_party: { name: "", address: "", email: "", phone: "" },
  to_party: { name: "", address: "", email: "", phone: "" },
  items: [{ id: crypto.randomUUID(), description: "Service or product", quantity: 1, price: 0 }],
  tax_rate: 0,
  discount: 0,
  notes: "",
  terms: "Payment due within 30 days.",
  primary_color: "#2563EB",
  accent_color: "#0EA5E9",
  signature_name: "",
  signature_title: "",
  status: "draft"
};
function calcTotals(doc) {
  const subtotal = doc.items.reduce((s, i) => s + i.quantity * i.price, 0);
  const discount = Number(doc.discount) || 0;
  const taxBase = Math.max(0, subtotal - discount);
  const tax = taxBase * (Number(doc.tax_rate) || 0) / 100;
  const total = taxBase + tax;
  return { subtotal, discount, tax, total };
}
function formatMoney(n, currency = "USD") {
  try {
    return new Intl.NumberFormat(void 0, { style: "currency", currency }).format(n);
  } catch {
    return `${currency} ${n.toFixed(2)}`;
  }
}
const CURRENCIES = ["USD", "EUR", "GBP", "KES", "NGN", "ZAR", "INR", "CAD", "AUD", "JPY"];
export {
  CURRENCIES as C,
  DOC_TYPES as D,
  DEFAULT_DOC as a,
  DOC_TEMPLATES as b,
  calcTotals as c,
  formatMoney as f
};
