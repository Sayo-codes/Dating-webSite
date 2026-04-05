import { NextResponse } from "next/server";
import { withAuth } from "@/shared/api/auth-guard";
import { prisma } from "@/shared/lib/prisma";

export async function GET() {
  const auth = await withAuth();
  if (auth instanceof NextResponse) return auth;
  const user = auth.user;

  const transactions = await prisma.transaction.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json({
    transactions: transactions.map((t: any) => ({
      id: t.id,
      amountCents: t.amountCents,
      currency: t.currency,
      status: t.status,
      itemType: t.itemType,
      itemId: t.itemId,
      createdAt: t.createdAt,
    })),
  });
}
