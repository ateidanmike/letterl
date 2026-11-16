import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  ImageRun,
  AlignmentType,
  Header,
  Footer,
  BorderStyle,
} from "docx";
import type { Brand, Letterhead } from "./types";

async function fetchLogoBytes(url: string | null): Promise<Uint8Array | null> {
  if (!url) return null;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return new Uint8Array(await res.arrayBuffer());
  } catch {
    return null;
  }
}

function detectImageType(url: string): "png" | "jpg" {
  return /\.jpe?g($|\?)/i.test(url) ? "jpg" : "png";
}

/** Decode a PNG or JPEG data URL, with its pixel size, for embedding. */
function signatureImage(dataUrl: string | null | undefined) {
  const match = /^data:image\/(png|jpeg);base64,([A-Za-z0-9+/=]+)$/.exec(dataUrl ?? "");
  if (!match) return null;
  try {
    const data = Uint8Array.from(atob(match[2]), (c) => c.charCodeAt(0));
    const view = new DataView(data.buffer);
    let width = 0;
    let height = 0;
    if (match[1] === "png" && data.length > 24) {
      width = view.getUint32(16);
      height = view.getUint32(20);
    }
    // Fit a 60px-tall line, like the on-screen letter; fall back to a common shape.
    const ratio = width && height ? width / height : 3.5;
    const h = 60;
    const w = Math.min(260, Math.round(h * ratio));
    return {
      type: match[1] === "png" ? ("png" as const) : ("jpg" as const),
      data,
      width: w,
      height: Math.round(w / ratio),
    };
  } catch {
    return null;
  }
}

function bodyParagraphs(letter: Letterhead): Paragraph[] {
  const sizeHp = letter.font_size * 2; // half-points
  const font = letter.font_family;
  const out: Paragraph[] = [];

  if (letter.letter_date) {
    out.push(
      new Paragraph({
        spacing: { after: 240 },
        children: [
          new TextRun({
            text: new Date(letter.letter_date).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
            font,
            size: sizeHp,
          }),
        ],
      }),
    );
  }

  if (letter.recipient) {
    letter.recipient.split("\n").forEach((line) => {
      out.push(
        new Paragraph({
          children: [new TextRun({ text: line || " ", font, size: sizeHp })],
        }),
      );
    });
    out.push(new Paragraph({ children: [new TextRun(" ")] }));
  }

  if (letter.subject) {
    out.push(
      new Paragraph({
        spacing: { after: 240 },
        children: [new TextRun({ text: `Re: ${letter.subject}`, bold: true, font, size: sizeHp })],
      }),
    );
  }

  (letter.body || "").split("\n").forEach((line) => {
    out.push(
      new Paragraph({
        spacing: { after: 120 },
        children: [new TextRun({ text: line || " ", font, size: sizeHp })],
      }),
    );
  });

  const signature = signatureImage(letter.signature_data);
  if (letter.signature_name || letter.signature_title || signature) {
    out.push(new Paragraph({ children: [new TextRun(" ")] }));
    out.push(
      new Paragraph({
        children: [new TextRun({ text: "Sincerely,", font, size: sizeHp })],
      }),
    );
    if (signature) {
      out.push(
        new Paragraph({
          children: [
            new ImageRun({
              type: signature.type,
              data: signature.data,
              transformation: { width: signature.width, height: signature.height },
              altText: { title: "Signature", description: "Signature", name: "signature" },
            }),
          ],
        }),
      );
    } else {
      out.push(new Paragraph({ children: [new TextRun(" ")] }));
      out.push(new Paragraph({ children: [new TextRun(" ")] }));
    }
    if (letter.signature_name)
      out.push(
        new Paragraph({
          children: [new TextRun({ text: letter.signature_name, bold: true, font, size: sizeHp })],
        }),
      );
    if (letter.signature_title)
      out.push(
        new Paragraph({
          children: [
            new TextRun({ text: letter.signature_title, font, size: sizeHp, color: "475569" }),
          ],
        }),
      );
  }

  return out;
}

export async function exportDocx(brand: Brand, letter: Letterhead, filename: string) {
  const logoBytes = await fetchLogoBytes(brand.logo_url);
  const logoType = brand.logo_url ? detectImageType(brand.logo_url) : "png";
  const primary = letter.primary_color.replace("#", "");
  const accent = letter.accent_color.replace("#", "");

  const headerChildren: Paragraph[] = [];
  if (logoBytes) {
    headerChildren.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new ImageRun({
            type: logoType,
            data: logoBytes,
            transformation: { width: 120, height: 80 },
            altText: { title: "Logo", description: brand.company_name, name: "logo" },
          }),
        ],
      }),
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
            font: letter.font_family,
          }),
        ],
      }),
    );
  }
  headerChildren.push(
    new Paragraph({
      border: {
        bottom: { style: BorderStyle.SINGLE, size: 12, color: primary, space: 1 },
      },
      children: [new TextRun(" ")],
    }),
  );

  const footerLine = [brand.phone, brand.email, brand.website].filter(Boolean).join("   |   ");
  const footerChildren: Paragraph[] = [
    new Paragraph({
      border: {
        top: { style: BorderStyle.SINGLE, size: 12, color: accent, space: 4 },
      },
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: footerLine,
          size: 18,
          color: primary,
          font: letter.font_family,
        }),
      ],
    }),
  ];

  const doc = new Document({
    styles: {
      default: {
        document: { run: { font: letter.font_family, size: letter.font_size * 2 } },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1080, bottom: 1080, left: 1440, right: 1440 },
          },
        },
        headers: { default: new Header({ children: headerChildren }) },
        footers: { default: new Footer({ children: footerChildren }) },
        children: bodyParagraphs(letter),
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".docx") ? filename : `${filename}.docx`;
  a.click();
  URL.revokeObjectURL(url);
}
