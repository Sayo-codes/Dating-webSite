"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/shared/lib/prisma";
import { getCurrentUser } from "@/shared/lib/auth";

export async function deleteModel(
  creatorId: string
): Promise<{ ok: boolean; error?: string }> {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return { ok: false, error: "Unauthorized" };
  }

  if (!creatorId || typeof creatorId !== "string") {
    return { ok: false, error: "Invalid creator." };
  }

  try {
    await prisma.creator.delete({ where: { id: creatorId } });
    revalidatePath("/admin/models");
    revalidatePath("/admin/creators");
    revalidatePath("/");
    revalidatePath("/creators");
    return { ok: true };
  } catch {
    return { ok: false, error: "Could not delete creator. They may already be removed." };
  }
}
