import Link from "next/link";
import { getCurrentUser } from "@/shared/lib/auth";
import {
  HeroSection,
  StatsSection,
  CreatorSliderSection,
  TrendingCreatorsSection,
  TestimonialsSection,
  PricingSection,
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
              Welcome back,{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #f0c97a, #d4a853, #ff2d78)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {user.username}
              </span>
            </h1>
            <p className="mt-2 text-caption text-sm">Choose where to go next.</p>
          </div>
          <GlassCard className="flex flex-col gap-4 p-6">
            <Link href="/messages" className="block">
              <PrimaryButton className="w-full">Messages</PrimaryButton>
            </Link>
            <Link href="/creators" className="block">
              <SecondaryButton type="button" className="w-full">
                Browse Creators
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
      <main className="flex flex-col">
        {/* Hero — full viewport */}
        <HeroSection />

        {/* Remaining sections: max-width container with spacing */}
        <div className="flex flex-col gap-20 py-20 sm:gap-28 sm:py-28">
          <StatsSection />
          <CreatorSliderSection />
          <TrendingCreatorsSection />
          <TestimonialsSection />
          <PricingSection />

          {/* Final CTA Banner */}
          <div className="px-4 sm:px-6 lg:px-10">
            <div
              className="relative overflow-hidden rounded-[28px] p-10 text-center sm:p-16"
              style={{
                background: "linear-gradient(135deg, rgba(212,168,83,0.12) 0%, rgba(255,45,120,0.10) 100%)",
                border: "1px solid rgba(212,168,83,0.25)",
                backdropFilter: "blur(24px)",
              }}
            >
              {/* Glow blobs */}
              <div
                aria-hidden
                className="pointer-events-none absolute -top-16 left-1/4 h-48 w-48 rounded-full opacity-30 blur-3xl"
                style={{ background: "#d4a853" }}
              />
              <div
                aria-hidden
                className="pointer-events-none absolute -bottom-16 right-1/4 h-48 w-48 rounded-full opacity-20 blur-3xl"
                style={{ background: "#ff2d78" }}
              />

              <div className="relative">
                <p className="section-heading mb-3 flex items-center justify-center gap-2">
                  ✦ Limited Spots Available
                </p>
                <h2
                  className="font-[var(--font-heading)] text-3xl font-bold sm:text-4xl lg:text-5xl"
                  style={{
                    background: "linear-gradient(135deg, #f0c97a 0%, #d4a853 40%, #ff2d78 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Begin Your Exclusive Journey
                </h2>
                <p className="mx-auto mt-4 max-w-md text-sm text-white/55 sm:text-base">
                  Join thousands of members already experiencing the most private, luxurious creator platform available.
                </p>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                  <Link href="/register">
                    <PrimaryButton size="lg" className="px-10 text-base font-semibold">
                      Join Now — It&apos;s Free ✦
                    </PrimaryButton>
                  </Link>
                  <Link
                    href="/creators"
                    className="focus-outline inline-flex min-h-[52px] items-center justify-center rounded-full border px-8 text-base font-medium text-white/75 transition-all duration-250 hover:border-[rgba(212,168,83,0.4)] hover:text-[#f0c97a]"
                    style={{ borderColor: "rgba(255,255,255,0.14)" }}
                  >
                    Browse Creators
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
