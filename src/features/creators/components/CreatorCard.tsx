import Link from "next/link";
import Image from "next/image";
import { GlassCard } from "@/shared/ui/GlassCard";
import { Badge } from "@/shared/ui/Badge";
import type { CreatorListItem } from "@/lib/types/creator";

type Props = { creator: CreatorListItem };

const placeholder = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23c778ff'/%3E%3Cstop offset='100%25' style='stop-color:%234dd5ff'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill='url(%23g)' width='400' height='400'/%3E%3C/svg%3E";

export function CreatorCard({ creator }: Props) {
  const imageUrl = creator.galleryThumbnail ?? creator.avatarUrl ?? placeholder;

  return (
    <GlassCard padding="none" className="glass-card--interactive overflow-hidden">
      <Link href={`/creators/${creator.username}`} className="block focus-outline rounded-[var(--radius-card)] focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)]">
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-t-[var(--radius-card)] bg-white/5">
          <Image
            src={imageUrl}
            alt={creator.displayName}
            fill
            className="object-cover"
            sizes="(max-width: 400px) 100vw, (max-width: 1024px) 50vw, 320px"
            unoptimized={imageUrl.startsWith("data:")}
          />
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            {creator.verified && (
              <Badge className="bg-emerald-500/20 border-emerald-400/40 text-emerald-200">
                Verified
              </Badge>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-4 p-5">
          <div className="min-w-0">
            <h2 className="font-[var(--font-heading)] text-lg font-semibold leading-snug text-white">
              {creator.displayName}
            </h2>
            {creator.location && (
              <p className="mt-1 text-sm text-[var(--text-muted)]">{creator.location}</p>
            )}
          </div>
          <span className="pill-button-primary focus-outline inline-flex min-h-[44px] w-full items-center justify-center rounded-full py-2.5 text-sm font-medium">
            View profile
          </span>
        </div>
      </Link>
    </GlassCard>
  );
}
