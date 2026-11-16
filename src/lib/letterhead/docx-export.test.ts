import JSZip from "jszip";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { exportDocx } from "./docx-export";
import { DEFAULT_LETTERHEAD, type Brand, type Letterhead } from "./types";

const brand: Brand = {
  company_name: "Acme Ltd",
  phone: "+254 700 000000",
  email: "hello@example.com",
  website: "",
  address: "1 Main St",
  logo_url: null,
  primary_color: "#112233",
  accent_color: "#445566",
};

const letter: Letterhead = {
  ...DEFAULT_LETTERHEAD,
  letter_date: null,
  recipient: "Jane Doe\nNairobi",
  subject: "Your offer",
  body: "First line\nSecond line",
  signature_name: "John Roe",
  signature_title: "Director",
  primary_color: "#112233",
  accent_color: "#445566",
};

// A valid 1x1 PNG, so the docx library can embed it.
const PNG = Uint8Array.from(
  atob(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
  ),
  (c) => c.charCodeAt(0),
);

let blobs: Blob[];
let names: string[];

beforeEach(() => {
  blobs = [];
  names = [];
  URL.createObjectURL = vi.fn((blob: Blob) => {
    blobs.push(blob);
    return "blob:x";
  });
  URL.revokeObjectURL = vi.fn();
  vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(function (
    this: HTMLAnchorElement,
  ) {
    names.push(this.download);
  });
  vi.stubGlobal("fetch", vi.fn());
});

/** Unzip the generated file and return its parts as text. */
async function parts() {
  const zip = await JSZip.loadAsync(await blobs[0].arrayBuffer());
  const files = Object.keys(zip.files);
  const read = async (match: RegExp) => {
    const name = files.find((f) => match.test(f));
    return name ? zip.file(name)!.async("string") : "";
  };
  return {
    files,
    body: await read(/^word\/document\.xml$/),
    header: await read(/^word\/header\d*\.xml$/),
    footer: await read(/^word\/footer\d*\.xml$/),
  };
}

describe("exportDocx", () => {
  it("writes the letter text into a Word file", async () => {
    await exportDocx(brand, letter, "offer");
    const { body } = await parts();

    for (const text of [
      "Jane Doe",
      "Nairobi",
      "Re: Your offer",
      "First line",
      "Second line",
      "Sincerely,",
      "John Roe",
      "Director",
    ]) {
      expect(body).toContain(text);
    }
  });

  it("puts the company name in the header when there is no logo", async () => {
    await exportDocx(brand, letter, "offer");
    const { header, files } = await parts();

    expect(header).toContain(">Acme Ltd<");
    expect(header).toContain("112233");
    expect(files.some((f) => f.startsWith("word/media/"))).toBe(false);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("lists only the filled-in contact details in the footer", async () => {
    await exportDocx(brand, letter, "offer");
    const { footer } = await parts();
    expect(footer).toContain("+254 700 000000   |   hello@example.com<");
  });

  it("embeds the logo when it can be fetched", async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(PNG));
    await exportDocx({ ...brand, logo_url: "https://cdn.example.com/logo.png" }, letter, "offer");
    const { header, files } = await parts();

    expect(files.some((f) => f.startsWith("word/media/"))).toBe(true);
    expect(header).toContain("<w:drawing>");
    expect(header).not.toContain(">Acme Ltd<");
  });

  it("still exports, with the company name, when the logo cannot be fetched", async () => {
    vi.mocked(fetch).mockRejectedValue(new TypeError("Failed to fetch"));
    await exportDocx({ ...brand, logo_url: "https://cdn.example.com/a.png" }, letter, "offer");
    expect((await parts()).header).toContain(">Acme Ltd<");

    blobs = [];
    vi.mocked(fetch).mockResolvedValue(new Response("gone", { status: 404 }));
    await exportDocx({ ...brand, logo_url: "https://cdn.example.com/a.png" }, letter, "offer");
    expect((await parts()).header).toContain(">Acme Ltd<");
  });

  it("embeds the drawn signature, even without a typed name", async () => {
    const dataUrl = `data:image/png;base64,${btoa(String.fromCharCode(...PNG))}`;
    await exportDocx(
      brand,
      { ...letter, signature_name: "", signature_title: "", signature_data: dataUrl },
      "offer",
    );
    const { body, files } = await parts();

    expect(body).toContain("Sincerely,");
    expect(body).toContain("<w:drawing>");
    expect(files.some((f) => f.startsWith("word/media/"))).toBe(true);
  });

  it("leaves out the signature block when no signer is given", async () => {
    await exportDocx(brand, { ...letter, signature_name: "", signature_title: "" }, "offer");
    expect((await parts()).body).not.toContain("Sincerely,");
  });

  it("downloads with a single .docx extension", async () => {
    await exportDocx(brand, letter, "offer");
    await exportDocx(brand, letter, "offer.docx");
    expect(names).toEqual(["offer.docx", "offer.docx"]);
  });
});
