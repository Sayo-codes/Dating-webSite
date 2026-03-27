import Image from "next/image";
import { GlassCard } from "@/shared/ui/GlassCard";

const STATS = [
  {
    label: "Total Members",
    value: "18,230+",
    sub: "Growing every hour",
    gradient: "linear-gradient(135deg, #f0c97a, #d4a853)",
    icon: "👥",
  },
  {
    label: "Response Rate",
    value: "92%",
    sub: "Verified model response rate",
    gradient: "linear-gradient(135deg, #ff6fa3, #ff2d78)",
    icon: "⚡",
  },
  {
    label: "Live Chats Today",
    value: "1,247",
    sub: "Updated in real time",
    gradient: "linear-gradient(135deg, #c778ff, #ff2d78)",
    icon: "💬",
  },
];

export function StatsSection() {
  return (
    <section className="section-shell relative" aria-labelledby="stats-heading">
      <h2 id="stats-heading" className="sr-only">Platform Statistics</h2>

      {/* ── IMAGE 2: Couple outdoors — ambient background for connection feel ── */}
      <div className="absolute inset-0 -top-24 -bottom-24 overflow-hidden rounded-3xl z-0">
        <Image
          src="/images/landing/couple-laughing.jpg"
          alt=""
          fill
          className="object-cover object-center"
          sizes="100vw"
          quality={75}
          style={{ filter: "brightness(0.35) saturate(1.2) blur(1px)" }}
        />
        {/* Gradient fade edges for seamless blending */}
        <div
          className="absolute inset-0"
          aria-hidden
          style={{
            background:
              "linear-gradient(180deg, rgba(7,7,11,1) 0%, rgba(7,7,11,0.3) 15%, rgba(7,7,11,0.1) 50%, rgba(7,7,11,0.3) 85%, rgba(7,7,11,1) 100%)",
          }}
        />
        {/* Warm rose tint */}
        <div
          className="absolute inset-0"
          aria-hidden
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(255,45,120,0.06) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative z-10 grid gap-4 px-4 sm:px-6 lg:px-10 sm:grid-cols-3">
        {STATS.map((stat, i) => (
          <GlassCard
            key={stat.label}
            padding="md"
            className="animate-fade-up flex flex-col gap-3"
            style={{ animationDelay: `${i * 100}ms` } as React.CSSProperties}
          >
            <p className="flex items-center gap-2 section-heading">
              <span>{stat.icon}</span>
              {stat.label}
            </p>
            <p
              className="text-3xl font-bold tracking-tight"
              style={{
                background: stat.gradient,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {stat.value}
            </p>
            <p className="text-caption">{stat.sub}</p>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}
