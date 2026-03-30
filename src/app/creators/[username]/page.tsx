import { notFound } from "next/navigation";
import { getCreatorByUsername } from "@/features/creators/data";
import { getCurrentUser } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { PremiumCreatorProfile } from "@/features/creators/components/PremiumCreatorProfile";

type Props = { params: Promise<{ username: string }> };

export async function generateMetadata({ params }: Props) {
  const { username } = await params;
  const creator = await getCreatorByUsername(username);
  if (!creator) return { title: "Creator not found" };
  return {
    title: `${creator.displayName} ✦ Rsdate`,
    description: creator.bio ?? `Profile for ${creator.displayName}`,
  };
}

export default async function CreatorProfilePage({ params }: Props) {
  const { username } = await params;
  const creator = await getCreatorByUsername(username);
  if (!creator) notFound();
  const currentUser = await getCurrentUser();
  const isOwnProfile =
    !!currentUser &&
    currentUser.role === "creator" &&
    currentUser.username.toLowerCase() === creator.username.toLowerCase();

  // Check subscription status
  let isSubscribed = false;
  if (currentUser && !isOwnProfile) {
    const subscription = await prisma.subscription.findUnique({
      where: {
        userId_creatorId: { userId: currentUser.id, creatorId: creator.id },
      },
    });
    isSubscribed =
      subscription?.status === "ACTIVE" &&
      subscription.currentPeriodEnd > new Date();
  }

  return (
    <PremiumCreatorProfile
      creator={creator}
      isLoggedIn={!!currentUser}
      isOwnProfile={isOwnProfile}
      isSubscribed={isSubscribed || isOwnProfile}
    />
  );
}
