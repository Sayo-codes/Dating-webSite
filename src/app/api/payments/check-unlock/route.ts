import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";

export async function GET(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ unlocked: false }, { status: 200 });

  const { searchParams } = new URL(request.url);
  const itemType = searchParams.get("itemType");
  const itemId = searchParams.get("itemId");

  if (!itemType && !itemId) {
    return NextResponse.json(
      { error: "itemType or itemId required" },
      { status: 400 }
    );
  }

  const where: { userId: string; status: string; itemType?: string | null; itemId?: string | null } = {
    userId: user.id,
    status: "COMPLETED",
  };
  if (itemType) where.itemType = itemType;
  if (itemId) where.itemId = itemId;

  const count = await prisma.transaction.count({
    where,
  });

  return NextResponse.json({ unlocked: count > 0 });
}
