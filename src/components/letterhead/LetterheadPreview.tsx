import { forwardRef } from "react";
import { Phone, Mail, Globe } from "lucide-react";
import type { Brand, Letterhead } from "@/lib/letterhead/types";

type Props = {
  brand: Brand;
  letter: Letterhead;
  /** Scale to fit container; 1 = full A4. */
  scale?: number;
};

// A4 at 96dpi: 794 x 1123 px
const A4_W = 794;
const A4_H = 1123;

export const LetterheadPreview = forwardRef<HTMLDivElement, Props>(
  function LetterheadPreview({ brand, letter, scale = 1 }, ref) {
    return (
      <div
        style={{
          width: A4_W * scale,
          height: A4_H * scale,
        }}
      >
        <div
          ref={ref}
          id="letterhead-page"
          style={{
            width: A4_W,
            height: A4_H,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            background: "white",
            color: "#0f172a",
            fontFamily: letter.font_family,
            fontSize: letter.font_size,
            lineHeight: 1.55,
            position: "relative",
            boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
            overflow: "hidden",
          }}
        >
          {letter.template === "classic" && <ClassicTemplate brand={brand} letter={letter} />}
          {letter.template === "left-modern" && <LeftModernTemplate brand={brand} letter={letter} />}
          {letter.template === "minimal" && <MinimalTemplate brand={brand} letter={letter} />}
          {letter.template === "bold-banner" && <BoldBannerTemplate brand={brand} letter={letter} />}
          {letter.template === "corporate" && <CorporateTemplate brand={brand} letter={letter} />}
          {letter.template === "legal" && <LegalTemplate brand={brand} letter={letter} />}
          {letter.template === "executive" && <ExecutiveTemplate brand={brand} letter={letter} />}
          {letter.template === "monogram" && <MonogramTemplate brand={brand} letter={letter} />}
          {brand.watermark_text && <Watermark text={brand.watermark_text} />}
        </div>
      </div>
    );
  },
);

function Body({ letter }: { letter: Letterhead }) {
  return (
    <div style={{ whiteSpace: "pre-wrap" }}>
      {letter.letter_date && (
        <p style={{ marginBottom: 16 }}>
          {new Date(letter.letter_date).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      )}
      {letter.recipient && (
        <p style={{ marginBottom: 16, whiteSpace: "pre-wrap" }}>{letter.recipient}</p>
      )}
      {letter.subject && (
        <p style={{ marginBottom: 16, fontWeight: 600 }}>
          Re: {letter.subject}
        </p>
      )}
      <div style={{ whiteSpace: "pre-wrap" }}>
        {letter.body || (
          <span style={{ color: "#94a3b8" }}>Start typing your letter…</span>
        )}
      </div>
      {(letter.signature_name || letter.signature_title) && (
        <div style={{ marginTop: 40 }}>
          <p style={{ marginBottom: 0 }}>Sincerely,</p>
          <p style={{ marginTop: 28, fontWeight: 600 }}>{letter.signature_name}</p>
          <p style={{ color: "#475569" }}>{letter.signature_title}</p>
        </div>
      )}
    </div>
  );
}

function ClassicTemplate({ brand, letter }: { brand: Brand; letter: Letterhead }) {
  return (
    <>
      <div style={{ padding: "48px 64px 0", textAlign: "center" }}>
        {brand.logo_url ? (
          <img
            src={brand.logo_url}
            alt="Logo"
            crossOrigin="anonymous"
            style={{ height: 96, objectFit: "contain", margin: "0 auto" }}
          />
        ) : (
          <div style={{ fontSize: 28, fontWeight: 700, color: letter.primary_color }}>
            {brand.company_name || "Your Company"}
          </div>
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: 16,
          }}
        >
          <div style={{ flex: 1, height: 2, background: letter.primary_color }} />
          <div style={{ flex: 1, height: 2, background: letter.accent_color }} />
        </div>
      </div>
      <div style={{ padding: "40px 64px", minHeight: A4_H - 320 }}>
        <Body letter={letter} />
      </div>
      <ClassicFooter brand={brand} letter={letter} />
    </>
  );
}

function ClassicFooter({ brand, letter }: { brand: Brand; letter: Letterhead }) {
  return (
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          padding: "16px 64px",
          fontSize: 11,
          color: letter.primary_color,
          fontWeight: 600,
        }}
      >
        <ContactItem icon={<Phone size={12} />} text={brand.phone} color={letter.accent_color} />
        <ContactItem icon={<Mail size={12} />} text={brand.email} color={letter.accent_color} />
        <ContactItem icon={<Globe size={12} />} text={brand.website} color={letter.accent_color} />
      </div>
      <svg viewBox="0 0 794 60" style={{ display: "block", width: "100%" }} preserveAspectRatio="none">
        <polygon points="0,0 794,0 794,60 0,60" fill={letter.primary_color} />
        <polygon points="280,60 397,0 514,60" fill="white" />
        <polygon points="320,60 397,20 474,60" fill={letter.accent_color} />
      </svg>
    </div>
  );
}

function ContactItem({
  icon,
  text,
  color,
}: {
  icon: React.ReactNode;
  text: string;
  color: string;
}) {
  if (!text) return <span />;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <span
        style={{
          background: color,
          color: "white",
          width: 18,
          height: 18,
          borderRadius: 999,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </span>
      <span>{text}</span>
    </div>
  );
}

function LeftModernTemplate({ brand, letter }: { brand: Brand; letter: Letterhead }) {
  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "48px 64px 24px",
          borderBottom: `3px solid ${letter.primary_color}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {brand.logo_url && (
            <img src={brand.logo_url} crossOrigin="anonymous" alt="" style={{ height: 64 }} />
          )}
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: letter.primary_color }}>
              {brand.company_name}
            </div>
            {brand.address && (
              <div style={{ fontSize: 10, color: "#475569", maxWidth: 240 }}>{brand.address}</div>
            )}
          </div>
        </div>
        <div style={{ fontSize: 10, textAlign: "right", color: "#334155" }}>
          {brand.phone && <div>{brand.phone}</div>}
          {brand.email && <div>{brand.email}</div>}
          {brand.website && <div style={{ color: letter.accent_color }}>{brand.website}</div>}
        </div>
      </div>
      <div style={{ padding: "40px 64px" }}>
        <Body letter={letter} />
      </div>
    </>
  );
}

function MinimalTemplate({ brand, letter }: { brand: Brand; letter: Letterhead }) {
  return (
    <>
      <div style={{ padding: "48px 64px 16px", display: "flex", alignItems: "center", gap: 12 }}>
        {brand.logo_url && (
          <img src={brand.logo_url} crossOrigin="anonymous" alt="" style={{ height: 40 }} />
        )}
        <div style={{ fontSize: 14, fontWeight: 600, color: letter.primary_color }}>
          {brand.company_name}
        </div>
      </div>
      <div style={{ height: 1, background: "#e2e8f0", margin: "0 64px" }} />
      <div style={{ padding: "32px 64px" }}>
        <Body letter={letter} />
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 32,
          left: 64,
          right: 64,
          fontSize: 10,
          color: "#64748b",
          textAlign: "center",
          borderTop: `1px solid ${letter.accent_color}`,
          paddingTop: 8,
        }}
      >
        {[brand.phone, brand.email, brand.website, brand.address].filter(Boolean).join("  •  ")}
      </div>
    </>
  );
}

function BoldBannerTemplate({ brand, letter }: { brand: Brand; letter: Letterhead }) {
  return (
    <>
      <div
        style={{
          background: letter.primary_color,
          color: "white",
          padding: "32px 64px",
          display: "flex",
          alignItems: "center",
          gap: 20,
        }}
      >
        {brand.logo_url && (
          <img
            src={brand.logo_url}
            crossOrigin="anonymous"
            alt=""
            style={{ height: 64, background: "white", padding: 6, borderRadius: 6 }}
          />
        )}
        <div>
          <div style={{ fontSize: 24, fontWeight: 800 }}>{brand.company_name || "Your Company"}</div>
          <div style={{ fontSize: 11, opacity: 0.9 }}>{brand.address}</div>
        </div>
      </div>
      <div style={{ height: 6, background: letter.accent_color }} />
      <div style={{ padding: "40px 64px" }}>
        <Body letter={letter} />
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "16px 64px",
          background: letter.primary_color,
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          fontSize: 10,
        }}
      >
        <span>
          <Phone size={10} style={{ display: "inline", marginRight: 4 }} />
          {brand.phone}
        </span>
        <span>
          <Mail size={10} style={{ display: "inline", marginRight: 4 }} />
          {brand.email}
        </span>
        <span>
          <Globe size={10} style={{ display: "inline", marginRight: 4 }} />
          {brand.website}
        </span>
      </div>
    </>
  );
}

function Watermark({ text }: { text: string }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        zIndex: 1,
      }}
    >
      <span
        style={{
          fontSize: 96,
          fontWeight: 800,
          color: "rgba(15, 23, 42, 0.06)",
          transform: "rotate(-30deg)",
          letterSpacing: 4,
          textTransform: "uppercase",
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </span>
    </div>
  );
}

function Initials(name: string) {
  return (name || "Y C")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? "")
    .join("");
}

function CorporateTemplate({ brand, letter }: { brand: Brand; letter: Letterhead }) {
  return (
    <div style={{ display: "flex", height: "100%" }}>
      <div
        style={{
          width: 14,
          background: `linear-gradient(180deg, ${letter.primary_color} 0%, ${letter.accent_color} 100%)`,
        }}
      />
      <div style={{ flex: 1, padding: "48px 56px", position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {brand.logo_url && (
              <img src={brand.logo_url} crossOrigin="anonymous" alt="" style={{ height: 56 }} />
            )}
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, color: letter.primary_color, letterSpacing: 0.5 }}>
                {brand.company_name || "Your Company"}
              </div>
              <div style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: 2 }}>
                Official Correspondence
              </div>
            </div>
          </div>
          <div style={{ fontSize: 10, textAlign: "right", color: "#334155", lineHeight: 1.6 }}>
            {brand.phone && <div>{brand.phone}</div>}
            {brand.email && <div>{brand.email}</div>}
            {brand.website && <div>{brand.website}</div>}
          </div>
        </div>
        <div style={{ height: 1, background: "#e2e8f0", margin: "24px 0" }} />
        <Body letter={letter} />
      </div>
    </div>
  );
}

function LegalTemplate({ brand, letter }: { brand: Brand; letter: Letterhead }) {
  return (
    <>
      <div style={{ padding: "56px 72px 16px", textAlign: "center", fontFamily: "Georgia, serif" }}>
        {brand.logo_url ? (
          <img src={brand.logo_url} crossOrigin="anonymous" alt="" style={{ height: 64, margin: "0 auto" }} />
        ) : (
          <div style={{ fontSize: 26, fontWeight: 700, color: letter.primary_color, letterSpacing: 3, textTransform: "uppercase" }}>
            {brand.company_name || "Your Firm"}
          </div>
        )}
        {brand.address && (
          <div style={{ fontSize: 10, color: "#475569", marginTop: 6 }}>{brand.address}</div>
        )}
        <div style={{ borderTop: `2px solid ${letter.primary_color}`, marginTop: 14 }} />
        <div style={{ borderTop: `1px solid ${letter.primary_color}`, marginTop: 2 }} />
      </div>
      <div style={{ padding: "32px 80px" }}>
        <Body letter={letter} />
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 32,
          left: 80,
          right: 80,
          fontSize: 9,
          color: "#64748b",
          textAlign: "center",
          fontFamily: "Georgia, serif",
          fontStyle: "italic",
        }}
      >
        {[brand.phone, brand.email, brand.website].filter(Boolean).join("  ·  ")}
      </div>
    </>
  );
}

function ExecutiveTemplate({ brand, letter }: { brand: Brand; letter: Letterhead }) {
  return (
    <>
      <div style={{ height: 4, background: letter.primary_color }} />
      <div style={{ padding: "32px 64px 12px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          {brand.logo_url ? (
            <img src={brand.logo_url} crossOrigin="anonymous" alt="" style={{ height: 52 }} />
          ) : (
            <div style={{ fontSize: 24, fontWeight: 300, color: letter.primary_color, letterSpacing: 4, textTransform: "uppercase" }}>
              {brand.company_name || "Your Company"}
            </div>
          )}
        </div>
        <div style={{ fontSize: 9, color: "#64748b", textAlign: "right", letterSpacing: 1, textTransform: "uppercase" }}>
          {brand.address}
        </div>
      </div>
      <div style={{ height: 1, background: "#cbd5e1", margin: "0 64px" }} />
      <div style={{ padding: "36px 64px" }}>
        <Body letter={letter} />
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 0, left: 0, right: 0,
          padding: "14px 64px",
          background: "#f8fafc",
          borderTop: `2px solid ${letter.accent_color}`,
          display: "flex",
          justifyContent: "space-between",
          fontSize: 10,
          color: "#334155",
        }}
      >
        <span>{brand.phone}</span>
        <span>{brand.email}</span>
        <span style={{ color: letter.primary_color, fontWeight: 600 }}>{brand.website}</span>
      </div>
    </>
  );
}

function MonogramTemplate({ brand, letter }: { brand: Brand; letter: Letterhead }) {
  return (
    <>
      <div style={{ padding: "56px 64px 24px", display: "flex", alignItems: "center", gap: 18 }}>
        {brand.logo_url ? (
          <img src={brand.logo_url} crossOrigin="anonymous" alt="" style={{ height: 64 }} />
        ) : (
          <div
            style={{
              width: 64, height: 64, borderRadius: 999,
              background: letter.primary_color, color: "white",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22, fontWeight: 800, letterSpacing: 1,
            }}
          >
            {Initials(brand.company_name)}
          </div>
        )}
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#0f172a" }}>
            {brand.company_name || "Your Company"}
          </div>
          <div style={{ fontSize: 10, color: "#64748b" }}>
            {[brand.phone, brand.email, brand.website].filter(Boolean).join(" · ")}
          </div>
        </div>
      </div>
      <div style={{ padding: "8px 64px 24px" }}>
        <Body letter={letter} />
      </div>
      <div
        style={{
          position: "absolute", bottom: 24, left: 64, right: 64,
          fontSize: 9, color: "#94a3b8", textAlign: "center", letterSpacing: 2, textTransform: "uppercase",
        }}
      >
        {brand.address}
      </div>
    </>
  );
}