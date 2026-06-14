import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Copy, Edit, FileText, Pencil, Plus, Trash2 } from "lucide-react";
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
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);

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

  const folders = useMemo(() => ["All", ...Array.from(new Set(rows.map((r) => r.folder).filter(Boolean)))], [rows]);
  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();
    return rows
      .filter((r) => folder === "All" || r.folder === folder)
      .filter((r) => !query || [r.title, r.template, r.folder].some((value) => value.toLowerCase().includes(query)));
  }, [folder, rows, search]);

  const create = async () => {
    const { data, error } = await supabase
      .from("letterheads")
      .insert({ user_id: user!.id, title: "Untitled letterhead" })
      .select("id").single();
    if (error) return toast.error(error.message);
    toast.success("Letterhead created");
    navigate({ to: "/editor", search: { id: data.id } });
  };

  const rename = async (row: Row) => {
    const title = window.prompt("Rename letterhead", row.title)?.trim();
    if (!title || title === row.title) return;
    setRenamingId(row.id);
    const { error } = await supabase.from("letterheads").update({ title }).eq("id", row.id);
    setRenamingId(null);
    if (error) return toast.error(error.message);
    setRows((current) => current.map((item) => item.id === row.id ? { ...item, title } : item));
    toast.success("Letterhead renamed");
  };

  const duplicate = async (row: Row) => {
    setDuplicatingId(row.id);
    const { data, error } = await supabase.from("letterheads").select("*").eq("id", row.id).single();
    if (error || !data) {
      setDuplicatingId(null);
      return toast.error(error?.message ?? "Could not duplicate letterhead");
    }
    const { id: _id, created_at: _createdAt, updated_at: _updatedAt, ...copy } = data;
    const { error: insertError } = await supabase.from("letterheads").insert({ ...copy, user_id: user!.id, title: `${data.title} copy` });
    setDuplicatingId(null);
    if (insertError) return toast.error(insertError.message);
    toast.success("Letterhead duplicated");
    await load();
  };

  const remove = async (row: Row) => {
    if (!window.confirm(`Delete "${row.title}"? This cannot be undone.`)) return;
    setDeletingId(row.id);
    const { error } = await supabase.from("letterheads").delete().eq("id", row.id);
    setDeletingId(null);
    if (error) return toast.error(error.message);
    setRows((current) => current.filter((item) => item.id !== row.id));
    toast.success("Letterhead deleted");
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
        <div className="sticky top-[73px] z-20 mt-4 flex flex-col gap-3 rounded-xl bg-background/90 py-2 backdrop-blur sm:static sm:flex-row sm:flex-wrap sm:items-center sm:bg-transparent sm:py-0 sm:backdrop-blur-none">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search letterheads..."
            className="w-full glass-subtle border-0 sm:max-w-xs"
          />
          <div className="flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible sm:pb-0">
            {folders.map((f) => (
              <button
                key={f}
                onClick={() => setFolder(f)}
                className={`min-h-9 shrink-0 rounded-full px-4 py-1 text-xs transition ${folder === f ? "bg-primary text-primary-foreground" : "glass-subtle hover:glass"}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        {loading ? (
          <p className="mt-8 text-muted-foreground">Loading...</p>
        ) : rows.length === 0 ? (
          <Card className="mt-8 glass border-0">
            <CardContent className="flex flex-col items-center gap-3 px-4 py-12 text-center sm:py-16">
              <FileText className="h-10 w-10 text-muted-foreground" />
              <p className="text-muted-foreground">No letterheads yet.</p>
              <Button onClick={create}><Plus className="h-4 w-4" /> Create your first one</Button>
            </CardContent>
          </Card>
        ) : filteredRows.length === 0 ? (
          <Card className="mt-8 glass border-0">
            <CardContent className="flex flex-col items-center gap-3 px-4 py-12 text-center sm:py-16">
              <FileText className="h-10 w-10 text-muted-foreground" />
              <p className="text-muted-foreground">No letterheads match this search.</p>
              <div className="grid w-full max-w-sm grid-cols-2 gap-2">
                <Button onClick={create}><Plus className="h-4 w-4" /> Create</Button>
                <Button variant="outline" onClick={() => { setSearch(""); setFolder("All"); }}>Clear filter</Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="mt-6 grid gap-3">
            {filteredRows.map((r) => (
              <Card key={r.id} className="glass border-0 transition hover:-translate-y-0.5">
                <CardContent className="grid gap-3 px-3 py-4 sm:px-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
                  <Link to="/editor" search={{ id: r.id }} className="min-w-0 text-left">
                    <div className="break-words font-medium">{r.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {r.folder} · {r.template} · updated {new Date(r.updated_at).toLocaleString()}
                    </div>
                  </Link>
                  <div className="grid w-full grid-cols-2 gap-2 sm:grid-cols-4 lg:w-auto lg:grid-cols-none lg:auto-cols-max lg:grid-flow-col">
                    <Button asChild variant="outline" size="sm" className="justify-center px-2 text-xs sm:text-sm">
                      <Link to="/editor" search={{ id: r.id }}><Edit className="h-4 w-4" /> Edit</Link>
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => rename(r)} disabled={renamingId === r.id} className="justify-center px-2 text-xs sm:text-sm">
                      <Pencil className="h-4 w-4" /> {renamingId === r.id ? "Saving" : "Rename"}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => duplicate(r)} disabled={duplicatingId === r.id} className="justify-center px-2 text-xs sm:text-sm">
                      <Copy className="h-4 w-4" /> {duplicatingId === r.id ? "Copying" : "Duplicate"}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => remove(r)} disabled={deletingId === r.id} className="justify-center px-2 text-xs sm:text-sm">
                      <Trash2 className="h-4 w-4 text-destructive" /> {deletingId === r.id ? "Deleting" : "Delete"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
