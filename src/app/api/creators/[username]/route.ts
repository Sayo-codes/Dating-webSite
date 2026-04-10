import { NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    
    if (!username) {
      return NextResponse.json({ error: "Username required" }, { status: 400 });
    }

    const creator = await prisma.creator.findFirst({
      where: {
        username: {
          equals: username.toLowerCase(),
          mode: "insensitive"
        }
      },
      include: {
        media: {
          orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        },
        posts: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!creator) {
      return NextResponse.json({ error: "Creator not found" }, { status: 404 });
    }

    return NextResponse.json({ creator });
  } catch (error) {
    console.error("Creator API error:", error);
    return NextResponse.json({ 
      error: "Internal server error", 
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
