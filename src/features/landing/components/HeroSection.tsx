"use client";

import Link from "next/link";
import Image from "next/image";

const TRUST_STATS = [
  { value: "18,230+", label: "Members" },
  { value: "100%", label: "Face-Verified" },
  { value: "92%", label: "Response Rate" },
] as const;

/** Animated floating particles to simulate a romantic bokeh feel */
function BokeParticles() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {Array.from({ length: 18 }).map((_, i) => {
        const size = 4 + (i % 5) * 2;
        const x = (i * 37 + 11) % 100;
        const y = (i * 53 + 7) % 100;
        const delay = (i * 0.4) % 4;
        const duration = 6 + (i % 4) * 2;
        const isGold = i % 3 !== 2;
        return (
          <span
            key={i}
            className="absolute rounded-full"
            style={{
              width: size,
              height: size,
              left: `${x}%`,
              top: `${y}%`,
              background: isGold
                ? "radial-gradient(circle, rgba(212,168,83,0.85), rgba(240,201,122,0.3))"
                : "radial-gradient(circle, rgba(255,45,120,0.75), rgba(255,111,163,0.2))",
              boxShadow: isGold
                ? `0 0 ${size * 3}px rgba(212,168,83,0.5)`
                : `0 0 ${size * 3}px rgba(255,45,120,0.45)`,
              animation: `float ${duration}s ease-in-out ${delay}s infinite`,
              opacity: 0.6 + (i % 3) * 0.15,
              filter: `blur(${i % 2}px)`,
            }}
          />
        );
      })}
    </div>
  );
}

export function HeroSection() {
  return (
    <section
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* ── IMAGE 1: Intimate couple — hero background for romantic atmosphere ── */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/landing/couple-intimate.jpg"
          alt=""
          fill
          className="object-cover object-[center_30%]"
          sizes="100vw"
          priority
          quality={85}
          style={{ filter: "brightness(0.55) saturate(1.3)" }}
        />
      </div>

      {/* ── Deep dark overlay with romantic gradient ── */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(180deg, rgba(7,7,11,0.35) 0%, rgba(19,10,31,0.45) 30%, rgba(7,7,11,0.65) 70%, rgba(7,7,11,0.92) 100%)",
        }}
      />

      {/* ── Rose / gold tint overlay for warmth ── */}
      <div
        className="absolute inset-0 z-[2]"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 120% 90% at 50% 50%, rgba(212,168,83,0.12) 0%, rgba(255,45,120,0.08) 40%, transparent 70%)",
          mixBlendMode: "screen",
        }}
      />

      {/* ── Romantic atmospheric blobs ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-[10%] top-[15%] z-[3] h-[520px] w-[520px] rounded-full opacity-25 blur-[140px]"
        style={{ background: "radial-gradient(circle, #d4a853 0%, transparent 70%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-[8%] top-[20%] z-[3] h-[480px] w-[480px] rounded-full opacity-18 blur-[120px]"
        style={{ background: "radial-gradient(circle, #ff2d78 0%, transparent 70%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[5%] left-[30%] z-[3] h-[400px] w-[400px] rounded-full opacity-15 blur-[110px]"
        style={{ background: "radial-gradient(circle, #c778ff 0%, transparent 70%)" }}
      />
      {/* Center warm glow — simulate couple / connection */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 z-[3] h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-10 blur-[160px]"
        style={{ background: "radial-gradient(circle, rgba(212,168,83,0.6) 0%, rgba(255,45,120,0.3) 50%, transparent 75%)" }}
      />

      {/* ── Bokeh particles ── */}
      <div className="z-[4]">
        <BokeParticles />
      </div>

      {/* ── Soft vignette overlay ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[5]"
        style={{
          background:
            "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 30%, rgba(7,7,11,0.6) 80%, rgba(7,7,11,0.9) 100%)",
        }}
      />

      {/* ── Couple silhouette SVG illustration ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[5] flex items-center justify-center opacity-[0.04]"
      >
        <svg
          viewBox="0 0 800 600"
          className="h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Woman silhouette */}
          <ellipse cx="340" cy="180" rx="38" ry="48" fill="url(#goldGrad)" />
          <path d="M290 600 Q310 320 340 260 Q370 320 390 600Z" fill="url(#goldGrad)" />
          <path d="M260 400 Q290 280 340 270 Q340 320 320 360 Q290 390 260 400Z" fill="url(#goldGrad)" />
          <path d="M420 400 Q390 280 340 270 Q340 320 360 360 Q390 390 420 400Z" fill="url(#goldGrad)" />
          {/* Man silhouette */}
          <ellipse cx="460" cy="175" rx="42" ry="50" fill="url(#pinkGrad)" />
          <path d="M400 600 Q430 310 460 255 Q490 310 520 600Z" fill="url(#pinkGrad)" />
          <path d="M365 380 Q395 265 460 260 Q455 310 430 350 Q400 375 365 380Z" fill="url(#pinkGrad)" />
          <path d="M555 380 Q525 265 460 260 Q465 310 490 350 Q520 375 555 380Z" fill="url(#pinkGrad)" />
          <defs>
            <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f0c97a" />
              <stop offset="100%" stopColor="#d4a853" />
            </linearGradient>
            <linearGradient id="pinkGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff6fa3" />
              <stop offset="100%" stopColor="#ff2d78" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* ── Hero content ── */}
      <div className="relative z-10 mx-auto w-full max-w-5xl px-4 py-24 text-center sm:px-6 sm:py-32 lg:px-10">

        {/* Badge */}
        <div className="animate-fade-up mb-8 flex justify-center">
          <span
            className="inline-flex items-center gap-2 rounded-full border px-5 py-2 text-xs font-semibold uppercase tracking-[0.22em]"
            style={{
              borderColor: "rgba(212,168,83,0.4)",
              background: "rgba(212,168,83,0.08)",
              color: "#f0c97a",
              backdropFilter: "blur(12px)",
            }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{
                background: "#3dff9a",
                boxShadow: "0 0 8px rgba(61,255,154,0.9)",
                animation: "pulse-online 2s ease-in-out infinite",
              }}
            />
            Private · Exclusive · Verified
          </span>
        </div>

        {/* Main headline */}
        <h1
          id="hero-heading"
          className="animate-fade-up-delay-1 font-[var(--font-heading)] text-5xl font-bold leading-[1.08] tracking-[-0.03em] sm:text-6xl lg:text-7xl xl:text-8xl"
          style={{ textShadow: "0 2px 40px rgba(0,0,0,0.5)" }}
        >
          Find Your{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #f0c97a 0%, #d4a853 35%, #ff2d78 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Spark ✦
          </span>
        </h1>

        {/* Sub-headline */}
        <p
          className="animate-fade-up-delay-2 mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/70 sm:text-xl"
          style={{ textShadow: "0 1px 20px rgba(0,0,0,0.4)" }}
        >
          Meet high-quality creators &amp; genuine connections in a&nbsp;luxurious,&nbsp;safe space.{" "}
          <span className="text-white/90">Private. Exclusive. Verified.</span>
        </p>

        {/* Secondary tagline */}
        <p
          className="animate-fade-up-delay-2 mx-auto mt-4 flex items-center justify-center gap-2 text-base font-medium tracking-wide sm:text-lg"
          style={{
            background: "linear-gradient(135deg, #f0c97a 0%, #ff6fa3 50%, #ff2d78 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            textShadow: "none",
          }}
        >
          <span style={{ WebkitTextFillColor: "initial", filter: "none" }}>🚀</span>
          Non-stop fun 24h — Connect with models anytime on Rsdate
        </p>

        {/* CTA button */}
        <div className="animate-fade-up-delay-3 mt-10 flex justify-center">
          <Link
            href="/register"
            id="hero-cta-primary"
            className="pill-button-primary focus-outline inline-flex min-h-[58px] w-full items-center justify-center rounded-full px-10 text-base font-bold tracking-wide sm:w-auto sm:text-lg"
          >
            Join Here ✦
          </Link>
        </div>

        {/* Trust line */}
        <p className="animate-fade-up-delay-4 mt-6 text-xs font-medium tracking-wide text-white/35 uppercase sm:text-sm">
          Over 18,000 members &nbsp;·&nbsp; Verified profiles &nbsp;·&nbsp; 100% private
        </p>

        {/* Stats bar */}
        <div
          className="animate-fade-up-delay-4 mx-auto mt-14 grid max-w-lg grid-cols-3 rounded-2xl border sm:max-w-xl"
          style={{
            borderColor: "rgba(255,255,255,0.1)",
            background: "rgba(255,255,255,0.03)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 16px 48px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.05)",
          }}
        >
          {TRUST_STATS.map(({ value, label }, i) => (
            <div
              key={label}
              className="flex flex-col items-center gap-1 px-4 py-5"
              style={i > 0 ? { borderLeft: "1px solid rgba(255,255,255,0.09)" } : {}}
            >
              <span
                className="font-[var(--font-heading)] text-2xl font-bold tabular-nums sm:text-3xl"
                style={{
                  background: "linear-gradient(135deg, #f0c97a, #d4a853)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {value}
              </span>
              <span className="text-[0.6rem] uppercase tracking-widest text-white/40 sm:text-[0.65rem]">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Scroll hint ── */}
      <div
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 flex flex-col items-center gap-2 text-white/25 animate-fade-in"
        aria-hidden
        style={{ animationDelay: "1.8s" }}
      >
        <span className="text-[0.55rem] uppercase tracking-[0.25em]">Scroll</span>
        <div
          className="h-10 w-px rounded-full"
          style={{
            background: "linear-gradient(180deg, rgba(212,168,83,0.6), transparent)",
            animation: "float 1.8s ease-in-out infinite",
          }}
        />
      </div>
    </section>
  );
}
