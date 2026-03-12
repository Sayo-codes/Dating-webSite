import { NextResponse } from "next/server";
import { getCurrentUser } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";

export type CurrentUser = Awaited<ReturnType<typeof getCurrentUser>> extends infer U
  ? U extends null ? never : U
  : never;

/**
 * Get current user or return 401 JSON response.
 * Use in API routes: const auth = await withAuth(); if (auth) return auth;
 */
export async function withAuth(): Promise<NextResponse | { user: NonNullable<Awaited<ReturnType<typeof getCurrentUser>>> }> {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return { user };
}

/**
 * Get current user and their creator id (for creator role).
 * Returns 401 if not logged in, 403 if not creator, 404 if no creator profile.
 * Use: const auth = await withCreator(); if (auth instanceof NextResponse) return auth;
 */
export async function withCreator(): Promise<
  NextResponse | { user: NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>; creatorId: string }
> {
  const auth = await withAuth();
  if (auth instanceof NextResponse) return auth;
  if (auth.user.role !== "creator") {
    return NextResponse.json({ error: "Creator access only" }, { status: 403 });
  }
  const creator = await prisma.creator.findUnique({
    where: { username: auth.user.username },
    select: { id: true },
  });
  if (!creator) {
    return NextResponse.json({ error: "Creator profile not found" }, { status: 404 });
  }
  return { user: auth.user, creatorId: creator.id };
}

/**
 * Get current user or redirect to login (for server components / layout).
 * Use requireAdmin() from auth for admin routes.
 */
export async function requireAuth(): Promise<NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>> {
  const user = await getCurrentUser();
  if (!user) {
    const { redirect } = await import("next/navigation");
    redirect("/login");
  }
  return user;
}

/**
 * Get current user and require admin role. Returns 401 if not logged in, 403 if not admin.
 * Use in API routes: const auth = await withAdmin(); if (auth instanceof NextResponse) return auth;
 */
export async function withAdmin(): Promise<
  NextResponse | { user: NonNullable<Awaited<ReturnType<typeof getCurrentUser>>> }
> {
  const auth = await withAuth();
  if (auth instanceof NextResponse) return auth;
  if (auth.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return auth;
}
