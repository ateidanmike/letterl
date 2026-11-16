import JSZip from "jszip";
import { forwardRef } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { exportPdfBlob } = vi.hoisted(() => ({ exportPdfBlob: vi.fn() }));
vi.mock("./pdf-export", () => ({ exportPdfBlob }));
vi.mock("@/components/letterhead/LetterheadPreview", () => ({
  LetterheadPreview: forwardRef<HTMLDivElement, { letter: { title: string } }>(function Preview(
    { letter },
    ref,
  ) {
    return <div ref={ref}>{letter.title}</div>;
  }),
}));

import { batchExportZip } from "./batch-export";
import { DEFAULT_LETTERHEAD, type Brand } from "./types";

const brand = { company_name: "Acme" } as Brand;
const item = (title: string) => ({
  brand,
  letter: { ...DEFAULT_LETTERHEAD, title },
  filename: title,
});

let zipped: Blob[];
let names: string[];

beforeEach(() => {
  document.body.innerHTML = "";
  zipped = [];
  names = [];
  exportPdfBlob.mockReset().mockImplementation(async (node: HTMLElement) => {
    return new Blob([`pdf:${node.textContent}`]);
  });
  URL.createObjectURL = vi.fn((blob: Blob) => {
    zipped.push(blob);
    return "blob:x";
  });
  URL.revokeObjectURL = vi.fn();
  vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(function (
    this: HTMLAnchorElement,
  ) {
    names.push(this.download);
  });
});

describe("batchExportZip", () => {
  it("zips one PDF per letter, each rendered from its own letter", async () => {
    await batchExportZip([item("alpha"), item("beta")], "all.zip");

    expect(names).toEqual(["all.zip"]);
    const zip = await JSZip.loadAsync(await zipped[0].arrayBuffer());
    expect(Object.keys(zip.files).sort()).toEqual(["alpha.pdf", "beta.pdf"]);
    expect(await zip.file("alpha.pdf")!.async("string")).toBe("pdf:alpha");
    expect(await zip.file("beta.pdf")!.async("string")).toBe("pdf:beta");
  });

  it("passes each letter's settings to the PDF export", async () => {
    const landscape = item("wide");
    landscape.letter.page_orientation = "landscape";
    await batchExportZip([landscape]);
    expect(exportPdfBlob.mock.calls[0][1]).toMatchObject({ page_orientation: "landscape" });
  });

  it("removes its hidden render container when finished", async () => {
    await batchExportZip([item("alpha")]);
    expect(document.body.children).toHaveLength(0);
  });

  it("removes its hidden render container and downloads nothing when an export fails", async () => {
    exportPdfBlob.mockRejectedValue(new Error("render failed"));
    await expect(batchExportZip([item("alpha")])).rejects.toThrow("render failed");
    expect(document.body.children).toHaveLength(0);
    expect(names).toEqual([]);
  });
});
