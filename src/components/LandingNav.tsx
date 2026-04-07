"use client";

import Link from "next/link";

export function LandingNav() {
  return (
    <div
      className="absolute inset-x-0 top-0 z-40 border-b"
      style={{
        background: "rgba(10,10,15,0.92)",
        borderBottomColor: "rgba(212,168,83,0.12)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        transform: "translateZ(0)",
        willChange: "transform",
      }}
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:h-[68px] sm:px-6 lg:px-10">
        {/* Logo */}
        <Link
          href="/"
          className="focus-outline flex items-center gap-2 min-h-[44px] shrink-0"
          aria-label="Rsdate home"
        >
          <span
            className="relative flex h-7 w-7 items-center justify-center rounded-lg sm:h-8 sm:w-8 sm:rounded-xl"
            style={{ background: "linear-gradient(135deg, #d4a853 0%, #ff2d78 100%)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M12 2L2 9l10 13 10-13L12 2z" fill="rgba(255,255,255,0.9)" />
              <path d="M2 9h20M7 2l-5 7 10 13M17 2l5 7-10 13" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
            </svg>
          </span>
          <span
            className="font-[var(--font-heading)] text-lg font-bold tracking-tight sm:text-xl"
            style={{
              background: "linear-gradient(135deg, #f0c97a 0%, #d4a853 45%, #ff2d78 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Rsdate
          </span>
        </Link>

        {/* Auth buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/login"
            className="focus-outline inline-flex min-h-[40px] items-center justify-center rounded-full border px-4 text-sm font-semibold text-white/85 transition-all duration-200 hover:border-[rgba(212,168,83,0.6)] hover:bg-[rgba(212,168,83,0.08)] hover:text-[#f0c97a] sm:px-5"
            style={{ borderColor: "rgba(255,255,255,0.22)" }}
          >
            Login
          </Link>
          <Link
            href="/register"
            className="focus-outline pill-button-primary inline-flex min-h-[40px] items-center justify-center rounded-full px-4 text-sm font-bold text-white sm:px-5"
          >
            Sign Up ✦
          </Link>
        </div>
      </div>
    </div>
  );
}
