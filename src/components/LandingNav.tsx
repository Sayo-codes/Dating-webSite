"use client";

import Link from "next/link";

export function LandingNav() {
  return (
    <div
      className="absolute inset-x-0 top-0 z-40 bg-[#0a0a0f]/95 backdrop-blur-xl border-b"
      style={{ borderBottomColor: "rgba(212,168,83,0.12)" }}
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:h-[72px] sm:px-6 lg:px-10">
        <Link
          href="/"
          className="focus-outline font-[var(--font-heading)] text-lg font-bold tracking-tight text-white sm:text-xl"
          style={{ textShadow: "0 1px 6px rgba(0,0,0,0.5)" }}
        >
          Rsdate
        </Link>

        <div className="flex items-center gap-2.5 sm:gap-3">
          <Link
            href="/login"
            className="focus-outline inline-flex min-h-[42px] items-center justify-center rounded-full border border-white/25 bg-[#07070b]/80 px-4 text-sm font-semibold text-white/90 transition-colors duration-200 hover:border-[#d4a853]/45 hover:text-[#f0c97a] sm:min-h-[42px] sm:px-5"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="focus-outline pill-button-primary inline-flex min-h-[42px] items-center justify-center rounded-full px-4 text-sm font-bold text-white sm:min-h-[42px] sm:px-5"
          >
            Sign Up ✦
          </Link>
        </div>
      </div>
    </div>
  );
}
