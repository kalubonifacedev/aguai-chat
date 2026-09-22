"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Mail,
  ArrowLeft,
  KeyRound,
  CheckCircle2,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { useToast } from "@/app/component/Toast";
import { createClient } from "@/app/lib/superbae/client";
import AguLoader from "@/app/component/loader";

type Step = "REQUEST" | "VERIFY_OTP" | "NEW_PASSWORD" | "SUCCESS";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>("REQUEST");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { showMessage } = useToast();
  const supabase = createClient();

  // STEP 1: Send OTP to Email using signInWithOtp to guarantee a 6-digit code
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();

    if (!cleanEmail || !cleanEmail.includes("@")) {
      showMessage("error", "Please enter a valid email address.");
      return;
    }

    setIsLoading(true);

    try {
      // signInWithOtp forces Supabase to send a numeric 6-digit code via {{ .Token }}
      const { error } = await supabase.auth.signInWithOtp({
        email: cleanEmail,
        options: {
          shouldCreateUser: false, // Prevents creating new accounts if the email doesn't exist
        },
      });

      if (error) {
        showMessage("error", error.message || "Failed to send reset code.");
        return;
      }

      setStep("VERIFY_OTP");
      showMessage("success", "OTP code sent! Check your email inbox.");
    } catch (error: any) {
      console.error("Forgot Password Error:", error);
      showMessage("error", error?.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  // STEP 2: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanOtp = otp.trim();

    if (cleanOtp.length < 6) {
      showMessage("error", "Please enter the full 6-digit OTP code.");
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: cleanOtp,
        type: "email", // Verification type for OTP sent via signInWithOtp
      });

      if (error) {
        showMessage("error", error.message || "Invalid or expired OTP code.");
        return;
      }

      setStep("NEW_PASSWORD");
      showMessage("success", "Code verified! Set your new password.");
    } catch (error: any) {
      console.error("OTP Verification Error:", error);
      showMessage("error", error?.message || "Failed to verify OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  // STEP 3: Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      showMessage("error", "Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        showMessage("error", error.message || "Failed to update password.");
        return;
      }

      setStep("SUCCESS");
      showMessage("success", "Password reset successfully!");
    } catch (error: any) {
      console.error("Password Update Error:", error);
      showMessage("error", error?.message || "Failed to reset password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-4 overflow-hidden selection:bg-[#9C4A2B]/30 selection:text-zinc-100">
      {/* Background Glow Canvas */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#9C4A2B]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative w-full max-w-md space-y-6 z-10">
        {/* Navigation Link */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-zinc-100 transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            Back to Sign In
          </Link>

          <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-500">
            Security Desk
          </span>
        </div>

        {/* Card Container */}
        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-6 sm:p-8 backdrop-blur-2xl shadow-2xl space-y-6">
          {/* Header */}
          <div className="space-y-3 text-center">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-[#9C4A2B]/10 border border-[#9C4A2B]/20 flex items-center justify-center shadow-inner">
              {step === "SUCCESS" ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              ) : step === "VERIFY_OTP" ? (
                <ShieldCheck className="w-6 h-6 text-[#9C4A2B]" />
              ) : (
                <KeyRound className="w-6 h-6 text-[#9C4A2B]" />
              )}
            </div>

            <div className="space-y-1">
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-zinc-100">
                {step === "REQUEST" && "Forgot password?"}
                {step === "VERIFY_OTP" && "Enter OTP Code"}
                {step === "NEW_PASSWORD" && "Set new password"}
                {step === "SUCCESS" && "Reset complete"}
              </h1>

              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-xs mx-auto">
                {step === "REQUEST" &&
                  "Enter your email address and we will dispatch a 6-digit OTP code to reset your account."}
                {step === "VERIFY_OTP" &&
                  `We've sent a 6-digit code to ${email}`}
                {step === "NEW_PASSWORD" &&
                  "Enter a new secure password with at least 6 characters."}
                {step === "SUCCESS" &&
                  "Your password has been updated. You can now sign in with your new credentials."}
              </p>
            </div>
          </div>

          {/* STEP 1: REQUEST EMAIL */}
          {step === "REQUEST" && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="text-xs font-medium text-zinc-300 block text-left"
                >
                  Email address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-950/70 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-[#9C4A2B]/80 focus:ring-1 focus:ring-[#9C4A2B]/80 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-[#9C4A2B] hover:bg-[#833d23] text-zinc-100 font-medium text-sm rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#9C4A2B]/15 active:scale-[0.99]"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <AguLoader />
                    <span>Sending OTP...</span>
                  </div>
                ) : (
                  "Send Verification Code"
                )}
              </button>
            </form>
          )}

          {/* STEP 2: VERIFY OTP */}
          {step === "VERIFY_OTP" && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="otp"
                  className="text-xs font-medium text-zinc-300 block text-left"
                >
                  6-Digit OTP Code
                </label>
                <input
                  id="otp"
                  type="text"
                  maxLength={6}
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="000000"
                  className="w-full text-center tracking-[0.6em] text-xl font-mono py-2.5 bg-zinc-950/70 border border-zinc-800 rounded-xl text-zinc-100 placeholder:text-zinc-700 focus:outline-none focus:border-[#9C4A2B]/80 focus:ring-1 focus:ring-[#9C4A2B]/80 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-[#9C4A2B] hover:bg-[#833d23] text-zinc-100 font-medium text-sm rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#9C4A2B]/15 active:scale-[0.99]"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <AguLoader />
                    <span>Verifying Code...</span>
                  </div>
                ) : (
                  "Verify OTP Code"
                )}
              </button>

              <button
                type="button"
                onClick={() => setStep("REQUEST")}
                className="w-full inline-flex items-center justify-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors pt-1"
              >
                <RefreshCw className="w-3 h-3" />
                Resend code or change email
              </button>
            </form>
          )}

          {/* STEP 3: NEW PASSWORD */}
          {step === "NEW_PASSWORD" && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="password"
                  className="text-xs font-medium text-zinc-300 block text-left"
                >
                  New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-zinc-950/70 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-[#9C4A2B]/80 focus:ring-1 focus:ring-[#9C4A2B]/80 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-[#9C4A2B] hover:bg-[#833d23] text-zinc-100 font-medium text-sm rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#9C4A2B]/15 active:scale-[0.99]"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <AguLoader />
                    <span>Updating Password...</span>
                  </div>
                ) : (
                  "Update Password"
                )}
              </button>
            </form>
          )}

          {/* STEP 4: SUCCESS VIEW */}
          {step === "SUCCESS" && (
            <div className="space-y-3">
              <Link
                href="/"
                className="w-full py-2.5 px-4 bg-[#9C4A2B] hover:bg-[#833d23] text-zinc-100 font-medium text-sm rounded-xl transition-all flex items-center justify-center text-center shadow-lg shadow-[#9C4A2B]/15 block active:scale-[0.99]"
              >
                Sign In Now
              </Link>
            </div>
          )}

          {/* Footer */}
          {step !== "SUCCESS" && (
            <div className="pt-2 text-center text-xs text-zinc-500 border-t border-zinc-800/60">
              Remembered your password?{" "}
              <Link
                href="/"
                className="font-medium text-[#9C4A2B] hover:underline underline-offset-4 transition-all"
              >
                Sign in
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
