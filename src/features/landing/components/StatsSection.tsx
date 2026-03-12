import { GlassCard } from "@/shared/ui/GlassCard";

export function StatsSection() {
  return (
    <section className="section-shell" aria-labelledby="trusted-activity-heading">
      <h2 id="trusted-activity-heading" className="section-heading">
        Trusted Activity
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <GlassCard padding="md" className="flex flex-col gap-3">
          <p className="section-heading">Total members</p>
          <p className="text-title text-2xl font-semibold tracking-tight text-white">18,230+</p>
          <p className="text-caption text-emerald-300/90">Growing every hour</p>
        </GlassCard>
        <GlassCard padding="md" className="flex flex-col gap-3">
          <p className="section-heading">Weekly activity</p>
          <p className="text-title text-2xl font-semibold tracking-tight text-white">92%</p>
          <p className="text-caption text-cyan-300/90">Verified model response rate</p>
        </GlassCard>
        <GlassCard padding="md" className="flex flex-col gap-3">
          <p className="section-heading">Live chats today</p>
          <p className="text-title text-2xl font-semibold tracking-tight text-white">1,247</p>
          <p className="text-caption text-fuchsia-300/90">Updated in real time</p>
        </GlassCard>
      </div>
    </section>
  );
}

