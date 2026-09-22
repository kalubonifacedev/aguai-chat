"use client";

import Image from "next/image";

/**
 * Agu loader — A clean, animated round logo loader with orbital rings,
 * breathing ambient glow, and refined typography.
 *
 * Usage:
 *   <AguLoader />                           // medium, no label
 *   <AguLoader label="Signing you in..." />
 *   <AguLoader size="sm" />
 *   <AguLoader fullScreen label="Loading Agu..." />
 */

type AguLoaderProps = {
  size?: "sm" | "md" | "lg";
  label?: string;
  fullScreen?: boolean;
  className?: string;
};

const SIZES: Record<
  NonNullable<AguLoaderProps["size"]>,
  { box: number; logo: number; ringWidth: string; glow: string }
> = {
  sm: { box: 44, logo: 30, ringWidth: "border-2", glow: "blur-md" },
  md: { box: 72, logo: 50, ringWidth: "border-[2.5px]", glow: "blur-xl" },
  lg: { box: 104, logo: 76, ringWidth: "border-3", glow: "blur-2xl" },
};

export function AguLoader({
  size = "md",
  label,
  fullScreen = false,
  className = "",
}: AguLoaderProps) {
  const { box, logo, ringWidth, glow } = SIZES[size];

  const spinner = (
    <div
      className={`flex flex-col items-center justify-center gap-3.5 ${className}`}
    >
      <div
        className="relative flex items-center justify-center"
        style={{ width: box, height: box }}
      >
        {/* Ambient Radial Soft Glow */}
        <div
          className={`absolute inset-0 animate-pulse rounded-full bg-[#9C4A2B]/30 ${glow}`}
          style={{ animationDuration: "2.5s" }}
        />

        {/* Outer Orbital Ring (Counter-Clockwise Smooth) */}
        <div
          className={`absolute inset-0 rounded-full ${ringWidth} border-[#9C4A2B]/15 border-b-[#9C4A2B]/80 animate-spin`}
          style={{ animationDuration: "2s", animationDirection: "reverse" }}
        />

        {/* Inner Primary Spinner Ring (Clockwise Fast) */}
        <div
          className={`absolute inset-1 rounded-full ${ringWidth} border-transparent border-t-[#9C4A2B] border-r-[#9C4A2B]/50 animate-spin`}
          style={{ animationDuration: "0.95s" }}
        />

        {/* Center Logo with Breathing Pulse */}
        <div className="relative z-10 flex items-center justify-center rounded-full bg-white/10 p-0.5 backdrop-blur-xs transition-transform dark:bg-black/20">
          <div
            className="animate-pulse rounded-full shadow-md shadow-[#9C4A2B]/10"
            style={{ animationDuration: "2.2s" }}
          >
            <Image
              src="/logo1.png"
              alt="Agu"
              width={logo}
              height={logo}
              className="rounded-full object-cover"
              priority
            />
          </div>
        </div>
      </div>

      {/* Animated Label */}
      {label && (
        <div className="flex items-center gap-1.5 text-xs font-medium tracking-wide text-neutral-600 dark:text-neutral-300">
          <span>{label}</span>
          <span className="flex gap-0.5">
            <span className="h-1 w-1 animate-bounce rounded-full bg-[#9C4A2B] [animation-delay:-0.3s]" />
            <span className="h-1 w-1 animate-bounce rounded-full bg-[#9C4A2B] [animation-delay:-0.15s]" />
            <span className="h-1 w-1 animate-bounce rounded-full bg-[#9C4A2B]" />
          </span>
        </div>
      )}
    </div>
  );

  if (!fullScreen) return spinner;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-md transition-all dark:bg-[#0C0B0B]/85">
      {spinner}
    </div>
  );
}

export default AguLoader;
