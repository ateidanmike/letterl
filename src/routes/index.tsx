import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { FileText, Sparkles, Upload, Download } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Letterly — Professional letterhead generator" },
      {
        name: "description",
        content:
          "Upload your logo, pick a template, and download polished PDF or Word letterheads in seconds.",
      },
    ],
  }),
});

function Index() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2 text-lg font-bold">
          <FileText className="h-6 w-6 text-primary" />
          Letterly
        </div>
        <div className="flex gap-2">
          {user ? (
            <Button asChild>
              <Link to="/dashboard">Open dashboard</Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link to="/login">Sign in</Link>
              </Button>
              <Button asChild>
                <Link to="/login">Get started</Link>
              </Button>
            </>
          )}
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-20">
        <h1 className="max-w-3xl text-5xl font-extrabold tracking-tight md:text-6xl">
          Professional letterheads,{" "}
          <span className="bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent">
            generated in seconds
          </span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          Upload your logo and details, pick a polished template, let AI clean up your text, and
          download a print-ready PDF or editable Word file.
        </p>
        <div className="mt-10 flex gap-3">
          <Button size="lg" asChild>
            <Link to={user ? "/dashboard" : "/login"}>
              Start creating <Sparkles className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="mt-20 grid gap-6 md:grid-cols-3">
          <Feature icon={<Upload />} title="Upload your brand">
            Drop in your logo and contact details once. Reuse them on every letter.
          </Feature>
          <Feature icon={<Sparkles />} title="AI clean-up">
            One click fixes grammar, spelling, and punctuation while keeping your tone.
          </Feature>
          <Feature icon={<Download />} title="PDF + Word">
            Export pixel-perfect PDFs for printing or editable .docx files for your team.
          </Feature>
        </div>
      </main>
    </div>
  );
}

function Feature({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border bg-card p-6">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{children}</p>
    </div>
  );
}
