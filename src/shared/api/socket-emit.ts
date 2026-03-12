/**
 * Emit real-time events to the socket server.
 * Single place for socket server URL and payload shape.
 */

const SOCKET_URL = process.env.SOCKET_SERVER_URL;
const SOCKET_SECRET = process.env.SOCKET_SERVER_SECRET;

export type NewMessagePayload = {
  id: string;
  conversationId: string;
  senderType: string;
  body: string | null;
  mediaUrl: string | null;
  mediaType: string | null;
  createdAt: Date;
};

export async function emitNewMessage(
  conversationId: string,
  message: NewMessagePayload
): Promise<void> {
  if (!SOCKET_URL) return;
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (SOCKET_SECRET) headers["X-Internal-Secret"] = SOCKET_SECRET;
  try {
    await fetch(`${SOCKET_URL}/internal/emit`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        room: conversationId,
        event: "message:new",
        data: {
          ...message,
          createdAt: message.createdAt instanceof Date
            ? message.createdAt.toISOString()
            : message.createdAt,
        },
      }),
    });
  } catch {
    // Fire-and-forget; do not fail the request
  }
}
