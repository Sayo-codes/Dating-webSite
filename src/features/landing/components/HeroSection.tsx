import Link from "next/link";
import { PrimaryButton } from "@/shared/ui/PrimaryButton";
import { SecondaryButton } from "@/shared/ui/SecondaryButton";

export function HeroSection() {
  return (
    <section
      className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-center"
      aria-labelledby="hero-heading"
    >
      <div className="space-y-6">
        <p className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-white/70 shadow-[var(--shadow-soft-subtle)] backdrop-blur transition-colors duration-200">
          Exclusive • Private • Verified
        </p>
        <h1
          id="hero-heading"
          className="text-balance font-[var(--font-heading)] text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl"
        >
          Private. Exclusive. Verified Models.
        </h1>
        <p className="max-w-xl text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">
          A luxury dark-mode chat experience with verified models. Discreet,
          invite-only, and designed for fast, intimate conversations.
        </p>
        <div className="flex flex-wrap gap-3 sm:gap-4">
          <Link href="/register" className="min-h-[44px] inline-flex items-center">
            <PrimaryButton size="md">Join Free</PrimaryButton>
          </Link>
          <Link href="/login" className="min-h-[44px] inline-flex items-center">
            <SecondaryButton size="md">Login</SecondaryButton>
          </Link>
        </div>
        <div className="mt-8 flex flex-wrap gap-8 text-sm text-[var(--text-muted)]">
          <div>
            <p className="section-heading mb-1">Security</p>
            <p className="text-[var(--text-secondary)]">End-to-end UX designed for privacy.</p>
          </div>
          <div>
            <p className="section-heading mb-1">Verification</p>
            <p className="text-[var(--text-secondary)]">Every model is face-verified.</p>
          </div>
        </div>
      </div>

      <div className="relative h-[320px] lg:h-[360px]" aria-hidden="true">
        <div className="absolute inset-0 rounded-[32px] bg-[radial-gradient(circle_at_top,#c778ff33,transparent_55%),radial-gradient(circle_at_bottom,#4dd5ff33,transparent_60%)] opacity-80 blur-3xl" />
        <div className="relative flex h-full items-center justify-center">
          <div className="glass-card relative flex w-full max-w-xs flex-col gap-4 p-5 shadow-[var(--shadow-card)]">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-indigo-400 to-fuchsia-400" />
              <div>
                <p className="text-sm font-medium">Eva • 24</p>
                <p className="flex items-center gap-2 text-[0.7rem] text-white/60">
                  <span className="status-dot status-dot--online" />
                  Online • VIP Model
                </p>
              </div>
            </div>
            <div className="space-y-1 text-xs text-white/60">
              <p>
                “Verified, discreet and private. I&apos;ll be online tonight for
                live chat.”
              </p>
            </div>
            <PrimaryButton className="mt-2 w-full py-2 text-xs font-semibold tracking-wide">
              Chat Now
            </PrimaryButton>
          </div>
        </div>
      </div>
    </section>
  );
}

