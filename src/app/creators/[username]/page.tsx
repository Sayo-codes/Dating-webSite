import { notFound, redirect } from "next/navigation";
import { getCreatorByUsername } from "@/features/creators/data";
import { getCurrentUser } from "@/shared/lib/auth";

import { PremiumCreatorProfile } from "@/features/creators/components/PremiumCreatorProfile";

type Props = { params: Promise<{ username: string }> };

export async function generateMetadata({ params }: Props) {
  const { username } = await params;
  if (!username) return { title: "Profile ✦ Rsdate" };

  try {
    const creator = await getCreatorByUsername(username);
    if (!creator) {
      return { title: "Creator Not Found ✦ Rsdate" };
    }

    return {
      title: `${creator.displayName || "Profile"} ✦ Rsdate`,
      description: creator.bio ?? `Profile for ${creator.displayName || "this creator"}`,
    };
  } catch (err) {
    return { title: "Error ✦ Rsdate" };
  }
}

export default async function CreatorProfilePage({ params }: Props) {
  const { username } = await params;

  // 1. Initial safety check for slug/username
  if (!username) {
    return redirect("/creators");
  }

  // 2. Fetch creator with null safety
  let creator = null;
  try {
    creator = await getCreatorByUsername(username);
  } catch (err) {
    console.error("Error fetching creator:", err);
  }

  // 3. Handle missing creator without crashing the server component
  if (!creator) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#07070b] px-4 text-center text-white">
        <h1 className="font-[var(--font-heading)] text-3xl font-bold text-gradient-gold mb-4">
          Creator not found
        </h1>
        <p className="max-w-md text-white/50 mb-8">
          The profile you are looking for doesn&apos;t exist or may have been set to private.
        </p>
        <a 
          href="/creators" 
          className="pill-button-primary focus-outline inline-flex min-h-[48px] items-center justify-center rounded-full px-8 text-[15px] font-semibold transition-all active:scale-95"
        >
          Explore Verified Models
        </a>
      </div>
    );
  }

  const currentUser = await getCurrentUser();
  const isOwnProfile =
    !!currentUser &&
    !!creator.username &&
    currentUser.role === "creator" &&
    currentUser.username.toLowerCase() === creator.username.toLowerCase();

  return (
    <PremiumCreatorProfile
      creator={creator}
      isLoggedIn={!!currentUser}
      isOwnProfile={isOwnProfile}
    />
  );
}
