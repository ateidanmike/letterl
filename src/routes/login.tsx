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
import { Eye, EyeOff, MailCheck, RotateCcw, ShieldCheck } from "lucide-react";
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
type ViewState = "login" | "forgot-password" | "verify-otp" | "new-password";

const OTP_LENGTH = 5;

function LoginPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { reset } = Route.useSearch();

  const [authMode, setAuthMode] = useState<AuthMode>("signin");
  const [viewState, setViewState] = useState<ViewState>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [pendingEmail, setPendingEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [recoveryCode, setRecoveryCode] = useState("");
  const [recoveryPassword, setRecoveryPassword] = useState("");
  const [recoveryPasswordConfirm, setRecoveryPasswordConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const authRedirectTo = getAuthRedirectTo();

  useEffect(() => {
    if (reset === "1") {
      setAuthMode("signin");
      setViewState("new-password");
    }
  }, [reset]);

  useEffect(() => {
    if (user && viewState === "login" && reset !== "1") navigate({ to: "/dashboard" });
  }, [user, viewState, reset, navigate]);

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

  const goToLogin = () => {
    setViewState("login");
    setAuthMode("signin");
    setRecoveryCode("");
    setRecoveryPassword("");
    setRecoveryPasswordConfirm("");
  };

  const goToForgotPassword = () => {
    setAuthMode("signin");
    setViewState("forgot-password");
    setRecoveryEmail((current) => current || email);
    setRecoveryCode("");
    setRecoveryPassword("");
    setRecoveryPasswordConfirm("");
  };

  const goToSignUp = () => {
    setViewState("login");
    setAuthMode("signup");
  };

  const verifyEmailToken = async () => {
    if (!pendingEmail) {
      toast.error("Create your account first.");
      return;
    }
    if (verificationCode.length < OTP_LENGTH) {
      toast.error(`Enter the ${OTP_LENGTH}-digit code from your email.`);
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

  const requestPasswordReset = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const resetEmail = recoveryEmail.trim();
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
      setRecoveryEmail(resetEmail);
      setRecoveryCode("");
      setRecoveryPassword("");
      setRecoveryPasswordConfirm("");
      setViewState("verify-otp");
      toast.success("Password reset code sent.");
    }
  };

  const verifyRecoveryCode = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const resetEmail = recoveryEmail.trim();
    if (!resetEmail) {
      toast.error("Enter your email first.");
      return;
    }
    if (recoveryCode.length < OTP_LENGTH) {
      toast.error(`Enter the ${OTP_LENGTH}-digit reset code.`);
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({
      email: resetEmail,
      token: recoveryCode,
      type: "recovery",
    });
    setLoading(false);

    if (error) toast.error(error.message);
    else {
      setRecoveryPassword("");
      setRecoveryPasswordConfirm("");
      setViewState("new-password");
      toast.success("Code verified.");
    }
  };

  const confirmPasswordReset = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (recoveryPassword.length < 6) {
      toast.error("Enter a new password with at least 6 characters.");
      return;
    }
    if (recoveryPassword !== recoveryPasswordConfirm) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: recoveryPassword });

    if (error) toast.error(error.message);
    else {
      await supabase.auth.signOut();
      setRecoveryCode("");
      setRecoveryPassword("");
      setRecoveryPasswordConfirm("");
      setViewState("login");
      setAuthMode("signin");
      toast.success("Password updated. Sign in with your new password.");
      navigate({ to: "/login", search: {} });
    }

    setLoading(false);
  };

  const isSignUp = authMode === "signup" && viewState === "login";
  const isRecoveryView = viewState !== "login";
  const cardTitle = getCardTitle(viewState, isSignUp);
  const cardDescription = getCardDescription(viewState, isSignUp, recoveryEmail);
  const primaryButtonClassName =
    "h-12 w-full bg-slate-950 text-base text-white hover:bg-slate-800 disabled:bg-slate-300 disabled:text-slate-500 disabled:opacity-100";
  const textButtonClassName =
    "text-sm font-semibold text-slate-950 underline-offset-4 hover:underline";

  return (
    <div className="ambient-bg flex min-h-screen items-center justify-center px-4 py-6 sm:py-10">
      <Card className={`w-full ${isRecoveryView ? "max-w-xl" : "max-w-lg"} overflow-hidden border border-slate-200 bg-white text-slate-950 shadow-xl`}>
        <CardHeader className={`items-center text-center ${isRecoveryView ? "px-6 pb-5 pt-8 sm:px-12 sm:pt-9" : "pb-4"}`}>
          <Link to="/" className="mb-3 flex h-14 w-[210px] items-center justify-center rounded-2xl bg-white px-4 py-2 shadow-sm ring-1 ring-slate-100">
            <img src="/logo to use.png" alt="Zuridoc" className="h-11 w-full object-contain object-center" />
          </Link>
          <CardTitle className="text-2xl text-slate-950 sm:text-3xl">{cardTitle}</CardTitle>
          <p className="max-w-md text-base text-slate-500 sm:text-lg">{cardDescription}</p>
        </CardHeader>
        <CardContent className={`px-6 ${isRecoveryView ? "pb-8 sm:px-16 sm:pb-10" : "pb-0 sm:px-12"}`}>
          {viewState === "login" && (
            <div className="space-y-6">
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="h-12 w-full border-slate-200 bg-white text-base text-slate-950 hover:bg-slate-50"
                onClick={signInWithGoogle}
                disabled={loading}
              >
                <GoogleIcon />
                Continue with Google
              </Button>

              <div className="flex items-center gap-4 text-sm text-slate-500">
                <div className="h-px flex-1 bg-slate-200" />
                or
                <div className="h-px flex-1 bg-slate-200" />
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
                  <Button size="lg" className={primaryButtonClassName} disabled={loading}>
                    Continue
                  </Button>
                  {pendingEmail && (
                    <div className="space-y-3 rounded-md border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-start gap-2 text-sm">
                        <MailCheck className="mt-0.5 h-4 w-4 text-slate-950" />
                        <div>
                          <p className="font-medium">Verification code sent</p>
                          <p className="text-slate-500">{pendingEmail}</p>
                        </div>
                      </div>
                      <InputOTP
                        maxLength={OTP_LENGTH}
                        value={verificationCode}
                        onChange={setVerificationCode}
                        disabled={loading}
                        containerClassName="justify-center"
                      >
                        <InputOTPGroup>
                          {Array.from({ length: OTP_LENGTH }).map((_, index) => (
                            <InputOTPSlot key={index} index={index} />
                          ))}
                        </InputOTPGroup>
                      </InputOTP>
                      <div className="grid gap-2 sm:grid-cols-2">
                        <Button
                          type="button"
                          className="bg-slate-950 text-white hover:bg-slate-800 disabled:bg-slate-300 disabled:text-slate-500 disabled:opacity-100"
                          onClick={verifyEmailToken}
                          disabled={loading || verificationCode.length < OTP_LENGTH}
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
                <form onSubmit={signIn} className="space-y-5">
                  <Field
                    label="Email address"
                    value={email}
                    onChange={setEmail}
                    type="email"
                    placeholder="Enter your email address"
                  />
                  <div className="space-y-2">
                    <Field
                      label="Password"
                      value={password}
                      onChange={setPassword}
                      type="password"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      className={`${textButtonClassName} ml-auto block`}
                      onClick={goToForgotPassword}
                      disabled={loading}
                    >
                      Forgot password?
                    </button>
                  </div>
                  <Button size="lg" className={primaryButtonClassName} disabled={loading}>
                    Continue
                  </Button>
                </form>
              )}
            </div>
          )}

          {viewState === "forgot-password" && (
            <form onSubmit={requestPasswordReset} className="mx-auto w-full max-w-md space-y-6">
              <Field
                label="Email address"
                value={recoveryEmail}
                onChange={setRecoveryEmail}
                type="email"
                placeholder="Enter your email address"
              />
              <Button
                size="lg"
                className={primaryButtonClassName}
                disabled={loading || !recoveryEmail.trim()}
              >
                Send Code
              </Button>
              <button
                type="button"
                className={`${textButtonClassName} mx-auto block pt-1`}
                onClick={goToLogin}
              >
                Back to Login
              </button>
            </form>
          )}

          {viewState === "verify-otp" && (
            <form onSubmit={verifyRecoveryCode} className="mx-auto w-full max-w-md space-y-6">
              <InputOTP
                maxLength={OTP_LENGTH}
                value={recoveryCode}
                onChange={setRecoveryCode}
                disabled={loading}
                containerClassName="justify-center"
              >
                <InputOTPGroup>
                  {Array.from({ length: OTP_LENGTH }).map((_, index) => (
                    <InputOTPSlot key={index} index={index} />
                  ))}
                </InputOTPGroup>
              </InputOTP>
              <Button
                size="lg"
                className={primaryButtonClassName}
                disabled={loading || recoveryCode.length < OTP_LENGTH}
              >
                Verify
              </Button>
              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
                <button
                  type="button"
                  className={textButtonClassName}
                  onClick={() => requestPasswordReset()}
                  disabled={loading || !recoveryEmail.trim()}
                >
                  Resend Code
                </button>
                <button type="button" className={textButtonClassName} onClick={goToLogin}>
                  Back to Login
                </button>
              </div>
            </form>
          )}

          {viewState === "new-password" && (
            <form onSubmit={confirmPasswordReset} className="mx-auto w-full max-w-md space-y-6">
              <Field
                label="Create a new password"
                value={recoveryPassword}
                onChange={setRecoveryPassword}
                type="password"
                placeholder="Create a new password"
              />
              <Field
                label="Confirm new password"
                value={recoveryPasswordConfirm}
                onChange={setRecoveryPasswordConfirm}
                type="password"
                placeholder="Confirm your new password"
              />
              <Button
                size="lg"
                className={primaryButtonClassName}
                disabled={
                  loading ||
                  recoveryPassword.length < 6 ||
                  recoveryPassword !== recoveryPasswordConfirm
                }
              >
                Update Password
              </Button>
              <button
                type="button"
                className={`${textButtonClassName} mx-auto block pt-1`}
                onClick={goToLogin}
              >
                Back to Login
              </button>
            </form>
          )}
        </CardContent>
        {viewState === "login" && (
          <div className="mt-8 border-t border-slate-200 bg-slate-50 px-6 py-5 text-center text-sm sm:px-12">
            {isSignUp ? "Already have an account? " : "Don't have an account? "}
            <button
              type="button"
              className="font-semibold text-slate-950 underline-offset-4 hover:underline"
              onClick={isSignUp ? goToLogin : goToSignUp}
            >
              {isSignUp ? "Sign in" : "Sign up"}
            </button>
          </div>
        )}
      </Card>
    </div>
  );
}

function getCardTitle(viewState: ViewState, isSignUp: boolean) {
  if (viewState === "forgot-password") return "Reset Password";
  if (viewState === "verify-otp") return "Enter Verification Code";
  if (viewState === "new-password") return "Create a new password";
  return isSignUp ? "Create your Zuridoc account" : "Sign in to Zuridoc";
}

function getCardDescription(viewState: ViewState, isSignUp: boolean, recoveryEmail: string) {
  if (viewState === "forgot-password") return "Enter your email and we will send a reset code.";
  if (viewState === "verify-otp") {
    return recoveryEmail
      ? `We sent a ${OTP_LENGTH}-digit code to ${recoveryEmail}.`
      : `Enter the ${OTP_LENGTH}-digit code sent to your email.`;
  }
  if (viewState === "new-password") return "Choose a strong password to finish resetting access.";
  return isSignUp
    ? "Create polished documents in seconds."
    : "Welcome back. Please sign in to continue.";
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
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <div className="space-y-1">
      <Label className="text-slate-950">{label}</Label>
      <div className="relative">
        <Input
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          placeholder={placeholder}
          className={isPassword ? "bg-white pr-11" : "bg-white"}
        />
        {isPassword && (
          <button
            type="button"
            className="absolute right-2 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950"
            onClick={() => setShowPassword((current) => !current)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            title={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
    </div>
  );
}
