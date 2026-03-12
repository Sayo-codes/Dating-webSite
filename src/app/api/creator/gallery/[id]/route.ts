import { NextResponse } from "next/server";
import { withCreator } from "@/shared/api/auth-guard";
import { prisma } from "@/shared/lib/prisma";

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await withCreator();
  if (auth instanceof NextResponse) return auth;

  const { id } = await context.params;

  await prisma.creatorMedia.deleteMany({
    where: { id, creatorId: auth.creatorId },
  });

  return NextResponse.json({ ok: true });
}
