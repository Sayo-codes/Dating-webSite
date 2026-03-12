import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/shared/api/auth-guard";
import { prisma } from "@/shared/lib/prisma";
import {
  getPresignedPutUrl,
  buildKey,
  isAllowedContentType,
  getMaxSizeBytes,
  type PresignContext,
} from "@/shared/lib/storage";

const CONTEXTS: PresignContext[] = ["message", "avatar", "gallery"];

export async function POST(request: NextRequest) {
  const auth = await withAuth();
  if (auth instanceof NextResponse) return auth;
  const user = auth.user;

  const body = await request.json().catch(() => ({}));
  const {
    filename,
    contentType,
    context,
    conversationId,
    creatorId,
    size,
  } = body as {
    filename?: string;
    contentType?: string;
    context?: string;
    conversationId?: string;
    creatorId?: string;
    size?: number;
  };

  if (!filename || typeof filename !== "string" || !contentType || typeof contentType !== "string") {
    return NextResponse.json(
      { error: "Missing or invalid filename and contentType" },
      { status: 400 }
    );
  }

  if (!CONTEXTS.includes(context as PresignContext)) {
    return NextResponse.json({ error: "Invalid context" }, { status: 400 });
  }

  if (!isAllowedContentType(contentType)) {
    return NextResponse.json({ error: "Content type not allowed" }, { status: 400 });
  }

  const maxBytes = getMaxSizeBytes(contentType);
  if (typeof size === "number" && size > maxBytes) {
    return NextResponse.json(
      { error: `File too large (max ${Math.round(maxBytes / 1024 / 1024)} MB)` },
      { status: 400 }
    );
  }

  let ownerId: string;

  if (context === "message") {
    if (!conversationId) {
      return NextResponse.json({ error: "conversationId required for message upload" }, { status: 400 });
    }
    const conv = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        OR: [{ userId: user.id }, { creator: { username: user.username } }],
      },
      select: { id: true },
    });
    if (!conv) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }
    ownerId = user.id;
  } else {
    if (user.role === "admin" && typeof body.creatorId === "string") {
      const creator = await prisma.creator.findUnique({
        where: { id: body.creatorId },
        select: { id: true },
      });
      if (!creator) return NextResponse.json({ error: "Creator not found" }, { status: 404 });
      ownerId = creator.id;
    } else if (user.role === "creator") {
      const creator = await prisma.creator.findUnique({
        where: { username: user.username },
        select: { id: true },
      });
      if (!creator) {
        return NextResponse.json({ error: "Creator profile not found" }, { status: 404 });
      }
      ownerId = creator.id;
    } else {
      return NextResponse.json({ error: "Creator access required" }, { status: 403 });
    }
  }

  const key = buildKey({
    context: context as PresignContext,
    ownerId,
    filename,
    conversationId: context === "message" ? conversationId : undefined,
  });

  const result = await getPresignedPutUrl({ key, contentType });
  if (!result) {
    return NextResponse.json(
      { error: "Storage not configured" },
      { status: 503 }
    );
  }

  return NextResponse.json({
    uploadUrl: result.uploadUrl,
    publicUrl: result.publicUrl,
    key,
  });
}
