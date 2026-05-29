import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "sonner";
import { FileText, MailCheck, RotateCcw, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({ meta: [{ title: "Sign in — Zuridoc" }] }),
});

function LoginPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) navigate({ to: "/dashboard" });
  }, [user, navigate]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [pendingEmail, setPendingEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [loading, setLoading] = useState(false);

  const emailRedirectTo =
    typeof window !== "undefined" ? `${window.location.origin}/auth/confirm` : undefined;

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) toast.error(error.message);
    else navigate({ to: "/dashboard" });
  };

  const signUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo,
        data: { full_name: name },
      },
    });
    setLoading(false);
    if (error) toast.error(error.message);
    else {
      setPendingEmail(email);
      setVerificationCode("");
      toast.success("Check your email to confirm your account.");
    }
  };

  const verifyEmailToken = async () => {
    if (!pendingEmail) {
      toast.error("Create your account first.");
      return;
    }
    if (verificationCode.length < 6) {
      toast.error("Enter the 6-digit code from your email.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({
      email: pendingEmail,
      token: verificationCode,
      type: "email",
    });
    setLoading(false);

    if (error) toast.error(error.message);
    else {
      toast.success("Email confirmed.");
      navigate({ to: "/dashboard" });
    }
  };

  const resendVerificationToken = async () => {
    const resendEmail = pendingEmail || email;
    if (!resendEmail.trim()) {
      toast.error("Enter your email first.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: resendEmail,
      options: { emailRedirectTo },
    });
    setLoading(false);

    if (error) toast.error(error.message);
    else {
      setPendingEmail(resendEmail);
      setVerificationCode("");
      toast.success("Verification email sent.");
    }
  };

  const forgotPassword = async () => {
    if (!email.trim()) {
      toast.error("Enter your email first.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/login",
    });
    setLoading(false);
    if (error) toast.error(error.message);
    else toast.success("Password reset email sent.");
  };

  return (
    <div className="ambient-bg flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md glass-strong border-0">
        <CardHeader>
          <Link to="/" className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
            <FileText className="h-4 w-4" /> Zuridoc
          </Link>
          <CardTitle>Welcome</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign in</TabsTrigger>
              <TabsTrigger value="signup">Sign up</TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <form onSubmit={signIn} className="space-y-3 pt-3">
                <Field label="Email" value={email} onChange={setEmail} type="email" />
                <Field label="Password" value={password} onChange={setPassword} type="password" />
                <Button className="w-full" disabled={loading}>
                  Sign in
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={forgotPassword}
                  disabled={loading}
                >
                  Forgot password?
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="signup">
              <form onSubmit={signUp} className="space-y-3 pt-3">
                <Field label="Full name" value={name} onChange={setName} />
                <Field label="Email" value={email} onChange={setEmail} type="email" />
                <Field label="Password" value={password} onChange={setPassword} type="password" />
                <Button className="w-full" disabled={loading}>
                  Create account
                </Button>
                {pendingEmail && (
                  <div className="space-y-3 rounded-md border bg-background/60 p-3">
                    <div className="flex items-start gap-2 text-sm">
                      <MailCheck className="mt-0.5 h-4 w-4 text-primary" />
                      <div>
                        <p className="font-medium">Verification code sent</p>
                        <p className="text-muted-foreground">{pendingEmail}</p>
                      </div>
                    </div>
                    <InputOTP
                      maxLength={6}
                      value={verificationCode}
                      onChange={setVerificationCode}
                      disabled={loading}
                      containerClassName="justify-center"
                    >
                      <InputOTPGroup>
                        {Array.from({ length: 6 }).map((_, index) => (
                          <InputOTPSlot key={index} index={index} />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                    <div className="grid gap-2 sm:grid-cols-2">
                      <Button
                        type="button"
                        onClick={verifyEmailToken}
                        disabled={loading || verificationCode.length < 6}
                      >
                        <ShieldCheck className="h-4 w-4" />
                        Confirm
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={resendVerificationToken}
                        disabled={loading}
                      >
                        <RotateCcw className="h-4 w-4" />
                        Resend
                      </Button>
                    </div>
                  </div>
                )}
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div className="space-y-1">
      <Label>{label}</Label>
      <Input type={type} value={value} onChange={(e) => onChange(e.target.value)} required />
    </div>
  );
}
