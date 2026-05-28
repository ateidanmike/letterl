import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2, FileText } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/ThemeToggle";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: Dashboard,
  head: () => ({ meta: [{ title: "My letterheads — Zuridoc" }] }),
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
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="flex items-center justify-between rounded-2xl glass px-5 py-4">
        <h1 className="text-2xl font-bold">My letterheads</h1>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button onClick={create}><Plus className="mr-2 h-4 w-4" /> New letterhead</Button>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search letterheads…"
          className="max-w-xs glass-subtle border-0"
        />
        {(["All", ...Array.from(new Set(rows.map((r) => r.folder).filter(Boolean)))]).map((f) => (
          <button
            key={f}
            onClick={() => setFolder(f)}
            className={`rounded-full px-3 py-1 text-xs transition ${folder === f ? "bg-primary text-primary-foreground" : "glass-subtle hover:glass"}`}
          >
            {f}
          </button>
        ))}
      </div>
      {loading ? (
        <p className="mt-8 text-muted-foreground">Loading…</p>
      ) : rows.length === 0 ? (
        <Card className="mt-8 glass border-0">
          <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
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
              <CardContent className="flex items-center justify-between gap-4 py-4">
                <Link to="/editor" search={{ id: r.id }} className="flex-1 text-left">
                  <div className="font-medium">{r.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {r.folder} · {r.template} · updated {new Date(r.updated_at).toLocaleString()}
                  </div>
                </Link>
                <Button variant="ghost" size="icon" onClick={() => remove(r.id)}>
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
