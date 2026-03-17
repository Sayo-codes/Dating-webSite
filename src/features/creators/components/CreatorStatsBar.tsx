type StatItem = {
  label: string;
  value: number;
  icon: string;
};

function formatCount(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return n.toString();
}

type Props = {
  followers: number;
  subscribers: number;
  photos: number;
  videos: number;
  totalLikes: number;
};

export function CreatorStatsBar({ followers, subscribers, photos, videos, totalLikes }: Props) {
  const stats: StatItem[] = [
    { label: "Followers", value: followers, icon: "👥" },
    { label: "Subscribers", value: subscribers, icon: "⭐" },
    { label: "Photos", value: photos, icon: "📷" },
    { label: "Videos", value: videos, icon: "🎬" },
    { label: "Likes", value: totalLikes, icon: "❤️" },
  ];

  return (
    <div className="premium-stats">
      {stats.map((stat) => (
        <div key={stat.label} className="stat-item">
          <span className="stat-icon">{stat.icon}</span>
          <span className="stat-value">{formatCount(stat.value)}</span>
          <span className="stat-label">{stat.label}</span>
        </div>
      ))}
    </div>
  );
}
