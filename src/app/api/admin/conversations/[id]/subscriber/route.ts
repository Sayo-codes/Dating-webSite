import { NextResponse } from "next/server";
import { withAdmin } from "@/shared/api/auth-guard";
import { prisma } from "@/shared/lib/prisma";

export async function GET(_req: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await withAdmin();
  if (auth instanceof NextResponse) return auth;
  const { id } = await context.params;

  const conv = await prisma.conversation.findUnique({
    where: { id },
    select: { userId: true, creatorId: true },
  });
  if (!conv) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Get user info
  const user = await prisma.user.findUnique({
    where: { id: conv.userId },
    select: { id: true, username: true, email: true, createdAt: true },
  });

  // Get transaction history for this user (subscription proxy)
  const transactions = await prisma.transaction.findMany({
    where: { userId: conv.userId, status: "COMPLETED" },
    orderBy: { createdAt: "desc" },
    take: 10,
    select: {
      id: true,
      amountCents: true,
      currency: true,
      status: true,
      itemType: true,
      itemId: true,
      createdAt: true,
    },
  });

  // Get payment history
  const payments = await prisma.payment.findMany({
    where: { payerId: conv.userId, status: "COMPLETED" },
    orderBy: { createdAt: "desc" },
    take: 10,
    select: {
      id: true,
      amountCents: true,
      currency: true,
      status: true,
      createdAt: true,
    },
  });

  const totalSpent = [
    ...transactions.map((t) => t.amountCents),
    ...payments.map((p) => p.amountCents),
  ].reduce((sum, a) => sum + a, 0);

  return NextResponse.json({
    user,
    totalSpentCents: totalSpent,
    transactions,
    payments,
    isSubscribed: transactions.length > 0 || payments.length > 0,
  });
}
