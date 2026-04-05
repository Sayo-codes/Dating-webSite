import { NextResponse } from "next/server";
import { withAdmin } from "@/shared/api/auth-guard";
import { prisma } from "@/shared/lib/prisma";

export async function GET() {
  const auth = await withAdmin();
  if (auth instanceof NextResponse) return auth;

  const [
    userCount,
    creatorCount,
    conversationCount,
    messageCount,
    recentUsers,
    recentConversations,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.creator.count(),
    prisma.conversation.count(),
    prisma.message.count(),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, username: true, email: true, role: true, createdAt: true },
    }),
    prisma.conversation.findMany({
      orderBy: { updatedAt: "desc" },
      take: 5,
      include: {
        user: { select: { username: true } },
        creator: { select: { displayName: true, username: true } },
      },
    }),
  ]);

  const messagesByDay = await prisma.$queryRaw<
    { date: string; count: bigint }[]
  >`
    SELECT date_trunc('day', created_at)::date AS date, count(*)::bigint AS count
    FROM messages
    WHERE created_at >= now() - interval '30 days'
    GROUP BY date_trunc('day', created_at)
    ORDER BY date ASC
  `;

  return NextResponse.json({
    counts: {
      users: userCount,
      creators: creatorCount,
      conversations: conversationCount,
      messages: messageCount,
    },
    recentUsers,
    recentConversations: recentConversations.map((c: any) => ({
      id: c.id,
      user: c.user.username,
      creator: c.creator.displayName ?? c.creator.username,
      updatedAt: c.updatedAt,
    })),
    messagesByDay: messagesByDay.map((r: any) => ({
      date: (r.date as any) instanceof Date ? (r.date as any).toISOString().slice(0, 10) : String(r.date),
      count: Number(r.count),
    })),
  });
}
