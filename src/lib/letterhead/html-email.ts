import type { Brand, Letterhead } from "./types";

function esc(s: string | null | undefined) {
  return (s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Build a self-contained, inline-styled HTML email of the letterhead. */
export function buildHtmlEmail(brand: Brand, letter: Letterhead) {
  const primary = letter.primary_color;
  const accent = letter.accent_color;
  const font = letter.font_family;
  const dateStr = letter.letter_date
    ? new Date(letter.letter_date).toLocaleDateString(undefined, {
        year: "numeric", month: "long", day: "numeric",
      })
    : "";
  const bodyHtml = esc(letter.body).replace(/\n/g, "<br/>");
  const recipientHtml = esc(letter.recipient).replace(/\n/g, "<br/>");

  const logo = brand.logo_url
    ? `<img src="${esc(brand.logo_url)}" alt="${esc(brand.company_name)}" style="height:80px;display:block;margin:0 auto;" />`
    : `<div style="font-size:24px;font-weight:700;color:${primary};text-align:center;">${esc(brand.company_name) || "Your Company"}</div>`;

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

export function downloadHtmlEmail(brand: Brand, letter: Letterhead, filename: string) {
  const html = buildHtmlEmail(brand, letter);
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".html") ? filename : `${filename}.html`;
  a.click();
  URL.revokeObjectURL(url);
}