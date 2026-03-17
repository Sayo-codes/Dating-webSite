import { NextRequest, NextResponse } from "next/server";
import { withAdmin } from "@/shared/api/auth-guard";
import { prisma } from "@/shared/lib/prisma";
import { emitNewMessage } from "@/shared/api/socket-emit";

const LIMIT = 100;

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const auth = await withAdmin();
  if (auth instanceof NextResponse) return auth;
  const { id } = await context.params;
  const before = req.nextUrl.searchParams.get("before") ?? undefined;
  const messages = await prisma.message.findMany({
    where: { conversationId: id },
    orderBy: { createdAt: "desc" },
    take: LIMIT + 1,
    ...(before ? { cursor: { id: before }, skip: 1 } : {}),
  });
  const hasMore = messages.length > LIMIT;
  const list = hasMore ? messages.slice(0, LIMIT) : messages;
  return NextResponse.json({ messages: list.reverse(), hasMore });
}

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const auth = await withAdmin();
  if (auth instanceof NextResponse) return auth;
  const { id } = await context.params;

  const conv = await prisma.conversation.findUnique({ where: { id } });
  if (!conv) return NextResponse.json({ error: "Conversation not found" }, { status: 404 });

  const body = await req.json().catch(() => ({})) as {
    body?: string;
    mediaUrl?: string;
    mediaType?: "IMAGE" | "VIDEO" | "VOICE";
    isPPV?: boolean;
    ppvPriceCents?: number;
  };

  if (!body.body && !body.mediaUrl) {
    return NextResponse.json({ error: "Message must have body or mediaUrl" }, { status: 400 });
  }

  const message = await prisma.message.create({
    data: {
      conversationId: id,
      senderType: "CREATOR",
      body: body.body ?? null,
      mediaUrl: body.mediaUrl ?? null,
      mediaType: body.mediaType ?? null,
      isPPV: body.isPPV ?? false,
      ppvPriceCents: body.isPPV ? (body.ppvPriceCents ?? null) : null,
      deliveredAt: new Date(),
    },
  });

  await prisma.conversation.update({
    where: { id },
    data: { updatedAt: new Date() },
  });

  await emitNewMessage(id, {
    id: message.id,
    conversationId: message.conversationId,
    senderType: message.senderType,
    body: message.body,
    mediaUrl: message.mediaUrl,
    mediaType: message.mediaType,
    createdAt: message.createdAt,
  });

  return NextResponse.json({ message }, { status: 201 });
}
