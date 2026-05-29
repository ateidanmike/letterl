import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FileText, LogIn, RefreshCw } from "lucide-react";
import type { EmailOtpType } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export const Route = createFileRoute("/auth/confirm")({
  component: ConfirmEmailPage,
  head: () => ({ meta: [{ title: "Confirm email - Zuridoc" }] }),
});

type ConfirmState = "checking" | "missing" | "failed";
type ConfirmDestination = "/" | "/dashboard" | "/login";

const emailOtpTypes = new Set<EmailOtpType>([
  "email",
  "signup",
  "invite",
  "magiclink",
  "recovery",
  "email_change",
]);

function ConfirmEmailPage() {
  const navigate = useNavigate();
  const [state, setState] = useState<ConfirmState>("checking");
  const [message, setMessage] = useState("Confirming your email...");

  useEffect(() => {
    let mounted = true;

    const confirmEmail = async () => {
      const searchParams = new URLSearchParams(window.location.search);
      const tokenHash = searchParams.get("token_hash");
      const type = getEmailOtpType(searchParams.get("type"));
      const next = getConfirmDestination(searchParams.get("next"));

      if (!tokenHash) {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          navigate({ to: next });
          return;
        }

        if (!mounted) return;
        setState("missing");
        setMessage("This confirmation link is missing its verification token.");
        return;
      }

      const { error } = await supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type,
      });

      if (!mounted) return;

      if (error) {
        setState("failed");
        setMessage(error.message);
        return;
      }

      if (type === "recovery") {
        toast.success("Recovery verified.");
        navigate({ to: "/login", search: { reset: "1" } });
        return;
      }

      toast.success("Email confirmed.");
      navigate({ to: next });
    };

    confirmEmail();

    return () => {
      mounted = false;
    };
  }, [navigate]);

  return (
    <div className="ambient-bg flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md glass-strong border-0">
        <CardHeader>
          <Link to="/" className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
            <FileText className="h-4 w-4" /> Zuridoc
          </Link>
          <CardTitle>{state === "checking" ? "Confirming email" : "Email confirmation"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">{message}</p>
          {state !== "checking" && (
            <div className="grid gap-2 sm:grid-cols-2">
              <Button asChild>
                <Link to="/login">
                  <LogIn className="h-4 w-4" />
                  Sign in
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/login">
                  <RefreshCw className="h-4 w-4" />
                  Try again
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function getEmailOtpType(type: string | null): EmailOtpType {
  return type && emailOtpTypes.has(type as EmailOtpType) ? (type as EmailOtpType) : "email";
}

function getConfirmDestination(next: string | null): ConfirmDestination {
  if (next === "/" || next === "/login" || next === "/dashboard") return next;
  return "/dashboard";
}
