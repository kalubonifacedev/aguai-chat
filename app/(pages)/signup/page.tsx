"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import {
  UserPlus,
  Eye,
  EyeOff,
  Search,
  Check,
  X,
  ChevronRight,
  MapPin,
  Mail,
  Lock,
  User,
  Phone,
} from "lucide-react";
import { createClient } from "@/app/lib/superbae/client";
import AguLoader from "@/app/component/loader";
import { useToast } from "@/app/component/Toast";

/* -------------------------------------------------------------------------- */
/*  Fixed reference data                                                      */
/* -------------------------------------------------------------------------- */

const VILLAGE_ZONES = [
  {
    zone: "Ututu Akasi",
    villages: ["Amakofia", "Eziama", "Obijoma", "Ohomja", "Ugwuogo"],
  },
  {
    zone: "Ututu Eleoha",
    villages: ["Amasa", "Amaeke", "Amankwu", "Amodu", "Nkpakpi", "Obiagwulu"],
  },
  {
    zone: "Ututu Umunna Isii",
    villages: ["Amaebem", "Obiakang", "Obialuoko", "Ukwuakwu"],
  },
  {
    zone: "Ututu Umu Ugwuonyiri",
    villages: ["Abuma", "Amaetiti", "Obiene", "Ubila"],
  },
] as const;

const GENDERS = ["Male", "Female"] as const;

const fieldClass =
  "w-full rounded-2xl border border-neutral-200/80 bg-neutral-50/50 px-3.5 py-3 text-sm text-neutral-900 placeholder-neutral-400 outline-none transition-all focus:border-[#9C4A2B] focus:bg-white focus:ring-2 focus:ring-[#9C4A2B]/20 dark:border-neutral-800/80 dark:bg-neutral-950/50 dark:text-neutral-100 dark:placeholder-neutral-500 dark:focus:border-[#9C4A2B] dark:focus:bg-neutral-950";
const labelClass =
  "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400";

/* -------------------------------------------------------------------------- */
/*  Password strength evaluator                                               */
/* -------------------------------------------------------------------------- */

function evaluatePasswordStrength(pass: string) {
  if (!pass) return { score: 0, label: "", color: "bg-neutral-200" };

  let score = 0;
  if (pass.length >= 8) score++;
  if (pass.length >= 12) score++;
  if (/[A-Z]/.test(pass)) score++;
  if (/[0-9]/.test(pass)) score++;
  if (/[^A-Za-z0-9]/.test(pass)) score++;

  if (score <= 2) {
    return {
      score: 1,
      label: "Weak",
      color: "bg-red-500",
      text: "text-red-500",
    };
  } else if (score <= 4) {
    return {
      score: 2,
      label: "Medium",
      color: "bg-amber-500",
      text: "text-amber-500",
    };
  } else {
    return {
      score: 3,
      label: "Strong",
      color: "bg-emerald-500",
      text: "text-emerald-500",
    };
  }
}

/* -------------------------------------------------------------------------- */
/*  Village picker modal                                                      */
/* -------------------------------------------------------------------------- */

function VillagePickerModal({
  open,
  value,
  onSelect,
  onClose,
}: {
  open: boolean;
  value: string;
  onSelect: (village: string) => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => searchRef.current?.focus(), 50);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      clearTimeout(t);
    };
  }, [open, onClose]);

  const filteredZones = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return VILLAGE_ZONES;
    return VILLAGE_ZONES.map((z) => ({
      zone: z.zone,
      villages: z.villages.filter((v) => v.toLowerCase().includes(q)),
    })).filter((z) => z.villages.length > 0);
  }, [query]);

  const totalResults = filteredZones.reduce((n, z) => n + z.villages.length, 0);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-md transition-opacity sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="village-picker-title"
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[85vh] w-full max-w-md flex-col overflow-hidden rounded-t-3xl border border-neutral-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-[#121111] sm:rounded-3xl"
      >
        <div className="flex items-center justify-between border-b border-neutral-100 px-5 pt-5 pb-4 dark:border-neutral-800/60">
          <div>
            <h2
              id="village-picker-title"
              className="text-base font-semibold text-neutral-900 dark:text-white"
            >
              Select your village
            </h2>
            <p className="text-xs text-neutral-500">
              Choose your native village in Ututu
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-5 pt-4">
          <div className="relative">
            <Search
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
            />
            <input
              ref={searchRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search village name..."
              className="w-full rounded-2xl border border-neutral-200/80 bg-neutral-50 py-2.5 pl-10 pr-4 text-sm text-neutral-900 placeholder-neutral-400 outline-none transition-colors focus:border-[#9C4A2B] focus:bg-white focus:ring-1 focus:ring-[#9C4A2B] dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100"
            />
          </div>
        </div>

        <div className="mt-2 flex-1 overflow-y-auto px-4 pb-4">
          {totalResults === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                No village found matching &ldquo;{query}&rdquo;
              </p>
              <p className="mt-1 text-xs text-neutral-400">
                Check spelling or clear your search query.
              </p>
            </div>
          ) : (
            filteredZones.map((z) => (
              <div key={z.zone} className="mt-3">
                <p className="px-2 pb-1.5 pt-1 text-[11px] font-semibold tracking-wider text-neutral-400 uppercase">
                  {z.zone}
                </p>
                <div className="space-y-1">
                  {z.villages.map((v) => {
                    const selected = v === value;
                    return (
                      <button
                        key={v}
                        type="button"
                        onClick={() => {
                          onSelect(v);
                          onClose();
                        }}
                        className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-sm transition-all ${
                          selected
                            ? "bg-[#9C4A2B]/10 text-[#9C4A2B] font-medium"
                            : "text-neutral-700 hover:bg-neutral-100/80 dark:text-neutral-300 dark:hover:bg-neutral-800/50"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <MapPin
                            size={14}
                            className={
                              selected ? "text-[#9C4A2B]" : "text-neutral-400"
                            }
                          />
                          {v}
                        </span>
                        {selected && (
                          <Check size={16} className="text-[#9C4A2B]" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {value && (
          <div className="border-t border-neutral-100 px-5 py-3 dark:border-neutral-800/60">
            <button
              type="button"
              onClick={() => {
                onSelect("");
                onClose();
              }}
              className="text-xs font-medium text-neutral-500 transition-colors hover:text-[#9C4A2B]"
            >
              Clear village selection
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Sign-up page                                                              */
/* -------------------------------------------------------------------------- */

export default function SignupPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [village, setVillage] = useState("");
  const [villageModalOpen, setVillageModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { showMessage } = useToast();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordStrength = useMemo(
    () => evaluatePasswordStrength(password),
    [password],
  );

  const validate = (): string | null => {
    if (!fullName.trim()) return "Enter your full name.";
    if (!email.trim()) return "Enter your email address.";
    if (password.length < 8) return "Password must be at least 8 characters.";
    if (password !== confirmPassword) return "Passwords do not match.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const cleanEmail = email.trim();

    try {
      // 1. Attempt standard signup
      const { data: signUpData, error: signUpError } =
        await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: {
              full_name: fullName.trim(),
              phone_number: phoneNumber.trim() || null,
              gender: gender || null,
              village: village || null,
            },
            emailRedirectTo: `${location.origin}/auth/callback`,
          },
        });

      if (signUpError) {
        setLoading(false);
        showMessage("error", signUpError.message);
        setError(signUpError.message);
        return;
      }
      showMessage(
        "success",
        "Ndewo! Account created. Please check your email for your verification code.",
      );

      // 2. Check if user already exists in Supabase
      // Supabase returns user object with empty identities array if user already exists
      const isExistingUser =
        signUpData?.user &&
        Array.isArray(signUpData.user.identities) &&
        signUpData.user.identities.length === 0;

      if (isExistingUser) {
        // Attempt login to test if email is verified or credentials are valid
        const { data: signInData, error: signInError } =
          await supabase.auth.signInWithPassword({
            email: cleanEmail,
            password,
          });

        if (signInError) {
          // Check if user exists but email is not confirmed
          if (
            signInError.message.toLowerCase().includes("email not confirmed")
          ) {
            await supabase.auth.resend({
              type: "signup",
              email: cleanEmail,
              options: {
                emailRedirectTo: `${location.origin}/auth/callback`,
              },
            });

            setLoading(false);
            router.push(`/verify?email=${encodeURIComponent(cleanEmail)}`);
            return;
          }

          // Existing user with wrong password or other issue
          setLoading(false);
          setError(
            "An account with this email already exists. Please check your credentials or log in.",
          );
          return;
        }

        // If login succeeded, user exists and is verified -> Send to homepage /
        if (signInData?.session) {
          setLoading(false);
          router.push("/");
          return;
        }
      }

      // 3. User does not exist (New user signup flow) -> Send to /verify
      setLoading(false);
      router.push(`/verify?email=${encodeURIComponent(cleanEmail)}`);
    } catch (err: any) {
      setLoading(false);
      setError(err?.message || "An unexpected error occurred.");
    }
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-50/60 px-4 py-8 dark:bg-[#0B0A0A]">
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

      <VillagePickerModal
        open={villageModalOpen}
        value={village}
        onSelect={setVillage}
        onClose={() => setVillageModalOpen(false)}
      />

      <div className="relative z-10 w-full max-w-lg rounded-3xl border border-neutral-200/80 bg-white/95 p-6 shadow-2xl shadow-neutral-200/50 backdrop-blur-md dark:border-neutral-800/80 dark:bg-[#121111]/95 dark:shadow-none sm:p-8">
        {loading && <AguLoader fullScreen={true} />}

        <div className="flex flex-col items-center text-center">
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
            Create your Ututu account
          </h1>
          <p className="mt-1 max-w-xs text-xs leading-relaxed text-neutral-500 dark:text-neutral-400 sm:text-sm">
            Join Agu to preserve history, explore lineage, and access
            conversations.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className={labelClass}>
              Full Name
            </label>
            <div className="relative">
              <User
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
              />
              <input
                id="fullName"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Kalu Boniface"
                className={`${fieldClass} pl-10`}
              />
            </div>
          </div>

          {/* Email */}
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

          {/* Password Section */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="password" className={labelClass}>
                Password
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
                />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="8+ characters"
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

              {password && (
                <div className="mt-2 space-y-1 px-1">
                  <div className="flex gap-1.5">
                    {[1, 2, 3].map((step) => (
                      <div
                        key={step}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          step <= passwordStrength.score
                            ? passwordStrength.color
                            : "bg-neutral-200 dark:bg-neutral-800"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-[11px] font-medium text-neutral-500">
                    Strength:{" "}
                    <span className={`font-semibold ${passwordStrength.text}`}>
                      {passwordStrength.label}
                    </span>
                  </p>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className={labelClass}>
                Confirm Password
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
                />
                <input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Retype password"
                  className={`${fieldClass} pl-10`}
                />
              </div>
            </div>
          </div>

          {/* Gender Custom Selector */}
          <div>
            <label className={labelClass}>
              Gender{" "}
              <span className="font-normal text-neutral-400">(optional)</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {GENDERS.map((g) => {
                const isSelected = gender === g;
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGender(isSelected ? "" : g)}
                    className={`flex items-center justify-between rounded-2xl border px-4 py-2.5 text-sm font-medium transition-all ${
                      isSelected
                        ? "border-[#9C4A2B] bg-[#9C4A2B]/10 text-[#9C4A2B] shadow-sm"
                        : "border-neutral-200/80 bg-neutral-50/50 text-neutral-600 hover:bg-neutral-100/60 dark:border-neutral-800/80 dark:bg-neutral-950/50 dark:text-neutral-400 dark:hover:bg-neutral-900/50"
                    }`}
                  >
                    <span>{g}</span>
                    <div
                      className={`flex h-4 w-4 items-center justify-center rounded-full border transition-colors ${
                        isSelected
                          ? "border-[#9C4A2B] bg-[#9C4A2B] text-white"
                          : "border-neutral-300 dark:border-neutral-700"
                      }`}
                    >
                      {isSelected && <Check size={10} strokeWidth={3} />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Phone Number & Village Picker */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="phoneNumber" className={labelClass}>
                Phone Number{" "}
                <span className="font-normal text-neutral-400">(opt)</span>
              </label>
              <div className="relative">
                <Phone
                  size={16}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
                />
                <input
                  id="phoneNumber"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="080..."
                  className={`${fieldClass} pl-10`}
                />
              </div>
            </div>

            <div>
              <span className={labelClass}>
                Village in Ututu{" "}
                <span className="font-normal text-neutral-400">(opt)</span>
              </span>
              <button
                type="button"
                onClick={() => setVillageModalOpen(true)}
                className={`${fieldClass} flex items-center justify-between text-left`}
              >
                <span
                  className={
                    village
                      ? "font-medium text-neutral-900 dark:text-neutral-100"
                      : "text-neutral-400"
                  }
                >
                  {village ? (
                    <span className="flex items-center gap-1.5 truncate">
                      <MapPin size={14} className="shrink-0 text-[#9C4A2B]" />
                      {village}
                    </span>
                  ) : (
                    "Select village"
                  )}
                </span>
                <ChevronRight size={16} className="shrink-0 text-neutral-400" />
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
            <UserPlus size={16} />
            {loading ? "Processing..." : "Create account"}
          </button>
        </form>

        {/* Footer Link */}
        <p className="mt-5 text-center text-xs text-neutral-500 dark:text-neutral-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-[#9C4A2B] transition-colors hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
