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
    <section className="section-shell" aria-labelledby="stats-heading">
      <h2 id="stats-heading" className="sr-only">Platform Statistics</h2>
      <div className="grid gap-4 px-4 sm:px-6 lg:px-10 sm:grid-cols-3">
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
