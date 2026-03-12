import Image from "next/image";
import Link from "next/link";
import { PageContainer } from "@/shared/ui/PageContainer";
import { GlassCard } from "@/shared/ui/GlassCard";
import { Badge } from "@/shared/ui/Badge";
import { StatusDot } from "@/shared/ui/StatusDot";
import { PrimaryButton, SecondaryButton } from "@/shared/ui";
import type { CreatorProfile } from "@/lib/types/creator";

type Props = { creator: CreatorProfile; isLoggedIn?: boolean; isOwnProfile?: boolean };

const placeholder =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23c778ff'/%3E%3Cstop offset='100%25' style='stop-color:%234dd5ff'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill='url(%23g)' width='800' height='600'/%3E%3C/svg%3E";

export function CreatorProfileView({ creator, isLoggedIn, isOwnProfile }: Props) {
  const mainImage = creator.avatarUrl ?? creator.gallery[0]?.url ?? placeholder;
  const gallery = creator.gallery.length > 0 ? creator.gallery : [{ id: "main", url: mainImage, type: "IMAGE" }];
  // For now, treat creators as online for visual status only – real presence could be wired later.
  const isOnline = true;

  return (
    <PageContainer>
      <div className="space-y-10">
        <nav className="flex flex-wrap items-center gap-3 sm:gap-4" aria-label="Breadcrumb">
          <Link href="/creators" className="min-h-[44px] -mx-1 inline-flex items-center rounded px-1 py-2 text-sm text-[var(--text-muted)] transition-colors duration-200 hover:text-white focus-outline">
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

        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-start">
          {/* Left: profile image + gallery */}
          <div className="space-y-5">
            <GlassCard padding="none" className="glass-card--interactive relative aspect-[4/5] w-full overflow-hidden bg-white/5">
              <Image
                src={mainImage}
                alt={creator.displayName}
                fill
                className="object-cover transition-transform duration-500 ease-out hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
                unoptimized={mainImage.startsWith("data:") || !mainImage.startsWith("/")}
              />
              <div className="absolute left-4 top-4 flex flex-wrap items-center gap-2">
                {creator.verified && (
                  <Badge className="bg-emerald-500/20 border-emerald-400/40 text-emerald-200">
                    ✓ Verified face
                  </Badge>
                )}
                <Badge className="border-fuchsia-400/40 bg-fuchsia-500/15 text-fuchsia-100">
                  VIP Model
                </Badge>
              </div>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            </GlassCard>
            {gallery.length > 1 && (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4">
                {gallery.slice(0, 8).map((m) => (
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
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: info + CTA */}
          <div className="space-y-6">
            <header className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-title font-[var(--font-heading)] text-2xl font-semibold leading-tight text-white sm:text-3xl">
                  {creator.displayName}
                </h1>
                {creator.verified && (
                  <Badge className="bg-emerald-500/15 border-emerald-400/50 text-emerald-200">
                    Verified
                  </Badge>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--text-muted)]">
                <div className="inline-flex items-center gap-1.5">
                  <StatusDot status={isOnline ? "online" : "offline"} />
                  <span>{isOnline ? "Online now" : "Offline"}</span>
                </div>
                {creator.location && (
                  <span>• {creator.location}</span>
                )}
              </div>
            </header>

            {creator.bio && (
              <GlassCard padding="md">
                <p className="section-heading mb-3">About</p>
                <p className="text-sm leading-relaxed text-[var(--text-secondary)] whitespace-pre-wrap">
                  {creator.bio}
                </p>
              </GlassCard>
            )}

            <GlassCard padding="md" className="grid gap-4 sm:grid-cols-2">
              <p className="section-heading sm:col-span-2">Details</p>
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

            <div className="flex flex-col gap-3 sm:flex-row">
              {isLoggedIn ? (
                <>
                  <Link href={`/messages?creator=${encodeURIComponent(creator.id)}`} className="min-w-0 flex-1 sm:flex-none">
                    <PrimaryButton className="w-full">
                      Send message
                    </PrimaryButton>
                  </Link>
                  <Link href={`/messages?creator=${encodeURIComponent(creator.id)}`} className="min-w-0 flex-1 sm:flex-none">
                    <SecondaryButton className="w-full">
                      Request photo
                    </SecondaryButton>
                  </Link>
                  <Link href={`/messages?creator=${encodeURIComponent(creator.id)}`} className="min-w-0 flex-1 sm:flex-none">
                    <SecondaryButton className="w-full">
                      Request video
                    </SecondaryButton>
                  </Link>
                </>
              ) : (
                <Link
                  href="/login"
                  className="min-w-0 flex-1 sm:flex-none"
                >
                  <PrimaryButton className="w-full">
                    Send message
                  </PrimaryButton>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
