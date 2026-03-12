import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createOtp, sendOtpEmail } from "@/shared/lib/otp";
import { prisma } from "@/shared/lib/prisma";
import { checkRateLimit } from "@/shared/lib/rate-limit";

const schema = z.object({ email: z.string().email() });

export async function POST(request: NextRequest) {
  const limit = checkRateLimit(request);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many attempts. Try again later." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
    );
  }

  const body = await request.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email." }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase();
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: "No account found with this email." }, { status: 404 });
  }

  const code = await createOtp(email);
  await sendOtpEmail(email, code);

  return NextResponse.json({ message: "Verification code sent." });
}
