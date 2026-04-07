"use client";

import { GlassCard } from "@/shared/ui/GlassCard";
import { useFeaturedModels } from "@/features/models/hooks/useFeaturedModels";
import { CreatorCard } from "@/components/CreatorCard";
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
          className="-mx-4 flex gap-5 overflow-x-auto px-4 pb-2 pt-1"
          aria-label="Featured models list"
        >
          {featuredModels.map((model) => (
            <FeaturedModelCard key={model.username} model={model} />
          ))}
        </div>
      )}
    </section>
  );
}

function FeaturedModelCard({ model }: { model: ModelSummary }) {
  const isVip = model.tags.some((t) => t.toUpperCase().includes("VIP"));

  return (
    <div className="w-[min(100%,280px)] shrink-0 snap-start">
      <CreatorCard
        creatorId=""
        username={model.username}
        name={model.name}
        age={model.age}
        location={model.location}
        imageUrl={model.imageUrl}
        isVIP={isVip}
      />
    </div>
  );
}

function FeaturedModelsSkeleton() {
  return (
    <div className="-mx-4 flex gap-5 overflow-x-auto px-4 pb-2">
      {Array.from({ length: 3 }).map((_, index) => (
        <GlassCard
          key={`skeleton-${index}`}
          className="aspect-[10/14] min-w-[260px] shrink-0 skeleton"
          aria-hidden="true"
        >
          <span className="sr-only">Loading</span>
        </GlassCard>
      ))}
    </div>
  );
}
