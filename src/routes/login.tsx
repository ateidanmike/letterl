import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  head: () => ({ meta: [{ title: "Sign in - Zuridoc" }] }),
});

type AuthMode = "signin" | "signup";

function LoginPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { reset } = Route.useSearch();

  const [authMode, setAuthMode] = useState<AuthMode>("signin");
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

  const authRedirectTo = getAuthRedirectTo();
  const canResetFromSession = reset === "1" && !!user;

  useEffect(() => {
    if (reset === "1") {
      setAuthMode("signin");
      setShowRecovery(true);
    }
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

  const signInWithGoogle = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: authRedirectTo,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    setLoading(false);
    if (error) toast.error(error.message);
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

  const isSignUp = authMode === "signup";

  return (
    <div className="ambient-bg flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-lg overflow-hidden glass-strong border-0">
        <CardHeader className="items-center pb-4 text-center">
          <Link to="/" className="mb-1 flex items-center gap-2 text-3xl font-bold text-foreground">
            <FileText className="h-8 w-8" />
            Zuridoc
          </Link>
          <CardTitle className="text-2xl">
            {isSignUp ? "Create your Zuridoc account" : "Sign in to Zuridoc"}
          </CardTitle>
          <p className="text-base text-muted-foreground">
            {isSignUp
              ? "Create polished documents in seconds."
              : "Welcome back. Please sign in to continue."}
          </p>
        </CardHeader>
        <CardContent className="px-6 pb-0 sm:px-12">
          <div className="space-y-6">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="h-12 w-full text-base"
              onClick={signInWithGoogle}
              disabled={loading}
            >
              <GoogleIcon />
              Continue with Google
            </Button>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="h-px flex-1 bg-border" />
              or
              <div className="h-px flex-1 bg-border" />
            </div>

            {isSignUp ? (
              <form onSubmit={signUp} className="space-y-5">
                <Field
                  label="Full name"
                  value={name}
                  onChange={setName}
                  placeholder="Enter your full name"
                />
                <Field
                  label="Email address"
                  value={email}
                  onChange={setEmail}
                  type="email"
                  placeholder="Enter your email address"
                />
                <Field
                  label="Password"
                  value={password}
                  onChange={setPassword}
                  type="password"
                  placeholder="Create a password"
                />
                <Button size="lg" className="h-12 w-full text-base" disabled={loading}>
                  Continue
                </Button>
                {pendingEmail && (
                  <div className="space-y-3 rounded-md border bg-background/60 p-4">
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
            ) : (
              <div className="space-y-4">
                <form onSubmit={signIn} className="space-y-5">
                  <Field
                    label="Email address"
                    value={email}
                    onChange={setEmail}
                    type="email"
                    placeholder="Enter your email address"
                  />
                  <Field
                    label="Password"
                    value={password}
                    onChange={setPassword}
                    type="password"
                    placeholder="Enter your password"
                  />
                  <Button size="lg" className="h-12 w-full text-base" disabled={loading}>
                    Continue
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
                  <div className="space-y-3 rounded-md border bg-background/60 p-4">
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
                      placeholder="Enter your reset email"
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
                      placeholder="Create a new password"
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
            )}
          </div>
        </CardContent>
        <div className="mt-8 border-t bg-background/40 px-6 py-5 text-center text-sm sm:px-12">
          {isSignUp ? "Already have an account? " : "Don't have an account? "}
          <button
            type="button"
            className="font-semibold text-primary hover:underline"
            onClick={() => setAuthMode(isSignUp ? "signin" : "signup")}
          >
            {isSignUp ? "Sign in" : "Sign up"}
          </button>
        </div>
      </Card>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06L5.84 9.9C6.71 7.3 9.14 5.38 12 5.38z"
      />
    </svg>
  );
}

function getAuthRedirectTo() {
  const configuredSiteUrl =
    import.meta.env.VITE_APP_URL ||
    import.meta.env.VITE_SITE_URL ||
    import.meta.env.VITE_PUBLIC_SITE_URL;
  const origin =
    configuredSiteUrl?.replace(/\/$/, "") ||
    (typeof window !== "undefined" ? window.location.origin : undefined);

  return origin ? `${origin}/auth/confirm` : undefined;
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = true,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1">
      <Label>{label}</Label>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
      />
    </div>
  );
}
