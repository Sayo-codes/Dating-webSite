import { NextRequest, NextResponse } from "next/server";
import { withCreator } from "@/shared/api/auth-guard";
import { prisma } from "@/shared/lib/prisma";

export async function POST(request: NextRequest) {
  const auth = await withCreator();
  if (auth instanceof NextResponse) return auth;

  const body = await request.json().catch(() => ({})) as { url?: string; type?: "IMAGE" | "VIDEO" };
  const { url, type } = body;

  if (!url || typeof url !== "string") {
    return NextResponse.json({ error: "url required" }, { status: 400 });
  }
  const mediaType = type === "VIDEO" ? "VIDEO" : "IMAGE";

  const maxOrder = await prisma.creatorMedia.aggregate({
    where: { creatorId: auth.creatorId },
    _max: { sortOrder: true },
  });
  const sortOrder = (maxOrder._max.sortOrder ?? -1) + 1;

  const item = await prisma.creatorMedia.create({
    data: {
      creatorId: auth.creatorId,
      url,
      type: mediaType,
      sortOrder,
    },
  });

  return NextResponse.json({ item }, { status: 201 });
}
