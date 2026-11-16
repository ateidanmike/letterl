import { createFileRoute, Outlet, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
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
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const handleSignOut = () => {
    setMobileNavOpen(false);
    void signOut();
  };

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [user, loading, navigate]);

  if (loading || !user) {
    return (
      <div className="ambient-bg flex min-h-screen items-center justify-center">
        <p className="landing-hand animate-pulse text-4xl">fetching your paperwork…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b-[3px] border-[var(--nb-ink)] bg-background">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-4 lg:gap-6">
            <Link
              to="/dashboard"
              className="flex h-12 shrink-0 items-center border-2 border-[var(--nb-ink)] bg-white px-2 shadow-[3px_3px_0_0_var(--nb-ink)] transition-transform hover:-rotate-2"
              aria-label="Zuridoc dashboard"
            >
              <img src="/logo to use.png" alt="Zuridoc" className="h-11 w-auto object-contain" />
            </Link>
            <nav className="hidden items-center gap-2 md:flex">
              {navItems.map((item) => (
                <NavLink key={item.to} to={item.to}>
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>

          <Button
            className="hidden md:inline-flex"
            variant="outline"
            size="sm"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4" /> Sign out
          </Button>

          <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
            <SheetTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="md:hidden"
                aria-label="Open navigation menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[86vw] max-w-xs p-5">
              <SheetHeader className="text-left">
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <SheetDescription className="sr-only">Zuridoc app navigation</SheetDescription>
                <Link
                  to="/dashboard"
                  className="flex h-12 w-fit items-center border-2 border-[var(--nb-ink)] bg-white px-2 shadow-[3px_3px_0_0_var(--nb-ink)]"
                  aria-label="Zuridoc dashboard"
                >
                  <img
                    src="/logo to use.png"
                    alt="Zuridoc"
                    className="h-11 w-auto object-contain"
                  />
                </Link>
              </SheetHeader>
              <nav className="mt-8 grid gap-2">
                {navItems.map((item) => (
                  <SheetClose asChild key={item.to}>
                    <NavLink
                      to={item.to}
                      onClick={() => setMobileNavOpen(false)}
                      className="w-full justify-start px-4 py-3 text-base"
                    >
                      {item.label}
                    </NavLink>
                  </SheetClose>
                ))}
              </nav>
              <Button
                variant="outline"
                className="mt-8 w-full justify-start"
                onClick={handleSignOut}
              >
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

function NavLink({
  to,
  children,
  className = "",
  onClick,
}: {
  to: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const baseClass = `inline-flex items-center border-2 border-transparent px-3 py-1.5 text-sm font-bold transition-transform hover:-rotate-1 hover:border-[var(--nb-ink)] hover:bg-card ${className}`;
  const activeClass = `inline-flex -rotate-1 items-center border-2 border-[var(--nb-ink)] bg-secondary px-3 py-1.5 text-sm font-extrabold text-secondary-foreground shadow-[3px_3px_0_0_var(--nb-ink)] ${className}`;

  return (
    <Link to={to} className={baseClass} activeProps={{ className: activeClass }} onClick={onClick}>
      {children}
    </Link>
  );
}
