import { beforeEach, describe, expect, it, vi } from "vitest";

const { html2canvas, pdfs } = vi.hoisted(() => ({
  html2canvas: vi.fn(),
  pdfs: [] as FakePdf[],
}));

type FakePdf = {
  options: { format: [number, number]; orientation: string };
  pages: number;
  images: { x: number; y: number; w: number; h: number }[];
  labels: string[];
};

vi.mock("html2canvas", () => ({ default: html2canvas }));
vi.mock("jspdf", () => ({
  default: class {
    state: FakePdf;
    internal: { pageSize: { getWidth: () => number; getHeight: () => number } };
    constructor(options: FakePdf["options"]) {
      this.state = { options, pages: 1, images: [], labels: [] };
      pdfs.push(this.state);
      const [w, h] = options.format;
      this.internal = { pageSize: { getWidth: () => w, getHeight: () => h } };
    }
    addPage() {
      this.state.pages += 1;
    }
    addImage(_data: string, _type: string, x: number, y: number, w: number, h: number) {
      this.state.images.push({ x, y, w, h });
    }
    text(label: string) {
      this.state.labels.push(label);
    }
    setFont() {}
    setFontSize() {}
    setTextColor() {}
    output() {
      return new Blob(["pdf"], { type: "application/pdf" });
    }
  },
}));

import { exportPdf, exportPdfBlob } from "./pdf-export";
import { DEFAULT_LETTERHEAD } from "./types";

/** A stand-in for the canvas html2canvas returns, sized in pixels. */
function fakeCanvas(width: number, height: number) {
  return { width, height, toDataURL: () => "data:image/png;base64,AAAA" };
}

function leftovers() {
  return document.querySelectorAll("[data-export-capture-root], [data-pdf-export-override]");
}

let node: HTMLElement;

beforeEach(() => {
  pdfs.length = 0;
  html2canvas.mockReset();
  document.body.innerHTML = "";
  node = document.createElement("div");
  node.id = "letterhead-page";
  node.style.transform = "scale(0.5)";
  document.body.appendChild(node);

  // jsdom has no canvas implementation; the multi-page path only needs these.
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({
    fillRect: vi.fn(),
    drawImage: vi.fn(),
  } as unknown as CanvasRenderingContext2D);
  vi.spyOn(HTMLCanvasElement.prototype, "toDataURL").mockReturnValue("data:image/png;base64,AAAA");
});

describe("exportPdfBlob", () => {
  it("puts content that fits on a single page", async () => {
    html2canvas.mockResolvedValue(fakeCanvas(2100, 2970));
    const blob = await exportPdfBlob(node);

    expect(blob.type).toBe("application/pdf");
    expect(pdfs[0].options).toMatchObject({ format: [210, 297], orientation: "portrait" });
    expect(pdfs[0].pages).toBe(1);
    expect(pdfs[0].images).toEqual([{ x: 0, y: 0, w: 210, h: 297 }]);
    expect(pdfs[0].labels).toEqual(["Page 1 of 1"]);
  });

  it("splits tall content across numbered pages without losing the remainder", async () => {
    // 2.5 A4 pages of content.
    html2canvas.mockResolvedValue(fakeCanvas(2100, 7425));
    await exportPdfBlob(node);

    expect(pdfs[0].pages).toBe(3);
    expect(pdfs[0].labels).toEqual(["Page 1 of 3", "Page 2 of 3", "Page 3 of 3"]);
    const heights = pdfs[0].images.map((i) => i.h);
    expect(heights[0]).toBeCloseTo(297);
    expect(heights[1]).toBeCloseTo(297);
    expect(heights[2]).toBeCloseTo(148.5);
  });

  it("uses the letter's page format, orientation and margin", async () => {
    html2canvas.mockResolvedValue(fakeCanvas(1000, 500));
    await exportPdfBlob(node, {
      ...DEFAULT_LETTERHEAD,
      page_format: "letter",
      page_orientation: "landscape",
      margin_mm: 10,
    });

    expect(pdfs[0].options).toMatchObject({ format: [279, 216], orientation: "landscape" });
    expect(pdfs[0].images).toEqual([{ x: 10, y: 10, w: 259, h: 129.5 }]);
  });

  it("captures an unscaled offscreen copy and leaves the original untouched", async () => {
    html2canvas.mockResolvedValue(fakeCanvas(100, 100));
    await exportPdfBlob(node);

    const captured = html2canvas.mock.calls[0][0] as HTMLElement;
    expect(captured).not.toBe(node);
    expect(captured.style.transform).toBe("none");
    expect(node.style.transform).toBe("scale(0.5)");
  });

  it("removes its temporary nodes after a successful export", async () => {
    html2canvas.mockResolvedValue(fakeCanvas(100, 100));
    await exportPdfBlob(node);
    expect(leftovers()).toHaveLength(0);
  });

  it("removes its temporary nodes when rendering fails", async () => {
    html2canvas.mockRejectedValue(new Error("tainted canvas"));
    await expect(exportPdfBlob(node)).rejects.toThrow("tainted canvas");
    expect(leftovers()).toHaveLength(0);
  });

  it("waits for images to load, or fail, before capturing", async () => {
    const img = document.createElement("img");
    node.appendChild(img);
    html2canvas.mockResolvedValue(fakeCanvas(100, 100));

    let cloned: HTMLImageElement | undefined;
    const original = Node.prototype.cloneNode;
    vi.spyOn(Node.prototype, "cloneNode").mockImplementation(function (this: Node, deep) {
      const copy = original.call(this, deep) as HTMLElement;
      cloned = copy.querySelector("img") ?? undefined;
      if (cloned) Object.defineProperty(cloned, "complete", { value: false });
      return copy;
    });

    const pending = exportPdfBlob(node);
    await new Promise((r) => setTimeout(r, 0));
    expect(html2canvas).not.toHaveBeenCalled();

    cloned!.onerror!(new Event("error"));
    await pending;
    expect(html2canvas).toHaveBeenCalledTimes(1);
  });
});

describe("exportPdf", () => {
  it("downloads with a single .pdf extension", async () => {
    html2canvas.mockResolvedValue(fakeCanvas(100, 100));
    URL.createObjectURL = vi.fn(() => "blob:x");
    URL.revokeObjectURL = vi.fn();
    const names: string[] = [];
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(function (
      this: HTMLAnchorElement,
    ) {
      names.push(this.download);
    });

    await exportPdf(node, "offer");
    await exportPdf(node, "offer.pdf");

    expect(names).toEqual(["offer.pdf", "offer.pdf"]);
    expect(URL.revokeObjectURL).toHaveBeenCalledTimes(2);
  });
});
