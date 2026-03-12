import { prisma } from "@/shared/lib/prisma";

export async function hasPremiumAccess(userId: string, productId = "premium_unlock"): Promise<boolean> {
  const tx = await prisma.transaction.findFirst({
    where: {
      userId,
      status: "COMPLETED",
      productId,
    },
  });
  return !!tx;
}
