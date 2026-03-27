import Link from "next/link";
import { getCurrentUser } from "@/shared/lib/auth";
import {
  StatsSection,
  WhyVelvetSection,
  TestimonialsSection,
  LandingFooter,
} from "@/features/landing";
import { PrimaryButton } from "@/shared/ui";
import { LoggedInDiscoverHome } from "@/features/dashboard/components/LoggedInDiscoverHome";
import { LandingHero } from "@/components/LandingHero";
import { LandingNav } from "@/components/LandingNav";
import {
  getDiscoverFeedForUser,
  getUnreadMessageCountForUser,
} from "@/features/dashboard/data";

export default async function Home() {
  const user = await getCurrentUser();

  // ── Logged-in: render dashboard ──────────────────────────────────────────
  if (user) {
    const [creators, unreadCount] = await Promise.all([
      getDiscoverFeedForUser(user.id),
      getUnreadMessageCountForUser(user.id),
    ]);

    return (
      <LoggedInDiscoverHome
        user={{ id: user.id, username: user.username, email: user.email }}
        unreadCount={unreadCount}
        creators={creators}
      />
    );
  }

  // ── Public: Tinder-style luxury landing page ─────────────────────────────
  return (
    <div className="relative min-h-screen overflow-x-hidden text-white">
      <LandingNav />
      <main className="flex flex-col">
        {/* 1. Full-viewport hero */}
        <LandingHero />

        <div className="flex flex-col gap-24 py-24 sm:gap-32 sm:py-32">

          {/* 2. Platform stats */}
          <StatsSection />

          {/* 3. Why Velvet Signal — 4 feature cards */}
          <WhyVelvetSection />

          {/* 4. Testimonials */}
          <TestimonialsSection />

          {/* 5. Final CTA block */}
          <div className="px-4 sm:px-6 lg:px-10">
            <div
              className="relative overflow-hidden rounded-[28px] p-10 text-center sm:p-16"
              style={{
                background:
                  "linear-gradient(135deg, rgba(212,168,83,0.12) 0%, rgba(255,45,120,0.10) 100%)",
                border: "1px solid rgba(212,168,83,0.25)",
                backdropFilter: "blur(24px)",
              }}
            >
              {/* Glow accents */}
              <div
                aria-hidden
                className="pointer-events-none absolute -top-20 left-1/4 h-56 w-56 rounded-full opacity-30 blur-3xl"
                style={{ background: "#d4a853" }}
              />
              <div
                aria-hidden
                className="pointer-events-none absolute -bottom-20 right-1/4 h-56 w-56 rounded-full opacity-22 blur-3xl"
                style={{ background: "#ff2d78" }}
              />

              <div className="relative">
                <p className="section-heading mb-3 flex items-center justify-center gap-2">
                  ✦ Limited Spots Available
                </p>
                <h2
                  className="font-[var(--font-heading)] text-3xl font-bold sm:text-4xl lg:text-5xl"
                  style={{
                    background:
                      "linear-gradient(135deg, #f0c97a 0%, #d4a853 40%, #ff2d78 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Begin Your Exclusive Journey
                </h2>
                <p className="mx-auto mt-4 max-w-md text-sm text-white/55 sm:text-base">
                  Join thousands of members already experiencing the most private, luxurious
                  creator platform available.
                </p>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                  <Link href="/register">
                    <PrimaryButton
                      size="lg"
                      className="px-10 text-base font-semibold opacity-100 shadow-[0_12px_30px_rgba(212,168,83,0.35)]"
                    >
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

        {/* 7. Footer */}
        <LandingFooter />
      </main>
    </div>
  );
}
