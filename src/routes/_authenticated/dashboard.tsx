import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Edit, Plus, Trash2, FileText } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/ThemeToggle";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: Dashboard,
  head: () => ({ meta: [{ title: "Letterhead creator - Zuridoc" }] }),
});

type Row = { id: string; title: string; template: string; updated_at: string; folder: string };

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [folder, setFolder] = useState<string>("All");

  const load = async () => {
    const { data, error } = await supabase
      .from("letterheads")
      .select("id,title,template,updated_at,folder")
      .order("updated_at", { ascending: false });
    if (error) toast.error(error.message);
    else setRows((data as Row[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { if (user) load(); }, [user]);

  const create = async () => {
    const { data, error } = await supabase
      .from("letterheads")
      .insert({ user_id: user!.id, title: "Untitled letterhead" })
      .select("id").single();
    if (error) return toast.error(error.message);
    navigate({ to: "/editor", search: { id: data.id } });
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("letterheads").delete().eq("id", id);
    if (error) toast.error(error.message);
    else setRows((r) => r.filter((x) => x.id !== id));
  };

  return (
    <div className="ambient-bg min-h-screen">
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-10">
      <div className="flex flex-col gap-4 rounded-2xl glass px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <h1 className="text-2xl font-bold leading-tight sm:text-3xl">Letterhead creator</h1>
        <div className="flex w-full items-center gap-2 sm:w-auto">
          <ThemeToggle />
          <Button onClick={create} className="flex-1 sm:flex-none"><Plus className="mr-2 h-4 w-4" /> New letterhead</Button>
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search letterheads…"
          className="w-full glass-subtle border-0 sm:max-w-xs"
        />
        {(["All", ...Array.from(new Set(rows.map((r) => r.folder).filter(Boolean)))]).map((f) => (
          <button
            key={f}
            onClick={() => setFolder(f)}
            className={`min-h-9 rounded-full px-3 py-1 text-xs transition ${folder === f ? "bg-primary text-primary-foreground" : "glass-subtle hover:glass"}`}
          >
            {f}
          </button>
        ))}
      </div>
      {loading ? (
        <p className="mt-8 text-muted-foreground">Loading…</p>
      ) : rows.length === 0 ? (
        <Card className="mt-8 glass border-0">
          <CardContent className="flex flex-col items-center gap-3 px-4 py-12 text-center sm:py-16">
            <FileText className="h-10 w-10 text-muted-foreground" />
            <p className="text-muted-foreground">No letterheads yet.</p>
            <Button onClick={create}>Create your first one</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="mt-6 grid gap-3">
          {rows
            .filter((r) => folder === "All" || r.folder === folder)
            .filter((r) => r.title.toLowerCase().includes(search.toLowerCase()))
            .map((r) => (
            <Card key={r.id} className="glass border-0 transition hover:-translate-y-0.5">
              <CardContent className="flex flex-col items-start gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                <Link to="/editor" search={{ id: r.id }} className="min-w-0 flex-1 text-left">
                  <div className="font-medium">{r.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {r.folder} · {r.template} · updated {new Date(r.updated_at).toLocaleString()}
                  </div>
                </Link>
                <Button variant="ghost" size="icon" className="self-end sm:self-center" onClick={() => remove(r.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
    </div>
  );
}

