"use client";

import { useChat } from "@ai-sdk/react";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowUp,
  Sparkles,
  Compass,
  BookOpen,
  Shield,
  Sun,
  Moon,
  PenLine,
  Copy,
  Check,
  X,
  Send,
  Share2,
  Settings,
  User,
  MapPin,
  Phone,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { createClient } from "../lib/superbae/client";

const DEVELOPER_EMAIL = "kalubonifacedev@gmail.com";

/* -------------------------------------------------------------------------- */
/*  Settings Modal (User Profile & Account Info)                             */
/* -------------------------------------------------------------------------- */

function SettingsModal({
  open,
  onClose,
  user,
}: {
  open: boolean;
  onClose: () => void;
  user: any;
}) {
  const router = useRouter();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  const meta = user?.user_metadata || {};

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-t-3xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-[#141212] sm:rounded-3xl"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800"
        >
          <X size={18} />
        </button>

        {/* User Header */}
        <div className="flex items-center gap-3 border-b border-neutral-100 pb-4 dark:border-neutral-800/80">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#9C4A2B]/10 text-[#9C4A2B]">
            <User size={24} />
          </div>
          <div>
            <h2
              id="settings-title"
              className="text-lg font-bold text-neutral-900 dark:text-white"
            >
              {meta.full_name || "Ututu Citizen"}
            </h2>
            <p className="text-xs text-neutral-500">{user?.email}</p>
          </div>
        </div>

        {/* Information Grid */}
        <div className="mt-5 space-y-3">
          <div className="flex items-center gap-3 rounded-2xl border border-neutral-200/80 bg-slate-50/60 p-3.5 dark:border-neutral-800/80 dark:bg-neutral-900/40">
            <MapPin size={18} className="text-[#9C4A2B]" />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                Village
              </p>
              <p className="text-xs font-medium text-neutral-800 dark:text-neutral-200">
                {meta.village || "Not specified"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-neutral-200/80 bg-slate-50/60 p-3.5 dark:border-neutral-800/80 dark:bg-neutral-900/40">
            <Phone size={18} className="text-[#9C4A2B]" />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                Phone Number
              </p>
              <p className="text-xs font-medium text-neutral-800 dark:text-neutral-200">
                {meta.phone_number || "Not specified"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-neutral-200/80 bg-slate-50/60 p-3.5 dark:border-neutral-800/80 dark:bg-neutral-900/40">
            <ShieldCheck size={18} className="text-[#9C4A2B]" />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                Account Status
              </p>
              <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                Verified Citizen
              </p>
            </div>
          </div>
        </div>

        {/* Sign Out Button */}
        <button
          onClick={handleSignOut}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-red-500/10 py-3 text-xs font-semibold text-red-600 transition-colors hover:bg-red-500/20 dark:text-red-400"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Contribute Modal (Clean Email Info Card)                                 */
/* -------------------------------------------------------------------------- */

function ContributeModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(DEVELOPER_EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const mailtoUrl = `mailto:${DEVELOPER_EMAIL}?subject=${encodeURIComponent(
    "Ututu History Contribution",
  )}&body=${encodeURIComponent(
    "Ndewoo! I would like to share/correct the following details regarding Ututu history:\n\n- Topic/Village:\n- Details:\n- Source (Elder, Book, or Family):",
  )}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="contribute-title"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-t-3xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-[#141212] sm:rounded-3xl"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800"
        >
          <X size={18} />
        </button>

        {/* Header Icon */}
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#9C4A2B]/10 text-[#9C4A2B]">
          <PenLine size={24} />
        </div>

        {/* Content */}
        <div className="mt-4 text-center">
          <h2
            id="contribute-title"
            className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white"
          >
            Contribute to Ututu History
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            Have history, lineage details, or a correction for Agu AI? Reach out
            directly to the developer to help refine our shared heritage.
          </p>
        </div>

        {/* Email Display Box */}
        <div className="mt-6 rounded-2xl border border-neutral-200 bg-slate-50 p-4 text-center dark:border-neutral-800 dark:bg-neutral-900/80">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Developer Contact
          </span>
          <p className="mt-1 font-mono text-base font-medium text-[#9C4A2B] select-all">
            {DEVELOPER_EMAIL}
          </p>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
          <a
            href={mailtoUrl}
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#9C4A2B] px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-[#853e24] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#9C4A2B]"
          >
            <Send size={16} />
            Send Email
          </a>
          <button
            onClick={handleCopyEmail}
            className="flex items-center justify-center gap-2 rounded-full border border-neutral-300 px-5 py-3 text-sm font-semibold text-neutral-700 transition-all hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            {copied ? (
              <Check size={16} className="text-emerald-500" />
            ) : (
              <Copy size={16} />
            )}
            {copied ? "Copied!" : "Copy Email"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Message Component with Copy & Web Share API                              */
/* -------------------------------------------------------------------------- */

function MessageItem({
  message,
  getText,
  onContribute,
}: {
  message: any;
  getText: (m: any) => string;
  onContribute: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const textContent = message.parts
    .map((p: any) => (p.type === "text" ? p.text : ""))
    .join("");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Agu AI - Ututu Knowledge",
          text: textContent,
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      handleCopy();
    }
  };

  const textLower = getText(message);
  const isMissing =
    message.role !== "user" &&
    (textLower.includes("not yet recorded") ||
      textLower.includes("not recorded") ||
      textLower.includes("isn't recorded") ||
      textLower.includes("is not recorded"));

  return (
    <div
      className={`group flex gap-3 ${
        message.role === "user" ? "justify-end" : "justify-start"
      }`}
    >
      {message.role !== "user" && (
        <Image
          src="/logo1.png"
          alt="Agu Avatar"
          width={28}
          height={28}
          className="h-7 w-7 rounded-full object-cover ring-1 ring-[#9C4A2B]/50 shrink-0"
        />
      )}
      <div className="max-w-[85%] flex flex-col">
        <div
          className={`relative rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
            message.role === "user"
              ? "bg-[#9C4A2B] text-white"
              : "border border-neutral-200 bg-white text-neutral-800 dark:border-neutral-800/80 dark:bg-neutral-900/60 dark:text-neutral-200"
          }`}
        >
          {message.parts.map((part: any, i: number) =>
            part.type === "text" ? (
              <span key={i} className="whitespace-pre-wrap">
                {part.text}
              </span>
            ) : null,
          )}
        </div>

        {/* Action Buttons */}
        <div
          className={`mt-1.5 flex items-center gap-1 text-xs text-neutral-400 ${
            message.role === "user" ? "justify-end" : "justify-start"
          }`}
        >
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 rounded-md px-1.5 py-0.5 hover:bg-neutral-200/50 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200 transition-colors"
            title="Copy message"
          >
            {copied ? (
              <Check size={13} className="text-emerald-500" />
            ) : (
              <Copy size={13} />
            )}
            <span className="text-[11px]">{copied ? "Copied" : "Copy"}</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-1 rounded-md px-1.5 py-0.5 hover:bg-neutral-200/50 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200 transition-colors"
            title="Share message"
          >
            <Share2 size={13} />
            <span className="text-[11px]">Share</span>
          </button>
        </div>

        {isMissing && (
          <button
            onClick={onContribute}
            className="mt-2 flex items-center gap-1.5 text-xs font-medium text-[#9C4A2B] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#9C4A2B]"
          >
            <PenLine size={13} />
            Know the answer? Contact the developer
          </button>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Chat Page Component                                                       */
/* -------------------------------------------------------------------------- */

export default function ChatPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [input, setInput] = useState("");
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [contributeOpen, setContributeOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Standard production useChat hook (no experimental options)
  const { messages, sendMessage, status } = useChat();

  useEffect(() => {
    setMounted(true);
    const fetchUser = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setCurrentUser(user);
      }
    };
    fetchUser();
  }, []);

  const handleSend = (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    // Send payload using standard stable options parameter
    sendMessage(
      { text },
      {
        body: {
          userProfile: currentUser
            ? {
                name:
                  currentUser.user_metadata?.full_name ||
                  currentUser.user_metadata?.name ||
                  currentUser.email?.split("@")[0],
                village: currentUser.user_metadata?.village,
                gender: currentUser.user_metadata?.gender,
              }
            : undefined,
        },
      },
    );

    setInput("");
  };

  const getText = (m: (typeof messages)[number]) =>
    m.parts
      .map((p) => (p.type === "text" ? p.text : ""))
      .join("")
      .toLowerCase();

  const samplePrompts = [
    {
      title: "History of Ututu",
      desc: "Tell me about the origin and founding fathers",
      icon: BookOpen,
    },
    {
      title: "Villages & Zones",
      desc: "List the autonomous communities in Ututu",
      icon: Compass,
    },
    {
      title: "Traditional Leadership",
      desc: "How is governance and chieftaincy structured?",
      icon: Shield,
    },
  ];

  const userFirstName = currentUser?.user_metadata?.full_name
    ? currentUser.user_metadata.full_name.split(" ")[0]
    : null;

  return (
    <main className="relative flex min-h-screen flex-col bg-slate-50 text-neutral-900 transition-colors duration-200 dark:bg-[#0C0B0B] dark:text-neutral-100 font-sans selection:bg-[#9C4A2B] selection:text-white">
      <ContributeModal
        open={contributeOpen}
        onClose={() => setContributeOpen(false)}
      />

      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        user={currentUser}
      />

      {/* Header */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-neutral-200/80 bg-slate-50/80 px-4 py-4 backdrop-blur-md dark:border-neutral-900/80 dark:bg-[#0C0B0B]/80 sm:px-6">
        <div className="flex items-center gap-3">
          <Image
            src="/logo1.png"
            alt="Agu AI Logo"
            width={32}
            height={32}
            className="rounded-full object-cover ring-2 ring-[#9C4A2B]/40"
          />
          <span className="font-semibold tracking-wide text-neutral-900 dark:text-neutral-200">
            Agu AI{" "}
            <span className="ml-1 text-xs font-mono text-[#9C4A2B]">
              Ututu Kernel
            </span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {currentUser && (
            <button
              onClick={() => setSettingsOpen(true)}
              className="flex h-9 items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 text-sm font-medium text-neutral-700 shadow-sm transition-all hover:border-[#9C4A2B]/60 hover:text-[#9C4A2B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#9C4A2B] dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300"
            >
              <Settings size={16} />
              <span className="hidden sm:inline">
                {userFirstName || "Profile"}
              </span>
            </button>
          )}

          <button
            onClick={() => setContributeOpen(true)}
            className="flex h-9 items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 text-sm font-medium text-neutral-700 shadow-sm transition-all hover:border-[#9C4A2B]/60 hover:text-[#9C4A2B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#9C4A2B] dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300"
          >
            <PenLine size={16} />
            <span className="hidden sm:inline">Add history</span>
          </button>

          {/* Theme Toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 shadow-sm transition-all hover:bg-neutral-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#9C4A2B] dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          )}
        </div>
      </header>

      {/* Main Container */}
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 pb-48 pt-6">
        {/* Welcome Screen */}
        {messages.length === 0 ? (
          <div className="my-auto flex flex-col items-center text-center">
            <div className="relative mb-6">
              <div className="absolute -inset-1 rounded-full bg-[#9C4A2B]/20 blur-xl"></div>
              <Image
                src="/logo1.png"
                alt="Agu Logo"
                width={80}
                height={80}
                className="relative rounded-full object-cover shadow-2xl ring-4 ring-[#9C4A2B]/30"
              />
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
              Ndewoo{userFirstName ? `, ${userFirstName}` : ""}, I am{" "}
              <span className="text-[#9C4A2B]">Agu</span>
            </h1>
            <p className="mt-2 max-w-md text-sm text-neutral-600 dark:text-neutral-400">
              The sovereign digital storyteller for the historic Ututu Kingdom.
            </p>

            {/* Quick Prompts */}
            <div className="mt-10 grid w-full grid-cols-1 gap-3 sm:grid-cols-3">
              {samplePrompts.map((prompt, idx) => {
                const Icon = prompt.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSend(prompt.title)}
                    className="group flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-4 text-left shadow-sm transition-all hover:border-[#9C4A2B]/60 hover:shadow-md dark:border-neutral-800/80 dark:bg-neutral-900/40 dark:hover:bg-neutral-900/90"
                  >
                    <div>
                      <Icon className="mb-3 h-5 w-5 text-[#9C4A2B] transition-transform group-hover:scale-110" />
                      <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-200">
                        {prompt.title}
                      </h3>
                      <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                        {prompt.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Contribution Banner */}
            <div className="mt-8 w-full rounded-2xl border border-dashed border-[#9C4A2B]/40 bg-[#9C4A2B]/5 p-4 text-left sm:flex sm:items-center sm:justify-between sm:gap-6">
              <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
                Ututu history is still being gathered. If something is missing,
                contact the developer and help preserve our story.
              </p>
              <button
                onClick={() => setContributeOpen(true)}
                className="mt-3 flex shrink-0 items-center gap-2 rounded-full bg-[#9C4A2B] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#853e24] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9C4A2B] sm:mt-0"
              >
                <PenLine size={15} />
                Add history
              </button>
            </div>
          </div>
        ) : (
          /* Message Stream */
          <div className="space-y-6 mb-8">
            {messages.map((m) => (
              <MessageItem
                key={m.id}
                message={m}
                getText={getText}
                onContribute={() => setContributeOpen(true)}
              />
            ))}

            {status === "submitted" && (
              <div className="flex items-center gap-3">
                <Image
                  src="/logo1.png"
                  alt="Agu"
                  width={28}
                  height={28}
                  className="h-7 w-7 animate-pulse rounded-full object-cover"
                />
                <div className="flex items-center gap-2 rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-xs text-neutral-500 dark:border-neutral-800/80 dark:bg-neutral-900/40 dark:text-neutral-400">
                  <Sparkles size={14} className="animate-spin text-[#9C4A2B]" />
                  <span>Consulting the oral traditions...</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Floating Input */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-slate-50 via-slate-50/90 to-transparent pb-4 pt-6 dark:from-[#0C0B0B] dark:via-[#0C0B0B]/90">
        <div className="relative mx-auto max-w-3xl px-4">
          <div className="absolute -inset-1 rounded-[2.5rem] bg-gradient-to-r from-[#9C4A2B]/30 via-[#9C4A2B]/10 to-[#9C4A2B]/30 blur-lg opacity-70 pointer-events-none transition-all duration-300"></div>

          <div className="relative rounded-3xl border border-neutral-200/90 bg-white/95 p-2 shadow-2xl backdrop-blur-xl transition-all focus-within:border-[#9C4A2B] focus-within:ring-2 focus-within:ring-[#9C4A2B]/30 dark:border-neutral-800/90 dark:bg-neutral-900/95">
            <textarea
              rows={2}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask Agu about Ututu..."
              className="w-full resize-none bg-transparent px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 outline-none dark:text-neutral-100 dark:placeholder-neutral-500"
            />

            <div className="flex items-center justify-between border-t border-neutral-200/60 px-2 pt-2 dark:border-neutral-800/60">
              <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                <Sparkles size={12} className="text-[#9C4A2B]" />
                <span>Ututu Knowledge Base Active</span>
              </div>

              <button
                onClick={() => handleSend()}
                disabled={!input.trim()}
                aria-label="Send message"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#9C4A2B] text-white transition-all hover:bg-[#853e24] disabled:opacity-30 disabled:hover:bg-[#9C4A2B]"
              >
                <ArrowUp size={18} />
              </button>
            </div>
          </div>

          <p className="mt-2 text-center text-xs text-neutral-500 dark:text-neutral-400">
            Something missing?{" "}
            <button
              onClick={() => setContributeOpen(true)}
              className="font-medium text-[#9C4A2B] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#9C4A2B]"
            >
              Contact the Agu developer
            </button>
          </p>
        </div>
      </div>
    </main>
  );
}
