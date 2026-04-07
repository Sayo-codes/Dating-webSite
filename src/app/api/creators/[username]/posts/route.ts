import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";
import { getCurrentUser } from "@/shared/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor");
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    // Verify creator exists
    const creator = await prisma.creator.findUnique({
      where: { username },
    });

    if (!creator) {
      return NextResponse.json({ error: "Creator not found" }, { status: 404 });
    }


    const posts = await prisma.creatorPost.findMany({
      where: { creatorId: creator.id },
      take: limit + 1, // Add 1 to check if there are more
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      orderBy: { createdAt: "desc" },
    });

    let nextCursor: string | null = null;
    if (posts.length > limit) {
      const nextItem = posts.pop();
      nextCursor = nextItem!.id;
    }

    // Map posts based on subscription status
    const mappedPosts = posts.map((post: any) => ({
      id: post.id,
      caption: post.caption,
      previewUrl: post.previewUrl,
      mediaType: post.mediaType,
      isLocked: false,
      mediaUrl: post.mediaUrl, // Full access immediately
      likeCount: post.likeCount,
      unlockPriceCents: post.unlockPriceCents,
      createdAt: post.createdAt.toISOString(),
      creatorId: post.creatorId,
    }));

    return NextResponse.json({
      posts: mappedPosts,
      nextCursor
    });
  } catch (error) {
    console.error("Error fetching creator posts:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    const user = await getCurrentUser();

    // Verify creator exists and find their ID
    const creator = await prisma.creator.findUnique({
      where: { username },
      select: { id: true, username: true }
    });

    if (!creator) return NextResponse.json({ error: "Creator not found" }, { status: 404 });

    // Only allow admins or the creator themselves
    if (!user || (user.role !== "admin" && user.username !== creator.username)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { mediaUrl, mediaType, caption, isLocked, unlockPriceCents } = body;

    if (!mediaUrl || !mediaType) {
      return NextResponse.json({ error: "mediaUrl and mediaType are required" }, { status: 400 });
    }

    const locked = isLocked === true;
    const priceCents = typeof unlockPriceCents === "number" && unlockPriceCents > 0
      ? unlockPriceCents
      : locked ? 1999 : 0;

    const newPost = await prisma.creatorPost.create({
      data: {
        creatorId: creator.id,
        mediaUrl,
        mediaType: mediaType === "VIDEO" ? "VIDEO" : "IMAGE",
        previewUrl: mediaUrl,
        caption: caption || null,
        isLocked: locked,
        unlockPriceCents: priceCents,
      },
    });

    return NextResponse.json({ post: newPost }, { status: 201 });
  } catch (error) {
    console.error("Error creating creator post:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
