import { NextResponse } from "next/server";
import { withAuth } from "@/shared/api/auth-guard";
import { prisma } from "@/shared/lib/prisma";

export async function GET() {
  const auth = await withAuth();
  if (auth instanceof NextResponse) return auth;
  const user = auth.user;

  const list = await prisma.transaction.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return NextResponse.json({ transactions: list });
}
