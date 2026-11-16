import { describe, expect, it } from "vitest";
import { documentSlug, slugify } from "./slug";

describe("slugify", () => {
  it("lowercases and joins words with single hyphens", () => {
    expect(slugify("  Acme Ltd -- Invoice #12 ")).toBe("acme-ltd-invoice-12");
  });

  it("returns an empty string when nothing usable is left", () => {
    expect(slugify("***")).toBe("");
    expect(slugify("")).toBe("");
  });
});

describe("documentSlug", () => {
  it("combines the title and the document number", () => {
    expect(documentSlug({ title: "March Invoice", doc_number: "INV/0042" })).toBe(
      "march-invoice-inv-0042",
    );
  });

  it("falls back to 'document' when the title has no usable characters", () => {
    expect(documentSlug({ title: "!!!", doc_number: "7" })).toBe("document-7");
  });

  it("omits the number when it is blank", () => {
    expect(documentSlug({ title: "Quote", doc_number: "  " })).toBe("quote");
  });
});
