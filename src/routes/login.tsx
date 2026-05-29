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
import { FileText, KeyRound, MailCheck, RotateCcw, ShieldCheck } from "lucide-react";
import { z } from "zod";

const searchSchema = z.object({
  reset: z
    .union([z.string(), z.number()])
    .optional()
    .transform((value) => value?.toString()),
});

export const Route = createFileRoute("/login")({
  validateSearch: searchSchema,
  component: LoginPage,
  head: () => ({ meta: [{ title: "Sign in - Letterly" }] }),
});

function LoginPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { reset } = Route.useSearch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [pendingEmail, setPendingEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [showRecovery, setShowRecovery] = useState(reset === "1");
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [recoveryCode, setRecoveryCode] = useState("");
  const [recoveryPassword, setRecoveryPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const authRedirectTo =
    typeof window !== "undefined" ? `${window.location.origin}/auth/confirm` : undefined;
  const canResetFromSession = reset === "1" && !!user;

  useEffect(() => {
    if (reset === "1") setShowRecovery(true);
  }, [reset]);

  useEffect(() => {
    if (user && !showRecovery) navigate({ to: "/dashboard" });
  }, [user, showRecovery, navigate]);

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
        emailRedirectTo: authRedirectTo,
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
      options: { emailRedirectTo: authRedirectTo },
    });
    setLoading(false);

    if (error) toast.error(error.message);
    else {
      setPendingEmail(resendEmail);
      setVerificationCode("");
      toast.success("Verification email sent.");
    }
  };

  const requestPasswordReset = async () => {
    const resetEmail = (recoveryEmail || email).trim();
    if (!resetEmail) {
      toast.error("Enter your email first.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: authRedirectTo,
    });
    setLoading(false);

    if (error) toast.error(error.message);
    else {
      setShowRecovery(true);
      setRecoveryEmail(resetEmail);
      setRecoveryCode("");
      setRecoveryPassword("");
      toast.success("Password reset code sent.");
    }
  };

  const confirmPasswordReset = async () => {
    const resetEmail = (recoveryEmail || email).trim();
    if (!canResetFromSession && !resetEmail) {
      toast.error("Enter your email first.");
      return;
    }
    if (!canResetFromSession && recoveryCode.length < 6) {
      toast.error("Enter the 6-digit reset code.");
      return;
    }
    if (recoveryPassword.length < 6) {
      toast.error("Enter a new password with at least 6 characters.");
      return;
    }

    setLoading(true);

    if (!canResetFromSession) {
      const { error } = await supabase.auth.verifyOtp({
        email: resetEmail,
        token: recoveryCode,
        type: "recovery",
      });

      if (error) {
        setLoading(false);
        toast.error(error.message);
        return;
      }
    }

    const { error } = await supabase.auth.updateUser({ password: recoveryPassword });
    setLoading(false);

    if (error) toast.error(error.message);
    else {
      setRecoveryCode("");
      setRecoveryPassword("");
      setShowRecovery(false);
      toast.success("Password updated.");
      navigate({ to: "/dashboard" });
    }
  };

  return (
    <div className="ambient-bg flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md glass-strong border-0">
        <CardHeader>
          <Link to="/" className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
            <FileText className="h-4 w-4" /> Letterly
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
              <div className="space-y-3 pt-3">
                <form onSubmit={signIn} className="space-y-3">
                  <Field label="Email" value={email} onChange={setEmail} type="email" />
                  <Field label="Password" value={password} onChange={setPassword} type="password" />
                  <Button className="w-full" disabled={loading}>
                    Sign in
                  </Button>
                </form>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={requestPasswordReset}
                  disabled={loading}
                >
                  Forgot password?
                </Button>
                {showRecovery && (
                  <div className="space-y-3 rounded-md border bg-background/60 p-3">
                    <div className="flex items-start gap-2 text-sm">
                      <KeyRound className="mt-0.5 h-4 w-4 text-primary" />
                      <div>
                        <p className="font-medium">Reset password</p>
                        <p className="text-muted-foreground">
                          {recoveryEmail || email || "Email verification"}
                        </p>
                      </div>
                    </div>
                    <Field
                      label="Reset email"
                      value={recoveryEmail}
                      onChange={setRecoveryEmail}
                      type="email"
                      required={false}
                    />
                    <InputOTP
                      maxLength={6}
                      value={recoveryCode}
                      onChange={setRecoveryCode}
                      disabled={loading || canResetFromSession}
                      containerClassName="justify-center"
                    >
                      <InputOTPGroup>
                        {Array.from({ length: 6 }).map((_, index) => (
                          <InputOTPSlot key={index} index={index} />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                    <Field
                      label="New password"
                      value={recoveryPassword}
                      onChange={setRecoveryPassword}
                      type="password"
                      required={false}
                    />
                    <div className="grid gap-2 sm:grid-cols-2">
                      <Button
                        type="button"
                        onClick={confirmPasswordReset}
                        disabled={
                          loading ||
                          recoveryPassword.length < 6 ||
                          (!canResetFromSession && recoveryCode.length < 6)
                        }
                      >
                        <ShieldCheck className="h-4 w-4" />
                        Update
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={requestPasswordReset}
                        disabled={loading}
                      >
                        <RotateCcw className="h-4 w-4" />
                        Resend
                      </Button>
                    </div>
                  </div>
                )}
              </div>
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
  required = true,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-1">
      <Label>{label}</Label>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
      />
    </div>
  );
}
