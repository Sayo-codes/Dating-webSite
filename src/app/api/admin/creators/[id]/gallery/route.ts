import { NextRequest, NextResponse } from "next/server";
import { withAdmin } from "@/shared/api/auth-guard";
import { prisma } from "@/shared/lib/prisma";

export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const auth = await withAdmin();
  if (auth instanceof NextResponse) return auth;
  const { id: creatorId } = await context.params;
  const media = await prisma.creatorMedia.findMany({
    where: { creatorId },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
  return NextResponse.json({ media });
}

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const auth = await withAdmin();
  if (auth instanceof NextResponse) return auth;
  const { id: creatorId } = await context.params;
  const creator = await prisma.creator.findUnique({ where: { id: creatorId }, select: { id: true } });
  if (!creator) return NextResponse.json({ error: "Creator not found" }, { status: 404 });
  const body = (await req.json().catch(() => ({}))) as { url?: string; type?: string };
  if (!body.url) return NextResponse.json({ error: "url required" }, { status: 400 });
  const type = body.type === "VIDEO" ? "VIDEO" : "IMAGE";
  const max = await prisma.creatorMedia.aggregate({ where: { creatorId }, _max: { sortOrder: true } });
  const sortOrder = (max._max.sortOrder ?? -1) + 1;
  const item = await prisma.creatorMedia.create({ data: { creatorId, url: body.url, type, sortOrder } });
  return NextResponse.json({ item }, { status: 201 });
}
