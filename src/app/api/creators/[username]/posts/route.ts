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
    const mappedPosts = posts.map(post => ({
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
