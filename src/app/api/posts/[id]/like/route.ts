import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";
import { getCurrentUser } from "@/shared/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Since we don't have a PostLike model to track likes per-user yet, 
    // we'll implement a simple increment/decrement.
    // Ideally we'd have a UserLikePost join table to prevent duplicate likes.
    
    const body = await req.json().catch(() => ({}));
    const action = body.action === "unlike" ? "decrement" : "increment";

    let decrementCheck = {};
    if (action === "decrement") {
      // Prevent negative likes
      const post = await prisma.creatorPost.findUnique({ where: { id }});
      if (!post || post.likeCount <= 0) {
        return NextResponse.json({ success: true, likeCount: 0 });
      }
    }

    const updatedPost = await prisma.creatorPost.update({
      where: { id },
      data: {
        likeCount: {
          [action]: 1
        }
      }
    });

    return NextResponse.json({ 
      success: true, 
      likeCount: updatedPost.likeCount 
    });
  } catch (error) {
    console.error("Error toggling like:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
