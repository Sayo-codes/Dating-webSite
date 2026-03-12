import { NextRequest, NextResponse } from "next/server";
import { clearSessionCookie } from "@/shared/lib/auth";

export async function POST(request: NextRequest) {
  await clearSessionCookie();
  const url = request.nextUrl.clone();
  url.pathname = "/";
  return NextResponse.redirect(url, 302);
}
