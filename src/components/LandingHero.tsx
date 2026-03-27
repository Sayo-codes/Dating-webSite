"use client";

import Link from "next/link";

export function LandingHero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#07070b] text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 72% 56% at 50% 42%, rgba(255,45,120,0.18) 0%, rgba(212,168,83,0.14) 35%, rgba(7,7,11,0) 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-20 top-[20%] h-[320px] w-[320px] rounded-full blur-[120px]"
        style={{ background: "rgba(255,45,120,0.18)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 bottom-[18%] h-[320px] w-[320px] rounded-full blur-[120px]"
        style={{ background: "rgba(212,168,83,0.16)" }}
      />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 sm:px-6 lg:px-10">
        <div className="flex flex-1 items-center justify-center pb-16 pt-24 sm:pb-24 sm:pt-28">
          <div className="mx-auto max-w-3xl text-center">
            <p className="section-heading mb-3">✦ Private Luxury Dating</p>
            <h1 className="font-[var(--font-heading)] text-4xl font-bold leading-tight tracking-[-0.02em] sm:text-6xl lg:text-7xl">
              Find your perfect match ✦
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/80 sm:text-xl">
              Private. Exclusive. Verified connections with premium creators in a refined, secure space.
            </p>
            <div className="mt-8">
              <Link
                href="/register"
                className="pill-button-primary focus-outline inline-flex min-h-[54px] items-center justify-center rounded-full bg-gradient-to-r from-[#d4a853] to-[#ff2d78] px-9 text-base font-semibold text-white opacity-100 shadow-[0_14px_36px_rgba(212,168,83,0.32)] transition-[filter,transform] duration-200 hover:brightness-110 hover:scale-[1.01]"
              >
                Join Now ✦
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
