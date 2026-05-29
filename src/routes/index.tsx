import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { FileText, Sparkles, Download, Wand2, Palette, Star, Users, Briefcase, Rocket, GraduationCap, Scale, HeartHandshake, Receipt, FileSpreadsheet, Truck } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { ThemeToggle } from "@/components/ThemeToggle";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Zuridoc - Create polished documents in seconds" },
      { name: "description", content: "Create polished, branded business documents in seconds. AI-drafted letterheads, invoices, receipts, quotations and delivery notes export-ready as PDF, Word, PNG or JPG." },
      { property: "og:title", content: "Zuridoc - Create polished documents in seconds" },
      { property: "og:description", content: "The modern documents creator for business correspondence. Brand documents with your logo and colors, draft with AI, and export to PDF, Word, PNG, or JPG." },
      { property: "og:url", content: "https://www.zuridoc.com" },
      { name: "twitter:title", content: "Zuridoc - Create polished documents in seconds" },
      { name: "twitter:description", content: "Create polished, branded business documents in seconds with AI drafting and multi-format export." },
    ],
  }),
});

function Index() {
  const { user } = useAuth();
  return (
    <div className="ambient-bg min-h-screen">
      <header className="sticky top-3 z-40 mx-auto mt-3 flex max-w-6xl items-center justify-between rounded-2xl px-6 py-3 glass">
        <div className="flex items-center gap-2 text-lg font-bold">
          <FileText className="h-6 w-6 text-primary" /> Zuridoc
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <Button asChild><Link to="/dashboard">Open dashboard</Link></Button>
          ) : (
            <>
              <Button variant="ghost" asChild><Link to="/login">Sign in</Link></Button>
              <Button asChild><Link to="/login">Get started</Link></Button>
            </>
          )}
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 pb-24 pt-12">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs text-muted-foreground glass">
          <Sparkles className="h-3 w-3 text-primary" /> The modern documents creator for business correspondence
        </div>
        <h1 className="max-w-3xl text-5xl font-extrabold tracking-tight md:text-6xl">
          Create polished documents{" "}
          <span className="bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent">in seconds</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          Letterheads, invoices, receipts, quotations and delivery notes — beautifully branded with
          your logo and colors. Drafted by AI, ready to send as PDF, Word, PNG or JPG.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Button size="lg" asChild>
            <Link to={user ? "/dashboard" : "/login"}>Start creating <Sparkles className="ml-2 h-4 w-4" /></Link>
          </Button>
          <Button size="lg" variant="outline" asChild><a href="#documents">See document types</a></Button>
        </div>

        <section id="documents" className="mt-20">
          <h2 className="text-3xl font-bold">Every document your business needs</h2>
          <p className="mt-2 text-muted-foreground">One workspace for letterheads, invoices, receipts, quotations and delivery notes.</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {[
              { icon: FileText, name: "Letters", desc: "AI-drafted letterheads with your brand." },
              { icon: Receipt, name: "Invoices", desc: "Bill clients with auto-calculated totals & tax." },
              { icon: FileSpreadsheet, name: "Quotations", desc: "Send price estimates that win deals." },
              { icon: Truck, name: "Delivery notes", desc: "Confirm shipments with itemised lists." },
            ].map((d) => (
              <div key={d.name} className="rounded-2xl p-5 glass transition hover:-translate-y-0.5">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <d.icon className="h-4 w-4" />
                </div>
                <h3 className="font-semibold">{d.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{d.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            Plus receipts to confirm payments — all under one roof.
          </div>
        </section>

        <div className="mt-20 grid gap-6 md:grid-cols-3">
          <Feature icon={<Wand2 />} title="AI writing assistant">Generate, rewrite, shorten, expand, simplify or translate content — with tones from formal to friendly.</Feature>
          <Feature icon={<Palette />} title="Branded templates">Eight polished templates auto-styled with your logo, colors, watermark and signature.</Feature>
          <Feature icon={<Download />} title="Export anywhere">Print-ready PDF, editable Word, or PNG/JPG image for email and chat.</Feature>
        </div>

        <section id="use-cases" className="mt-24">
          <h2 className="text-3xl font-bold">Built for every team that creates documents</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {[
              { name: "HR teams", icon: Users },
              { name: "Agencies", icon: Briefcase },
              { name: "Startups", icon: Rocket },
              { name: "Schools", icon: GraduationCap },
              { name: "Law firms", icon: Scale },
              { name: "NGOs", icon: HeartHandshake },
            ].map((u) => (
              <div key={u.name} className="flex items-center gap-3 rounded-xl p-4 glass">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <u.icon className="h-4 w-4" />
                </div>
                <p className="font-medium">{u.name}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-24">
          <h2 className="text-3xl font-bold">Trusted by professionals</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              { q: "Cuts our HR letter time from an hour to two minutes.", a: "Amina, People Lead" },
              { q: "Looks like we paid a designer. We didn't.", a: "Daniel, Founder" },
              { q: "Finally — letters that match our brand without Word fights.", a: "Priya, Ops Manager" },
            ].map((t, i) => (
              <div key={i} className="rounded-2xl p-5 glass">
                <div className="mb-2 flex gap-1 text-amber-500">
                  {Array.from({ length: 5 }).map((_, j) => <Star key={j} className="h-3 w-3 fill-current" />)}
                </div>
                <p className="text-sm">"{t.q}"</p>
                <p className="mt-3 text-xs text-muted-foreground">— {t.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-24">
          <h2 className="text-3xl font-bold">Frequently asked questions</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {[
              { q: "Does AI replace my writing?", a: "No — it drafts, polishes, or translates on demand. You stay in full control." },
              { q: "Is my data private?", a: "Letters and brand assets are scoped to your account. Logos are stored privately." },
              { q: "Can I export to Word?", a: "Yes — every letter exports to PDF, DOCX, PNG, or JPG." },
              { q: "Do I need design skills?", a: "Pick a template, drop in your logo, and Zuridoc handles the layout." },
            ].map((f) => (
              <div key={f.q} className="rounded-2xl p-5 glass">
                <p className="font-semibold">{f.q}</p>
                <p className="mt-1 text-sm text-muted-foreground">{f.a}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <footer className="border-t py-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Zuridoc · Crafted for teams that care about how they write.
      </footer>
    </div>
  );
}

function Feature({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl p-6 glass transition hover:-translate-y-0.5 hover:glass-strong">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">{icon}</div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{children}</p>
    </div>
  );
}
