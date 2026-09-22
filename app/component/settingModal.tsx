"use client";

import {
  X,
  User,
  MapPin,
  Phone,
  Mail,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "../lib/superbae/client";

export default function SettingsModal({
  open,
  onClose,
  user,
}: {
  open: boolean;
  onClose: () => void;
  user: any;
}) {
  const router = useRouter();

  if (!open) return null;

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  const meta = user?.user_metadata || {};

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-3xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-[#121111]"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 border-b border-neutral-100 pb-4 dark:border-neutral-800/80">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#9C4A2B]/10 text-[#9C4A2B]">
            <User size={24} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
              {meta.full_name || "Ututu Citizen"}
            </h2>
            <p className="text-xs text-neutral-500">{user?.email}</p>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          <div className="flex items-center gap-3 rounded-2xl border border-neutral-100 bg-neutral-50/60 p-3.5 dark:border-neutral-800/60 dark:bg-neutral-900/40">
            <MapPin size={18} className="text-[#9C4A2B]" />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                Village
              </p>
              <p className="text-xs font-medium text-neutral-800 dark:text-neutral-200">
                {meta.village || "Not set"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-neutral-100 bg-neutral-50/60 p-3.5 dark:border-neutral-800/60 dark:bg-neutral-900/40">
            <Phone size={18} className="text-[#9C4A2B]" />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                Phone
              </p>
              <p className="text-xs font-medium text-neutral-800 dark:text-neutral-200">
                {meta.phone_number || "Not set"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-neutral-100 bg-neutral-50/60 p-3.5 dark:border-neutral-800/60 dark:bg-neutral-900/40">
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

        <button
          onClick={handleSignOut}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-red-500/10 py-3 text-xs font-semibold text-red-600 transition-colors hover:bg-red-500/20 dark:text-red-400"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </div>
  );
}
