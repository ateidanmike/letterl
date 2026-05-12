import JSZip from "jszip";
import React from "react";
import { createRoot } from "react-dom/client";
import { LetterheadPreview } from "@/components/letterhead/LetterheadPreview";
import type { Brand, Letterhead } from "./types";
import { exportPdfBlob } from "./pdf-export";

/** Render each letter into a hidden DOM node, export as PDF, zip everything. */
export async function batchExportZip(
  items: { brand: Brand; letter: Letterhead; filename: string }[],
  zipName = "letterheads.zip",
) {
  const zip = new JSZip();

  // Hidden host container offscreen.
  const host = document.createElement("div");
  host.style.position = "fixed";
  host.style.left = "-10000px";
  host.style.top = "0";
  host.style.zIndex = "-1";
  document.body.appendChild(host);

  try {
    for (const item of items) {
      const mount = document.createElement("div");
      host.appendChild(mount);
      const root = createRoot(mount);
      let nodeRef: HTMLDivElement | null = null;

      await new Promise<void>((resolve) => {
        root.render(
          React.createElement(LetterheadPreview, {
            brand: item.brand,
            letter: item.letter,
            scale: 1,
            ref: (n: HTMLDivElement | null) => {
              nodeRef = n;
              if (n) requestAnimationFrame(() => resolve());
            },
          } as never),
        );
      });

      // Give logo images a moment to load.
      await new Promise((r) => setTimeout(r, 250));

      if (nodeRef) {
        const blob = await exportPdfBlob(nodeRef, item.letter);
        zip.file(`${item.filename}.pdf`, blob);
      }

      root.unmount();
      host.removeChild(mount);
    }
  } finally {
    document.body.removeChild(host);
  }

  const out = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(out);
  const a = document.createElement("a");
  a.href = url;
  a.download = zipName;
  a.click();
  URL.revokeObjectURL(url);
}