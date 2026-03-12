import { NextResponse } from "next/server";
import { getCreatorsList } from "@/features/creators/data";

export async function GET() {
  const creators = await getCreatorsList();
  return NextResponse.json({ creators });
}
