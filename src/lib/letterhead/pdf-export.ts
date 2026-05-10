import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export async function exportPdf(node: HTMLElement, filename: string) {
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
    const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    pdf.addImage(imgData, "PNG", 0, 0, pageW, pageH, undefined, "FAST");
    pdf.save(filename.endsWith(".pdf") ? filename : `${filename}.pdf`);
  } finally {
    node.style.transform = prevTransform;
    node.style.transformOrigin = prevOrigin;
    overrideStyle.remove();
  }
}