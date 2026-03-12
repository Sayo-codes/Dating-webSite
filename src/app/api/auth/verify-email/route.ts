import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";
import { verifyOtp } from "@/shared/lib/otp";
import { createToken, setSessionCookie } from "@/shared/lib/auth";
import { verifyEmailSchema } from "@/shared/lib/validation/auth";
import { checkRateLimit } from "@/shared/lib/rate-limit";

export async function POST(request: NextRequest) {
  const limit = checkRateLimit(request);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many attempts. Try again later." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
    );
  }

  const body = await request.json().catch(() => ({}));
  const parsed = verifyEmailSchema.safeParse(body);
  if (!parsed.success) {
    const msg = parsed.error.errors[0]?.message ?? "Invalid input";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const { email, code } = parsed.data;
  const normalizedEmail = email.toLowerCase();

  const valid = await verifyOtp(normalizedEmail, code);
  if (!valid) {
    return NextResponse.json(
      { error: "Invalid or expired code. Request a new one." },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });
  if (!user) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerified: true },
  });

  const token = await createToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });
  await setSessionCookie(token);

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      emailVerified: true,
    },
  });
}
