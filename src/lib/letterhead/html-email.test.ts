import { describe, expect, it } from "vitest";
import { buildHtmlEmail } from "./html-email";
import { DEFAULT_LETTERHEAD, type Brand, type Letterhead } from "./types";

const brand: Brand = {
  company_name: "Acme & Sons",
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
  title: "Offer",
  letter_date: null,
  recipient: "Jane Doe\nNairobi",
  subject: "Your offer",
  body: "Line one\nLine two",
  signature_name: "John",
  signature_title: "Director",
  primary_color: "#112233",
  accent_color: "#445566",
};

describe("buildHtmlEmail", () => {
  it("escapes HTML in user-entered text", () => {
    const html = buildHtmlEmail(brand, {
      ...letter,
      title: "</title><script>alert(1)</script>",
      body: '<img src=x onerror="alert(1)">',
      subject: "<b>bold</b>",
    });
    expect(html).not.toContain("<script>");
    expect(html).not.toContain("<img src=x");
    expect(html).not.toContain("<b>bold</b>");
    expect(html).toContain("&lt;img src=x onerror=&quot;alert(1)&quot;&gt;");
    expect(html).toContain("Acme &amp; Sons");
  });

  it("keeps line breaks in the body and recipient", () => {
    const html = buildHtmlEmail(brand, letter);
    expect(html).toContain("Line one<br/>Line two");
    expect(html).toContain("Jane Doe<br/>Nairobi");
  });

  it("uses the logo when there is one and the company name otherwise", () => {
    expect(buildHtmlEmail(brand, letter)).not.toContain("<img");
    const withLogo = buildHtmlEmail(
      { ...brand, logo_url: 'https://cdn.example.com/logo.png?a=1&b="2"' },
      letter,
    );
    expect(withLogo).toContain(
      '<img src="https://cdn.example.com/logo.png?a=1&amp;b=&quot;2&quot;" alt="Acme &amp; Sons"',
    );
  });

  it("leaves out the date, subject and signature when they are empty", () => {
    const html = buildHtmlEmail(brand, {
      ...letter,
      subject: "",
      signature_name: "",
      signature_title: "",
    });
    expect(html).not.toContain("Re:");
    expect(html).not.toContain("Sincerely,");
  });

  it("lists only the contact details that are filled in", () => {
    const html = buildHtmlEmail({ ...brand, phone: "", website: "" }, letter);
    expect(html).toContain(">hello@example.com</td>");
  });

  it("applies the letter's colours", () => {
    const html = buildHtmlEmail(brand, letter);
    expect(html).toContain("border-bottom:3px solid #112233");
    expect(html).toContain("background:#445566");
  });
});
