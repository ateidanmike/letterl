import { beforeEach, describe, expect, it, vi } from "vitest";

const { html2canvas } = vi.hoisted(() => ({ html2canvas: vi.fn() }));
vi.mock("html2canvas", () => ({ default: html2canvas }));

import { exportPng } from "./png-export";

let node: HTMLElement;
let downloads: { name: string; href: string }[];
let toDataURL: ReturnType<typeof vi.fn>;

beforeEach(() => {
  document.body.innerHTML = "";
  document.head.innerHTML = "";
  node = document.createElement("div");
  document.body.appendChild(node);

  toDataURL = vi.fn((mime: string) => `data:${mime};base64,AAAA`);
  html2canvas.mockReset().mockResolvedValue({ toDataURL });

  downloads = [];
  vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(function (
    this: HTMLAnchorElement,
  ) {
    downloads.push({ name: this.download, href: this.href });
  });
});

describe("exportPng", () => {
  it("downloads a PNG by default with a single extension", async () => {
    await exportPng(node, "letter");
    await exportPng(node, "letter.png");

    expect(downloads.map((d) => d.name)).toEqual(["letter.png", "letter.png"]);
    expect(downloads[0].href).toMatch(/^data:image\/png/);
  });

  it("downloads a JPEG as .jpg when asked", async () => {
    await exportPng(node, "letter", "image/jpeg");

    expect(toDataURL).toHaveBeenCalledWith("image/jpeg", 0.95);
    expect(downloads[0].name).toBe("letter.jpg");
  });

  it("removes its temporary nodes after success and after failure", async () => {
    await exportPng(node, "letter");
    expect(document.body.children).toHaveLength(1);
    expect(document.head.querySelectorAll("style")).toHaveLength(0);

    html2canvas.mockRejectedValue(new Error("render failed"));
    await expect(exportPng(node, "letter")).rejects.toThrow("render failed");
    expect(document.body.children).toHaveLength(1);
    expect(document.head.querySelectorAll("style")).toHaveLength(0);
    expect(downloads).toHaveLength(1);
  });

  it("replaces oklch colours in the cloned page, leaving real colours alone", async () => {
    await exportPng(node, "letter");
    const { onclone } = html2canvas.mock.calls[0][1];

    const doc = document.implementation.createHTMLDocument();
    const themed = doc.createElement("p");
    const plain = doc.createElement("p");
    doc.body.append(themed, plain);
    const styles = new Map<Element, Record<string, string>>([
      [
        themed,
        {
          color: "oklch(0.2 0.1 250)",
          backgroundColor: "oklch(1 0 0)",
          borderTopColor: "oklch(0.9 0 0)",
        },
      ],
      [plain, { color: "rgb(1, 2, 3)", borderTopColor: "rgb(200, 0, 0)" }],
    ]);
    Object.defineProperty(doc, "defaultView", {
      value: { getComputedStyle: (el: Element) => styles.get(el) ?? {} },
    });

    onclone(doc);

    expect(themed.style.color).toBe("rgb(15, 23, 42)");
    expect(themed.style.backgroundColor).toBe("transparent");
    expect(themed.style.borderTopColor).toBe("rgb(226, 232, 240)");
    expect(plain.style.color).toBe("");
    expect(plain.style.borderTopColor).toBe("");
  });
});
