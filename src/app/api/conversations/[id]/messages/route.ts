import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/shared/api/auth-guard";
import { emitNewMessage } from "@/shared/api/socket-emit";
import {
  getMessages,
  createMessage,
  MESSAGE_LIST_LIMIT,
} from "@/features/chat/data";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await withAuth();
  if (auth instanceof NextResponse) return auth;

  const { id } = await context.params;
  const { searchParams } = new URL(request.url);
  const before = searchParams.get("before") ?? undefined;

  const messages = await getMessages(id, auth.user.id, MESSAGE_LIST_LIMIT, before);
  if (messages === null)
    return NextResponse.json({ error: "Conversation not found" }, { status: 404 });

  return NextResponse.json({ messages });
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await withAuth();
  if (auth instanceof NextResponse) return auth;

  const { id } = await context.params;
  const body = await request.json().catch(() => ({})) as {
    body?: string;
    mediaUrl?: string;
    mediaType?: "IMAGE" | "VIDEO" | "VOICE";
  };
  const { body: text, mediaUrl, mediaType } = body;

  if (!text && !mediaUrl) {
    return NextResponse.json(
      { error: "Message must have body or mediaUrl" },
      { status: 400 }
    );
  }

  const message = await createMessage(id, auth.user.id, {
    body: text,
    mediaUrl: mediaUrl ?? undefined,
    mediaType: mediaType ?? undefined,
  });

  if (!message)
    return NextResponse.json({ error: "Conversation not found" }, { status: 404 });

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
