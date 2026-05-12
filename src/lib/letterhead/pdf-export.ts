import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import type { Letterhead } from "./types";
import { getPageMm } from "./page-size";

export async function exportPdf(node: HTMLElement, filename: string, letter?: Letterhead) {
  const blob = await exportPdfBlob(node, letter);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".pdf") ? filename : `${filename}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function exportPdfBlob(node: HTMLElement, letter?: Letterhead): Promise<Blob> {
  // Temporarily neutralise the preview transform so html2canvas captures
  // the full A4 page, not the scaled-down preview.
  const prevTransform = node.style.transform;
  const prevOrigin = node.style.transformOrigin;
  node.style.transform = "none";
  node.style.transformOrigin = "top left";

  // html2canvas cannot parse `oklch(...)` color values (used by the app's
  // Tailwind theme tokens). Inject an override stylesheet that forces every
  // descendant to inherit safe sRGB colors during capture.
  const overrideStyle = document.createElement("style");
  overrideStyle.setAttribute("data-pdf-export-override", "true");
  overrideStyle.textContent = `
    #letterhead-page, #letterhead-page * {
      border-color: #e2e8f0 !important;
      outline-color: #e2e8f0 !important;
      text-decoration-color: inherit !important;
      caret-color: auto !important;
    }
  `;
  document.head.appendChild(overrideStyle);

  try {
    const canvas = await html2canvas(node, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      logging: false,
      width: node.offsetWidth,
      height: node.offsetHeight,
      windowWidth: node.offsetWidth,
      windowHeight: node.offsetHeight,
      onclone: (clonedDoc) => {
        // Walk every element in the cloned document and replace any computed
        // style values containing `oklch(` with safe fallbacks. html2canvas
        // reads inline styles preferentially, so writing them here wins.
        const COLOR_PROPS = [
          "color",
          "backgroundColor",
          "borderTopColor",
          "borderRightColor",
          "borderBottomColor",
          "borderLeftColor",
          "outlineColor",
          "fill",
          "stroke",
        ] as const;
        const all = clonedDoc.querySelectorAll<HTMLElement>("*");
        all.forEach((el) => {
          const cs = clonedDoc.defaultView?.getComputedStyle(el);
          if (!cs) return;
          COLOR_PROPS.forEach((prop) => {
            const value = cs[prop as keyof CSSStyleDeclaration] as string | undefined;
            if (value && value.includes("oklch")) {
              const fallback =
                prop === "color"
                  ? "#0f172a"
                  : prop === "backgroundColor"
                    ? "transparent"
                    : "#e2e8f0";
              (el.style as unknown as Record<string, string>)[prop] = fallback;
            }
          });
        });
      },
    });
    const imgData = canvas.toDataURL("image/png");
    const fmt = letter?.page_format ?? "a4";
    const orient = letter?.page_orientation ?? "portrait";
    const margin = letter?.margin_mm ?? 0;
    const [pageWmm, pageHmm] = getPageMm(fmt, orient);
    const pdf = new jsPDF({ unit: "mm", format: [pageWmm, pageHmm], orientation: orient });
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    const contentW = pageW - margin * 2;
    const contentH = pageH - margin * 2;
    // Scale: canvas width maps to pageW. Compute total rendered height.
    const imgHeight = (canvas.height * contentW) / canvas.width;
    if (imgHeight <= contentH + 0.5) {
      pdf.addImage(imgData, "PNG", margin, margin, contentW, imgHeight, undefined, "FAST");
      drawPageNumber(pdf, 1, 1, pageW, pageH);
    } else {
      // Multi-page: slice the canvas into contentH-tall chunks.
      const pxPerMm = canvas.width / contentW;
      const sliceHeightPx = Math.floor(contentH * pxPerMm);
      let renderedPx = 0;
      const sliceCanvas = document.createElement("canvas");
      sliceCanvas.width = canvas.width;
      const ctx = sliceCanvas.getContext("2d")!;
      let first = true;
      const totalPages = Math.ceil(canvas.height / sliceHeightPx);
      let pageIndex = 0;
      while (renderedPx < canvas.height) {
        const remaining = canvas.height - renderedPx;
        const currentSlicePx = Math.min(sliceHeightPx, remaining);
        sliceCanvas.height = currentSlicePx;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, sliceCanvas.width, sliceCanvas.height);
        ctx.drawImage(
          canvas,
          0,
          renderedPx,
          canvas.width,
          currentSlicePx,
          0,
          0,
          canvas.width,
          currentSlicePx,
        );
        const sliceData = sliceCanvas.toDataURL("image/png");
        const sliceHeightMm = currentSlicePx / pxPerMm;
        if (!first) pdf.addPage();
        pdf.addImage(sliceData, "PNG", margin, margin, contentW, sliceHeightMm, undefined, "FAST");
        pageIndex += 1;
        drawPageNumber(pdf, pageIndex, totalPages, pageW, pageH);
        first = false;
        renderedPx += currentSlicePx;
      }
    }
    return pdf.output("blob");
  } finally {
    node.style.transform = prevTransform;
    node.style.transformOrigin = prevOrigin;
    overrideStyle.remove();
  }
}

function drawPageNumber(
  pdf: jsPDF,
  current: number,
  total: number,
  pageW: number,
  pageH: number,
) {
  const label = `Page ${current} of ${total}`;
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.setTextColor(110, 110, 110);
  pdf.text(label, pageW - 8, pageH - 4, { align: "right" });
}