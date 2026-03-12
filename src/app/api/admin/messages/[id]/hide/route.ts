import { NextResponse } from "next/server";
import { withAdmin } from "@/shared/api/auth-guard";
import { prisma } from "@/shared/lib/prisma";

export async function POST(_req: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await withAdmin();
  if (auth instanceof NextResponse) return auth;
  const { id } = await context.params;
  await prisma.message.update({ where: { id }, data: { deletedAt: new Date() } });
  return NextResponse.json({ ok: true });
}
