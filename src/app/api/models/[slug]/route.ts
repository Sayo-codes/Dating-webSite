import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  return NextResponse.json({
    model: null,
    message: `Model profile [${slug}] placeholder – wire to Prisma`,
  });
}
