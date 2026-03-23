import Image from "next/image";
import Link from "next/link";
import { PageContainer } from "@/shared/ui/PageContainer";
import { GlassCard } from "@/shared/ui/GlassCard";
import { StatusDot } from "@/shared/ui/StatusDot";
import { PrimaryButton, SecondaryButton } from "@/shared/ui";
import { CreatorStatsBar } from "./CreatorStatsBar";
import { LockedPostCard } from "./LockedPostCard";
import type { CreatorProfile } from "@/lib/types/creator";

type Props = {
  creator: CreatorProfile;
  isLoggedIn?: boolean;
  isOwnProfile?: boolean;
  isSubscribed?: boolean;
};

const bannerPlaceholder =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='400' viewBox='0 0 1200 400'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%231a0e25'/%3E%3Cstop offset='100%25' style='stop-color:%23d4a853'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill='url(%23g)' width='1200' height='400'/%3E%3C/svg%3E";

const avatarPlaceholder =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23c778ff'/%3E%3Cstop offset='100%25' style='stop-color:%23d4a853'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill='url(%23g)' width='200' height='200' rx='100'/%3E%3C/svg%3E";

export function PremiumCreatorProfile({ creator, isLoggedIn, isOwnProfile, isSubscribed }: Props) {
  const bannerSrc = creator.bannerUrl ?? bannerPlaceholder;
  const avatarSrc = creator.avatarUrl ?? avatarPlaceholder;
  const isOnline = true;

  return (
    <div className="premium-profile">
      {/* ── Banner ── */}
      <div className="premium-banner">
        <Image
          src={bannerSrc}
          alt={`${creator.displayName} banner`}
          fill
          className="premium-banner__image"
          sizes="100vw"
          priority
          unoptimized={bannerSrc.startsWith("data:") || !bannerSrc.startsWith("/")}
        />
        <div className="premium-banner__gradient" />
      </div>

      {/* ── Avatar overlapping banner ── */}
      <div className="premium-avatar-wrapper">
        <div className="premium-avatar">
          <Image
            src={avatarSrc}
            alt={creator.displayName}
            width={140}
            height={140}
            className="premium-avatar__image"
            unoptimized={avatarSrc.startsWith("data:") || !avatarSrc.startsWith("/")}
          />
          <div className="premium-avatar__ring" />
          {/* Online dot */}
          <div className="premium-avatar__status">
            <StatusDot status={isOnline ? "online" : "offline"} />
          </div>
        </div>
      </div>

      <PageContainer>
        <div className="premium-profile__body">
          {/* ── Breadcrumb nav ── */}
          <nav className="flex flex-wrap items-center gap-3 sm:gap-4 mb-2" aria-label="Breadcrumb">
            <Link
              href="/creators"
              className="min-h-[44px] -mx-1 inline-flex items-center rounded px-1 py-2 text-sm text-[var(--text-muted)] transition-colors duration-200 hover:text-white focus-outline"
            >
              ← Back to creators
            </Link>
            {isOwnProfile && (
              <Link
                href="/creator/dashboard"
                className="min-h-[44px] -mx-1 inline-flex items-center rounded px-1 py-2 text-sm font-medium text-[var(--accent-primary)] transition-colors duration-200 hover:underline focus-outline"
              >
                Edit profile & gallery
              </Link>
            )}
          </nav>

          {/* ── Name, Badge, Location ── */}
          <header className="premium-profile__header animate-fade-up">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-display text-2xl sm:text-3xl lg:text-4xl">
                {creator.displayName}
              </h1>
              {creator.verified && (
                <span className="verified-badge" title="Verified Creator">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="11" fill="url(#gold-gradient)" />
                    <path
                      d="M9 12l2 2 4-4"
                      stroke="#fff"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <defs>
                      <linearGradient id="gold-gradient" x1="0" y1="0" x2="24" y2="24">
                        <stop offset="0%" stopColor="#f0c97a" />
                        <stop offset="100%" stopColor="#d4a853" />
                      </linearGradient>
                    </defs>
                  </svg>
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--text-muted)] mt-2">
              <div className="inline-flex items-center gap-1.5">
                <StatusDot status={isOnline ? "online" : "offline"} />
                <span>{isOnline ? "Online now" : "Offline"}</span>
              </div>
              {creator.location && (
                <span className="inline-flex items-center gap-1">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {creator.location}
                </span>
              )}
            </div>
          </header>

          {/* ── Stats bar ── */}
          <div className="animate-fade-up-delay-1">
            <CreatorStatsBar
              followers={creator.followerCount}
              subscribers={creator.subscriberCount}
              photos={creator.photoCount}
              videos={creator.videoCount}
              totalLikes={creator.totalLikes}
            />
          </div>

          {/* ── Action buttons ── */}
          <div className="flex flex-col gap-3 sm:flex-row animate-fade-up-delay-2">
            {isLoggedIn ? (
              <>
                <Link href={`/messages?creator=${encodeURIComponent(creator.id)}`} className="min-w-0 flex-1 sm:flex-none">
                  <PrimaryButton className="w-full">
                    ✦ Send message
                  </PrimaryButton>
                </Link>
                {!isSubscribed && !isOwnProfile && (
                  <Link href={`/premium?creator=${encodeURIComponent(creator.id)}`} className="min-w-0 flex-1 sm:flex-none">
                    <SecondaryButton className="w-full">
                      Subscribe — $19.99/mo
                    </SecondaryButton>
                  </Link>
                )}
                {isSubscribed && (
                  <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(61,255,154,0.3)] bg-[rgba(61,255,154,0.08)] px-5 py-2.5 text-sm font-medium text-[#3dff9a]">
                    <StatusDot status="online" /> Subscribed
                  </div>
                )}
              </>
            ) : (
              <Link href="/login" className="min-w-0 flex-1 sm:flex-none">
                <PrimaryButton className="w-full">
                  ✦ Subscribe to unlock — $19.99/mo
                </PrimaryButton>
              </Link>
            )}
          </div>

          {/* ── About ── */}
          {creator.bio && (
            <GlassCard padding="md" className="animate-fade-up-delay-2">
              <p className="section-heading mb-3">✦ About</p>
              <p className="text-sm leading-relaxed text-[var(--text-secondary)] whitespace-pre-wrap">
                {creator.bio}
              </p>
            </GlassCard>
          )}

          {/* ── Details ── */}
          <GlassCard padding="md" className="grid gap-4 sm:grid-cols-2 animate-fade-up-delay-3">
            <p className="section-heading sm:col-span-2">✦ Details</p>
            {creator.profession && (
              <div className="space-y-1">
                <p className="text-caption">Profession</p>
                <p className="text-sm text-[var(--text-secondary)]">{creator.profession}</p>
              </div>
            )}
            {creator.height && (
              <div className="space-y-1">
                <p className="text-caption">Height</p>
                <p className="text-sm text-[var(--text-secondary)]">{creator.height}</p>
              </div>
            )}
            {creator.weight && (
              <div className="space-y-1">
                <p className="text-caption">Weight</p>
                <p className="text-sm text-[var(--text-secondary)]">{creator.weight}</p>
              </div>
            )}
            {creator.location && (
              <div className="space-y-1">
                <p className="text-caption">Location</p>
                <p className="text-sm text-[var(--text-secondary)]">{creator.location}</p>
              </div>
            )}
          </GlassCard>

          {/* ── Gallery with blur for non-subscribers ── */}
          {creator.gallery.length > 0 && (
            <div className="animate-fade-up-delay-3">
              <p className="section-heading mb-4">✦ Gallery</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4">
                {creator.gallery.slice(0, 8).map((m, idx) => (
                  <div
                    key={m.id}
                    className="relative aspect-square overflow-hidden rounded-xl bg-white/5 transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.6)]"
                  >
                    <Image
                      src={m.url}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="120px"
                      unoptimized={m.url.startsWith("data:") || !m.url.startsWith("/")}
                      style={!isSubscribed && idx > 0 ? { filter: "blur(24px)" } : undefined}
                    />
                    {/* Blur overlay + lock icon for non-subscribers (skip first image as preview) */}
                    {!isSubscribed && idx > 0 && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[rgba(7,7,11,0.30)] backdrop-blur-sm z-10">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(212,168,83,0.15)] border border-[rgba(212,168,83,0.35)]">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d4a853" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {/* Subscribe CTA below gallery for non-subscribers */}
              {!isSubscribed && !isOwnProfile && (
                <div className="mt-4 text-center">
                  <Link
                    href={isLoggedIn ? `/premium?creator=${encodeURIComponent(creator.id)}` : "/login"}
                    className="pill-button-primary focus-outline inline-flex min-h-[48px] items-center justify-center rounded-full px-8 py-3 text-sm font-semibold"
                    style={{ background: "linear-gradient(135deg, #ff2d78 0%, #d4a853 100%)" }}
                  >
                    🔒 Subscribe to Unlock — $19.99/mo
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* ── Locked Content Feed ── */}
          <div className="animate-fade-up-delay-4">
            <p className="section-heading mb-4">✦ Exclusive Content</p>
            {creator.posts.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {creator.posts.map((post) => (
                  <LockedPostCard
                    key={post.id}
                    post={isSubscribed ? { ...post, isLocked: false } : post}
                    creatorName={creator.displayName}
                    creatorId={creator.id}
                  />
                ))}
              </div>
            ) : (
              <GlassCard padding="lg" className="text-center">
                <p className="text-[var(--text-muted)]">No posts yet. Check back soon!</p>
              </GlassCard>
            )}
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
