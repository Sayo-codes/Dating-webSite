import { hash, compare } from "bcryptjs";
import * as jose from "jose";
import { prisma } from "./prisma";
import { cookies } from "next/headers";

const SALT_ROUNDS = 12;
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "dev-secret-change-in-production"
);
const JWT_ISSUER = "velvet-signal";
const JWT_AUDIENCE = "velvet-signal";
const COOKIE_NAME = "session";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export type JwtPayload = {
  sub: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
};

export async function hashPassword(plain: string): Promise<string> {
  return hash(plain, SALT_ROUNDS);
}

export async function verifyPassword(plain: string, hashed: string): Promise<boolean> {
  return compare(plain, hashed);
}

export async function createToken(user: { id: string; email: string; role: string }): Promise<string> {
  return new jose.SignJWT({ email: user.email, role: user.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuer(JWT_ISSUER)
    .setAudience(JWT_AUDIENCE)
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<JwtPayload | null> {
  try {
    const { payload } = await jose.jwtVerify(token, JWT_SECRET, {
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    });
    return payload as unknown as JwtPayload;
  } catch {
    return null;
  }
}

export function getCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  };
}

export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, getCookieOptions());
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getSessionToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value ?? null;
}

export async function getCurrentUser(): Promise<{
  id: string;
  email: string;
  username: string;
  role: string;
  emailVerified: boolean;
} | null> {
  const token = await getSessionToken();
  if (!token) return null;
  const payload = await verifyToken(token);
  if (!payload) return null;
  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    select: { id: true, email: true, username: true, role: true, emailVerified: true },
  });
  if (!user) return null;
  return {
    ...user,
    role: user.role,
  };
}

export async function requireAdmin(): Promise<{
  id: string;
  email: string;
  username: string;
  role: string;
  emailVerified: boolean;
}> {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    const { redirect } = await import("next/navigation");
    redirect("/login");
  }
  return user;
}
