"use client";

import Link from "next/link";

export function LandingNav() {
  return (
    <div className="absolute inset-x-0 top-0 z-40">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-[72px] sm:px-6 lg:px-10">
        <Link
          href="/"
          className="focus-outline font-[var(--font-heading)] text-lg font-bold tracking-tight text-white sm:text-xl"
        >
          Velvet Signal
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/login"
            className="focus-outline inline-flex min-h-[40px] items-center justify-center rounded-full border border-white/20 bg-[#07070b]/70 px-3.5 text-sm font-medium text-white/90 transition-colors duration-200 hover:border-[#d4a853]/45 hover:text-[#f0c97a] sm:min-h-[42px] sm:px-4"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="focus-outline inline-flex min-h-[40px] items-center justify-center rounded-full border border-white/16 bg-white/5 px-3.5 text-sm font-medium text-white/90 transition-colors duration-200 hover:border-[#ff2d78]/45 hover:text-white sm:min-h-[42px] sm:px-4"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
