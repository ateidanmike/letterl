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
  const { node: captureNode, cleanup } = await createCaptureNode(node);

  // html2canvas cannot parse `oklch(...)` colours (used by the app's theme
  // tokens). The onclone step below swaps any such computed colour for a safe
  // fallback per element, which leaves the document's own coloured rules and
  // table borders exactly as they appear on screen. These two properties are not
  // covered by that step, so neutralise them here.
  const overrideStyle = document.createElement("style");
  overrideStyle.setAttribute("data-pdf-export-override", "true");
  overrideStyle.textContent = `
    #letterhead-page, #letterhead-page * {
      text-decoration-color: inherit !important;
      caret-color: auto !important;
    }
  `;
  document.head.appendChild(overrideStyle);

  try {
    const captureWidth = captureNode.scrollWidth || captureNode.offsetWidth;
    const captureHeight = captureNode.scrollHeight || captureNode.offsetHeight;
    const canvas = await html2canvas(captureNode, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      logging: false,
      width: captureWidth,
      height: captureHeight,
      windowWidth: captureWidth,
      windowHeight: captureHeight,
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
    cleanup();
    overrideStyle.remove();
  }
}

async function createCaptureNode(node: HTMLElement) {
  const width = node.scrollWidth || node.offsetWidth || 794;
  const height = node.scrollHeight || node.offsetHeight || 1123;
  const clone = node.cloneNode(true) as HTMLElement;
  clone.style.transform = "none";
  clone.style.transformOrigin = "top left";
  clone.style.width = `${width}px`;
  clone.style.minHeight = `${height}px`;

  const wrapper = document.createElement("div");
  wrapper.setAttribute("data-export-capture-root", "true");
  wrapper.style.position = "fixed";
  wrapper.style.left = "-10000px";
  wrapper.style.top = "0";
  wrapper.style.width = `${width}px`;
  wrapper.style.minHeight = `${height}px`;
  wrapper.style.background = "#ffffff";
  wrapper.style.transform = "none";
  wrapper.style.opacity = "1";
  wrapper.style.pointerEvents = "none";
  wrapper.appendChild(clone);
  document.body.appendChild(wrapper);

  await waitForImages(clone);

  return {
    node: clone,
    cleanup: () => wrapper.remove(),
  };
}

async function waitForImages(node: HTMLElement) {
  const images = Array.from(node.querySelectorAll("img"));
  await Promise.all(
    images.map((img) => {
      if (img.complete) return Promise.resolve();
      return new Promise<void>((resolve) => {
        img.onload = () => resolve();
        img.onerror = () => resolve();
      });
    }),
  );
}

function drawPageNumber(pdf: jsPDF, current: number, total: number, pageW: number, pageH: number) {
  const label = `Page ${current} of ${total}`;
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.setTextColor(110, 110, 110);
  pdf.text(label, pageW - 8, pageH - 4, { align: "right" });
}
