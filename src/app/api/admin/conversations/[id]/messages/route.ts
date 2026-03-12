import { NextRequest, NextResponse } from "next/server";
import { withAdmin } from "@/shared/api/auth-guard";
import { prisma } from "@/shared/lib/prisma";

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
