const FEATURES = [
  {
    icon: "✦",
    iconBg: "linear-gradient(135deg, #d4a853, #f0c97a)",
    iconColor: "#07070b",
    title: "Luxury Experience",
    description:
      "A meticulously designed platform that rivals the finest digital experiences. Premium interface with every detail crafted for discerning tastes.",
  },
  {
    icon: "🛡",
    iconBg: "linear-gradient(135deg, #ff2d78, #ff6fa3)",
    iconColor: "#ffffff",
    title: "Absolute Privacy",
    description:
      "End-to-end encrypted messaging, blurred media previews, and zero data sharing. Your discretion is our highest priority.",
  },
  {
    icon: "✓",
    iconBg: "linear-gradient(135deg, #3dff9a, #22d3ee)",
    iconColor: "#07070b",
    title: "Verified Profiles",
    description:
      "Every creator undergoes rigorous identity and face verification. No bots, no fakes — only authentic, real connections.",
  },
  {
    icon: "💎",
    iconBg: "linear-gradient(135deg, #c778ff, #ff2d78)",
    iconColor: "#ffffff",
    title: "Exclusive Content",
    description:
      "Access premium, members-only content and direct conversations with high-quality creators who are genuinely invested in you.",
  },
] as const;

export function WhyRsdateSection() {
  return (
    <section
      id="why-rsdate"
      className="section-shell relative overflow-hidden"
      aria-labelledby="why-velvet-heading"
    >
      {/* Subtle background accent */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 left-1/2 h-[300px] w-[600px] -translate-x-1/2 rounded-full opacity-15 blur-[100px]"
        style={{ background: "radial-gradient(ellipse, #d4a853 0%, transparent 70%)" }}
      />

      {/* Section header */}
      <div className="px-4 text-center sm:px-6 lg:px-10">
        <p className="section-heading mb-3 flex items-center justify-center gap-2">
          ✦ Why Rsdate
        </p>
        <h2
          id="why-rsdate-heading"
          className="font-[var(--font-heading)] text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
        >
          Designed for the{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #f0c97a 0%, #d4a853 40%, #ff2d78 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Exceptional
          </span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/50 sm:text-base">
          We believe real connections deserve a real luxury platform. Here&apos;s why thousands
          choose Rsdate.
        </p>
      </div>

      {/* Feature cards */}
      <div className="grid gap-5 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-10">
        {FEATURES.map((f, i) => (
          <div
            key={f.title}
            className="glass-card glass-card--interactive animate-fade-up flex flex-col gap-5 p-7 transition-all duration-150 active:opacity-80"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            {/* Icon */}
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-xl font-bold shadow-lg"
              style={{ background: f.iconBg, color: f.iconColor }}
            >
              {f.icon}
            </div>

            {/* Text */}
            <div className="flex flex-col gap-2">
              <h3 className="text-title text-base font-semibold">{f.title}</h3>
              <p className="text-caption text-[0.82rem] leading-relaxed">{f.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
