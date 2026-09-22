"use client";

import {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
  Suspense,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { KeyRound, ArrowLeft, RefreshCw, CheckCircle2 } from "lucide-react";
import { createClient } from "@/app/lib/superbae/client";
import AguLoader from "@/app/component/loader";
import { useToast } from "@/app/component/Toast";

const OTP_LENGTH = 6;
const RESEND_INTERVAL = 60; // Countdown in seconds
const STORAGE_KEY_PREFIX = "agu_otp_resend_timestamp_";

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const { showMessage } = useToast();

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Unique key for local storage based on email
  const storageKey = useMemo(() => {
    return email ? `${STORAGE_KEY_PREFIX}${email.toLowerCase()}` : "";
  }, [email]);

  /* -------------------------------------------------------------------------- */
  /*  Timer setup with localStorage persistence                                 */
  /* -------------------------------------------------------------------------- */
  const updateTimer = useCallback(() => {
    if (!storageKey) return;
    const storedExpiry = localStorage.getItem(storageKey);
    if (storedExpiry) {
      const expiryTime = parseInt(storedExpiry, 10);
      const remaining = Math.ceil((expiryTime - Date.now()) / 1000);
      if (remaining > 0) {
        setCooldown(remaining);
      } else {
        setCooldown(0);
        localStorage.removeItem(storageKey);
      }
    }
  }, [storageKey]);

  useEffect(() => {
    updateTimer();
    const interval = setInterval(() => {
      updateTimer();
    }, 1000);
    return () => clearInterval(interval);
  }, [updateTimer]);

  const startCooldown = () => {
    if (!storageKey) return;
    const expiryTime = Date.now() + RESEND_INTERVAL * 1000;
    localStorage.setItem(storageKey, expiryTime.toString());
    setCooldown(RESEND_INTERVAL);
  };

  /* -------------------------------------------------------------------------- */
  /*  OTP Input Handlers                                                        */
  /* -------------------------------------------------------------------------- */
  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    setError("");

    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (!/^\d+$/.test(pastedData)) return;

    const digits = pastedData.slice(0, OTP_LENGTH).split("");
    const newOtp = [...otp];

    digits.forEach((digit, idx) => {
      newOtp[idx] = digit;
    });

    setOtp(newOtp);
    setError("");

    const nextIndex = Math.min(digits.length, OTP_LENGTH - 1);
    inputRefs.current[nextIndex]?.focus();
  };

  /* -------------------------------------------------------------------------- */
  /*  Verify OTP                                                                */
  /* -------------------------------------------------------------------------- */
  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const code = otp.join("");

    if (code.length < OTP_LENGTH) {
      setError(`Please enter all ${OTP_LENGTH} digits.`);
      return;
    }

    if (!email) {
      setError("Email missing. Please return to the signup page.");
      return;
    }

    setLoading(true);
    setError("");
    const supabase = createClient();

    const { error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: "signup",
    });

    setLoading(false);
    if (verifyError) {
      showMessage("error", verifyError.message);
      setError(verifyError.message);
      return;
    }
    showMessage("success", "Your email has been verified successfully. ");

    if (storageKey) localStorage.removeItem(storageKey);
    router.push("/");
  };

  /* -------------------------------------------------------------------------- */
  /*  Resend OTP Code                                                           */
  /* -------------------------------------------------------------------------- */
  const handleResend = async () => {
    if (cooldown > 0 || resending || !email) return;

    setResending(true);
    setError("");
    setSuccessMsg("");
    const supabase = createClient();

    const { error: resendError } = await supabase.auth.resend({
      type: "signup",
      email,
    });

    setResending(false);

    if (resendError) {
      setError(resendError.message);
      return;
    }

    setSuccessMsg("Verification code resent successfully!");
    startCooldown();
    setTimeout(() => setSuccessMsg(""), 4000);
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
        {loading && <AguLoader fullScreen={true} />}

        {/* Back Link */}
        <Link
          href="/signup"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 transition-colors hover:text-[#9C4A2B] dark:text-neutral-400"
        >
          <ArrowLeft size={14} />
          Back to signup
        </Link>

        {/* Header Icon */}
        <div className="mt-4 flex flex-col items-center text-center">
          <div className="relative mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#9C4A2B]/10 text-[#9C4A2B] ring-8 ring-[#9C4A2B]/5">
            <KeyRound size={26} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-2xl">
            Verify your email
          </h1>
          <p className="mt-1 max-w-xs text-xs leading-relaxed text-neutral-500 dark:text-neutral-400 sm:text-sm">
            We sent a 6-digit code to{" "}
            <span className="font-semibold text-neutral-900 dark:text-neutral-200">
              {email || "your email"}
            </span>
          </p>
        </div>

        {/* OTP Inputs Form */}
        <form onSubmit={handleVerify} className="mt-6 space-y-5">
          <div className="flex justify-between gap-1.5 sm:gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className={`h-12 w-11 rounded-2xl border text-center text-lg font-bold outline-none transition-all sm:h-14 sm:w-12 sm:text-xl ${
                  digit
                    ? "border-[#9C4A2B] bg-[#9C4A2B]/5 text-[#9C4A2B] dark:bg-[#9C4A2B]/10"
                    : "border-neutral-200/80 bg-neutral-50/50 text-neutral-900 focus:border-[#9C4A2B] focus:bg-white focus:ring-2 focus:ring-[#9C4A2B]/20 dark:border-neutral-800/80 dark:bg-neutral-950/50 dark:text-white dark:focus:bg-neutral-950"
                }`}
              />
            ))}
          </div>

          {/* Messages */}
          {error && (
            <div className="rounded-2xl border border-red-200/60 bg-red-50/80 px-3.5 py-2.5 text-center text-xs text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="flex items-center justify-center gap-1.5 rounded-2xl border border-emerald-200/60 bg-emerald-50/80 px-3.5 py-2.5 text-center text-xs text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400">
              <CheckCircle2 size={15} />
              {successMsg}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || otp.join("").length < OTP_LENGTH}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#9C4A2B] px-4 py-3 text-sm font-semibold text-white shadow-md shadow-[#9C4A2B]/20 transition-all hover:bg-[#853e24] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9C4A2B] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify Code"}
          </button>
        </form>

        {/* Resend Action */}
        <div className="mt-6 text-center text-xs text-neutral-500 dark:text-neutral-400">
          Didn&apos;t receive the code?{" "}
          <button
            type="button"
            onClick={handleResend}
            disabled={cooldown > 0 || resending}
            className={`inline-flex items-center gap-1 font-semibold transition-colors ${
              cooldown > 0 || resending
                ? "cursor-not-allowed text-neutral-400 dark:text-neutral-600"
                : "text-[#9C4A2B] hover:underline"
            }`}
          >
            {resending && <RefreshCw size={12} className="animate-spin" />}
            {cooldown > 0
              ? `Resend in ${cooldown}s`
              : resending
                ? "Resending..."
                : "Resend code"}
          </button>
        </div>
      </div>
    </main>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<AguLoader fullScreen={true} />}>
      <VerifyOtpContent />
    </Suspense>
  );
}
