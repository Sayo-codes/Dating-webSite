import { prisma } from "@/shared/lib/prisma";
import { unstable_cache } from "next/cache";

export const getCreatorsList = unstable_cache(
  async () => {
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
  },
  ["creators-list"],
  { revalidate: 60, tags: ["creators"] }
);

export async function getCreatorByUsername(username: string) {
  try {
    const creator = await prisma.creator.findFirst({
      where: {
        username: {
          equals: username.toLowerCase(),
          mode: "insensitive"
        }
      },
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
      gallery: (creator.media || []).map((m: any) => ({
        id: m?.id || "",
        url: m?.url || "",
        type: m?.type || "IMAGE"
      })),
      posts: (creator.posts || []).map((p: any) => ({
        id: p?.id || "",
        caption: p?.caption || null,
        previewUrl: p?.previewUrl || "",
        mediaUrl: p?.mediaUrl || null,
        mediaType: p?.mediaType || "IMAGE",
        isLocked: p?.isLocked ?? false,
        unlockPriceCents: p?.unlockPriceCents ?? 0,
        likeCount: p?.likeCount ?? 0,
        likesLocked: p?.likesLocked ?? false,
        createdAt: p?.createdAt ? p.createdAt.toISOString() : new Date().toISOString(),
      })),
    };
  } catch (error) {
    console.error("getCreatorByUsername error:", error);
    return null;
  }
}
