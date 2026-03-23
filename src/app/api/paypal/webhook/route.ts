/**
 * PayPal webhook handler for recurring subscriptions.
 * Handles: BILLING.SUBSCRIPTION.ACTIVATED, PAYMENT.SALE.COMPLETED,
 * BILLING.SUBSCRIPTION.CANCELLED, BILLING.SUBSCRIPTION.EXPIRED
 *
 * Set PAYPAL_WEBHOOK_ID in .env for webhook signature verification.
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";
import { verifyWebhookSignature } from "@/shared/lib/paypal";
import { sendAutoWelcome } from "@/lib/auto-welcome";

type WebhookEvent = {
  id: string;
  event_type: string;
  resource: {
    id: string;
    status?: string;
    custom_id?: string; // We encode "userId:creatorId" here
    billing_agreement_id?: string;
    subscriber?: { email_address?: string };
    amount?: { value: string; currency_code: string };
    billing_info?: {
      next_billing_time?: string;
    };
  };
};

export async function POST(request: NextRequest) {
  const body = await request.text();
  let event: WebhookEvent;
  try {
    event = JSON.parse(body) as WebhookEvent;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Verify webhook signature in production
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;
  if (webhookId) {
    const isValid = await verifyWebhookSignature({
      authAlgo: request.headers.get("paypal-auth-algo") ?? "",
      certUrl: request.headers.get("paypal-cert-url") ?? "",
      transmissionId: request.headers.get("paypal-transmission-id") ?? "",
      transmissionSig: request.headers.get("paypal-transmission-sig") ?? "",
      transmissionTime: request.headers.get("paypal-transmission-time") ?? "",
      webhookId,
      webhookEvent: event,
    });
    if (!isValid) {
      console.warn("[paypal-webhook] Invalid signature for event:", event.id);
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  }

  const eventType = event.event_type;
  console.log(`[paypal-webhook] Received event: ${eventType} (${event.id})`);

  try {
    switch (eventType) {
      case "BILLING.SUBSCRIPTION.ACTIVATED": {
        await handleSubscriptionActivated(event);
        break;
      }
      case "PAYMENT.SALE.COMPLETED": {
        await handlePaymentCompleted(event);
        break;
      }
      case "BILLING.SUBSCRIPTION.CANCELLED": {
        await handleSubscriptionCancelled(event);
        break;
      }
      case "BILLING.SUBSCRIPTION.EXPIRED": {
        await handleSubscriptionExpired(event);
        break;
      }
      case "BILLING.SUBSCRIPTION.SUSPENDED": {
        await handleSubscriptionSuspended(event);
        break;
      }
      default:
        console.log(`[paypal-webhook] Unhandled event type: ${eventType}`);
    }
  } catch (error) {
    console.error(`[paypal-webhook] Error handling ${eventType}:`, error);
    // Return 200 so PayPal doesn't retry (we've logged the error)
    return NextResponse.json({ status: "error_logged" });
  }

  return NextResponse.json({ status: "ok" });
}

/**
 * New subscription activated — create DB record + send welcome message
 */
async function handleSubscriptionActivated(event: WebhookEvent) {
  const resource = event.resource;
  const paypalSubscriptionId = resource.id;
  const customId = resource.custom_id; // "userId:creatorId:planId"

  if (!customId) {
    console.warn("[paypal-webhook] No custom_id on subscription activation");
    return;
  }

  const [userId, creatorId, planId] = customId.split(":");
  if (!userId || !creatorId) {
    console.warn("[paypal-webhook] Invalid custom_id format:", customId);
    return;
  }

  const priceCents = planId === "elite" ? 4999 : 1999;
  const now = new Date();
  const periodEnd = new Date(now);
  periodEnd.setMonth(periodEnd.getMonth() + 1);

  // Use next_billing_time if available
  if (resource.billing_info?.next_billing_time) {
    const nbt = new Date(resource.billing_info.next_billing_time);
    if (!isNaN(nbt.getTime())) {
      periodEnd.setTime(nbt.getTime());
    }
  }

  const prior = await prisma.subscription.findUnique({
    where: { userId_creatorId: { userId, creatorId } },
    select: { status: true },
  });
  const alreadyActive = prior?.status === "ACTIVE";

  // Create or update subscription
  await prisma.subscription.upsert({
    where: { userId_creatorId: { userId, creatorId } },
    create: {
      userId,
      creatorId,
      planId: planId ?? "vip",
      priceCents,
      paypalSubscriptionId,
      status: "ACTIVE",
      currentPeriodStart: now,
      currentPeriodEnd: periodEnd,
    },
    update: {
      planId: planId ?? "vip",
      priceCents,
      paypalSubscriptionId,
      status: "ACTIVE",
      currentPeriodStart: now,
      currentPeriodEnd: periodEnd,
    },
  });

  // Record transaction
  await prisma.transaction.create({
    data: {
      userId,
      amountCents: priceCents,
      currency: "USD",
      status: "COMPLETED",
      itemType: "subscription",
      itemId: creatorId,
      metadata: {
        paypalSubscriptionId,
        planId: planId ?? "vip",
        eventType: "BILLING.SUBSCRIPTION.ACTIVATED",
      },
    },
  });

  // Increment subscriber count only when not already active (avoids duplicate webhooks)
  if (!alreadyActive) {
    await prisma.creator.update({
      where: { id: creatorId },
      data: { subscriberCount: { increment: 1 } },
    });
  }

  // Send auto-welcome message
  await sendAutoWelcome(userId, creatorId);

  console.log(`[paypal-webhook] Subscription activated for user=${userId} creator=${creatorId}`);
}

/**
 * Recurring payment completed — update subscription period + record earnings
 */
async function handlePaymentCompleted(event: WebhookEvent) {
  const resource = event.resource;
  const paypalSubscriptionId = resource.billing_agreement_id;

  if (!paypalSubscriptionId) {
    console.log("[paypal-webhook] Payment completed but no billing_agreement_id — one-time payment");
    return;
  }

  // Find subscription in DB
  const subscription = await prisma.subscription.findUnique({
    where: { paypalSubscriptionId },
  });

  if (!subscription) {
    console.warn("[paypal-webhook] Subscription not found for:", paypalSubscriptionId);
    return;
  }

  // Calculate new period end
  const now = new Date();
  const newPeriodEnd = new Date(now);
  newPeriodEnd.setMonth(newPeriodEnd.getMonth() + 1);

  // Update subscription dates
  await prisma.subscription.update({
    where: { id: subscription.id },
    data: {
      status: "ACTIVE",
      currentPeriodStart: now,
      currentPeriodEnd: newPeriodEnd,
    },
  });

  // Parse amount
  const amountStr = resource.amount?.value ?? "19.99";
  const amountCents = Math.round(parseFloat(amountStr) * 100);

  // Record earnings transaction
  await prisma.transaction.create({
    data: {
      userId: subscription.userId,
      amountCents,
      currency: resource.amount?.currency_code ?? "USD",
      status: "COMPLETED",
      itemType: "subscription_renewal",
      itemId: subscription.creatorId,
      metadata: {
        paypalSubscriptionId,
        planId: subscription.planId,
        eventType: "PAYMENT.SALE.COMPLETED",
        paypalSaleId: resource.id,
      },
    },
  });

  // Send renewal welcome message
  await sendAutoWelcome(subscription.userId, subscription.creatorId);

  console.log(
    `[paypal-webhook] Renewal payment $${amountStr} for subscription=${paypalSubscriptionId}`
  );
}

/**
 * Subscription cancelled — mark as CANCELLED
 */
async function handleSubscriptionCancelled(event: WebhookEvent) {
  const paypalSubscriptionId = event.resource.id;
  const subscription = await prisma.subscription.findUnique({
    where: { paypalSubscriptionId },
  });
  if (!subscription) return;

  await prisma.subscription.update({
    where: { id: subscription.id },
    data: { status: "CANCELLED" },
  });

  // Decrement subscriber count
  await prisma.creator.update({
    where: { id: subscription.creatorId },
    data: { subscriberCount: { decrement: 1 } },
  });

  console.log(`[paypal-webhook] Subscription cancelled: ${paypalSubscriptionId}`);
}

/**
 * Subscription expired
 */
async function handleSubscriptionExpired(event: WebhookEvent) {
  const paypalSubscriptionId = event.resource.id;
  const subscription = await prisma.subscription.findUnique({
    where: { paypalSubscriptionId },
  });
  if (!subscription) return;

  await prisma.subscription.update({
    where: { id: subscription.id },
    data: { status: "EXPIRED" },
  });

  await prisma.creator.update({
    where: { id: subscription.creatorId },
    data: { subscriberCount: { decrement: 1 } },
  });

  console.log(`[paypal-webhook] Subscription expired: ${paypalSubscriptionId}`);
}

/**
 * Subscription suspended (payment issue)
 */
async function handleSubscriptionSuspended(event: WebhookEvent) {
  const paypalSubscriptionId = event.resource.id;
  const subscription = await prisma.subscription.findUnique({
    where: { paypalSubscriptionId },
  });
  if (!subscription) return;

  await prisma.subscription.update({
    where: { id: subscription.id },
    data: { status: "PAST_DUE" },
  });

  console.log(`[paypal-webhook] Subscription suspended: ${paypalSubscriptionId}`);
}
