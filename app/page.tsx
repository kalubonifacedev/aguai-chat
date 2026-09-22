"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, LogIn, ArrowLeft } from "lucide-react";
import { createClient } from "./lib/superbae/client";
import AguLoader from "./component/loader";
import { useToast } from "./component/Toast";

const fieldClass =
  "w-full rounded-2xl border border-neutral-200/80 bg-neutral-50/50 px-3.5 py-3 text-sm text-neutral-900 placeholder-neutral-400 outline-none transition-all focus:border-[#9C4A2B] focus:bg-white focus:ring-2 focus:ring-[#9C4A2B]/20 dark:border-neutral-800/80 dark:bg-neutral-950/50 dark:text-neutral-100 dark:placeholder-neutral-500 dark:focus:border-[#9C4A2B] dark:focus:bg-neutral-950";
const labelClass =
  "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { showMessage } = useToast();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      showMessage("error", "Please enter both email and password.");
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    const { error: signInError, data } = await supabase.auth.signInWithPassword(
      {
        email: email.trim(),
        password,
      },
    );
    setLoading(false);

    if (signInError) {
      showMessage("error", signInError.message);

      setError(signInError.message);
      return;
    }
    showMessage("success", "Ndewo! Welcome back to Agu.");

    router.push("/dashboard");
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-50/60 px-4 py-8 dark:bg-[#0B0A0A]">
      {/* Background Watermark */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-end justify-center"
      >
        <div className="relative -mb-16 h-[65vh] w-full max-w-2xl opacity-[0.05] dark:opacity-[0.08]">
          <Image
            src="/logo.png"
            alt=""
            fill
            className="object-contain object-bottom"
            priority={false}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50/60 via-transparent to-slate-50/80 dark:from-[#0B0A0A] dark:via-transparent dark:to-[#0B0A0A]" />
      </div>

      <div className="relative z-10 w-full max-w-md rounded-3xl border border-neutral-200/80 bg-white/95 p-6 shadow-2xl shadow-neutral-200/50 backdrop-blur-md dark:border-neutral-800/80 dark:bg-[#121111]/95 dark:shadow-none sm:p-8">
        {loading && <AguLoader fullScreen={true} label="Signing you in..." />}

        {/* Back Button */}
        {/* <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 transition-colors hover:text-[#9C4A2B] dark:text-neutral-400"
        >
          <ArrowLeft size={14} />
          Back to home
        </Link> */}

        {/* Header Branding */}
        <div className="mt-2 flex flex-col items-center text-center">
          <div className="relative mb-3">
            <div className="absolute -inset-1 rounded-full bg-[#9C4A2B]/25 blur-lg" />
            <Image
              src="/logo1.png"
              alt="Agu AI"
              width={56}
              height={56}
              className="relative rounded-full object-cover shadow-md ring-2 ring-[#9C4A2B]/40"
            />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-2xl">
            Welcome back to Agu
          </h1>
          <p className="mt-1 max-w-xs text-xs leading-relaxed text-neutral-500 dark:text-neutral-400 sm:text-sm">
            Sign in to continue your discussions and access your workspace.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
          {/* Email Field */}
          <div>
            <label htmlFor="email" className={labelClass}>
              Email Address
            </label>
            <div className="relative">
              <Mail
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
              />
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={`${fieldClass} pl-10`}
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className={labelClass}>
                Password
              </label>
              <Link
                href="/password-reset"
                className="mb-1.5 text-xs font-medium text-[#9C4A2B] transition-colors hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
              />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className={`${fieldClass} pl-10 pr-9`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="rounded-2xl border border-red-200/60 bg-red-50/80 px-3.5 py-2.5 text-xs text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#9C4A2B] px-4 py-3 text-sm font-semibold text-white shadow-md shadow-[#9C4A2B]/20 transition-all hover:bg-[#853e24] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9C4A2B] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <LogIn size={16} />
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        {/* Signup Redirect */}
        <p className="mt-6 text-center text-xs text-neutral-500 dark:text-neutral-400">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-semibold text-[#9C4A2B] transition-colors hover:underline"
          >
            Create account
          </Link>
        </p>
      </div>
    </main>
  );
}
