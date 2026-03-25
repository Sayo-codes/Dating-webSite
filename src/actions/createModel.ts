"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/shared/lib/prisma";
import { getCurrentUser } from "@/shared/lib/auth";

export type CreateModelInput = {
  username: string;
  displayName: string;
  age?: number | null;
  location?: string;
  bio?: string;
  profession?: string;
  height?: string;
  weight?: string;
  verified?: boolean;
};

export async function createModel(
  input: CreateModelInput
): Promise<{ ok: boolean; error?: string; id?: string }> {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return { ok: false, error: "Unauthorized" };
  }

  const username = input.username.trim().toLowerCase().replace(/\s+/g, "");
  const displayName = input.displayName.trim();
  if (!username || !displayName) {
    return { ok: false, error: "Username and display name are required." };
  }

  const existing = await prisma.creator.findUnique({ where: { username } });
  if (existing) {
    return { ok: false, error: "That username is already taken." };
  }

  const age =
    input.age != null && Number.isFinite(Number(input.age))
      ? Math.round(Number(input.age))
      : null;

  try {
    const creator = await prisma.creator.create({
      data: {
        username,
        displayName,
        age: age != null && !Number.isNaN(age) ? age : null,
        location: input.location?.trim() || null,
        bio: input.bio?.trim() || null,
        profession: input.profession?.trim() || null,
        height: input.height?.trim() || null,
        weight: input.weight?.trim() || null,
        verified: Boolean(input.verified),
      },
    });

    revalidatePath("/admin/models");
    revalidatePath("/admin/creators");
    revalidatePath("/");
    revalidatePath("/creators");

    return { ok: true, id: creator.id };
  } catch {
    return { ok: false, error: "Could not create creator. Try again." };
  }
}
