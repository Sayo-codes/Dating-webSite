import Link from "next/link";
import { getCurrentUser } from "@/shared/lib/auth";
import {
  HeroSection,
  StatsSection,
  FeaturedModelsSection,
} from "@/features/landing";
import { PageContainer } from "@/shared/ui/PageContainer";
import { GlassCard } from "@/shared/ui/GlassCard";
import { PrimaryButton, SecondaryButton } from "@/shared/ui";

export default async function Home() {
  const user = await getCurrentUser();

  if (user) {
    return (
      <PageContainer className="min-h-screen items-center justify-center px-4 py-8">
        <div className="w-full max-w-md space-y-6 sm:space-y-8">
          <div className="text-center">
            <h1 className="text-title font-[var(--font-heading)] text-2xl font-semibold text-white sm:text-3xl">
              Welcome back, {user.username}
            </h1>
            <p className="mt-2 text-caption text-sm">
              Choose where to go next.
            </p>
          </div>
          <GlassCard className="flex flex-col gap-4 p-6">
            <Link href="/messages" className="block">
              <PrimaryButton className="w-full">Messages</PrimaryButton>
            </Link>
            <Link href="/creators" className="block">
              <SecondaryButton type="button" className="w-full">
                Browse creators
              </SecondaryButton>
            </Link>
            <Link href="/premium" className="block">
              <SecondaryButton type="button" className="w-full">
                Premium
              </SecondaryButton>
            </Link>
            <form
              action="/api/auth/logout"
              method="POST"
              className="mt-4 border-t border-white/10 pt-4"
            >
              <button
                type="submit"
                className="min-h-[44px] w-full rounded-xl text-sm text-[var(--text-muted)] transition-colors duration-200 hover:text-white focus-outline"
              >
                Log out
              </button>
            </form>
          </GlassCard>
        </div>
      </PageContainer>
    );
  }

  return (
    <div className="min-h-screen text-white overflow-x-hidden">
      <main className="page-content mx-auto flex min-h-screen max-w-6xl flex-col gap-12 sm:gap-16">
        <HeroSection />
        <StatsSection />
        <FeaturedModelsSection />
      </main>
    </div>
  );
}
