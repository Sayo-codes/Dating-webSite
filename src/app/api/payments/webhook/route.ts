import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";
import { verifyWebhookSignature } from "@/shared/lib/paypal";

export async function POST(request: NextRequest) {
  const authAlgo = request.headers.get("paypal-auth-algo") ?? "";
  const certUrl = request.headers.get("paypal-cert-url") ?? "";
  const transmissionId = request.headers.get("paypal-transmission-id") ?? "";
  const transmissionSig = request.headers.get("paypal-transmission-sig") ?? "";
  const transmissionTime = request.headers.get("paypal-transmission-time") ?? "";
  const webhookId = process.env.PAYPAL_WEBHOOK_ID ?? "";

  const webhookEvent = await request.json().catch(() => null);
  if (!webhookEvent) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const eventType = (webhookEvent as { event_type?: string }).event_type;
  if (eventType !== "PAYMENT.CAPTURE.COMPLETED") {
    return NextResponse.json({ received: true });
  }

  const verified = await verifyWebhookSignature({
    authAlgo,
    certUrl,
    transmissionId,
    transmissionSig,
    transmissionTime,
    webhookId,
    webhookEvent,
  });
  if (!verified) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const resource = (webhookEvent as { resource?: Record<string, unknown> }).resource;
  if (!resource || typeof resource !== "object") {
    return NextResponse.json({ received: true });
  }

  const captureId = resource.id as string | undefined;
  const supplementary = resource.supplementary_data as { related_ids?: { order_id?: string } } | undefined;
  const orderId = supplementary?.related_ids?.order_id;

  if (orderId) {
    await prisma.transaction.updateMany({
      where: { paypalOrderId: orderId, status: "PENDING" },
      data: {
        status: "COMPLETED",
        paypalCaptureId: captureId ?? undefined,
      },
    });
  } else if (captureId) {
    await prisma.transaction.updateMany({
      where: { paypalCaptureId: captureId, status: "PENDING" },
      data: { status: "COMPLETED" },
    });
  }

  return NextResponse.json({ received: true });
}
