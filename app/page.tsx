"use client";

import { useChat } from "@ai-sdk/react";
import { useState, useEffect } from "react";
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
} from "lucide-react";

export default function ChatPage() {
  const { messages, sendMessage, status } = useChat();
  const [input, setInput] = useState("");
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch on initial render
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSend = (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim()) return;
    sendMessage({ text });
    setInput("");
  };

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
      {/* Header */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-neutral-200/80 bg-slate-50/80 px-6 py-4 backdrop-blur-md dark:border-neutral-900/80 dark:bg-[#0C0B0B]/80">
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
            <span className="text-xs text-[#9C4A2B] font-mono ml-1">
              Ututu Kernel
            </span>
          </span>
        </div>

        {/* Theme Toggle Button */}
        {mounted && (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 shadow-sm transition-all hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        )}
      </header>

      {/* Main Container */}
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 pb-36 pt-6">
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
              Nnoo, I am <span className="text-[#9C4A2B]">Agu</span>
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
          </div>
        ) : (
          /* Message History Stream */
          <div className="space-y-6">
            {messages.map((m) => (
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
                <div
                  className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm max-w-[85%] ${
                    m.role === "user"
                      ? "bg-[#9C4A2B] text-white"
                      : "border border-neutral-200 bg-white text-neutral-800 shadow-sm dark:border-neutral-800/80 dark:bg-neutral-900/60 dark:text-neutral-200"
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
              </div>
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

      {/* Floating Input Area */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-slate-50 via-slate-50/90 to-transparent pb-6 pt-4 dark:from-[#0C0B0B] dark:via-[#0C0B0B]/90">
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
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#9C4A2B] text-white transition-all hover:bg-[#853e24] disabled:opacity-30 disabled:hover:bg-[#9C4A2B]"
              >
                <ArrowUp size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
