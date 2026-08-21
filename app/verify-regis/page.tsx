"use client";

import { useState, useCallback, useEffect } from "react";
import { useSignIn, useSignUp, useClerk } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { FaSpinner } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import {
  LockKeyhole,
  ShieldCheck,
  Zap,
  Sparkles,
  LayoutDashboard,
} from "lucide-react";

// Helper function to extract error messages safely
function getErrorMessage(error: unknown): string {
  if (!error) return "An unexpected error occurred.";
  const e = error as { errors?: { longMessage?: string }[]; message?: string };
  return (
    e.errors?.[0]?.longMessage ??
    e.message ??
    "An unexpected error occurred. Please try again."
  );
}

// Reusable component for the benefits list on the left side
function BenefitItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 dark:bg-white flex items-center justify-center dark:text-blue-800">
        {icon}
      </div>
      <div>
        <h3 className="text-gray-900 dark:text-gray-100 h-font font-semibold text-[15px] mb-1">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-[13px] leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

export default function AuthPage() {
  // Clerk Hooks
  const { signIn } = useSignIn();
  const { signUp } = useSignUp();
  const { setActive } = useClerk();

  // Theme Hook for dynamic Captcha support
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // State
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState(""); // Fixed unused variable here

  const [pendingVerification, setPendingVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  const [pendingMfa, setPendingMfa] = useState(false);
  const [mfaCode, setMfaCode] = useState("");

  const providers = ["AWS", "Clerk"];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Rotate security providers every 2.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % providers.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [providers.length]);

  // Auth Handlers (Logic strictly preserved)
  const handleSignIn = useCallback(async () => {
    if (!signIn) return;
    setLoading(true);
    setAuthError(null);
    try {
      const { error } = await signIn.password({ identifier: email, password });
      if (error) {
        setAuthError(getErrorMessage(error));
        setLoading(false);
        return;
      }

      if (signIn.status === "complete" && signIn.createdSessionId) {
        await setActive({ session: signIn.createdSessionId });
        window.location.href = "/dashboard";
      } else if (
        signIn.status === "needs_second_factor" ||
        signIn.status === "needs_client_trust"
      ) {
        const emailFactor = signIn.supportedSecondFactors?.find(
          (f) => f.strategy === "email_code",
        );

        if (emailFactor) {
          const { error: sendError } = await signIn.emailCode.sendCode();
          if (sendError) {
            setAuthError(getErrorMessage(sendError));
            setLoading(false);
            return;
          }
          setPendingMfa(true);
          setLoading(false);
        } else {
          setAuthError(
            "Device verification required, but no email factor was found.",
          );
          setLoading(false);
        }
      } else {
        setAuthError(`Status: ${signIn.status} — requires additional steps.`);
        setLoading(false);
      }
    } catch (err) {
      setAuthError(getErrorMessage(err));
      setLoading(false);
    }
  }, [signIn, setActive, email, password]);

  const handleVerifyMfa = useCallback(async () => {
    if (!signIn) return;
    setLoading(true);
    setAuthError(null);
    try {
      const { error } = await signIn.emailCode.verifyCode({ code: mfaCode });
      if (error) {
        setAuthError(getErrorMessage(error));
        setLoading(false);
        return;
      }
      if (signIn.status === "complete" && signIn.createdSessionId) {
        await setActive({ session: signIn.createdSessionId });
        window.location.href = "/dashboard";
      } else {
        setAuthError(`Verification incomplete. Status: ${signIn.status}`);
        setLoading(false);
      }
    } catch (err) {
      setAuthError(getErrorMessage(err));
      setLoading(false);
    }
  }, [signIn, setActive, mfaCode]);

  const handleSignUp = useCallback(async () => {
    if (!signUp) return;
    setLoading(true);
    setAuthError(null);
    try {
      const { error: createErr } = await signUp.password({
        emailAddress: email,
        password,
        firstName: firstName || undefined,
        lastName: lastName || undefined, // Updated here
      });
      if (createErr) {
        setAuthError(getErrorMessage(createErr));
        setLoading(false);
        return;
      }
      const { error: sendErr } = await signUp.verifications.sendEmailCode();
      if (sendErr) {
        setAuthError(getErrorMessage(sendErr));
        setLoading(false);
        return;
      }
      setPendingVerification(true);
    } catch (err) {
      setAuthError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [signUp, email, password, firstName, lastName]); // Updated dependency

  const handleVerifySignUp = useCallback(async () => {
    if (!signUp) return;
    setLoading(true);
    setAuthError(null);
    try {
      const { error: verifyErr } = await signUp.verifications.verifyEmailCode({
        code: verificationCode,
      });
      if (verifyErr) {
        setAuthError(getErrorMessage(verifyErr));
        setLoading(false);
        return;
      }
      if (
        (signUp.status === "complete" || signUp.createdSessionId) &&
        signUp.createdSessionId
      ) {
        await setActive({ session: signUp.createdSessionId });
        window.location.href = "/dashboard";
      } else {
        const missing = signUp.missingFields ?? [];
        const unverified = signUp.unverifiedFields ?? [];
        setAuthError(
          missing.length > 0
            ? `Missing required fields: ${missing.join(", ")}`
            : unverified.length > 0
              ? `Still unverified: ${unverified.join(", ")}`
              : "Sign-up incomplete. Please try again.",
        );
        setLoading(false);
      }
    } catch (err) {
      setAuthError(getErrorMessage(err));
      setLoading(false);
    }
  }, [signUp, setActive, verificationCode]);

  const handleSubmit = useCallback(() => {
    if (pendingMfa) return handleVerifyMfa();
    if (pendingVerification) return handleVerifySignUp();
    if (isSignUp) return handleSignUp();
    return handleSignIn();
  }, [
    pendingMfa,
    pendingVerification,
    isSignUp,
    handleVerifyMfa,
    handleVerifySignUp,
    handleSignUp,
    handleSignIn,
  ]);

  const toggleMode = useCallback(() => {
    setIsSignUp((prev) => !prev);
    setAuthError(null);
    setPendingVerification(false);
    setPendingMfa(false);
    setVerificationCode("");
    setMfaCode("");
  }, []);

  // Form Computed Values
  const heading = pendingMfa
    ? "Device Verification"
    : pendingVerification
      ? "Verify Email"
      : isSignUp
        ? "Create an Account"
        : "Welcome Back";

  const subtext = pendingMfa
    ? "A security code has been sent to your email."
    : pendingVerification
      ? `A 6-digit code has been sent to ${email}.`
      : isSignUp
        ? "Enter your details below to set up your workspace."
        : "Log in to Kosha to continue to your dashboard.";

  const canSubmit = pendingMfa
    ? mfaCode.length === 6
    : pendingVerification
      ? verificationCode.length === 6
      : isSignUp
        ? !!(email && password && firstName && lastName) // Updated here
        : !!(email && password);

  // Themed Styles
  const inputClass =
    "w-full px-4 py-2 bg-gray-100 border dark:border-[#444444] border-zinc-400 text-[18px] text-gray-900 placeholder-gray-400  outline-none rounded-xl transition-all dark:bg-[#141414] ";
  const labelClass =
    "block text-[16px] font-medium text-gray-700 dark:text-gray-100 mb-1.5";
  const primaryButtonClass =
    "w-full flex items-center justify-center gap-2 py-3 px-4 font-normal text-[17px] bg-blue-600 hover:bg-blue-700 text-white rounded-full cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm dark:bg-blue-800 dark:hover:bg-blue-700";
  const secondaryButtonClass =
    "w-full flex items-center justify-center gap-2 py-3 px-4 font-semibold text-[17px] cursor-pointer bg-transparent text-gray-700 border-2 border-gray-300 hover:border-green-600 hover:text-green-600 rounded-2xl transition-all disabled:opacity-50 dark:text-gray-200 dark:border-[#444444] dark:hover:border-green-500 dark:hover:text-green-500";

  return (
    <div className="flex min-h-screen bg-white text-gray-900 selection:bg-[#0078D4] selection:text-white dark:bg-black dark:text-gray-100">
      {/* LEFT PANEL: Branding & Benefits (Hidden on small screens) */}
      <div className="relative hidden lg:flex flex-col justify-between w-1/2 max-w-2xl p-12 xl:p-16 border-r border-gray-200 bg-gray-50/30 overflow-hidden dark:border-[#1f1f1f] dark:bg-black">
        <div className="relative z-10 flex flex-col gap-12">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Image
              src="/authlogo.png"
              alt="Kosha Logo"
              width={44}
              height={44}
              className="object-contain"
            />
            <span className="text-2xl font-bold tracking-tight  text-gray-900 dark:text-white">
              <span className="h-font font-semibold">Kosha</span>{" "}
              <span className="font-bold text-gray-400 dark:text-gray-500">
                {"/"}
              </span>{" "}
              <span className="text-sm px-3 py-2 text-gray-700 bg-gray-200 font-semibold tracking-tight rounded-2xl dark:text-white dark:bg-[#252525]">
                Authentication
              </span>
            </span>
          </div>

          {/* Value Proposition */}
          <div className="mt-8">
            <h1 className="text-4xl xl:text-5xl font-semibold h-font text-gray-900 mb-6 leading-tight dark:text-white">
              Push and secure your files with kosha
            </h1>
            <p className="text-lg text-gray-600 max-w-md leading-relaxed dark:text-gray-400">
              Experience a modern cloud storage provider platform which is open
              source and simple to use
            </p>
          </div>

          {/* Benefits List */}
          <div className="space-y-8 mt-4 max-w-md">
            <BenefitItem
              icon={<ShieldCheck className="w-5 h-5" />}
              title="Advanced Security"
              description="Protect your workspace with industry-leading encryption and robust multi-factor authentication protocols."
            />
            <BenefitItem
              icon={<Zap className="w-5 h-5" />}
              title="Lightning Fast Execution"
              description="Built on a high-performance edge architecture ensuring your data is available instantaneously."
            />
            <BenefitItem
              icon={<LayoutDashboard className="w-5 h-5" />}
              title="Intuitive Workflows"
              description="A clean, optimized dashboard that puts your most important tools exactly where you need them."
            />
          </div>
        </div>

        {/* Dynamic Security Badge inside the Left Panel */}
        <div className="relative z-10 flex items-center gap-2 mt-auto pt-12">
          <div className="flex items-center gap-2 text-[13px] text-gray-600 bg-white border border-gray-200 px-4 py-2 rounded-full dark:text-gray-400 dark:bg-[#111111] dark:border-[#222222]">
            <LockKeyhole className="w-4 h-4 text-[#0078D4]" />
            <span>Secured infrastructure by</span>
            <div className="relative flex items-center justify-start w-[45px] h-[18px] h-font overflow-hidden font-semibold text-gray-900 dark:text-gray-200">
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={providers[index]}
                  initial={{ y: 15, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -15, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute left-0"
                >
                  {providers[index]}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Authentication Form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16 xl:px-24 bg-white dark:bg-black">
        {/* Mobile Logo (Visible only on small screens) */}
        <div className="lg:hidden flex items-center justify-center gap-3 mb-10">
          <Image
            src="/authlogo.png"
            alt="Kosha Logo"
            width={40}
            height={40}
            className="object-contain"
          />
          <span className="text-2xl font-bold tracking-tight h-font text-gray-900 dark:text-white">
            Kosha /
            <span className="ml-2 text-xs px-2 py-1 text-blue-700 bg-blue-50 border border-blue-200 rounded-2xl dark:bg-blue-800/20 dark:border-blue-400 dark:text-blue-400">
              Authentication
            </span>
          </span>
        </div>

        <div className="w-full max-w-[420px] mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-2 h-font dark:text-white">
              {heading}
            </h2>
            <p className="text-[15px] text-gray-600 dark:text-gray-400">
              {subtext}
            </p>
          </div>

          {/* Error Banner */}
          {authError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 flex items-start gap-3 rounded-2xl bg-red-50 border border-red-100 dark:bg-red-500/10 dark:border-red-500/20"
            >
              <div className="mt-0.5 text-red-600 dark:text-red-500">
                <Sparkles className="w-6 h-6" />
              </div>
              <p className="text-[15px] font-medium text-red-700 leading-snug dark:text-red-200">
                {authError}
              </p>
            </motion.div>
          )}

          {/* Main Form container */}
          <div className="space-y-5">
            {pendingMfa || pendingVerification ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div>
                  <label className={labelClass}>Security Code</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="******"
                    value={pendingMfa ? mfaCode : verificationCode}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                      if (pendingMfa) setMfaCode(val);
                      else setVerificationCode(val);
                    }}
                    onKeyDown={(e) =>
                      e.key === "Enter" && canSubmit && handleSubmit()
                    }
                    className={`${inputClass} text-center text-5xl tracking-[0.3em] py-4`}
                  />
                </div>

                <div className="space-y-4 pt-2">
                  <button
                    onClick={handleSubmit}
                    disabled={loading || !canSubmit}
                    className={primaryButtonClass}
                  >
                    {loading ? (
                      <FaSpinner className="animate-spin w-5 h-5" />
                    ) : (
                      "Verify code"
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setPendingMfa(false);
                      setPendingVerification(false);
                      setVerificationCode("");
                      setMfaCode("");
                      setAuthError(null);
                    }}
                    className="w-full text-center text-[14px] text-gray-500 hover:text-gray-900 transition-colors dark:text-gray-400 dark:hover:text-white"
                  >
                    Cancel and go back
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-5"
              >
                {isSignUp && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>First Name</label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className={inputClass}
                        placeholder="First Name"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Last Name</label>
                      <input
                        type="text"
                        value={lastName} // Updated here
                        onChange={(e) => setLastName(e.target.value)} // Updated here
                        className={inputClass}
                        placeholder="Last Name"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className={labelClass}>Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    className={inputClass}
                    placeholder="you@gmail/yahoo/outlook/company.com"
                  />
                </div>

                <div>
                  <label className={labelClass}>Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete={
                      isSignUp ? "new-password" : "current-password"
                    }
                    onKeyDown={(e) =>
                      e.key === "Enter" && canSubmit && handleSubmit()
                    }
                    className={inputClass}
                    placeholder="*******"
                  />
                </div>

                {/* CLERK CAPTCHA */}
                {mounted && (
                  <div
                    id="clerk-captcha"
                    data-cl-theme={resolvedTheme === "dark" ? "dark" : "light"}
                    data-cl-size="flexible"
                    className="pt-1"
                  />
                )}

                <div className="pt-2 space-y-4">
                  <button
                    onClick={handleSubmit}
                    disabled={loading || !canSubmit}
                    className={primaryButtonClass}
                  >
                    {loading ? (
                      <FaSpinner className="animate-spin w-5 h-5" />
                    ) : isSignUp ? (
                      "Create Account"
                    ) : (
                      "Sign In"
                    )}
                  </button>

                  <div className="relative flex items-center justify-center py-2">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200 dark:border-[#222]"></div>
                    </div>
                    <div className="relative bg-white px-4 text-[12px] font-semibold text-gray-500 uppercase tracking-wider dark:bg-black dark:text-gray-200">
                      or continue with
                    </div>
                  </div>

                  <button onClick={toggleMode} className={secondaryButtonClass}>
                    {isSignUp
                      ? "Log in to existing account"
                      : "Create a new account"}
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Footer Terms */}
          <div className="mt-12 text-center text-[13px] text-gray-500 leading-relaxed">
            By continuing, you agree to our{" "}
            <Link
              href="/terms"
              className="text-gray-700 hover:text-gray-900 underline decoration-gray-300 underline-offset-2 transition-colors dark:text-gray-300 dark:hover:text-white dark:decoration-gray-600"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="text-gray-700 hover:text-gray-900 underline decoration-gray-300 underline-offset-2 transition-colors dark:text-gray-300 dark:hover:text-white dark:decoration-gray-600"
            >
              Privacy Policy
            </Link>
            .
          </div>
        </div>
      </div>
    </div>
  );
}
