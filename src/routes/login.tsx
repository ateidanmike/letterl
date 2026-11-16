import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useId, useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { requestWelcomeEmail } from "@/lib/welcome-email";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { toast } from "sonner";
import { ArrowRight, Eye, EyeOff, MailCheck, RotateCcw, ShieldCheck } from "lucide-react";
import { GooglyEye } from "@/components/GooglyEye";
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
  head: () => ({
    meta: [{ title: "Sign in - Zuridoc" }],
  }),
});

type AuthMode = "signin" | "signup";
type ViewState = "login" | "forgot-password" | "verify-otp" | "new-password";

const OTP_LENGTH = 6;

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
  const [eyesShut, setEyesShut] = useState(false);
  const [resendingRecoveryCode, setResendingRecoveryCode] = useState(false);

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
      requestWelcomeEmail();
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

  const sendRecoveryCodeEmail = async (resetEmail: string, resend = false) => {
    if (!resetEmail) {
      toast.error("Enter your email first.");
      return;
    }

    if (resend) setResendingRecoveryCode(true);
    else setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: authRedirectTo,
    });

    if (resend) setResendingRecoveryCode(false);
    else setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    setRecoveryEmail(resetEmail);
    setRecoveryCode("");
    setRecoveryPassword("");
    setRecoveryPasswordConfirm("");
    setViewState("verify-otp");
    toast.success(resend ? "New reset code sent to your email." : "Password reset code sent.");
  };

  const requestPasswordReset = async (e?: React.FormEvent) => {
    e?.preventDefault();
    await sendRecoveryCodeEmail(recoveryEmail.trim());
  };

  const resendRecoveryCode = async () => {
    await sendRecoveryCodeEmail(recoveryEmail.trim(), true);
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

    if (error) {
      setRecoveryCode("");
      toast.error(getRecoveryCodeErrorMessage(error.message));
      return;
    }

    setRecoveryPassword("");
    setRecoveryPasswordConfirm("");
    setViewState("new-password");
    toast.success("Code verified.");
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
  const cardTitle = getCardTitle(viewState, isSignUp);
  const cardDescription = getCardDescription(viewState, isSignUp, recoveryEmail);
  const sticker = getSticker(viewState, isSignUp);
  const primaryButtonClassName =
    "nb-btn inline-flex h-14 w-full items-center justify-center gap-2 bg-[#0067EC] text-lg font-extrabold text-white";
  const secondaryButtonClassName =
    "nb-btn inline-flex h-12 w-full items-center justify-center gap-2 bg-white text-base font-extrabold";
  const textButtonClassName =
    "nb-focus text-[15px] font-extrabold underline decoration-[3px] underline-offset-4 hover:decoration-[#FF7AA2] disabled:opacity-50";
  const otpSlotClassName =
    "h-12 w-10 rounded-none border-[3px] border-[#011B43] bg-white text-xl font-extrabold first:rounded-none first:border-l-[3px] last:rounded-none sm:h-14 sm:w-12";

  // The mascot covers its eyes while a password field has focus.
  const watchSecretFocus = (event: React.FocusEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (target.dataset.secret === "true") setEyesShut(event.type === "focus");
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="landing nb-dots flex min-h-screen flex-col overflow-x-clip bg-[#FFF7E3] text-[#011B43]">
        <header className="border-b-[3px] border-[#011B43] bg-[#FFF7E3]">
          <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-5 sm:px-8">
            <Link to="/" className="nb-focus flex items-center" aria-label="Zuridoc home">
              <img src="/logo to use.png" alt="Zuridoc" className="h-14 w-auto object-contain" />
            </Link>
            <Link
              to="/"
              className="nb-focus text-[15px] font-extrabold underline decoration-[3px] underline-offset-4 hover:decoration-[#FF7AA2]"
            >
              ← Back home
            </Link>
          </div>
        </header>

        <main className="flex flex-1 items-center justify-center px-5 pb-16 pt-24 sm:px-8">
          <motion.div
            initial={{ y: 30, rotate: -2 }}
            animate={{ y: 0, rotate: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 14 }}
            className="relative w-full max-w-lg"
            onFocus={watchSecretFocus}
            onBlur={watchSecretFocus}
          >
            {/* peeking mascot */}
            <div aria-hidden className="absolute -top-[52px] left-8 flex gap-1.5">
              <GooglyEye size={54} closed={eyesShut} />
              <GooglyEye size={54} closed={eyesShut} />
            </div>
            <p
              aria-hidden
              className="landing-hand absolute -top-12 left-[9.5rem] -rotate-3 text-2xl sm:text-3xl"
            >
              {eyesShut ? "not looking!" : "oh, hello."}
            </p>
            <svg
              viewBox="0 0 60 60"
              aria-hidden
              className="nb-spin absolute -right-5 -top-7 z-10 h-14 w-14 sm:-right-7"
            >
              <path
                d="M30 3c2 14 6 20 26 26-19 4-24 11-26 28-3-17-8-23-27-27C22 25 27 18 30 3z"
                fill="#FF7AA2"
                stroke="#011B43"
                strokeWidth="3"
                strokeLinejoin="round"
              />
            </svg>

            <div className="nb-box-lg relative bg-white">
              <div className="px-6 pb-8 pt-9 sm:px-10">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={`${viewState}-${isSignUp}`}
                    initial={{ x: 24, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -24, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    <span
                      style={{ backgroundColor: sticker.color }}
                      className="nb-scribble nb-wiggle inline-block -rotate-2 border-[3px] border-[#011B43] px-4 py-1 text-sm font-extrabold uppercase tracking-[0.12em]"
                    >
                      {sticker.text}
                    </span>
                    <h1 className="mt-4 text-4xl font-extrabold leading-[1] tracking-[-0.03em] sm:text-5xl">
                      {cardTitle}
                    </h1>
                    <p className="mt-3 text-lg font-medium leading-7">{cardDescription}</p>

                    <div className="mt-8">
                      {viewState === "login" &&
                        (isSignUp ? (
                          <form onSubmit={signUp} className="space-y-5">
                            <Field
                              label="Full name"
                              value={name}
                              onChange={setName}
                              placeholder="Enter your full name"
                              autoComplete="name"
                            />
                            <Field
                              label="Email address"
                              value={email}
                              onChange={setEmail}
                              type="email"
                              placeholder="Enter your email address"
                              autoComplete="email"
                            />
                            <Field
                              label="Password"
                              value={password}
                              onChange={setPassword}
                              type="password"
                              placeholder="Create a password"
                              autoComplete="new-password"
                            />
                            <button className={primaryButtonClassName} disabled={loading}>
                              Create account
                              <ArrowRight className="h-5 w-5" strokeWidth={3} />
                            </button>
                            {pendingEmail && (
                              <div className="space-y-4 border-[3px] border-[#011B43] bg-[#6EE7B7] p-4">
                                <div className="flex items-start gap-2.5">
                                  <MailCheck className="mt-0.5 h-5 w-5" strokeWidth={2.5} />
                                  <div>
                                    <p className="font-extrabold">Verification code sent</p>
                                    <p className="break-all font-medium">{pendingEmail}</p>
                                  </div>
                                </div>
                                <InputOTP
                                  maxLength={OTP_LENGTH}
                                  pattern={REGEXP_ONLY_DIGITS}
                                  value={verificationCode}
                                  onChange={setVerificationCode}
                                  disabled={loading}
                                  containerClassName="justify-center"
                                >
                                  <InputOTPGroup className="gap-1.5">
                                    {Array.from({ length: OTP_LENGTH }).map((_, index) => (
                                      <InputOTPSlot
                                        key={index}
                                        index={index}
                                        className={otpSlotClassName}
                                      />
                                    ))}
                                  </InputOTPGroup>
                                </InputOTP>
                                <div className="grid gap-4 sm:grid-cols-2">
                                  <button
                                    type="button"
                                    className="nb-btn inline-flex h-12 w-full items-center justify-center gap-2 bg-[#0067EC] text-base font-extrabold text-white"
                                    onClick={verifyEmailToken}
                                    disabled={loading || verificationCode.length < OTP_LENGTH}
                                  >
                                    <ShieldCheck className="h-4 w-4" strokeWidth={2.5} />
                                    Confirm
                                  </button>
                                  <button
                                    type="button"
                                    className={secondaryButtonClassName}
                                    onClick={resendVerificationToken}
                                    disabled={loading}
                                  >
                                    <RotateCcw className="h-4 w-4" strokeWidth={2.5} />
                                    Resend
                                  </button>
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
                              autoComplete="email"
                            />
                            <div className="space-y-3">
                              <Field
                                label="Password"
                                value={password}
                                onChange={setPassword}
                                type="password"
                                placeholder="Enter your password"
                                autoComplete="current-password"
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
                            <button className={primaryButtonClassName} disabled={loading}>
                              {loading ? "Signing in…" : "Sign in"}
                              <ArrowRight className="h-5 w-5" strokeWidth={3} />
                            </button>
                          </form>
                        ))}

                      {viewState === "forgot-password" && (
                        <form onSubmit={requestPasswordReset} className="space-y-6">
                          <Field
                            label="Email address"
                            value={recoveryEmail}
                            onChange={setRecoveryEmail}
                            type="email"
                            placeholder="Enter your email address"
                            autoComplete="email"
                          />
                          <button
                            className={primaryButtonClassName}
                            disabled={loading || !recoveryEmail.trim()}
                          >
                            Send code
                          </button>
                          <button
                            type="button"
                            className={`${textButtonClassName} mx-auto block`}
                            onClick={goToLogin}
                          >
                            Back to sign in
                          </button>
                        </form>
                      )}

                      {viewState === "verify-otp" && (
                        <form onSubmit={verifyRecoveryCode} className="space-y-6">
                          <InputOTP
                            maxLength={OTP_LENGTH}
                            pattern={REGEXP_ONLY_DIGITS}
                            value={recoveryCode}
                            onChange={setRecoveryCode}
                            disabled={loading}
                            containerClassName="justify-center"
                          >
                            <InputOTPGroup className="gap-1.5">
                              {Array.from({ length: OTP_LENGTH }).map((_, index) => (
                                <InputOTPSlot
                                  key={index}
                                  index={index}
                                  className={otpSlotClassName}
                                />
                              ))}
                            </InputOTPGroup>
                          </InputOTP>
                          <p className="border-[3px] border-dashed border-[#011B43]/40 p-3 text-sm font-medium leading-6">
                            Use the newest reset email. If you clicked the email reset link, the
                            code is already used and you can create a new password there.
                          </p>
                          <button
                            className={primaryButtonClassName}
                            disabled={loading || recoveryCode.length < OTP_LENGTH}
                          >
                            Verify
                          </button>
                          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
                            <button
                              type="button"
                              className={textButtonClassName}
                              onClick={resendRecoveryCode}
                              disabled={loading || resendingRecoveryCode || !recoveryEmail.trim()}
                            >
                              {resendingRecoveryCode ? "Sending..." : "Resend code"}
                            </button>
                            <button
                              type="button"
                              className={textButtonClassName}
                              onClick={goToLogin}
                            >
                              Back to sign in
                            </button>
                          </div>
                        </form>
                      )}

                      {viewState === "new-password" && (
                        <form onSubmit={confirmPasswordReset} className="space-y-6">
                          <Field
                            label="Create a new password"
                            value={recoveryPassword}
                            onChange={setRecoveryPassword}
                            type="password"
                            placeholder="Create a new password"
                            autoComplete="new-password"
                          />
                          <Field
                            label="Confirm new password"
                            value={recoveryPasswordConfirm}
                            onChange={setRecoveryPasswordConfirm}
                            type="password"
                            placeholder="Confirm your new password"
                            autoComplete="new-password"
                          />
                          <button
                            className={primaryButtonClassName}
                            disabled={
                              loading ||
                              recoveryPassword.length < 6 ||
                              recoveryPassword !== recoveryPasswordConfirm
                            }
                          >
                            Update password
                          </button>
                          <button
                            type="button"
                            className={`${textButtonClassName} mx-auto block`}
                            onClick={goToLogin}
                          >
                            Back to sign in
                          </button>
                        </form>
                      )}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {viewState === "login" && (
                <div className="border-t-[3px] border-[#011B43] bg-[#FFD43B] px-6 py-4 text-center text-base font-bold sm:px-10">
                  {isSignUp ? "Already have an account? " : "Don't have an account? "}
                  <button
                    type="button"
                    className="nb-focus font-extrabold underline decoration-[3px] underline-offset-4 hover:decoration-white"
                    onClick={isSignUp ? goToLogin : goToSignUp}
                  >
                    {isSignUp ? "Sign in" : "Sign up"}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </main>
      </div>
    </MotionConfig>
  );
}

function getSticker(viewState: ViewState, isSignUp: boolean) {
  if (viewState === "forgot-password") return { text: "It happens", color: "#FF7AA2" };
  if (viewState === "verify-otp") return { text: "Check your inbox", color: "#9CC8FF" };
  if (viewState === "new-password") return { text: "Almost there", color: "#6EE7B7" };
  return isSignUp
    ? { text: "Free to start", color: "#6EE7B7" }
    : { text: "Welcome back", color: "#FFD43B" };
}

function getRecoveryCodeErrorMessage(message: string) {
  const normalized = message.toLowerCase();
  if (normalized.includes("expired") || normalized.includes("invalid")) {
    return "This reset code is expired or already used. Use the newest email code, or click Resend Code for a fresh one.";
  }
  return message;
}

function getCardTitle(viewState: ViewState, isSignUp: boolean) {
  if (viewState === "forgot-password") return "Reset password";
  if (viewState === "verify-otp") return "Enter the code";
  if (viewState === "new-password") return "Create a new password";
  return isSignUp ? "Create your account" : "Sign in to Zuridoc";
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
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
}) {
  const id = useId();
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-[15px] font-extrabold">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          placeholder={placeholder}
          autoComplete={autoComplete}
          data-secret={isPassword ? "true" : undefined}
          className={`nb-input h-13 w-full px-4 py-3 text-base font-medium placeholder:text-[#011B43]/45 ${
            isPassword ? "pr-14" : ""
          }`}
        />
        {isPassword && (
          <button
            type="button"
            className="nb-focus absolute right-2 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center border-[3px] border-[#011B43] bg-[#FFD43B] transition-transform hover:-rotate-6"
            onClick={() => setShowPassword((current) => !current)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            title={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" strokeWidth={2.5} />
            ) : (
              <Eye className="h-4 w-4" strokeWidth={2.5} />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
