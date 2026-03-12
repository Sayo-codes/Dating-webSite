import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/shared/api/auth-guard";
import { prisma } from "@/shared/lib/prisma";
import { capturePayPalOrder } from "@/shared/lib/paypal";

export async function POST(request: NextRequest) {
  const auth = await withAuth();
  if (auth instanceof NextResponse) return auth;
  const user = auth.user;

  const body = await request.json().catch(() => ({}));
  const { orderID } = body as { orderID?: string };
  if (!orderID) {
    return NextResponse.json({ error: "orderID required" }, { status: 400 });
  }

  const transaction = await prisma.transaction.findFirst({
    where: { paypalOrderId: orderID, userId: user.id },
  });
  if (!transaction) {
    return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
  }
  if (transaction.status === "COMPLETED") {
    return NextResponse.json({ transaction, alreadyCompleted: true });
  }

  let captureId: string;
  try {
    const result = await capturePayPalOrder(orderID);
    captureId = result.captureId;
  } catch (err) {
    await prisma.transaction.update({
      where: { id: transaction.id },
      data: { status: "FAILED" },
    });
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Capture failed" },
      { status: 502 }
    );
  }

  const updated = await prisma.transaction.update({
    where: { id: transaction.id },
    data: {
      status: "COMPLETED",
      paypalCaptureId: captureId,
    },
  });

  return NextResponse.json({ transaction: updated });
}
