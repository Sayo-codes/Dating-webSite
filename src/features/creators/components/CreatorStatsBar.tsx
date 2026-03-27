type Props = {
  earnedCents: number;
  subscriberCount: number;
  rating: number;
  totalTipsCents: number;
};

function formatMoney(cents: number): string {
  const dollars = cents / 100;
  if (dollars >= 1_000_000) return "$" + (dollars / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (dollars >= 1_000) return "$" + (dollars / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return "$" + dollars.toFixed(0);
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return n.toString();
}

type StatItemDef = {
  label: string;
  value: string;
  icon: string;
  gradient: string;
};

export function CreatorStatsBar({ earnedCents, subscriberCount, rating, totalTipsCents }: Props) {
  const stats: StatItemDef[] = [
    {
      label: "Earned",
      value: formatMoney(earnedCents),
      icon: "💰",
      gradient: "linear-gradient(135deg, #f0c97a 0%, #d4a853 100%)",
    },
    {
      label: "Subscribers",
      value: formatCount(subscriberCount),
      icon: "⭐",
      gradient: "linear-gradient(135deg, #ff6fa3 0%, #ff2d78 100%)",
    },
    {
      label: "Rating",
      value: rating > 0 ? rating.toFixed(1) : "—",
      icon: "✦",
      gradient: "linear-gradient(135deg, #c778ff 0%, #ff2d78 100%)",
    },
    {
      label: "Tips",
      value: formatMoney(totalTipsCents),
      icon: "🎁",
      gradient: "linear-gradient(135deg, #f0c97a 0%, #ff2d78 100%)",
    },
  ];

  return (
    <div
      className="flex justify-center flex-wrap gap-px overflow-hidden rounded-[22px] border"
      style={{
        background: "linear-gradient(145deg, rgba(25,18,38,0.9) 0%, rgba(14,10,22,0.95) 100%)",
        border: "1px solid rgba(212,168,83,0.15)",
        backdropFilter: "blur(24px)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)",
      }}
    >
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className="relative flex min-w-0 flex-1 flex-col items-center gap-1 px-3 py-5 sm:px-5"
          style={
            i > 0
              ? { borderLeft: "1px solid rgba(212,168,83,0.12)" }
              : {}
          }
        >
          {/* Icon with gradient bg */}
          <div
            className="mb-1 flex h-8 w-8 items-center justify-center rounded-xl text-sm"
            style={{
              background: stat.gradient,
              boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
            }}
          >
            {stat.icon}
          </div>

          {/* Value */}
          <span
            className="font-[var(--font-heading)] text-xl font-bold tabular-nums leading-tight sm:text-2xl"
            style={{
              background: stat.gradient,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {stat.value}
          </span>

          {/* Label */}
          <span className="text-[0.65rem] font-medium uppercase tracking-[0.12em] text-white/40 sm:text-[0.7rem]">
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  );
}
