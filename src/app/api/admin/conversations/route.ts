import { NextResponse } from "next/server";
import { withAdmin } from "@/shared/api/auth-guard";
import { prisma } from "@/shared/lib/prisma";

export async function GET() {
  const auth = await withAdmin();
  if (auth instanceof NextResponse) return auth;
  const conversations = await prisma.conversation.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      user: { select: { id: true, username: true, email: true } },
      creator: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });
  return NextResponse.json({
    conversations: conversations.map((c) => ({
      id: c.id,
      userId: c.userId,
      creatorId: c.creatorId,
      user: c.user,
      creator: c.creator,
      lastMessage: c.messages[0]
        ? {
            id: c.messages[0].id,
            body: c.messages[0].body,
            senderType: c.messages[0].senderType,
            mediaUrl: c.messages[0].mediaUrl,
            mediaType: c.messages[0].mediaType,
            createdAt: c.messages[0].createdAt,
            deletedAt: c.messages[0].deletedAt,
          }
        : null,
      updatedAt: c.updatedAt,
    })),
  });
}
