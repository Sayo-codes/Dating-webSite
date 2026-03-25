import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { withAuth } from "@/shared/api/auth-guard";
import { prisma } from "@/shared/lib/prisma";
import { createToken, setSessionCookie } from "@/shared/lib/auth";
import { checkRateLimit } from "@/shared/lib/rate-limit";

function secretsMatch(expected: string, provided: string): boolean {
  try {
    const a = Buffer.from(expected, "utf8");
    const b = Buffer.from(provided, "utf8");
    if (a.length === 0 || b.length === 0 || a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  const limit = checkRateLimit(request);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many attempts. Try again later." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
    );
  }

  const envSecret = process.env.ADMIN_INVITE_SECRET?.trim() ?? "";
  if (!envSecret) {
    return NextResponse.json(
      { error: "Admin invite is not configured on this server." },
      { status: 503 }
    );
  }

  const auth = await withAuth();
  if (auth instanceof NextResponse) return auth;

  const body = (await request.json().catch(() => ({}))) as { secret?: string };
  const provided = typeof body.secret === "string" ? body.secret.trim() : "";

  if (!secretsMatch(envSecret, provided)) {
    return NextResponse.json({ error: "Invalid invite code." }, { status: 403 });
  }

  const updated = await prisma.user.update({
    where: { id: auth.user.id },
    data: { role: "admin" },
    select: { id: true, email: true, username: true, role: true, emailVerified: true },
  });

  const token = await createToken({
    id: updated.id,
    email: updated.email,
    role: updated.role,
  });
  await setSessionCookie(token);

  return NextResponse.json({
    user: {
      id: updated.id,
      email: updated.email,
      username: updated.username,
      role: updated.role,
      emailVerified: updated.emailVerified,
    },
  });
}
