"use client";

import { CreatorCardExplicit } from "@/features/creators/components/CreatorCard";

export type DiscoverCardData = {
  id: string;
  username: string;
  displayName: string;
  imageUrl: string | null;
  location: string | null;
  matchPercent: number;
  distanceLabel: string;
  displayAge: number;
  showLockedOverlay: boolean;
  isSubscribed: boolean;
};

type Props = {
  creator: DiscoverCardData;
};

export function CreatorDiscoverCard({ creator }: Props) {
  return (
    <CreatorCardExplicit
      creatorId={creator.id}
      username={creator.username}
      name={creator.displayName}
      age={creator.displayAge}
      location={creator.location ?? creator.distanceLabel}
      imageUrl={creator.imageUrl}
      isVIP={creator.matchPercent >= 88}
      matchPercent={creator.matchPercent}
      showLockedOverlay={creator.showLockedOverlay}
      isSubscribed={creator.isSubscribed}
    />
  );
}
