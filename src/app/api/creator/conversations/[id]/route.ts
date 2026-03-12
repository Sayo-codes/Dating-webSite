import { NextResponse } from "next/server";
import { withCreator } from "@/shared/api/auth-guard";
import { getConversationForCreator } from "@/features/chat/data";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await withCreator();
  if (auth instanceof NextResponse) return auth;

  const { id } = await context.params;
  const conv = await getConversationForCreator(id, auth.creatorId);
  if (!conv) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ conversation: conv });
}
