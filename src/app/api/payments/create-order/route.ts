import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/shared/api/auth-guard";
import { prisma } from "@/shared/lib/prisma";
import { createPayPalOrder } from "@/shared/lib/paypal";

export async function POST(request: NextRequest) {
  const auth = await withAuth();
  if (auth instanceof NextResponse) return auth;
  const user = auth.user;

  const body = await request.json().catch(() => ({}));
  const {
    amountCents,
    currency,
    itemType,
    itemId,
    description,
  } = body as {
    amountCents?: number;
    currency?: string;
    itemType?: string;
    itemId?: string;
    description?: string;
  };

  if (!amountCents || amountCents < 100) {
    return NextResponse.json(
      { error: "Invalid amount (min 1.00)" },
      { status: 400 }
    );
  }

  const transaction = await prisma.transaction.create({
    data: {
      userId: user.id,
      amountCents,
      currency: currency ?? "USD",
      status: "PENDING",
      itemType: itemType ?? null,
      itemId: itemId ?? null,
    },
  });

  let orderId: string;
  try {
    orderId = await createPayPalOrder({
      amountCents,
      currency: currency ?? "USD",
      description: description ?? "Premium content",
    });
  } catch (err) {
    await prisma.transaction.update({
      where: { id: transaction.id },
      data: { status: "FAILED" },
    });
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Payment setup failed" },
      { status: 502 }
    );
  }

  await prisma.transaction.update({
    where: { id: transaction.id },
    data: { paypalOrderId: orderId },
  });

  return NextResponse.json({ orderId, transactionId: transaction.id });
}
