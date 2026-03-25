import Link from "next/link";

const SPOTLIGHT = [
  {
    name: "Aria V.",
    age: 24,
    initials: "AV",
    tag: "VIP Model",
    gradient: "linear-gradient(135deg, #d4a853 0%, #ff2d78 100%)",
    quote: "Online tonight for exclusive live chat 💋",
    position: "top-0 right-0 sm:right-4",
    rotation: "rotate-2",
    delay: "0s",
    z: "z-20",
  },
  {
    name: "Sophia K.",
    age: 26,
    initials: "SK",
    tag: "Elite",
    gradient: "linear-gradient(135deg, #c778ff 0%, #ff2d78 100%)",
    quote: "Private sessions available. Verified ✦",
    position: "bottom-0 left-0 sm:left-6",
    rotation: "-rotate-1",
    delay: "0.4s",
    z: "z-10",
  },
] as const;

export function DiscoverHomeBottomSpotlight() {
  return (
    <section
      className="mt-16 border-t border-white/[0.08] pt-14 pb-8 sm:mt-20 sm:pt-20"
      aria-labelledby="discover-spotlight-heading"
    >
      <h2 id="discover-spotlight-heading" className="sr-only">
        Featured creators
      </h2>
      <div className="relative mx-auto h-[min(420px,70vw)] w-full max-w-sm sm:h-[400px]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full opacity-25 blur-[72px]"
          style={{
            background:
              "radial-gradient(circle, rgba(212,168,83,0.45) 0%, rgba(255,45,120,0.25) 50%, transparent 70%)",
          }}
        />
        {SPOTLIGHT.map((creator, i) => (
          <div
            key={creator.name}
            className={`absolute w-[min(100%,240px)] ${creator.position} ${creator.rotation} ${creator.z}`}
            style={{
              animation: `float ${5 + i}s ease-in-out infinite`,
              animationDelay: creator.delay,
            }}
          >
            <div
              className="glass-card glass-card--gold shimmer-overlay space-y-3 p-4"
              style={{ borderRadius: "20px" }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-sm font-bold text-white"
                  style={{ background: creator.gradient }}
                >
                  {creator.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    {creator.name} · {creator.age}
                  </p>
                  <p className="flex items-center gap-1.5 text-[0.65rem] text-white/55">
                    <span className="status-dot status-dot--online" />
                    Online · {creator.tag}
                  </p>
                </div>
              </div>
              <p className="text-xs italic leading-relaxed text-white/60">
                &ldquo;{creator.quote}&rdquo;
              </p>
              <Link
                href="/creators"
                className="flex w-full items-center justify-center rounded-full py-2 text-xs font-semibold text-white transition-all duration-200 hover:scale-[1.02]"
                style={{
                  background: "var(--gradient-primary)",
                  boxShadow: "0 4px 16px rgba(212,168,83,0.3)",
                }}
              >
                Chat Now ✦
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
