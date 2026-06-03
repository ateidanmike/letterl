import { createFileRoute, Outlet, useNavigate, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { LogOut, Menu } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export const Route = createFileRoute("/_authenticated")({
  component: AuthLayout,
});

const navItems = [
  { to: "/dashboard", label: "Letterhead creator" },
  { to: "/documents", label: "Documents" },
  { to: "/brand", label: "Brand" },
];

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
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-4 lg:gap-6">
            <Link
              to="/dashboard"
              className="flex h-12 w-[170px] shrink-0 items-center justify-center rounded-xl bg-white px-4 py-2 shadow-sm sm:w-[190px]"
              aria-label="Zuridoc dashboard"
            >
              <img src="/logo to use.png" alt="Zuridoc" className="h-8 w-full object-contain object-center" />
            </Link>
            <nav className="hidden items-center gap-1 md:flex">
              {navItems.map((item) => (
                <NavLink key={item.to} to={item.to}>{item.label}</NavLink>
              ))}
            </nav>
          </div>

          <Button className="hidden md:inline-flex" variant="ghost" size="sm" onClick={signOut}>
            Sign out
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open navigation menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[86vw] max-w-xs p-5">
              <SheetHeader className="text-left">
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <SheetDescription className="sr-only">Zuridoc app navigation</SheetDescription>
                <Link
                  to="/dashboard"
                  className="flex h-12 w-[180px] items-center justify-center rounded-xl bg-white px-4 py-2 shadow-sm"
                  aria-label="Zuridoc dashboard"
                >
                  <img src="/logo to use.png" alt="Zuridoc" className="h-8 w-full object-contain object-center" />
                </Link>
              </SheetHeader>
              <nav className="mt-8 grid gap-2">
                {navItems.map((item) => (
                  <SheetClose asChild key={item.to}>
                    <NavLink to={item.to} className="w-full justify-start px-4 py-3 text-base">
                      {item.label}
                    </NavLink>
                  </SheetClose>
                ))}
              </nav>
              <Button variant="outline" className="mt-8 w-full justify-start" onClick={signOut}>
                <LogOut className="h-4 w-4" /> Sign out
              </Button>
            </SheetContent>
          </Sheet>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

function NavLink({ to, children, className = "" }: { to: string; children: React.ReactNode; className?: string }) {
  const baseClass = `inline-flex items-center rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-secondary hover:text-foreground ${className}`;
  const activeClass = `inline-flex items-center rounded-md bg-secondary px-3 py-2 text-sm font-medium text-foreground ${className}`;

  return (
    <Link to={to} className={baseClass} activeProps={{ className: activeClass }}>
      {children}
    </Link>
  );
}
