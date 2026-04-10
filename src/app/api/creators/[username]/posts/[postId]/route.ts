import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";
import { requireAdmin } from "@/shared/lib/auth";
import { deleteFile } from "@/shared/lib/storage";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ username: string; postId: string }> }
) {
  try {
    await requireAdmin();
    const { postId } = await params;

    // 1. Find the post
    const post = await prisma.creatorPost.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // 2. Delete media from S3 if it exists
    if (post.mediaUrl) {
      await deleteFile(post.mediaUrl);
    }
    
    // Also delete preview if different
    if (post.previewUrl && post.previewUrl !== post.mediaUrl) {
      await deleteFile(post.previewUrl);
    }

    // 3. Delete from database
    await prisma.creatorPost.delete({
      where: { id: postId },
    });

    return NextResponse.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting creator post:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
