/**
 * Check if current user is subscribed to a specific creator.
 * GET /api/subscriptions/check?creatorId=xxx
 */

import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/shared/api/auth-guard";
import { prisma } from "@/shared/lib/prisma";

export async function GET(request: NextRequest) {
  const auth = await withAuth();
  if (auth instanceof NextResponse) return auth;

  const creatorId = request.nextUrl.searchParams.get("creatorId");
  if (!creatorId) {
    return NextResponse.json({ error: "Missing creatorId" }, { status: 400 });
  }

  const subscription = await prisma.subscription.findUnique({
    where: { userId_creatorId: { userId: auth.user.id, creatorId } },
  });

  const isSubscribed =
    subscription?.status === "ACTIVE" &&
    subscription.currentPeriodEnd > new Date();

  return NextResponse.json({
    isSubscribed,
    planId: subscription?.planId ?? null,
    expiresAt: subscription?.currentPeriodEnd?.toISOString() ?? null,
  });
}
