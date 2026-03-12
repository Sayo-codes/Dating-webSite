 "use client";

import { GlassCard } from "@/shared/ui/GlassCard";
import { PrimaryButton } from "@/shared/ui/PrimaryButton";
import { StatusDot } from "@/shared/ui/StatusDot";
import { useFeaturedModels } from "@/features/models/hooks/useFeaturedModels";
import type { ModelSummary } from "@/lib/types/model";

export function FeaturedModelsSection() {
  const { data: featuredModels, isLoading, error } = useFeaturedModels();

  return (
    <section
      className="section-shell"
      aria-labelledby="featured-models-heading"
    >
      <div className="flex items-center justify-between gap-2">
        <h2 id="featured-models-heading" className="section-heading">
          Featured VIP Models
        </h2>
        <p className="text-caption">Swipe to browse</p>
      </div>
      {isLoading ? (
        <FeaturedModelsSkeleton />
      ) : error ? (
        <GlassCard padding="sm" className="border-amber-400/20 bg-amber-500/10 text-sm text-amber-200">
          There was a problem loading featured models. Please try again in a moment.
        </GlassCard>
      ) : featuredModels.length === 0 ? (
        <GlassCard padding="sm" className="text-sm text-[var(--text-secondary)]">
          No featured models are available right now. Check back in a few minutes.
        </GlassCard>
      ) : (
        <div
          className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2"
          aria-label="Featured models list"
        >
          {featuredModels.map((model) => (
            <FeaturedModelCard key={model.name} model={model} />
          ))}
        </div>
      )}
    </section>
  );
}

type FeaturedModelCardProps = {
  model: ModelSummary;
};

function FeaturedModelCard({ model }: FeaturedModelCardProps) {
  return (
    <button
      type="button"
      className="glass-card glass-card--interactive focus-outline min-w-[220px] flex-1 cursor-pointer text-left"
      aria-label={`Open chat with ${model.name}`}
    >
      <div className="flex flex-col gap-3 p-4">
        <div className="h-32 rounded-2xl bg-[radial-gradient(circle_at_top,#ffffff33,transparent_55%),linear-gradient(135deg,#c778ff,#4dd5ff)]" />
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold">{model.name}</p>
            <p className="flex items-center gap-2 text-[0.7rem] text-white/60">
              <StatusDot status={model.status} />
              {model.status === "online" ? "Online" : "Offline"}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1 text-[0.65rem] text-white/60">
            {model.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-fuchsia-400/40 bg-fuchsia-500/10 px-2 py-0.5"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <PrimaryButton className="w-full py-2 text-xs font-semibold tracking-wide">
          Chat Now
        </PrimaryButton>
      </div>
    </button>
  );
}

function FeaturedModelsSkeleton() {
  return (
    <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2">
      {Array.from({ length: 3 }).map((_, index) => (
        <GlassCard
          key={`skeleton-${index}`}
          className="min-w-[220px] flex-1 p-4 skeleton"
          aria-hidden="true"
        >
          <span className="sr-only">Loading</span>
        </GlassCard>
      ))}
    </div>
  );
}


