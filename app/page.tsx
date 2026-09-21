"use client";

import { useChat } from "@ai-sdk/react";
import { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";
import {
  ArrowUp,
  Sparkles,
  Compass,
  BookOpen,
  Shield,
  Sun,
  Moon,
  PenLine,
  Mail,
  Copy,
  Check,
  X,
  Send,
} from "lucide-react";

const DEVELOPER_EMAIL = "kalubonifacedev@gmail.com";

/* -------------------------------------------------------------------------- */
/*  Contribute Modal (Clean Email Info Card)                                  */
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

        {/* Email Address Display Box */}
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
/*  Chat page                                                                 */
/* -------------------------------------------------------------------------- */

export default function ChatPage() {
  const { messages, sendMessage, status } = useChat();
  const [input, setInput] = useState("");
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [contributeOpen, setContributeOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSend = (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim()) return;
    sendMessage({ text });
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

  return (
    <main className="relative flex min-h-screen flex-col bg-slate-50 text-neutral-900 transition-colors duration-200 dark:bg-[#0C0B0B] dark:text-neutral-100 font-sans selection:bg-[#9C4A2B] selection:text-white">
      <ContributeModal
        open={contributeOpen}
        onClose={() => setContributeOpen(false)}
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
          <button
            onClick={() => setContributeOpen(true)}
            className="flex h-9 items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 text-sm font-medium text-neutral-700 shadow-sm transition-all hover:border-[#9C4A2B]/60 hover:text-[#9C4A2B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#9C4A2B] dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300"
          >
            <PenLine size={16} />
            <span className="hidden sm:inline">Add history</span>
          </button>

          {/* Theme Toggle Button */}
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
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 pb-40 pt-6">
        {/* Empty State / Welcome Screen */}
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
              Ndewoo, I am <span className="text-[#9C4A2B]">Agu</span>
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

            {/* Invitation to contribute */}
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
          /* Message History Stream */
          <div className="space-y-6">
            {messages.map((m) => {
              const text = getText(m);
              const isMissing =
                m.role !== "user" &&
                (text.includes("not yet recorded") ||
                  text.includes("not recorded") ||
                  text.includes("isn't recorded") ||
                  text.includes("is not recorded"));

              return (
                <div
                  key={m.id}
                  className={`flex gap-3 ${
                    m.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {m.role !== "user" && (
                    <Image
                      src="/logo1.png"
                      alt="Agu Avatar"
                      width={28}
                      height={28}
                      className="h-7 w-7 rounded-full object-cover ring-1 ring-[#9C4A2B]/50"
                    />
                  )}
                  <div className="max-w-[85%]">
                    <div
                      className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                        m.role === "user"
                          ? "bg-[#9C4A2B] text-white"
                          : "border border-neutral-200 bg-white text-neutral-800 dark:border-neutral-800/80 dark:bg-neutral-900/60 dark:text-neutral-200"
                      }`}
                    >
                      {m.parts.map((part, i) =>
                        part.type === "text" ? (
                          <span key={i} className="whitespace-pre-wrap">
                            {part.text}
                          </span>
                        ) : null,
                      )}
                    </div>

                    {isMissing && (
                      <button
                        onClick={() => setContributeOpen(true)}
                        className="mt-2 flex items-center gap-1.5 text-xs font-medium text-[#9C4A2B] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#9C4A2B]"
                      >
                        <PenLine size={13} />
                        Know the answer? Contact the developer
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

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

      {/* Floating Input Area */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-slate-50 via-slate-50/90 to-transparent pb-4 pt-4 dark:from-[#0C0B0B] dark:via-[#0C0B0B]/90">
        <div className="mx-auto max-w-3xl px-4">
          <div className="relative rounded-3xl border border-neutral-200 bg-white/90 p-2 shadow-xl backdrop-blur-xl transition-all focus-within:border-[#9C4A2B]/80 focus-within:ring-1 focus-within:ring-[#9C4A2B]/80 dark:border-neutral-800 dark:bg-neutral-900/90">
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
