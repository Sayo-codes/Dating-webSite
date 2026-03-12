import { NextResponse } from "next/server";
import { withCreator } from "@/shared/api/auth-guard";
import { getConversationsForCreator } from "@/features/chat/data";

export async function GET() {
  const auth = await withCreator();
  if (auth instanceof NextResponse) return auth;

  const list = await getConversationsForCreator(auth.creatorId);
  return NextResponse.json({ conversations: list });
}
