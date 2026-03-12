import { notFound } from "next/navigation";
import { getCreatorByUsername } from "@/features/creators/data";
import { getCurrentUser } from "@/shared/lib/auth";
import { CreatorProfileView } from "@/features/creators/components/CreatorProfileView";

type Props = { params: Promise<{ username: string }> };

export async function generateMetadata({ params }: Props) {
  const { username } = await params;
  const creator = await getCreatorByUsername(username);
  if (!creator) return { title: "Creator not found" };
  return {
    title: creator.displayName,
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
  return (
    <CreatorProfileView
      creator={creator}
      isLoggedIn={!!currentUser}
      isOwnProfile={isOwnProfile}
    />
  );
}
