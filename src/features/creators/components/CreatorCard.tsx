"use client";

import type { CreatorListItem } from "@/lib/types/creator";
import {
  CreatorCard as CreatorCardView,
  creatorListItemToCardProps,
  type CreatorCardProps,
} from "@/components/CreatorCard";

export type { CreatorCardProps };
export { creatorListItemToCardProps };

type ListProps = { creator: CreatorListItem; className?: string };

/** Browse grid: pass Prisma-backed `CreatorListItem`. */
export function CreatorCard({ creator, className }: ListProps) {
  return <CreatorCardView {...creatorListItemToCardProps(creator)} className={className} />;
}

/** Discover / featured: explicit fields matching Figma props. */
export function CreatorCardExplicit(props: CreatorCardProps) {
  return <CreatorCardView {...props} />;
}
