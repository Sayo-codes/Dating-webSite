import { NextResponse } from "next/server";
import { withAdmin } from "@/shared/api/auth-guard";
import { prisma } from "@/shared/lib/prisma";

export async function POST(_req: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await withAdmin();
  if (auth instanceof NextResponse) return auth;
  const { id } = await context.params;

  const result = await prisma.message.updateMany({
    where: {
      conversationId: id,
      senderType: "USER",
      readAt: null,
      deletedAt: null,
    },
    data: { readAt: new Date() },
  });

  return NextResponse.json({ marked: result.count });
}
