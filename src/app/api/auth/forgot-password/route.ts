export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";
import { createOtp } from "@/shared/lib/otp";
import { sendPasswordResetEmail } from "@/lib/email";
import { checkRateLimit } from "@/shared/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    const limit = checkRateLimit(request);
    if (!limit.ok) {
      return NextResponse.json(
        { error: "Too many attempts. Try again later." },
        { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { email } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (user) {
      // Create a reset token (using OtpRequest as the token store)
      const token = await createOtp(normalizedEmail);
      await sendPasswordResetEmail(normalizedEmail, token);
    }

    // Always return success to prevent email enumeration
    return NextResponse.json(
      { message: "If an account exists, a reset link has been sent to your email." },
      { status: 200 }
    );
  } catch (err) {
    console.error("[forgot-password] Failed:", err);
    return NextResponse.json(
      { error: "An error occurred. Please try again." },
      { status: 500 }
    );
  }
}
