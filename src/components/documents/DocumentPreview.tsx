import { forwardRef } from "react";
import { DOC_TYPES, calcTotals, formatMoney, type BusinessDoc } from "@/lib/documents/types";

const A4_W = 794;
const A4_H = 1123;

type Props = { doc: BusinessDoc; scale?: number };

export const DocumentPreview = forwardRef<HTMLDivElement, Props>(function DocumentPreview(
  { doc, scale = 1 },
  ref,
) {
  const label = DOC_TYPES.find((t) => t.id === doc.doc_type)?.label ?? "DOCUMENT";
  const totals = calcTotals(doc);
  const fmt = (n: number) => formatMoney(n, doc.currency);

  return (
    <div style={{ width: A4_W * scale, minHeight: A4_H * scale }}>
      <div
        ref={ref}
        id="letterhead-page"
        style={{
          width: A4_W,
          minHeight: A4_H,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          background: "#ffffff",
          color: "#0f172a",
          fontFamily: "Inter, system-ui, sans-serif",
          fontSize: 12,
          position: "relative",
          boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
        }}
      >
        {doc.template === "modern" && <ModernTemplate doc={doc} label={label} totals={totals} fmt={fmt} />}
        {doc.template === "classic" && <ClassicTemplate doc={doc} label={label} totals={totals} fmt={fmt} />}
        {doc.template === "minimal" && <MinimalTemplate doc={doc} label={label} totals={totals} fmt={fmt} />}
        {doc.template === "bold" && <BoldTemplate doc={doc} label={label} totals={totals} fmt={fmt} />}
      </div>
    </div>
  );
});

type TplProps = {
  doc: BusinessDoc;
  label: string;
  totals: ReturnType<typeof calcTotals>;
  fmt: (n: number) => string;
};

function Header({ doc }: { doc: BusinessDoc }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      {doc.logo_url ? (
        <img src={doc.logo_url} alt="" style={{ maxHeight: 56, maxWidth: 160, objectFit: "contain" }} />
      ) : null}
      <div>
        <div style={{ fontWeight: 700, fontSize: 18 }}>{doc.from_party.name || "Your Company"}</div>
        <div style={{ fontSize: 11, color: "#64748b", whiteSpace: "pre-line" }}>
          {doc.from_party.address}
        </div>
      </div>
    </div>
  );
}

function Meta({ doc, label, color }: { doc: BusinessDoc; label: string; color: string }) {
  return (
    <div style={{ textAlign: "right" }}>
      <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: 1, color }}>{label}</div>
      <div style={{ fontSize: 11, color: "#475569", marginTop: 6 }}>
        <div><b>No.</b> {doc.doc_number}</div>
        {doc.issue_date && <div><b>Date:</b> {doc.issue_date}</div>}
        {doc.due_date && doc.doc_type === "invoice" && <div><b>Due:</b> {doc.due_date}</div>}
      </div>
    </div>
  );
}

function ItemsTable({ doc, fmt, color }: { doc: BusinessDoc; fmt: (n: number) => string; color: string }) {
  const showQty = doc.doc_type !== "receipt";
  return (
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, marginTop: 16 }}>
      <thead>
        <tr style={{ background: color, color: "#fff" }}>
          <th style={th}>#</th>
          <th style={{ ...th, textAlign: "left" }}>Description</th>
          {showQty && <th style={th}>Qty</th>}
          {showQty && <th style={th}>Price</th>}
          <th style={{ ...th, textAlign: "right" }}>Amount</th>
        </tr>
      </thead>
      <tbody>
        {doc.items.map((it, i) => (
          <tr key={it.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
            <td style={td}>{String(i + 1).padStart(2, "0")}</td>
            <td style={{ ...td, textAlign: "left" }}>{it.description}</td>
            {showQty && <td style={td}>{it.quantity}</td>}
            {showQty && <td style={td}>{fmt(it.price)}</td>}
            <td style={{ ...td, textAlign: "right", fontWeight: 600 }}>{fmt(it.quantity * it.price)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Totals({ doc, totals, fmt, color }: TplProps & { color: string }) {
  if (doc.doc_type === "delivery_note") return null;
  return (
    <div style={{ marginTop: 16, marginLeft: "auto", width: 280, fontSize: 12 }}>
      <Row label="Subtotal" value={fmt(totals.subtotal)} />
      {totals.discount > 0 && <Row label="Discount" value={`- ${fmt(totals.discount)}`} />}
      {doc.tax_rate > 0 && <Row label={`Tax (${doc.tax_rate}%)`} value={fmt(totals.tax)} />}
      <div style={{ background: color, color: "#fff", padding: "10px 12px", borderRadius: 6, marginTop: 6, display: "flex", justifyContent: "space-between", fontWeight: 700 }}>
        <span>Total</span>
        <span>{fmt(totals.total)}</span>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px dashed #e2e8f0" }}>
      <span style={{ color: "#64748b" }}>{label}</span>
      <span style={{ fontWeight: 600 }}>{value}</span>
    </div>
  );
}

function BillTo({ doc }: { doc: BusinessDoc }) {
  const heading = doc.doc_type === "delivery_note" ? "Deliver To" : doc.doc_type === "quotation" ? "Prepared For" : "Bill To";
  return (
    <div>
      <div style={{ fontSize: 10, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1 }}>{heading}</div>
      <div style={{ fontWeight: 700, fontSize: 14, marginTop: 4 }}>{doc.to_party.name || "Recipient name"}</div>
      <div style={{ fontSize: 11, color: "#64748b", whiteSpace: "pre-line" }}>{doc.to_party.address}</div>
      {doc.to_party.email && <div style={{ fontSize: 11, color: "#64748b" }}>{doc.to_party.email}</div>}
      {doc.to_party.phone && <div style={{ fontSize: 11, color: "#64748b" }}>{doc.to_party.phone}</div>}
    </div>
  );
}

function Footer({ doc }: { doc: BusinessDoc }) {
  return (
    <div style={{ marginTop: 28, fontSize: 10.5, color: "#475569" }}>
      {doc.notes && (<div><b>Notes:</b> {doc.notes}</div>)}
      {doc.terms && (<div style={{ marginTop: 4 }}><b>Terms:</b> {doc.terms}</div>)}
      {(doc.signature_name || doc.signature_data) && (
        <div style={{ marginTop: 30, textAlign: "right" }}>
          {doc.signature_data && <img src={doc.signature_data} alt="signature" style={{ height: 40, display: "inline-block" }} />}
          <div style={{ borderTop: "1px solid #94a3b8", display: "inline-block", paddingTop: 4, marginTop: 4, minWidth: 180 }}>
            <div style={{ fontWeight: 700 }}>{doc.signature_name}</div>
            <div style={{ color: "#64748b" }}>{doc.signature_title}</div>
          </div>
        </div>
      )}
    </div>
  );
}

const th: React.CSSProperties = { padding: "10px 8px", fontSize: 10.5, textAlign: "center", textTransform: "uppercase", letterSpacing: 0.5 };
const td: React.CSSProperties = { padding: "10px 8px", textAlign: "center" };

/* ----------- Templates ----------- */

function ModernTemplate({ doc, label, totals, fmt }: TplProps) {
  return (
    <div style={{ padding: 48 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <Header doc={doc} />
        <Meta doc={doc} label={label} color={doc.primary_color} />
      </div>
      <div style={{ marginTop: 28 }}>
        <BillTo doc={doc} />
      </div>
      <ItemsTable doc={doc} fmt={fmt} color={doc.primary_color} />
      <Totals doc={doc} label={label} totals={totals} fmt={fmt} color={doc.primary_color} />
      <Footer doc={doc} />
    </div>
  );
}

function ClassicTemplate({ doc, label, totals, fmt }: TplProps) {
  return (
    <div style={{ padding: 48 }}>
      <div style={{ textAlign: "center", borderBottom: `3px double ${doc.primary_color}`, paddingBottom: 16 }}>
        {doc.logo_url && <img src={doc.logo_url} alt="" style={{ maxHeight: 64, maxWidth: 200, objectFit: "contain" }} />}
        <div style={{ fontWeight: 700, fontSize: 22, marginTop: 8 }}>{doc.from_party.name || "Your Company"}</div>
        <div style={{ fontSize: 11, color: "#64748b" }}>{doc.from_party.address}</div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginTop: 24 }}>
        <BillTo doc={doc} />
        <Meta doc={doc} label={label} color={doc.primary_color} />
      </div>
      <ItemsTable doc={doc} fmt={fmt} color={doc.primary_color} />
      <Totals doc={doc} label={label} totals={totals} fmt={fmt} color={doc.primary_color} />
      <Footer doc={doc} />
    </div>
  );
}

function MinimalTemplate({ doc, label, totals, fmt }: TplProps) {
  return (
    <div style={{ padding: 56 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div style={{ fontSize: 28, fontWeight: 300, letterSpacing: 4, color: doc.primary_color }}>{label}</div>
        <div style={{ fontSize: 11, color: "#64748b", textAlign: "right" }}>
          <div>{doc.from_party.name}</div>
          <div>{doc.from_party.email}</div>
        </div>
      </div>
      <div style={{ borderTop: `1px solid ${doc.primary_color}`, marginTop: 8 }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 28 }}>
        <BillTo doc={doc} />
        <div style={{ fontSize: 11, color: "#475569" }}>
          <div><b>No.</b> {doc.doc_number}</div>
          {doc.issue_date && <div><b>Date:</b> {doc.issue_date}</div>}
          {doc.due_date && doc.doc_type === "invoice" && <div><b>Due:</b> {doc.due_date}</div>}
        </div>
      </div>
      <ItemsTable doc={doc} fmt={fmt} color="#0f172a" />
      <Totals doc={doc} label={label} totals={totals} fmt={fmt} color={doc.primary_color} />
      <Footer doc={doc} />
    </div>
  );
}

function BoldTemplate({ doc, label, totals, fmt }: TplProps) {
  return (
    <div>
      <div style={{ background: doc.primary_color, color: "#fff", padding: "32px 48px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          {doc.logo_url && <img src={doc.logo_url} alt="" style={{ maxHeight: 48, filter: "brightness(0) invert(1)" }} />}
          <div style={{ fontWeight: 700, fontSize: 18, marginTop: 6 }}>{doc.from_party.name || "Your Company"}</div>
          <div style={{ fontSize: 11, opacity: 0.85 }}>{doc.from_party.email} · {doc.from_party.phone}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 38, fontWeight: 800, letterSpacing: 1 }}>{label}</div>
          <div style={{ fontSize: 11, opacity: 0.9, marginTop: 6 }}>
            <div>No. {doc.doc_number}</div>
            {doc.issue_date && <div>Date: {doc.issue_date}</div>}
          </div>
        </div>
      </div>
      <div style={{ padding: 48 }}>
        <BillTo doc={doc} />
        <ItemsTable doc={doc} fmt={fmt} color={doc.accent_color} />
        <Totals doc={doc} label={label} totals={totals} fmt={fmt} color={doc.accent_color} />
        <Footer doc={doc} />
      </div>
    </div>
  );
}