import Link from "next/link";
import { PrimaryButton } from "@/shared/ui/PrimaryButton";

const CREATOR_PREVIEWS = [
  {
    name: "Aria V.",
    age: 24,
    tag: "VIP Model",
    gradient: "linear-gradient(135deg, #d4a853 0%, #ff2d78 100%)",
    quote: "Online tonight for exclusive live chat 💋",
    initials: "AV",
    delay: "0s",
    position: "top-4 right-4",
    rotation: "rotate-2",
  },
  {
    name: "Sophia K.",
    age: 26,
    tag: "Elite",
    gradient: "linear-gradient(135deg, #c778ff 0%, #ff2d78 100%)",
    quote: "Private sessions available. Verified ✦",
    initials: "SK",
    delay: "0.4s",
    position: "bottom-6 right-0",
    rotation: "-rotate-1",
  },
  {
    name: "Luna M.",
    age: 23,
    tag: "Verified",
    gradient: "linear-gradient(135deg, #ff2d78 0%, #d4a853 100%)",
    quote: "Accepting requests now 🌙",
    initials: "LM",
    delay: "0.8s",
    position: "top-1/2 -left-4",
    rotation: "rotate-1",
  },
];

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
        <div className="grid gap-12 lg:grid-cols-[1fr_480px] lg:items-center">

          {/* Left: Text Content */}
          <div className="space-y-7 text-center lg:text-left">

            {/* Badge */}
            <p
              className="animate-fade-up inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em]"
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

            {/* Trust facts */}
            <div className="animate-fade-up-delay-4 flex flex-wrap items-center justify-center gap-6 lg:justify-start">
              {[
                { label: "18,230+", sub: "Members" },
                { label: "100%", sub: "Face-Verified" },
                { label: "92%", sub: "Response Rate" },
              ].map(({ label, sub }) => (
                <div key={sub} className="flex flex-col items-center gap-0.5 lg:items-start">
                  <span
                    className="text-xl font-bold"
                    style={{
                      background: "linear-gradient(135deg, #f0c97a, #d4a853)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {label}
                  </span>
                  <span className="text-xs text-white/45 uppercase tracking-widest">{sub}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Floating Creator Cards */}
          <div className="relative mx-auto h-[460px] w-full max-w-sm lg:mx-0" aria-hidden="true">
            {/* Glow orb behind cards */}
            <div
              className="absolute inset-0 rounded-full opacity-30 blur-[80px]"
              style={{ background: "radial-gradient(circle, rgba(212,168,83,0.5) 0%, rgba(255,45,120,0.3) 50%, transparent 70%)" }}
            />

            {CREATOR_PREVIEWS.map((creator, i) => (
              <div
                key={creator.name}
                className={`absolute w-56 ${creator.position} ${creator.rotation}`}
                style={{
                  animation: `float ${5 + i}s ease-in-out infinite`,
                  animationDelay: creator.delay,
                }}
              >
                <div
                  className="glass-card glass-card--gold shimmer-overlay p-4 space-y-3"
                  style={{ borderRadius: "20px" }}
                >
                  {/* Avatar + name row */}
                  <div className="flex items-center gap-3">
                    <div
                      className="h-11 w-11 rounded-2xl flex items-center justify-center text-white font-bold text-sm shrink-0"
                      style={{ background: creator.gradient }}
                    >
                      {creator.initials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{creator.name} · {creator.age}</p>
                      <p className="flex items-center gap-1.5 text-[0.65rem] text-white/55">
                        <span className="status-dot status-dot--online" />
                        Online · {creator.tag}
                      </p>
                    </div>
                  </div>
                  {/* Quote */}
                  <p className="text-xs text-white/60 leading-relaxed italic">&ldquo;{creator.quote}&rdquo;</p>
                  {/* Chat button */}
                  <button
                    aria-label={`Chat with ${creator.name}`}
                    className="w-full rounded-full py-2 text-xs font-semibold text-white transition-all duration-200 hover:scale-105"
                    style={{ background: "var(--gradient-primary)", boxShadow: "0 4px 16px rgba(212,168,83,0.3)" }}
                  >
                    Chat Now ✦
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
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
