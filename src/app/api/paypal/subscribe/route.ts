/**
 * Create a PayPal subscription for a creator.
 * POST body: { creatorId: string, planId?: "vip" | "elite" }
 * Returns: { planId: string, customId: string } for the frontend PayPal createSubscription
 */

import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/shared/api/auth-guard";
import { prisma } from "@/shared/lib/prisma";
import { getPayPalPlanId } from "@/shared/lib/paypal";

export async function POST(request: NextRequest) {
  const auth = await withAuth();
  if (auth instanceof NextResponse) return auth;

  const body = (await request.json().catch(() => ({}))) as {
    creatorId?: string;
    planId?: "vip" | "elite";
  };

  if (!body.creatorId) {
    return NextResponse.json({ error: "Missing creatorId" }, { status: 400 });
  }

  // Verify creator exists
  const creator = await prisma.creator.findUnique({
    where: { id: body.creatorId },
    select: { id: true, displayName: true },
  });
  if (!creator) {
    return NextResponse.json({ error: "Creator not found" }, { status: 404 });
  }

  // Check existing active subscription
  const existing = await prisma.subscription.findUnique({
    where: { userId_creatorId: { userId: auth.user.id, creatorId: body.creatorId } },
  });
  if (existing?.status === "ACTIVE") {
    return NextResponse.json({ error: "Already subscribed" }, { status: 400 });
  }

  const planId = body.planId ?? "vip";
  const paypalPlanId = await getPayPalPlanId(planId);
  const customId = `${auth.user.id}:${body.creatorId}:${planId}`;

  return NextResponse.json({
    paypalPlanId,
    customId,
    creatorName: creator.displayName,
  });
}
