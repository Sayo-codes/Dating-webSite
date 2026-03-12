import { NextRequest, NextResponse } from "next/server";
import { withAdmin } from "@/shared/api/auth-guard";
import { prisma } from "@/shared/lib/prisma";

export async function GET() {
  const auth = await withAdmin();
  if (auth instanceof NextResponse) return auth;
  const creators = await prisma.creator.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      media: { orderBy: [{ sortOrder: "asc" }], take: 5 },
      _count: { select: { conversations: true } },
    },
  });
  return NextResponse.json({
    creators: creators.map((c) => ({
      id: c.id,
      username: c.username,
      displayName: c.displayName,
      avatarUrl: c.avatarUrl,
      bio: c.bio,
      location: c.location,
      profession: c.profession,
      height: c.height,
      weight: c.weight,
      verified: c.verified,
      createdAt: c.createdAt,
      conversationCount: c._count.conversations,
      gallery: c.media.map((m) => ({ id: m.id, url: m.url, type: m.type })),
    })),
  });
}

export async function POST(request: NextRequest) {
  const auth = await withAdmin();
  if (auth instanceof NextResponse) return auth;
  const body = await request.json().catch(() => ({}));
  const { username, displayName, bio, location, profession, height, weight, verified } = body as Record<string, unknown>;
  if (!username || !displayName) {
    return NextResponse.json({ error: "username and displayName required" }, { status: 400 });
  }
  const uname = String(username).toLowerCase();
  const existing = await prisma.creator.findUnique({ where: { username: uname } });
  if (existing) {
    return NextResponse.json({ error: "Username already exists" }, { status: 400 });
  }
  const creator = await prisma.creator.create({
    data: {
      username: uname,
      displayName: String(displayName),
      bio: typeof bio === "string" ? bio : null,
      location: typeof location === "string" ? location : null,
      profession: typeof profession === "string" ? profession : null,
      height: typeof height === "string" ? height : null,
      weight: typeof weight === "string" ? weight : null,
      verified: verified === true,
    },
  });
  return NextResponse.json({ creator }, { status: 201 });
}
