import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import type { ErrorComponentProps } from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { AuthProvider } from "@/lib/auth-context";
import { ThemeProvider } from "@/lib/theme";
import { Toaster } from "@/components/ui/sonner";

const pageButton =
  "nb-btn inline-flex h-12 items-center justify-center px-6 text-base font-extrabold";

function NotFoundComponent() {
  return (
    <div className="ambient-bg flex min-h-screen items-center justify-center px-5 py-16">
      <div className="nb-box-lg w-full max-w-md -rotate-1 bg-card p-8 text-center">
        <h1 className="text-8xl font-extrabold leading-none tracking-[-0.04em]">
          4
          <span className="mx-1 inline-block rotate-12 bg-secondary px-2 text-secondary-foreground">
            0
          </span>
          4
        </h1>
        <h2 className="mt-5 text-2xl">Page not found</h2>
        <p className="landing-hand mt-2 text-2xl leading-tight">
          this page got lost in the filing cabinet.
        </p>
        <div className="mt-7">
          <Link to="/" className={`${pageButton} bg-primary text-primary-foreground`}>
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="ambient-bg flex min-h-screen items-center justify-center px-5 py-16">
      <div className="nb-box-lg w-full max-w-md bg-card p-8 text-center">
        <h1 className="text-3xl">This page didn't load</h1>
        <p className="mt-3 font-medium text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-4">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className={`${pageButton} bg-primary text-primary-foreground`}
          >
            Try again
          </button>
          <a href="/" className={`${pageButton} bg-card text-card-foreground`}>
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Zuridoc - Create polished documents in seconds" },
      {
        name: "description",
        content:
          "Create polished, branded business documents in seconds. AI-drafted letterheads, invoices, receipts, quotations, and delivery notes export-ready as PDF, Word, PNG, or JPG.",
      },
      { name: "author", content: "Zuridoc" },
      { name: "application-name", content: "Zuridoc" },
      { name: "category", content: "SaaS, Business Document Creation, AI Productivity Tool" },
      {
        name: "keywords",
        content:
          "Zuridoc, AI document creator, business documents, letterheads, invoices, receipts, quotations, delivery notes, PDF export, DOCX export",
      },
      { property: "og:title", content: "Zuridoc - Create polished documents in seconds" },
      {
        property: "og:description",
        content:
          "The modern documents creator for business correspondence. Create polished, branded business documents in seconds with AI writing assistance and multi-format export.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.zuridoc.com" },
      { property: "og:image", content: "https://www.zuridoc.com/icon.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@Zuridoc" },
      { name: "twitter:title", content: "Zuridoc - Create polished documents in seconds" },
      {
        name: "twitter:description",
        content:
          "AI-powered business document creation for letterheads, invoices, receipts, quotations, and delivery notes.",
      },
    ],
    links: [
      {
        rel: "canonical",
        href: "https://www.zuridoc.com",
      },
      {
        rel: "icon",
        href: "/favicon.ico",
        sizes: "any",
      },
      {
        rel: "icon",
        type: "image/svg+xml",
        href: "/favicon.svg",
      },
      {
        rel: "apple-touch-icon",
        href: "/apple-touch-icon.png",
      },
      {
        rel: "manifest",
        href: "/site.webmanifest",
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..800&family=Caveat:wght@600;700&display=swap",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Outlet />
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
