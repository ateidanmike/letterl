import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { forwardRef, type ComponentType, type ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { rpc, getPublicUrl, exportPdf, toastError } = vi.hoisted(() => ({
  rpc: vi.fn(),
  getPublicUrl: vi.fn(),
  exportPdf: vi.fn(),
  toastError: vi.fn(),
}));

vi.mock("@tanstack/react-router", () => ({
  createFileRoute: () => (options: Record<string, unknown>) => ({
    ...options,
    useParams: () => ({ token: "tok123" }),
  }),
  Link: ({ to, children }: { to: string; children: ReactNode }) => <a href={to}>{children}</a>,
}));
vi.mock("@/integrations/supabase/client", () => ({
  supabase: { rpc, storage: { from: () => ({ getPublicUrl }) } },
}));
vi.mock("@/lib/letterhead/pdf-export", () => ({ exportPdf }));
vi.mock("sonner", () => ({ toast: { error: toastError } }));
vi.mock("@/components/letterhead/LetterheadPreview", () => ({
  LetterheadPreview: forwardRef<HTMLDivElement, Record<string, never>>(
    function Preview(props, ref) {
      const { brand, letter, qrUrl } = props as unknown as {
        brand: { logo_url: string | null; primary_color: string };
        letter: { body: string; font_family: string };
        qrUrl: string | null;
      };
      return (
        <div
          ref={ref}
          data-testid="preview"
          data-logo={brand.logo_url ?? ""}
          data-primary={brand.primary_color}
          data-font={letter.font_family}
          data-qr={qrUrl ?? ""}
        >
          {letter.body}
        </div>
      );
    },
  ),
}));

import { Route } from "./share.$token";

const Page = (Route as unknown as { component: ComponentType }).component;

const payload = {
  letter: { title: "Offer letter", body: "Hello Jane", primary_color: "#aa0000" },
  brand: { company_name: "Acme Ltd", logo_path: "u1/logo.png" },
  allow_download: true,
};

beforeEach(() => {
  rpc.mockReset().mockResolvedValue({ data: payload, error: null });
  getPublicUrl.mockReset().mockReturnValue({ data: { publicUrl: "https://cdn/u1/logo.png" } });
  exportPdf.mockReset().mockResolvedValue(undefined);
  toastError.mockReset();
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      disconnect() {}
    },
  );
});
afterEach(cleanup);

describe("shared letter page", () => {
  it("looks the letter up by the token in the link", async () => {
    render(<Page />);
    await screen.findByTestId("preview");
    expect(rpc).toHaveBeenCalledWith("get_shared_letterhead", { _token: "tok123" });
  });

  it("shows the letter with the sender's brand, logo and defaults filled in", async () => {
    render(<Page />);
    const preview = await screen.findByTestId("preview");

    expect(screen.getByText("Acme Ltd shared this letter with you.")).toBeTruthy();
    expect(preview.textContent).toBe("Hello Jane");
    expect(getPublicUrl).toHaveBeenCalledWith("u1/logo.png");
    expect(preview.dataset.logo).toBe("https://cdn/u1/logo.png");
    // Brand colour falls back to the letter's; missing letter fields get defaults.
    expect(preview.dataset.primary).toBe("#aa0000");
    expect(preview.dataset.font).toBe("Inter");
    expect(preview.dataset.qr).toBe(window.location.href);
  });

  it("copes with a letter that has no brand", async () => {
    rpc.mockResolvedValue({ data: { letter: payload.letter, brand: null }, error: null });
    render(<Page />);
    const preview = await screen.findByTestId("preview");

    expect(screen.getByText("This letter was shared with you.")).toBeTruthy();
    expect(preview.dataset.logo).toBe("");
    expect(getPublicUrl).not.toHaveBeenCalled();
  });

  it("downloads the PDF under the letter's title", async () => {
    render(<Page />);
    const preview = await screen.findByTestId("preview");
    fireEvent.click(screen.getByRole("button", { name: /download pdf/i }));

    await waitFor(() => expect(exportPdf).toHaveBeenCalledTimes(1));
    const [node, filename, letter] = exportPdf.mock.calls[0];
    expect(node).toBe(preview);
    expect(filename).toBe("Offer letter");
    expect(letter).toMatchObject({ body: "Hello Jane" });
  });

  it("reports a failed download and lets the reader try again", async () => {
    exportPdf.mockRejectedValue(new Error("tainted canvas"));
    render(<Page />);
    await screen.findByTestId("preview");
    fireEvent.click(screen.getByRole("button", { name: /download pdf/i }));

    await waitFor(() => expect(toastError).toHaveBeenCalledWith("tainted canvas"));
    const button = (await screen.findByRole("button", {
      name: /download pdf/i,
    })) as HTMLButtonElement;
    expect(button.disabled).toBe(false);
  });

  it("offers no download when the sender switched it off", async () => {
    rpc.mockResolvedValue({ data: { ...payload, allow_download: false }, error: null });
    render(<Page />);
    await screen.findByTestId("preview");
    expect(screen.queryByRole("button", { name: /download/i })).toBeNull();
  });

  it.each([
    ["an expired link", { data: { error: "expired" }, error: null }, "This link has expired"],
    ["an unknown link", { data: { error: "not_found" }, error: null }, "Letter not found"],
    ["a payload without a letter", { data: {}, error: null }, "Letter not found"],
    ["a failed request", { data: null, error: new Error("network") }, "Couldn't load this letter"],
    ["an empty response", { data: null, error: null }, "Couldn't load this letter"],
  ])("explains %s without showing a letter or download", async (_name, response, title) => {
    rpc.mockResolvedValue(response);
    render(<Page />);

    expect(await screen.findByRole("heading", { name: title })).toBeTruthy();
    expect(screen.queryByTestId("preview")).toBeNull();
    expect(screen.queryByRole("button", { name: /download/i })).toBeNull();
  });
});
