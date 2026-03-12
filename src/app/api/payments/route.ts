import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const { amountCents, currency, conversationId } = body as {
    amountCents?: number;
    currency?: string;
    conversationId?: string;
  };

  if (!amountCents || amountCents <= 0) {
    return NextResponse.json(
      { error: "Invalid amount" },
      { status: 400 }
    );
  }

  // TODO: auth + Stripe + Prisma – create Payment intent, record Payment row
  return NextResponse.json(
    {
      clientSecret: null,
      message: "Payment placeholder – wire to Stripe + Prisma",
    },
    { status: 201 }
  );
}
