import Link from "next/link";
import { Lock, MessageCircle, ShieldCheck, Sparkles } from "lucide-react";
import { PrimaryButton } from "@/shared/ui/PrimaryButton";

const HERO_STATS = [
  { label: "18,230+", sub: "Members" },
  { label: "100%", sub: "Face-Verified" },
  { label: "92%", sub: "Response Rate" },
] as const;

function HeroAbstractVisual({ className }: { className?: string }) {
  return (
    <div
      className={className}
      aria-hidden
    >
      <div className="relative mx-auto w-full max-w-[420px] lg:max-w-none">
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[min(100%,420px)] w-[min(100%,420px)] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-35 blur-[100px]"
          style={{
            background:
              "radial-gradient(circle, rgba(212,168,83,0.45) 0%, rgba(255,45,120,0.2) 45%, transparent 70%)",
          }}
        />

        <div
          className="relative mx-auto aspect-[4/5] max-h-[min(520px,62vh)] w-full max-w-[340px] sm:max-w-[380px] lg:max-h-[min(540px,58vh)] lg:max-w-[400px]"
          style={{ animation: "float 7s ease-in-out infinite" }}
        >
          <div
            className="absolute inset-0 rounded-[28px] border border-white/[0.12] bg-gradient-to-br from-white/[0.07] to-white/[0.02] shadow-[0_32px_80px_rgba(0,0,0,0.65)] backdrop-blur-xl"
            style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.06)" }}
          >
            <div className="flex items-center gap-2 border-b border-white/[0.06] px-5 py-4">
              <span className="status-dot status-dot--online" />
              <span className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-white/40">
                Your private space
              </span>
            </div>
            <div className="space-y-3 p-5">
              {[
                { align: "start" as const, w: 72 },
                { align: "end" as const, w: 64 },
                { align: "start" as const, w: 88 },
                { align: "end" as const, w: 52 },
              ].map((row, i) => (
                <div
                  key={i}
                  className={`flex ${row.align === "end" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className="h-10 rounded-2xl bg-white/[0.06] ring-1 ring-white/[0.04]"
                    style={{ width: `${row.w}%`, maxWidth: "100%" }}
                  />
                </div>
              ))}
              <div className="flex justify-center pt-2">
                <div
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[0.7rem] text-white/45"
                >
                  <MessageCircle className="h-3.5 w-3.5 text-[#d4a853]/90" strokeWidth={2} />
                  End-to-end discretion
                </div>
              </div>
            </div>
          </div>

          <div
            className="glass-card glass-card--gold absolute -right-1 top-[10%] z-10 w-[min(200px,52vw)] rounded-2xl p-3.5 shadow-lg sm:-right-2 sm:w-[220px]"
            style={{ animation: "float 5.5s ease-in-out infinite", animationDelay: "0.3s" }}
          >
            <div className="flex items-start gap-3">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white"
                style={{ background: "var(--gradient-primary)" }}
              >
                <ShieldCheck className="h-5 w-5" strokeWidth={2} />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Verified creators</p>
                <p className="mt-0.5 text-[0.65rem] leading-snug text-white/50">
                  Identity &amp; face checks on every profile
                </p>
              </div>
            </div>
          </div>

          <div
            className="glass-card absolute -left-2 bottom-[14%] z-10 w-[min(190px,50vw)] rounded-2xl border border-white/10 bg-white/[0.05] p-3.5 backdrop-blur-md sm:-left-4 sm:w-[210px]"
            style={{ animation: "float 6.2s ease-in-out infinite", animationDelay: "0.8s" }}
          >
            <div className="flex items-start gap-3">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-[#f0c97a]"
              >
                <Lock className="h-5 w-5" strokeWidth={2} />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Private by design</p>
                <p className="mt-0.5 text-[0.65rem] leading-snug text-white/50">
                  Encrypted messaging &amp; locked media
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function HeroSection() {
  return (
    <section
      className="relative min-h-[calc(100vh-64px)] flex items-center overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* Atmospheric background blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/4 h-[600px] w-[600px] rounded-full opacity-20 blur-[120px]"
        style={{ background: "radial-gradient(circle, #d4a853 0%, transparent 70%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/3 right-0 h-[500px] w-[500px] rounded-full opacity-15 blur-[100px]"
        style={{ background: "radial-gradient(circle, #ff2d78 0%, transparent 70%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full opacity-10 blur-[90px]"
        style={{ background: "radial-gradient(circle, #c778ff 0%, transparent 70%)" }}
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10 py-16 sm:py-20 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(300px,0.95fr)] lg:gap-14 xl:gap-20">
          <div className="mx-auto w-full max-w-2xl space-y-7 text-center lg:mx-0 lg:max-w-none lg:text-left">

            {/* Badge */}
            <p
              className="animate-fade-up inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] lg:mx-0 mx-auto"
              style={{
                borderColor: "rgba(212,168,83,0.35)",
                background: "rgba(212,168,83,0.08)",
                color: "#f0c97a",
              }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#3dff9a] shadow-[0_0_8px_rgba(61,255,154,0.8)]" />
              Exclusive · Private · Verified
            </p>

            {/* Headline */}
            <h1
              id="hero-heading"
              className="animate-fade-up-delay-1 font-[var(--font-heading)] text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl"
            >
              Join Now to{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #f0c97a 0%, #d4a853 40%, #ff2d78 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Unlock Exclusive
              </span>{" "}
              Content
            </h1>

            {/* Sub-copy */}
            <p className="animate-fade-up-delay-2 mx-auto max-w-xl text-base leading-relaxed text-white/65 lg:mx-0 lg:text-lg">
              A luxury dark-mode platform connecting you with verified, face-checked creators.
              Discreet, intimate, and built for real connections.
            </p>

            {/* Value chips */}
            <div className="animate-fade-up-delay-2 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
              {[
                { icon: ShieldCheck, label: "Face-checked" },
                { icon: Lock, label: "Private media" },
                { icon: Sparkles, label: "Premium experience" },
              ].map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[0.7rem] font-medium text-white/70"
                >
                  <Icon className="h-3.5 w-3.5 text-[#d4a853]" strokeWidth={2} />
                  {label}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div className="animate-fade-up-delay-3 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <Link href="/register" className="inline-flex min-h-[52px] items-center">
                <PrimaryButton size="lg" className="px-8 text-base font-semibold tracking-wide">
                  Join Now — It&apos;s Free ✦
                </PrimaryButton>
              </Link>
              <Link
                href="/creators"
                className="focus-outline inline-flex min-h-[52px] items-center justify-center rounded-full border px-7 text-base font-medium text-white/80 transition-all duration-250 hover:border-[rgba(212,168,83,0.5)] hover:bg-[rgba(212,168,83,0.08)] hover:text-[#f0c97a]"
                style={{ borderColor: "rgba(255,255,255,0.14)" }}
              >
                Explore Creators
              </Link>
            </div>

            {/* Trust facts — full-width glass bar */}
            <div
              className="animate-fade-up-delay-4 rounded-2xl border border-white/[0.1] bg-white/[0.04] p-5 shadow-[0_16px_48px_rgba(0,0,0,0.35)] backdrop-blur-md sm:p-6"
              style={{ boxShadow: "0 16px 48px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04)" }}
            >
              <div className="grid grid-cols-3 gap-4 divide-x divide-white/10 sm:gap-6">
                {HERO_STATS.map(({ label, sub }) => (
                  <div key={sub} className="flex flex-col items-center gap-1 px-2 first:pl-0 last:pr-0 lg:items-start lg:pl-4 lg:first:pl-0">
                    <span
                      className="text-xl font-bold tabular-nums sm:text-2xl"
                      style={{
                        background: "linear-gradient(135deg, #f0c97a, #d4a853)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      {label}
                    </span>
                    <span className="text-center text-[0.65rem] uppercase tracking-widest text-white/45 lg:text-left">
                      {sub}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <HeroAbstractVisual className="hidden lg:block" />
        </div>

        <HeroAbstractVisual className="mt-4 lg:hidden" />
      </div>

      {/* Scroll hint */}
      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/30 animate-fade-in"
        aria-hidden
        style={{ animationDelay: "1.5s" }}
      >
        <span className="text-[0.6rem] uppercase tracking-widest">Scroll</span>
        <div
          className="h-8 w-0.5 rounded-full"
          style={{
            background: "linear-gradient(180deg, rgba(212,168,83,0.5), transparent)",
            animation: "float 1.8s ease-in-out infinite",
          }}
        />
      </div>
    </section>
  );
}
