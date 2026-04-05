import { prisma } from "@/shared/lib/prisma";

/** Default page size for message list in API routes. */
export const MESSAGE_LIST_LIMIT = 50;

export async function getConversationsForUser(userId: string) {
  const list = await prisma.conversation.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    include: {
      creator: {
        select: { id: true, username: true, displayName: true, avatarUrl: true, verified: true },
      },
      messages: {
        where: { deletedAt: null },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });
  return list.map((c: any) => ({
    id: c.id,
    creator: c.creator,
    lastMessage: c.messages[0]
      ? {
          id: c.messages[0].id,
          body: c.messages[0].body,
          mediaUrl: c.messages[0].mediaUrl,
          mediaType: c.messages[0].mediaType,
          senderType: c.messages[0].senderType,
          createdAt: c.messages[0].createdAt,
        }
      : null,
    updatedAt: c.updatedAt,
  }));
}

export async function findOrCreateConversation(userId: string, creatorId: string) {
  let conv = await prisma.conversation.findUnique({
    where: { userId_creatorId: { userId, creatorId } },
    include: {
      creator: {
        select: { id: true, username: true, displayName: true, avatarUrl: true, verified: true },
      },
    },
  });
  if (!conv) {
    conv = await prisma.conversation.create({
      data: { userId, creatorId },
      include: {
        creator: {
          select: { id: true, username: true, displayName: true, avatarUrl: true, verified: true },
        },
      },
    });
  }
  return conv;
}

export async function getConversationForUser(conversationId: string, userId: string) {
  const c = await prisma.conversation.findFirst({
    where: { id: conversationId, userId },
    include: {
      creator: {
        select: { id: true, username: true, displayName: true, avatarUrl: true, verified: true },
      },
    },
  });
  return c;
}

export async function getMessages(conversationId: string, userId: string, limit: number, before?: string) {
  const conv = await prisma.conversation.findFirst({
    where: { id: conversationId, userId },
  });
  if (!conv) return null;

  const messages = await prisma.message.findMany({
    where: { conversationId, deletedAt: null },
    orderBy: { createdAt: "desc" },
    take: limit + 1,
    ...(before ? { cursor: { id: before }, skip: 1 } : {}),
  });

  const hasMore = messages.length > limit;
  const list = hasMore ? messages.slice(0, limit) : messages;
  return list.reverse();
}

export async function createMessage(
  conversationId: string,
  userId: string,
  data: { body?: string; mediaUrl?: string; mediaType?: "IMAGE" | "VIDEO" | "VOICE" }
) {
  const conv = await prisma.conversation.findFirst({
    where: { id: conversationId, userId },
  });
  if (!conv) return null;

  const message = await prisma.message.create({
    data: {
      conversationId,
      senderType: "USER",
      body: data.body ?? null,
      mediaUrl: data.mediaUrl ?? null,
      mediaType: data.mediaType ?? null,
      deliveredAt: new Date(),
    },
  });

  await prisma.conversation.update({
    where: { id: conversationId },
    data: { updatedAt: new Date() },
  });

  return message;
}

// ---------- Creator-side ----------

export async function getConversationsForCreator(creatorId: string) {
  const list = await prisma.conversation.findMany({
    where: { creatorId },
    orderBy: { updatedAt: "desc" },
    include: {
      user: {
        select: { id: true, username: true },
      },
      creator: {
        select: { id: true, username: true, displayName: true, avatarUrl: true, verified: true },
      },
      messages: {
        where: { deletedAt: null },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });
  return list.map((c: any) => ({
    id: c.id,
    user: c.user,
    creator: c.creator,
    lastMessage: c.messages[0]
      ? {
          id: c.messages[0].id,
          body: c.messages[0].body,
          mediaUrl: c.messages[0].mediaUrl,
          mediaType: c.messages[0].mediaType,
          senderType: c.messages[0].senderType,
          createdAt: c.messages[0].createdAt,
        }
      : null,
    updatedAt: c.updatedAt,
  }));
}

export async function getConversationForCreator(conversationId: string, creatorId: string) {
  const c = await prisma.conversation.findFirst({
    where: { id: conversationId, creatorId },
    include: {
      user: { select: { id: true, username: true } },
      creator: {
        select: { id: true, username: true, displayName: true, avatarUrl: true, verified: true },
      },
    },
  });
  return c;
}

export async function getMessagesForCreator(
  conversationId: string,
  creatorId: string,
  limit: number,
  before?: string
) {
  const conv = await prisma.conversation.findFirst({
    where: { id: conversationId, creatorId },
  });
  if (!conv) return null;

  const messages = await prisma.message.findMany({
    where: { conversationId, deletedAt: null },
    orderBy: { createdAt: "desc" },
    take: limit + 1,
    ...(before ? { cursor: { id: before }, skip: 1 } : {}),
  });

  const hasMore = messages.length > limit;
  const list = hasMore ? messages.slice(0, limit) : messages;
  return list.reverse();
}

export async function createMessageAsCreator(
  conversationId: string,
  creatorId: string,
  data: { body?: string; mediaUrl?: string; mediaType?: "IMAGE" | "VIDEO" | "VOICE" }
) {
  const conv = await prisma.conversation.findFirst({
    where: { id: conversationId, creatorId },
  });
  if (!conv) return null;

  const message = await prisma.message.create({
    data: {
      conversationId,
      senderType: "CREATOR",
      body: data.body ?? null,
      mediaUrl: data.mediaUrl ?? null,
      mediaType: data.mediaType ?? null,
      deliveredAt: new Date(),
    },
  });

  await prisma.conversation.update({
    where: { id: conversationId },
    data: { updatedAt: new Date() },
  });

  return message;
}
