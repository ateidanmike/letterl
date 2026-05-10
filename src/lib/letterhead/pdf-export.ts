import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export async function exportPdf(node: HTMLElement, filename: string) {
  // Temporarily neutralise the preview transform so html2canvas captures
  // the full A4 page, not the scaled-down preview.
  const prevTransform = node.style.transform;
  const prevOrigin = node.style.transformOrigin;
  node.style.transform = "none";
  node.style.transformOrigin = "top left";

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
  }
}