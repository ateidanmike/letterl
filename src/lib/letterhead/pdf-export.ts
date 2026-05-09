import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export async function exportPdf(node: HTMLElement, filename: string) {
  const canvas = await html2canvas(node, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
    logging: false,
  });
  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({ unit: "px", format: "a4", orientation: "portrait" });
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  pdf.addImage(imgData, "PNG", 0, 0, pageW, pageH);
  pdf.save(filename.endsWith(".pdf") ? filename : `${filename}.pdf`);
}