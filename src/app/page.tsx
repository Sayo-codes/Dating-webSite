import Link from "next/link";
import Image from "next/image";
import { getCurrentUser } from "@/shared/lib/auth";
import {
  HeroSection,
  WhyRsdateSection,
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
        user={{ id: user.id, username: user.username, email: user.email, role: user.role }}
        unreadCount={unreadCount}
        creators={creators}
      />
    );
  }

  // ── Public: Luxury landing page ─────────────────────────────
  return (
    <div className="min-h-screen text-white overflow-x-hidden selection:bg-[#ff2d78]/30">
      <main className="flex flex-col">

        {/* 1. Full-viewport hero */}
        <HeroSection />

        {/* Optimized mobile spacing: tighter gaps on small screens to prevent scroll-fatigue */}
        <div className="flex flex-col gap-16 py-16 sm:gap-24 sm:py-24 lg:gap-32 lg:py-32 contain-paint">

          {/* 3. Why Rsdate — 4 feature cards */}
          <WhyRsdateSection />

          {/* 4. Testimonials */}
          <TestimonialsSection />

          {/* 5. Final CTA block */}
          <div className="px-4 sm:px-6 lg:px-10">
            <div
              className="relative overflow-hidden rounded-[20px] p-6 text-center sm:rounded-[28px] sm:p-12 lg:p-16"
              style={{
                border: "1px solid rgba(212,168,83,0.35)",
                boxShadow:
                  "0 12px 40px rgba(0,0,0,0.5), 0 0 30px rgba(212,168,83,0.06), inset 0 1px 0 rgba(255,255,255,0.05)",
                // Hardware acceleration for the container
                transform: "translateZ(0)",
                willChange: "transform",
              }}
            >
              {/* ── IMAGE 4: Couple embracing — emotional CTA background ── */}
              <Image
                src="/images/landing/couple-embrace.jpg"
                alt="Romantic couple embrace background"
                fill
                className="object-cover object-center"
                // Optimized sizes prop for the CTA container width
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 80vw"
                // WebP optimization + lower quality for background image to save bandwidth
                quality={70}
                // Lazy load since this is at the very bottom of the page
                loading="lazy"
                style={{ 
                  filter: "brightness(0.2) saturate(1.15)",
                }}
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
                className="pointer-events-none absolute -top-20 left-1/4 h-48 w-48 rounded-full opacity-40 blur-3xl sm:h-56 sm:w-56"
                style={{ background: "#d4a853" }}
              />
              <div
                aria-hidden
                className="pointer-events-none absolute -bottom-20 right-1/4 h-48 w-48 rounded-full opacity-30 blur-3xl sm:h-56 sm:w-56"
                style={{ background: "#ff2d78" }}
              />

              <div className="relative z-10">
                <p className="section-heading mb-3 flex items-center justify-center gap-2 text-[0.65rem] sm:text-xs">
                  ✦ Limited Spots Available
                </p>
                <h2
                  className="font-[var(--font-heading)] text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl"
                  style={{
                    color: "#ffffff",
                    textShadow: "0 2px 20px rgba(0,0,0,0.4)",
                  }}
                >
                  Begin Your Exclusive Journey
                </h2>
                <p
                  className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-white/80 sm:mt-5 sm:text-base"
                  style={{ textShadow: "0 1px 10px rgba(0,0,0,0.3)" }}
                >
                  Join thousands of members already experiencing the most private, luxurious
                  creator platform available.
                </p>
                
                {/* ── Buttons stacked on mobile, inline on sm+ screens ── */}
                <div className="mt-8 flex flex-col items-center gap-3.5 sm:mt-10 sm:flex-row sm:justify-center sm:gap-4">
                  <Link href="/register" className="w-full sm:w-auto">
                    <PrimaryButton size="lg" className="w-full px-10 text-[0.95rem] font-semibold sm:w-auto">
                      Join Now — It&apos;s Free ✦
                    </PrimaryButton>
                  </Link>

                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 6. Footer */}
        <LandingFooter />
      </main>
    </div>
  );
}
