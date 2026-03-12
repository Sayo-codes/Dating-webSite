import { NextResponse } from "next/server";
import { withAuth } from "@/shared/api/auth-guard";
import { getConversationForUser } from "@/features/chat/data";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await withAuth();
  if (auth instanceof NextResponse) return auth;

  const { id } = await context.params;
  const conv = await getConversationForUser(id, auth.user.id);
  if (!conv) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ conversation: conv });
}
