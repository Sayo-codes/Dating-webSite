type StatItem = {
  label: string;
  value: string;
  icon: string;
};

export function CreatorStatsBar() {
  const stats: StatItem[] = [
    { label: "Earned", value: "$8.2K", icon: "💰" },
    { label: "Subscribers", value: "17.4K", icon: "⭐" },
    { label: "Rating", value: "4.9", icon: "✦" },
    { label: "Tips", value: "$12.5K", icon: "🎁" },
  ];

  return (
    <div className="premium-stats">
      {stats.map((stat) => (
        <div key={stat.label} className="stat-item">
          <span className="stat-icon">{stat.icon}</span>
          <span className="stat-value">{stat.value}</span>
          <span className="stat-label">{stat.label}</span>
        </div>
      ))}
    </div>
  );
}
