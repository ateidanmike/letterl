import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { createRef } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { makeQrDataUrl } = vi.hoisted(() => ({ makeQrDataUrl: vi.fn() }));
vi.mock("@/lib/letterhead/qr", () => ({ makeQrDataUrl }));

import { LetterheadPreview } from "./LetterheadPreview";
import { DEFAULT_LETTERHEAD, TEMPLATES, type Brand, type Letterhead } from "@/lib/letterhead/types";

const brand: Brand = {
  company_name: "Acme Ltd",
  phone: "+254 700 000000",
  email: "hello@example.com",
  website: "example.com",
  address: "1 Main St",
  logo_url: null,
  primary_color: "#112233",
  accent_color: "#445566",
};

const letter: Letterhead = {
  ...DEFAULT_LETTERHEAD,
  recipient: "Jane Doe",
  subject: "Your offer",
  body: "The body of the letter.",
  signature_name: "John Roe",
  signature_title: "Director",
};

beforeEach(() => {
  makeQrDataUrl.mockReset().mockResolvedValue("data:image/png;base64,QR");
});
afterEach(cleanup);

describe("LetterheadPreview", () => {
  it.each(TEMPLATES.map((t) => t.id))("renders the letter in the %s template", (template) => {
    render(<LetterheadPreview brand={brand} letter={{ ...letter, template }} />);

    expect(screen.getByText("The body of the letter.")).toBeTruthy();
    expect(screen.getByText("Jane Doe")).toBeTruthy();
    expect(screen.getByText("Re: Your offer")).toBeTruthy();
    expect(screen.getByText("John Roe")).toBeTruthy();
    expect(document.body.textContent).toContain("hello@example.com");
  });

  it("shows a placeholder when the body is empty and no signature block without a signer", () => {
    render(
      <LetterheadPreview
        brand={brand}
        letter={{ ...letter, body: "", signature_name: "", signature_title: "" }}
      />,
    );
    expect(screen.getByText("Start typing your letter…")).toBeTruthy();
    expect(screen.queryByText("Sincerely,")).toBeNull();
  });

  it("uses the drawn signature when there is one", () => {
    render(
      <LetterheadPreview
        brand={brand}
        letter={{ ...letter, signature_data: "data:image/png;base64,SIG" }}
      />,
    );
    expect(screen.getByAltText("Signature").getAttribute("src")).toBe("data:image/png;base64,SIG");
  });

  it("shows a drawn signature even when no name is typed", () => {
    render(
      <LetterheadPreview
        brand={brand}
        letter={{
          ...letter,
          signature_name: "",
          signature_title: "",
          signature_data: "data:image/png;base64,SIG",
        }}
      />,
    );
    expect(screen.getByAltText("Signature")).toBeTruthy();
    expect(screen.getByText("Sincerely,")).toBeTruthy();
  });

  it("shows the logo in place of the company name", () => {
    render(
      <LetterheadPreview
        brand={{ ...brand, logo_url: "https://cdn.example.com/l.png" }}
        letter={letter}
      />,
    );
    expect(screen.getByAltText("Logo").getAttribute("src")).toBe("https://cdn.example.com/l.png");
    expect(screen.queryByText("Acme Ltd")).toBeNull();
  });

  it("renders a QR code for the given link when the letter asks for one", async () => {
    render(
      <LetterheadPreview
        brand={brand}
        letter={{ ...letter, show_qr: true }}
        qrUrl="https://app.example.com/share/tok"
      />,
    );
    await waitFor(() =>
      expect(screen.getByAltText("QR").getAttribute("src")).toBe("data:image/png;base64,QR"),
    );
    expect(makeQrDataUrl).toHaveBeenCalledWith("https://app.example.com/share/tok", 96);
  });

  it("renders no QR code when it is switched off or there is no link", () => {
    const { rerender } = render(
      <LetterheadPreview brand={brand} letter={letter} qrUrl="https://app.example.com/share/tok" />,
    );
    rerender(
      <LetterheadPreview brand={brand} letter={{ ...letter, show_qr: true }} qrUrl={null} />,
    );
    expect(makeQrDataUrl).not.toHaveBeenCalled();
    expect(screen.queryByAltText("QR")).toBeNull();
  });

  it("scales the page and exposes it through the ref", () => {
    const ref = createRef<HTMLDivElement>();
    render(<LetterheadPreview brand={brand} letter={letter} scale={0.5} ref={ref} />);
    const page = ref.current;
    expect(page!.id).toBe("letterhead-page");
    expect(page!.style.transform).toBe("scale(0.5)");
    expect(page!.style.width).toBe("794px");
  });
});
