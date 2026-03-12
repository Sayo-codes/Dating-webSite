import { NextResponse } from "next/server";
import { withAuth } from "@/shared/api/auth-guard";

export async function GET() {
  const auth = await withAuth();
  if (auth instanceof NextResponse) return auth;

  return NextResponse.json({
    user: {
      id: auth.user.id,
      email: auth.user.email,
      username: auth.user.username,
      role: auth.user.role,
      emailVerified: auth.user.emailVerified,
    },
  });
}
