import { describe, expect, it } from "vitest";
import { calcTotals, formatMoney } from "./types";

const item = (quantity: number, price: number) => ({
  id: `${quantity}x${price}`,
  description: "",
  quantity,
  price,
});

describe("calcTotals", () => {
  it("applies the discount before tax", () => {
    const totals = calcTotals({ items: [item(2, 100), item(1, 50)], discount: 50, tax_rate: 16 });
    expect(totals).toEqual({ subtotal: 250, discount: 50, tax: 32, total: 232 });
  });

  it("never taxes or totals below zero when the discount exceeds the subtotal", () => {
    const totals = calcTotals({ items: [item(1, 40)], discount: 100, tax_rate: 16 });
    expect(totals.tax).toBe(0);
    expect(totals.total).toBe(0);
  });

  it("treats missing or non-numeric discount and tax as zero", () => {
    const totals = calcTotals({
      items: [item(3, 10)],
      discount: "" as unknown as number,
      tax_rate: undefined as unknown as number,
    });
    expect(totals).toEqual({ subtotal: 30, discount: 0, tax: 0, total: 30 });
  });

  it("returns zeros for a document with no items", () => {
    expect(calcTotals({ items: [], discount: 0, tax_rate: 16 })).toEqual({
      subtotal: 0,
      discount: 0,
      tax: 0,
      total: 0,
    });
  });
});

describe("formatMoney", () => {
  it("formats with the given currency", () => {
    const out = formatMoney(1234.5, "KES");
    expect(out).toMatch(/1,234\.50/);
    expect(out).toMatch(/KES|Ksh/);
  });

  it("falls back to a plain format for an invalid currency code", () => {
    expect(formatMoney(12, "not-a-code")).toBe("not-a-code 12.00");
  });
});
