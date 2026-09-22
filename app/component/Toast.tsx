"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

export type ToastType = "success" | "error";

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
  action?: ToastAction;
}

interface ToastContextType {
  showMessage: (type: ToastType, message: string, action?: ToastAction) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showMessage = useCallback(
    (type: ToastType, message: string, action?: ToastAction) => {
      const id = Math.random().toString(36).substring(2, 9);

      setToasts((prev) => [...prev, { id, type, message, action }]);

      // Auto dismiss after 5 seconds
      setTimeout(() => {
        removeToast(id);
      }, 5000);
    },
    [removeToast],
  );

  return (
    <ToastContext.Provider value={{ showMessage }}>
      {children}

      {/* Top-Center Toast Container */}
      <div
        aria-live="assertive"
        className="fixed top-5 left-1/2 -translate-x-1/2 z-[9999] flex flex-col items-center gap-2 max-w-md w-full pointer-events-none px-4"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-full border shadow-2xl backdrop-blur-xl transition-all duration-300 animate-in fade-in slide-in-from-top-4 w-full sm:w-auto ${
              toast.type === "success"
                ? "bg-zinc-950/85 border-emerald-500/20 text-zinc-100 shadow-emerald-950/20"
                : "bg-zinc-950/85 border-rose-500/20 text-zinc-100 shadow-rose-950/20"
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {toast.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              )}

              <p className="text-xs sm:text-sm font-medium leading-none text-zinc-200 truncate">
                {toast.message}
              </p>

              {toast.action && (
                <button
                  onClick={() => {
                    toast.action?.onClick();
                    removeToast(toast.id);
                  }}
                  className="ml-1 text-xs font-semibold underline underline-offset-2 hover:opacity-80 transition-opacity text-amber-400 shrink-0"
                >
                  {toast.action.label}
                </button>
              )}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-zinc-400 hover:text-zinc-100 p-1 rounded-full hover:bg-zinc-800/50 transition-colors shrink-0 -mr-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
