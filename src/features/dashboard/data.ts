import { prisma } from "@/shared/lib/prisma";

export type DiscoverCreatorRow = {
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

function hashToInt(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return h;
}

/**
 * Pseudo match %, distance, and display age (no DB fields yet) — stable per user+creator.
 */
function enrichForViewer(userId: string, creatorId: string, location: string | null) {
  const h = hashToInt(`${userId}:${creatorId}`);
  const matchPercent = 61 + (h % 35);
  const km = 2 + (h % 47);
  const distanceLabel = location?.trim() ? `${location}` : `${km} km`;
  const displayAge = 22 + (h % 17);
  return { matchPercent, distanceLabel, displayAge };
}

export async function getDiscoverFeedForUser(userId: string): Promise<DiscoverCreatorRow[]> {
  const [creators, activeSubs] = await Promise.all([
    prisma.creator.findMany({
      orderBy: [{ subscriberCount: "desc" }, { createdAt: "desc" }],
      take: 24,
      include: {
        media: {
          where: { type: "IMAGE" },
          orderBy: { sortOrder: "asc" },
          take: 1,
        },
      },
    }),
    prisma.subscription.findMany({
      where: {
        userId,
        status: "ACTIVE",
        currentPeriodEnd: { gt: new Date() },
      },
      select: { creatorId: true },
    }),
  ]);

  const subscribed = new Set(activeSubs.map((s) => s.creatorId));

  return creators.map((c, index) => {
    const { matchPercent, distanceLabel, displayAge } = enrichForViewer(userId, c.id, c.location);
    const age = c.age != null && Number.isFinite(c.age) ? c.age : displayAge;
    const isSubscribed = subscribed.has(c.id);
    const thumb = c.media[0]?.url ?? c.avatarUrl;
    const showLockedOverlay = !isSubscribed && index % 3 === 1;

    return {
      id: c.id,
      username: c.username,
      displayName: c.displayName,
      imageUrl: thumb,
      location: c.location,
      matchPercent,
      distanceLabel,
      displayAge: age,
      showLockedOverlay,
      isSubscribed,
    };
  });
}

export async function getUnreadMessageCountForUser(userId: string): Promise<number> {
  return prisma.message.count({
    where: {
      conversation: { userId },
      senderType: "CREATOR",
      readAt: null,
    },
  });
}
