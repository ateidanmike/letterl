import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { LetterheadPreview } from "@/components/letterhead/LetterheadPreview";
import { exportPdf } from "@/lib/letterhead/pdf-export";
import { DEFAULT_LETTERHEAD } from "@/lib/letterhead/types";
import type { Brand, Letterhead } from "@/lib/letterhead/types";

export const Route = createFileRoute("/share/$token")({
  component: SharedLetterPage,
  head: () => ({
    meta: [{ title: "Shared letter - Zuridoc" }, { name: "robots", content: "noindex, nofollow" }],
  }),
});

type SharedPayload = {
  error?: "not_found" | "expired";
  letter?: Partial<Letterhead>;
  brand?: (Partial<Brand> & { logo_path?: string | null }) | null;
  allow_download?: boolean;
};

type ViewState =
  | { status: "loading" }
  | { status: "error"; title: string; message: string }
  | { status: "ready"; letter: Letterhead; brand: Brand; allowDownload: boolean };

const PAGE_WIDTH = 794;

function SharedLetterPage() {
  const { token } = Route.useParams();
  const [view, setView] = useState<ViewState>({ status: "loading" });
  const [scale, setScale] = useState(1);
  const [downloading, setDownloading] = useState(false);
  const [pageUrl, setPageUrl] = useState<string | null>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    setPageUrl(window.location.href);
    (async () => {
      const { data, error } = await supabase.rpc("get_shared_letterhead", { _token: token });
      if (cancelled) return;
      const payload = (data ?? null) as SharedPayload | null;

      if (error || !payload) {
        setView({
          status: "error",
          title: "Couldn't load this letter",
          message: "Check your connection and try opening the link again.",
        });
        return;
      }
      if (payload.error === "expired") {
        setView({
          status: "error",
          title: "This link has expired",
          message: "Ask the sender for a new link.",
        });
        return;
      }
      if (payload.error || !payload.letter) {
        setView({
          status: "error",
          title: "Letter not found",
          message: "This link is not valid, or the letter has been removed.",
        });
        return;
      }

      const brand = payload.brand ?? {};
      const logoUrl = brand.logo_path
        ? supabase.storage.from("logos").getPublicUrl(brand.logo_path).data.publicUrl
        : null;
      const letter: Letterhead = { ...DEFAULT_LETTERHEAD, ...payload.letter };
      setView({
        status: "ready",
        allowDownload: payload.allow_download !== false,
        letter,
        brand: {
          company_name: brand.company_name ?? "",
          phone: brand.phone ?? "",
          email: brand.email ?? "",
          website: brand.website ?? "",
          address: brand.address ?? "",
          logo_url: logoUrl,
          primary_color: brand.primary_color ?? letter.primary_color,
          accent_color: brand.accent_color ?? letter.accent_color,
          watermark_text: brand.watermark_text ?? null,
        },
      });
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  // Fit the A4 page to the screen width.
  useEffect(() => {
    const shell = shellRef.current;
    if (!shell || view.status !== "ready") return;
    const update = () => {
      const width = shell.clientWidth;
      if (width) setScale(Math.min(1, width / PAGE_WIDTH));
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(shell);
    return () => observer.disconnect();
  }, [view.status]);

  const download = async () => {
    if (view.status !== "ready" || !previewRef.current) return;
    setDownloading(true);
    try {
      await exportPdf(previewRef.current, view.letter.title || "letter", view.letter);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "PDF export failed");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="landing nb-dots flex min-h-screen flex-col bg-[#FFF7E3] text-[#011B43]">
      <header className="border-b-[3px] border-[#011B43] bg-[#FFF7E3]">
        <div className="mx-auto flex h-[68px] max-w-5xl items-center justify-between gap-4 px-4 sm:px-8">
          <Link to="/" className="nb-focus flex items-center" aria-label="Zuridoc home">
            <img src="/logo to use.png" alt="Zuridoc" className="h-14 w-auto object-contain" />
          </Link>
          {view.status === "ready" && view.allowDownload && (
            <button
              type="button"
              onClick={download}
              disabled={downloading}
              className="nb-btn inline-flex h-11 items-center gap-2 bg-[#0067EC] px-5 text-[15px] font-extrabold text-white"
            >
              <Download className="h-4 w-4" strokeWidth={3} />
              {downloading ? "Preparing…" : "Download PDF"}
            </button>
          )}
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-8 sm:py-12">
        {view.status === "loading" && (
          <p className="landing-hand animate-pulse text-center text-4xl">opening the envelope…</p>
        )}

        {view.status === "error" && (
          <div className="nb-box-lg mx-auto max-w-md bg-white p-8 text-center">
            <h1 className="text-3xl">{view.title}</h1>
            <p className="mt-3 text-lg font-medium">{view.message}</p>
          </div>
        )}

        {view.status === "ready" && (
          <>
            <p className="mb-5 text-center text-[15px] font-bold">
              {view.brand.company_name
                ? `${view.brand.company_name} shared this letter with you.`
                : "This letter was shared with you."}
            </p>
            <div ref={shellRef} className="mx-auto w-full max-w-[794px]">
              <div className="w-fit border-[3px] border-[#011B43] shadow-[8px_8px_0_0_#011B43]">
                <LetterheadPreview
                  ref={previewRef}
                  brand={view.brand}
                  letter={view.letter}
                  scale={scale}
                  qrUrl={pageUrl}
                />
              </div>
            </div>
          </>
        )}
      </main>

      <footer className="border-t-[3px] border-[#011B43] px-4 py-5 text-center text-sm font-bold">
        Made with{" "}
        <Link to="/" className="underline decoration-[3px] underline-offset-4">
          Zuridoc
        </Link>
      </footer>
    </div>
  );
}
