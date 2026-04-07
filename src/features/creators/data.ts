import { prisma } from "@/shared/lib/prisma";

export async function getCreatorsList() {
  const creators = await prisma.creator.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      media: {
        where: { type: "IMAGE" },
        orderBy: { sortOrder: "asc" },
        take: 1,
      },
    },
  });
  return creators.map((c: any) => ({
    id: c.id,
    username: c.username,
    displayName: c.displayName,
    age: c.age,
    avatarUrl: c.avatarUrl,
    verified: c.verified,
    location: c.location,
    cardImage: c.cardImage,
    galleryThumbnail: c.media[0]?.url ?? null,
  }));
}

export async function getCreatorByUsername(username: string) {
  const creator = await prisma.creator.findUnique({
    where: { username: username.toLowerCase() },
    include: {
      media: {
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      },
      posts: {
        orderBy: { createdAt: "desc" },
      },
    },
  });
  if (!creator) return null;

  const photoCount = creator.media.filter((m: any) => m.type === "IMAGE").length;
  const videoCount = creator.media.filter((m: any) => m.type === "VIDEO").length;

  return {
    id: creator.id,
    username: creator.username,
    displayName: creator.displayName,
    avatarUrl: creator.avatarUrl,
    bannerUrl: creator.bannerUrl,
    bio: creator.bio,
    location: creator.location,
    profession: creator.profession,
    height: creator.height,
    weight: creator.weight,
    verified: creator.verified,
    followerCount: creator.followerCount,
    subscriberCount: creator.subscriberCount,
    earnedCents: creator.earnedCents,
    rating: creator.rating,
    totalTipsCents: creator.totalTipsCents,
    totalLikes: creator.totalLikes,
    photoCount,
    videoCount,
    gallery: creator.media.map((m: any) => ({ id: m.id, url: m.url, type: m.type })),
    posts: creator.posts.map((p: any) => ({
      id: p.id,
      caption: p.caption,
      previewUrl: p.previewUrl,
      mediaUrl: p.mediaUrl,
      mediaType: p.mediaType,
      isLocked: false,
      unlockPriceCents: p.unlockPriceCents,
      likeCount: p.likeCount,
      likesLocked: p.likesLocked,
      commentCount: 0,
      createdAt: p.createdAt.toISOString(),
    })),
  };
}
