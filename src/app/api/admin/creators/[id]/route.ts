import { NextRequest, NextResponse } from "next/server";
import { withAdmin } from "@/shared/api/auth-guard";
import { prisma } from "@/shared/lib/prisma";

export async function GET(_r: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await withAdmin();
  if (auth instanceof NextResponse) return auth;
  const { id } = await context.params;
  const creator = await prisma.creator.findUnique({
    where: { id },
    include: { media: { orderBy: [{ sortOrder: "asc" }] }, _count: { select: { conversations: true } } },
  });
  if (!creator) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ creator: { ...creator, conversationCount: creator._count.conversations } });
}

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const auth = await withAdmin();
  if (auth instanceof NextResponse) return auth;
  const { id } = await context.params;
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const data: Record<string, unknown> = {};
  if (typeof body.username === "string") data.username = body.username.toLowerCase();
  if (typeof body.displayName === "string") data.displayName = body.displayName;
  if (typeof body.avatarUrl === "string") data.avatarUrl = body.avatarUrl;
  if (typeof body.bannerUrl === "string") data.bannerUrl = body.bannerUrl;
  if (typeof body.age === "number" && Number.isFinite(body.age)) data.age = Math.round(body.age);
  if (body.age === null) data.age = null;
  if (typeof body.bio === "string") data.bio = body.bio;
  if (typeof body.location === "string") data.location = body.location;
  if (typeof body.profession === "string") data.profession = body.profession;
  if (typeof body.height === "string") data.height = body.height;
  if (typeof body.weight === "string") data.weight = body.weight;
  if (typeof body.verified === "boolean") data.verified = body.verified;
  if (typeof data.username === "string") {
    const taken = await prisma.creator.findFirst({ where: { username: data.username as string, NOT: { id } } });
    if (taken) return NextResponse.json({ error: "Username taken" }, { status: 400 });
  }
  const creator = await prisma.creator.update({ where: { id }, data });
  return NextResponse.json({ creator });
}

export async function DELETE(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const auth = await withAdmin();
  if (auth instanceof NextResponse) return auth;
  const { id } = await context.params;
  try {
    await prisma.creator.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Creator not found or could not be deleted" }, { status: 404 });
  }
}
