import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { FileText, Sparkles, Download, Wand2, Palette, Check, Star } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { ThemeToggle } from "@/components/ThemeToggle";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Letterly — AI-powered letterhead generator" },
      { name: "description", content: "Draft, brand and export professional business letters in seconds with AI." },
    ],
  }),
});

function Index() {
  const { user } = useAuth();
  return (
    <div className="ambient-bg min-h-screen">
      <header className="sticky top-3 z-40 mx-auto mt-3 flex max-w-6xl items-center justify-between rounded-2xl px-6 py-3 glass">
        <div className="flex items-center gap-2 text-lg font-bold">
          <FileText className="h-6 w-6 text-primary" /> Letterly
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
          <Sparkles className="h-3 w-3 text-primary" /> The modern AI workspace for business correspondence
        </div>
        <h1 className="max-w-3xl text-5xl font-extrabold tracking-tight md:text-6xl">
          Stunning business letters,{" "}
          <span className="bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent">written by AI in seconds</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          Drop in your logo, describe what you want to say, and Letterly drafts a polished letter on
          your branded letterhead — with tone control, signatures, and one-click PDF, Word, PNG or JPG export.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Button size="lg" asChild>
            <Link to={user ? "/dashboard" : "/login"}>Start creating <Sparkles className="ml-2 h-4 w-4" /></Link>
          </Button>
          <Button size="lg" variant="outline" asChild><a href="#use-cases">See use cases</a></Button>
        </div>

        <div className="mt-20 grid gap-6 md:grid-cols-3">
          <Feature icon={<Wand2 />} title="AI writing assistant">Generate, rewrite, shorten, expand, simplify or translate any letter — with tones from formal to friendly.</Feature>
          <Feature icon={<Palette />} title="Branded templates">Eight polished templates auto-styled with your logo, colors, watermark and signature.</Feature>
          <Feature icon={<Download />} title="Export anywhere">Print-ready PDF, editable Word, or PNG/JPG image for email and chat.</Feature>
        </div>

        <section id="use-cases" className="mt-24">
          <h2 className="text-3xl font-bold">Built for every team that writes letters</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {["HR teams", "Agencies", "Startups", "Schools", "Law firms", "NGOs"].map((u) => (
              <div key={u} className="rounded-xl p-4 glass">
                <Check className="mb-2 h-4 w-4 text-primary" />
                <p className="font-medium">{u}</p>
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
          <h2 className="text-3xl font-bold">Simple pricing</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              { name: "Free", price: "$0", items: ["3 letters / month", "All templates", "PDF export"] },
              { name: "Pro", price: "$9", items: ["Unlimited letters", "AI assistant", "PDF + DOCX + PNG", "Multiple brands"], featured: true },
              { name: "Team", price: "$29", items: ["Everything in Pro", "Shared brand kit", "Priority support"] },
            ].map((p) => (
              <div key={p.name} className={`rounded-2xl p-6 ${p.featured ? "glass-strong ring-2 ring-primary" : "glass"}`}>
                <p className="text-sm text-muted-foreground">{p.name}</p>
                <p className="mt-1 text-3xl font-bold">{p.price}<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
                <ul className="mt-4 space-y-2 text-sm">
                  {p.items.map((i) => <li key={i} className="flex items-center gap-2"><Check className="h-3 w-3 text-primary" /> {i}</li>)}
                </ul>
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
              { q: "Do I need design skills?", a: "Pick a template, drop in your logo, and Letterly handles the layout." },
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
        © {new Date().getFullYear()} Letterly · Crafted for teams that care about how they write.
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