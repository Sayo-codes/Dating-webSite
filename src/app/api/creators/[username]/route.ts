import { NextResponse } from "next/server";
import { getCreatorByUsername } from "@/features/creators/data";

type Params = { params: Promise<{ username: string }> };

export async function GET(request: Request, context: Params) {
  const { username } = await context.params;
  if (!username) {
    return NextResponse.json({ error: "Username required" }, { status: 400 });
  }
  const creator = await getCreatorByUsername(username);
  if (!creator) {
    return NextResponse.json({ error: "Creator not found" }, { status: 404 });
  }
  return NextResponse.json({ creator });
}
