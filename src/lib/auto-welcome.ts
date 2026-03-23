/**
 * Auto-welcome message helper.
 * When a subscription (new or renewal) occurs, create a welcome message
 * from the Creator to the user and emit via Socket.io.
 */

import { prisma } from "@/shared/lib/prisma";
import { emitNewMessage } from "@/shared/api/socket-emit";

const WELCOME_MESSAGE =
  "Hey honey, thanks for joining! Check your inbox for a special gift 💋";

export async function sendAutoWelcome(
  userId: string,
  creatorId: string
): Promise<void> {
  try {
    // Find or create conversation
    let conversation = await prisma.conversation.findUnique({
      where: { userId_creatorId: { userId, creatorId } },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: { userId, creatorId },
      });
    }

    // Create the welcome message from the creator
    const message = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        senderType: "CREATOR",
        body: WELCOME_MESSAGE,
        deliveredAt: new Date(),
      },
    });

    // Update conversation timestamp
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { updatedAt: new Date() },
    });

    // Emit via Socket.io for real-time delivery
    await emitNewMessage(conversation.id, {
      id: message.id,
      conversationId: message.conversationId,
      senderType: message.senderType,
      body: message.body,
      mediaUrl: null,
      mediaType: null,
      createdAt: message.createdAt,
    });
  } catch (error) {
    // Fire-and-forget — log but don't break subscription flow
    console.error("[auto-welcome] Failed to send welcome message:", error);
  }
}
