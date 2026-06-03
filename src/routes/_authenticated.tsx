import { createFileRoute, Outlet, useNavigate, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated")({
  component: AuthLayout,
});

function AuthLayout() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [user, loading, navigate]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        Loading…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      <header className="border-b bg-background">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="flex h-10 w-[150px] items-center justify-center rounded-xl bg-white px-3 py-1.5 shadow-sm">
              <img src="/logo to use.png" alt="Zuridoc" className="h-8 w-full object-contain object-center" />
            </Link>
            <nav className="flex gap-1">
              <NavLink to="/dashboard">Dashboard</NavLink>
              <NavLink to="/documents">Documents</NavLink>
              <NavLink to="/brand">Brand setup</NavLink>
              <button type="button" onClick={() => alert("Account settings and billing are available from the dashboard summary.")} className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground">Account</button>
            </nav>
          </div>
          <Button variant="ghost" size="sm" onClick={signOut}>
            Sign out
          </Button>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
      activeProps={{ className: "rounded-md px-3 py-1.5 text-sm font-medium bg-secondary text-foreground" }}
    >
      {children}
    </Link>
  );
}
