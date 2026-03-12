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
  return creators.map((c) => ({
    id: c.id,
    username: c.username,
    displayName: c.displayName,
    avatarUrl: c.avatarUrl,
    verified: c.verified,
    location: c.location,
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
    },
  });
  if (!creator) return null;
  return {
    id: creator.id,
    username: creator.username,
    displayName: creator.displayName,
    avatarUrl: creator.avatarUrl,
    bio: creator.bio,
    location: creator.location,
    profession: creator.profession,
    height: creator.height,
    weight: creator.weight,
    verified: creator.verified,
    gallery: creator.media.map((m) => ({ id: m.id, url: m.url, type: m.type })),
  };
}
