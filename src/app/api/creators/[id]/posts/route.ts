import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";
import { getCurrentUser } from "@/shared/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: creatorId } = await params;
    const user = await getCurrentUser();

    // Only allow admins or the creator themselves
    if (!user || (user.role !== "admin" && user.username !== (await prisma.creator.findUnique({ where: { id: creatorId }, select: { username: true } }))?.username)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { mediaUrl, mediaType, caption } = body;

    if (!mediaUrl || !mediaType) {
      return NextResponse.json({ error: "mediaUrl and mediaType are required" }, { status: 400 });
    }

    // Since previewUrl is required in the schema, we use mediaUrl as a fallback for now.
    // In a real production app, one might generate a separate thumbnail for videos.
    const newPost = await prisma.creatorPost.create({
      data: {
        creatorId,
        mediaUrl,
        mediaType: mediaType === "VIDEO" ? "VIDEO" : "IMAGE",
        previewUrl: mediaUrl, // Using mediaUrl as previewUrl
        caption: caption || null,
        isLocked: false, // Defaulting to public post for admin/manual creation
        unlockPriceCents: 0, // Public post
      },
    });

    return NextResponse.json({ post: newPost }, { status: 201 });
  } catch (error) {
    console.error("Error creating creator post:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
