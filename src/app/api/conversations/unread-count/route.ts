import { NextResponse } from "next/server";
import { withAuth } from "@/shared/api/auth-guard";
import { prisma } from "@/shared/lib/prisma";

export async function GET() {
  const auth = await withAuth();
  if (auth instanceof NextResponse) return auth;

  // Count messages in user's conversations that are from CREATOR and not yet read
  const count = await prisma.message.count({
    where: {
      conversation: { userId: auth.user.id },
      senderType: "CREATOR",
      readAt: null,
    },
  });

  return NextResponse.json({ count });
}
