import { NextResponse } from "next/server";
import { getSessionToken } from "@/shared/lib/auth";

export async function GET() {
  const token = await getSessionToken();
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ token });
}
