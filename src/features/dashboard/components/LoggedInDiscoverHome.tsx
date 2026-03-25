import { CreatorSliderSection, TrendingCreatorsSection } from "@/features/landing";
import { DiscoverHomeBottomSpotlight } from "./DiscoverHomeBottomSpotlight";
import { DashboardHeader } from "./DashboardHeader";
import { CreatorDiscoverCard } from "./CreatorDiscoverCard";
import type { DiscoverCreatorRow } from "../data";

type UserBrief = {
  id: string;
  username: string;
  email: string;
};

type Props = {
  user: UserBrief;
  unreadCount: number;
  creators: DiscoverCreatorRow[];
};

export function LoggedInDiscoverHome({ user, unreadCount, creators }: Props) {
  return (
    <div className="min-h-screen bg-[#07070b] text-white">
      <DashboardHeader
        title="Discover Creators ✦"
        unreadCount={unreadCount}
        user={{
          username: user.username,
          email: user.email,
          avatarUrl: null,
        }}
      />

      <main className="mx-auto max-w-7xl px-3 pb-10 pt-5 sm:px-6 sm:pt-7 lg:px-10">
        {creators.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-16 text-center">
            <p className="font-[var(--font-heading)] text-lg text-white/90">✦ No creators yet</p>
            <p className="mt-2 text-sm text-white/50">Check back soon — new talent is onboarding.</p>
          </div>
        ) : (
          <ul className="grid grid-cols-2 gap-2.5 overflow-visible py-1 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-5">
            {creators.map((c) => (
              <li key={c.id} className="min-w-0 overflow-visible">
                <CreatorDiscoverCard
                  creator={{
                    id: c.id,
                    username: c.username,
                    displayName: c.displayName,
                    imageUrl: c.imageUrl,
                    location: c.location,
                    matchPercent: c.matchPercent,
                    distanceLabel: c.distanceLabel,
                    displayAge: c.displayAge,
                    showLockedOverlay: c.showLockedOverlay,
                    isSubscribed: c.isSubscribed,
                  }}
                />
              </li>
            ))}
          </ul>
        )}

        <div className="mt-14 flex flex-col gap-14 sm:mt-16 sm:gap-20">
          <CreatorSliderSection />
          <TrendingCreatorsSection />
        </div>

        <DiscoverHomeBottomSpotlight />
      </main>
    </div>
  );
}
