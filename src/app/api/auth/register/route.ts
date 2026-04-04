import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";
import { hashPassword } from "@/shared/lib/auth";
import { createOtp } from "@/shared/lib/otp";
import { sendVerificationEmail } from "@/lib/email";
import { registerSchema } from "@/shared/lib/validation/auth";
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
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      const firstError = parsed.error.errors[0];
      const msg = firstError?.message ?? "Validation failed";
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    const { email, username, password } = parsed.data;
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedUsername = username.trim().toLowerCase();

    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ email: normalizedEmail }, { username: normalizedUsername }],
      },
    });
    if (existing) {
      const message =
        existing.email === normalizedEmail
          ? "Email already registered."
          : "Username already taken.";
      return NextResponse.json({ error: message }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);

    await prisma.user.create({
      data: {
        email: normalizedEmail,
        username: normalizedUsername,
        passwordHash,
        role: "user",
      },
    });

    try {
      const code = await createOtp(normalizedEmail);
      await sendVerificationEmail(normalizedEmail, code);
    } catch (otpError) {
      console.error("[register] Email send failed after user create:", otpError);
      return NextResponse.json(
        {
          message:
            "Account created. If you did not receive a verification code, use the resend option on the verify-email page.",
          requiresVerification: true,
        },
        { status: 201 }
      );
    }

    return NextResponse.json(
      { message: "Verification code sent to your email.", requiresVerification: true },
      { status: 201 }
    );
  } catch (err) {
    const isPrisma = err && typeof err === "object" && "code" in err;
    const errMessage = err instanceof Error ? err.message : String(err);
    const errCode = isPrisma && typeof (err as { code: string }).code === "string" ? (err as { code: string }).code : undefined;
    console.error("[register] Failed:", errCode ?? errMessage, isPrisma ? (err as { meta?: unknown }).meta : err);

    if (errMessage.includes("DATABASE_URL") && (errMessage.includes("not set") || errMessage.includes("cannot find"))) {
      return NextResponse.json(
        {
          error:
            "Database is not configured. Copy .env.example to .env and set DATABASE_URL to your PostgreSQL connection string.",
        },
        { status: 503 }
      );
    }

    if (isPrisma && errCode) {
      if (errCode === "P2002") {
        return NextResponse.json(
          { error: "Email or username is already registered." },
          { status: 409 }
        );
      }
      if (errCode === "P1001" || errCode === "P1002" || errCode === "P1003") {
        return NextResponse.json(
          { error: "Database is temporarily unavailable. Please try again later." },
          { status: 503 }
        );
      }
      if (errCode === "P2021" || errCode === "P2010") {
        return NextResponse.json(
          {
            error:
              "Database schema issue: run 'npx prisma migrate dev' to create or update tables.",
            ...(process.env.NODE_ENV === "development" && { detail: errMessage }),
          },
          { status: 503 }
        );
      }
    }

    return NextResponse.json(
      {
        error: "Registration failed. Please try again.",
        ...(process.env.NODE_ENV === "development" && { detail: errMessage }),
      },
      { status: 500 }
    );
  }
}
