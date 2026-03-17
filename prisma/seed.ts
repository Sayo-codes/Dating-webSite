import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

const SEED_PASSWORD = "password123";

// Different Unsplash portrait/avatar images (w=400&h=400&fit=crop for consistent sizing)
const AVATARS = {
  eva: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
  jessie: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=400&fit=crop",
  luna: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop",
  maya: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
  zoe: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop",
  ivy: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop",
  ruby: "https://images.unsplash.com/photo-1525134479668-1bee5c7c6845?w=400&h=400&fit=crop",
  stella: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=400&fit=crop",
};

// Banner images (landscape, atmospheric)
const BANNERS: Record<string, string> = {
  eva: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=400&fit=crop",
  jessie: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=1200&h=400&fit=crop",
  luna: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&h=400&fit=crop",
  maya: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=400&fit=crop",
  zoe: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&h=400&fit=crop",
  ivy: "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=1200&h=400&fit=crop",
  ruby: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&h=400&fit=crop",
  stella: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&h=400&fit=crop",
};

// Optional extra gallery images per creator (different from avatar for variety)
const GALLERY_EXTRAS: Record<string, string[]> = {
  eva: [
    "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=400&h=500&fit=crop",
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=500&fit=crop",
  ],
  jessie: [
    "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=500&fit=crop",
    "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=500&fit=crop",
  ],
  luna: [
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop",
    "https://images.unsplash.com/photo-1525134479668-1bee5c7c6845?w=400&h=500&fit=crop",
  ],
  maya: [
    "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=500&fit=crop",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=500&fit=crop",
  ],
  zoe: [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop",
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=500&fit=crop",
  ],
  ivy: [
    "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=500&fit=crop",
    "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=500&fit=crop",
  ],
  ruby: [
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop",
    "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=500&fit=crop",
  ],
  stella: [
    "https://images.unsplash.com/photo-1525134479668-1bee5c7c6845?w=400&h=500&fit=crop",
    "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=400&h=500&fit=crop",
  ],
};

// Post preview images (used for locked content feed)
const POST_PREVIEWS = [
  "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1502635385003-ee1e6a1a742d?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=500&h=500&fit=crop",
];

const CREATOR_PROFILES: Array<{
  username: string;
  displayName: string;
  bio: string;
  location: string;
  profession: string;
  height: string;
  weight: string;
  verified: boolean;
  followerCount: number;
  subscriberCount: number;
  totalLikes: number;
}> = [
  {
    username: "eva",
    displayName: "Eva",
    bio: "Verified creator. Love connecting with respectful people. Available for chat and custom content.",
    location: "Los Angeles, CA",
    profession: "Content Creator",
    height: "5'6\"",
    weight: "125 lbs",
    verified: true,
    followerCount: 24300,
    subscriberCount: 1820,
    totalLikes: 98400,
  },
  {
    username: "jessie",
    displayName: "Jessie",
    bio: "VIP creator. Fast replies and exclusive content. Let's get to know each other.",
    location: "Miami, FL",
    profession: "Model",
    height: "5'7\"",
    weight: "130 lbs",
    verified: true,
    followerCount: 31500,
    subscriberCount: 2450,
    totalLikes: 145000,
  },
  {
    username: "luna",
    displayName: "Luna",
    bio: "New here. Shy but curious. Say hi!",
    location: "New York, NY",
    profession: "Student",
    height: "5'4\"",
    weight: "118 lbs",
    verified: false,
    followerCount: 3200,
    subscriberCount: 180,
    totalLikes: 12500,
  },
  {
    username: "maya",
    displayName: "Maya",
    bio: "Fitness & lifestyle creator. DM for collabs and custom requests.",
    location: "Austin, TX",
    profession: "Fitness Coach",
    height: "5'5\"",
    weight: "122 lbs",
    verified: true,
    followerCount: 18700,
    subscriberCount: 990,
    totalLikes: 67200,
  },
  {
    username: "zoe",
    displayName: "Zoe",
    bio: "Artist and creator. I reply to every message. Let's chat!",
    location: "Seattle, WA",
    profession: "Artist",
    height: "5'8\"",
    weight: "128 lbs",
    verified: true,
    followerCount: 12400,
    subscriberCount: 640,
    totalLikes: 41000,
  },
  {
    username: "ivy",
    displayName: "Ivy",
    bio: "Your girl next door. Online most evenings. No pressure, just fun.",
    location: "Chicago, IL",
    profession: "Content Creator",
    height: "5'3\"",
    weight: "115 lbs",
    verified: false,
    followerCount: 5600,
    subscriberCount: 310,
    totalLikes: 18900,
  },
  {
    username: "ruby",
    displayName: "Ruby",
    bio: "Verified VIP. Exclusive content and 1:1 chats. Link in bio.",
    location: "Las Vegas, NV",
    profession: "Model",
    height: "5'9\"",
    weight: "132 lbs",
    verified: true,
    followerCount: 42100,
    subscriberCount: 3200,
    totalLikes: 210000,
  },
  {
    username: "stella",
    displayName: "Stella",
    bio: "Fashion and beauty. Custom shoots and video calls available.",
    location: "San Francisco, CA",
    profession: "Influencer",
    height: "5'6\"",
    weight: "120 lbs",
    verified: true,
    followerCount: 28900,
    subscriberCount: 1560,
    totalLikes: 89000,
  },
];

const POST_CAPTIONS = [
  "New exclusive set just dropped 🔥",
  "Behind the scenes from today's shoot ✨",
  "Something special just for subscribers 💕",
  "Weekend vibes – unlock to see more 🌅",
];

async function main() {
  const passwordHash = await hash(SEED_PASSWORD, 12);

  // Create User accounts for all creators
  for (const p of CREATOR_PROFILES) {
    await prisma.user.upsert({
      where: { email: `${p.username}@example.com` },
      create: {
        email: `${p.username}@example.com`,
        username: p.username,
        passwordHash,
        role: "creator",
        emailVerified: true,
      },
      update: { passwordHash, role: "creator", emailVerified: true },
    });
  }

  // Test user (fan)
  await prisma.user.upsert({
    where: { email: "test@example.com" },
    create: {
      email: "test@example.com",
      username: "testuser",
      passwordHash,
      role: "user",
      emailVerified: true,
    },
    update: { passwordHash, emailVerified: true },
  });

  // Create Creator profiles with unique avatars and premium fields
  const creators = await Promise.all(
    CREATOR_PROFILES.map((p) => {
      const avatarUrl = AVATARS[p.username as keyof typeof AVATARS] ?? AVATARS.eva;
      const bannerUrl = BANNERS[p.username] ?? BANNERS.eva;
      return prisma.creator.upsert({
        where: { username: p.username },
        create: {
          username: p.username,
          displayName: p.displayName,
          avatarUrl,
          bannerUrl,
          bio: p.bio,
          location: p.location,
          profession: p.profession,
          height: p.height,
          weight: p.weight,
          verified: p.verified,
          followerCount: p.followerCount,
          subscriberCount: p.subscriberCount,
          totalLikes: p.totalLikes,
        },
        update: {
          displayName: p.displayName,
          avatarUrl,
          bannerUrl,
          bio: p.bio,
          location: p.location,
          profession: p.profession,
          height: p.height,
          weight: p.weight,
          verified: p.verified,
          followerCount: p.followerCount,
          subscriberCount: p.subscriberCount,
          totalLikes: p.totalLikes,
        },
      });
    })
  );

  // Gallery: avatar + extra images per creator (only if none exist)
  for (const c of creators) {
    const profile = CREATOR_PROFILES.find((p) => p.username === c.username)!;
    const avatarUrl = AVATARS[profile.username as keyof typeof AVATARS] ?? AVATARS.eva;
    const extras = GALLERY_EXTRAS[profile.username] ?? [];

    const count = await prisma.creatorMedia.count({ where: { creatorId: c.id } });
    if (count === 0) {
      const galleryUrls = [avatarUrl, ...extras];
      await prisma.creatorMedia.createMany({
        data: galleryUrls.map((url, i) => ({
          creatorId: c.id,
          url,
          type: "IMAGE" as const,
          sortOrder: i,
        })),
      });
    }
  }

  // Seed locked posts for each creator (only if none exist)
  for (const c of creators) {
    const postCount = await prisma.creatorPost.count({ where: { creatorId: c.id } });
    if (postCount === 0) {
      const postsToCreate = POST_PREVIEWS.slice(0, 4).map((url, i) => ({
        creatorId: c.id,
        caption: POST_CAPTIONS[i % POST_CAPTIONS.length],
        previewUrl: url,
        mediaType: i === 2 ? ("VIDEO" as const) : ("IMAGE" as const),
        isLocked: i < 3, // first 3 locked, last unlocked
        unlockPriceCents: 1999,
        likeCount: Math.floor(Math.random() * 500) + 50,
      }));
      await prisma.creatorPost.createMany({ data: postsToCreate });
    }
  }

  console.log("Seed complete. Creators:", creators.length);
  console.log("\nDummy login credentials (password for all: " + SEED_PASSWORD + ")");
  console.log("  Creator accounts (log in to reply as the creator):");
  for (const p of CREATOR_PROFILES) {
    console.log("    " + p.username + "@example.com / " + SEED_PASSWORD + "  (creator: " + p.displayName + ")");
  }
  console.log("  Test fan (send messages to creators):");
  console.log("    test@example.com / " + SEED_PASSWORD);
  console.log("  Make any user admin in DB: UPDATE users SET role = 'admin' WHERE email = 'your@email.com';");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
