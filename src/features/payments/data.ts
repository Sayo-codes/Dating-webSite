import { prisma } from "@/shared/lib/prisma";
import { TransactionStatus } from "@prisma/client";

export async function hasPremiumAccess(userId: string, itemType = "premium_unlock"): Promise<boolean> {
  const tx = await prisma.transaction.findFirst({
    where: {
      userId,
      status: TransactionStatus.COMPLETED,
      itemType,
    },
  });
  return !!tx;
}
