import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/shared/api/auth-guard";
import { getConversationsForUser, findOrCreateConversation } from "@/features/chat/data";

export async function GET() {
  const auth = await withAuth();
  if (auth instanceof NextResponse) return auth;

  const list = await getConversationsForUser(auth.user.id);
  return NextResponse.json({ conversations: list });
}

export async function POST(request: NextRequest) {
  const auth = await withAuth();
  if (auth instanceof NextResponse) return auth;

  const body = await request.json().catch(() => ({})) as { creatorId?: string };
  const creatorId = body.creatorId;
  if (!creatorId) return NextResponse.json({ error: "Missing creatorId" }, { status: 400 });

  const conv = await findOrCreateConversation(auth.user.id, creatorId);
  return NextResponse.json({ conversation: conv }, { status: 200 });
}
