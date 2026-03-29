import Link from "next/link";
import Image from "next/image";
import { getCurrentUser } from "@/shared/lib/auth";
import {
  HeroSection,
  StatsSection,
  WhyVelvetSection,
  TestimonialsSection,
  LandingFooter,
} from "@/features/landing";
import { PrimaryButton } from "@/shared/ui";
import { LoggedInDiscoverHome } from "@/features/dashboard/components/LoggedInDiscoverHome";
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
    <div className="min-h-screen text-white overflow-x-hidden">
      <main className="flex flex-col">

        {/* 1. Full-viewport hero */}
        <HeroSection />

        <div className="flex flex-col gap-24 py-24 sm:gap-32 sm:py-32">

          {/* 2. Platform stats */}
          <StatsSection />

          {/* 3. Why Velvet Signal — 4 feature cards */}
          <WhyVelvetSection />

          {/* 4. Testimonials */}
          <TestimonialsSection />

          {/* 5. Final CTA block — IMAGE 4: Couple embrace for emotional connection */}
          <div className="px-4 sm:px-6 lg:px-10">
            <div
              className="relative overflow-hidden rounded-[20px] p-6 text-center sm:rounded-[28px] sm:p-16"
              style={{
                border: "1px solid rgba(212,168,83,0.35)",
                boxShadow:
                  "0 24px 60px rgba(0,0,0,0.5), 0 0 40px rgba(212,168,83,0.08), inset 0 1px 0 rgba(255,255,255,0.08)",
              }}
            >
              {/* ── IMAGE 4: Couple embracing — emotional CTA background ── */}
              <Image
                src="/images/landing/couple-embrace.jpg"
                alt=""
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 80vw"
                quality={80}
                style={{ filter: "brightness(0.2) saturate(1.15)" }}
              />

              {/* Solid gradient overlay — ensures premium, opaque feel */}
              <div
                className="absolute inset-0"
                aria-hidden
                style={{
                  background:
                    "linear-gradient(135deg, rgba(212,168,83,0.55) 0%, rgba(180,120,50,0.40) 30%, rgba(255,45,120,0.45) 70%, rgba(200,30,90,0.50) 100%)",
                }}
              />

              {/* Dark fade for text contrast */}
              <div
                className="absolute inset-0"
                aria-hidden
                style={{
                  background:
                    "radial-gradient(ellipse 80% 80% at 50% 50%, rgba(7,7,11,0.2) 0%, rgba(7,7,11,0.5) 100%)",
                }}
              />

              {/* Glow accents */}
              <div
                aria-hidden
                className="pointer-events-none absolute -top-20 left-1/4 h-56 w-56 rounded-full opacity-40 blur-3xl"
                style={{ background: "#d4a853" }}
              />
              <div
                aria-hidden
                className="pointer-events-none absolute -bottom-20 right-1/4 h-56 w-56 rounded-full opacity-30 blur-3xl"
                style={{ background: "#ff2d78" }}
              />

              <div className="relative z-10">
                <p className="section-heading mb-3 flex items-center justify-center gap-2">
                  ✦ Limited Spots Available
                </p>
                <h2
                  className="font-[var(--font-heading)] text-3xl font-bold sm:text-4xl lg:text-5xl"
                  style={{
                    color: "#ffffff",
                    textShadow: "0 2px 20px rgba(0,0,0,0.4)",
                  }}
                >
                  Begin Your Exclusive Journey
                </h2>
                <p
                  className="mx-auto mt-4 max-w-md text-sm text-white/80 sm:text-base"
                  style={{ textShadow: "0 1px 10px rgba(0,0,0,0.3)" }}
                >
                  Join thousands of members already experiencing the most private, luxurious
                  creator platform available.
                </p>
                <div className="mt-6 flex flex-col items-center gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4">
                  <Link href="/register">
                    <PrimaryButton size="lg" className="px-10 text-base font-semibold">
                      Join Now — It&apos;s Free ✦
                    </PrimaryButton>
                  </Link>
                  <Link
                    href="/creators"
                    className="focus-outline inline-flex min-h-[52px] items-center justify-center rounded-full border px-8 text-base font-medium text-white/90 transition-all duration-250 hover:border-[rgba(255,255,255,0.5)] hover:text-white hover:bg-white/10"
                    style={{
                      borderColor: "rgba(255,255,255,0.3)",
                      backdropFilter: "blur(8px)",
                      textShadow: "0 1px 8px rgba(0,0,0,0.3)",
                    }}
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
