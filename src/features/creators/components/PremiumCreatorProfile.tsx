import Image from "next/image";
import Link from "next/link";
import { ClientPostFeed } from "./ClientPostFeed";
import type { CreatorProfile } from "@/lib/types/creator";

/* ── Props ── */
type Props = {
  creator: CreatorProfile;
  isLoggedIn?: boolean;
  isOwnProfile?: boolean;
};

/* ── Placeholders ── */
const avatarPlaceholder =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%231a1525' width='200' height='200' rx='100'/%3E%3C/svg%3E";

/* ── Stat Item ── */
function StatItem({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="flex flex-1 flex-col items-center gap-0.5 py-3">
      <span className="text-[18px] font-bold tabular-nums text-white">
        {value}
      </span>
      <span className="text-[13px] text-white/45">{label}</span>
    </div>
  );
}

/* ── Format helpers ── */
function formatCount(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return n.toString();
}

/* ── Camera Icon for empty state ── */
function CameraIcon() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-white/20"
      aria-hidden
    >
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

/* ── Main Component ── */
export function PremiumCreatorProfile({ creator, isLoggedIn, isOwnProfile }: Props) {
  const avatarSrc = creator?.avatarUrl ?? avatarPlaceholder;
  const chatHref = isLoggedIn
    ? `/messages?creator=${encodeURIComponent(creator?.id || "")}`
    : "/login";

  return (
    <div className="mx-auto flex min-h-[100dvh] w-full max-w-[600px] flex-col bg-[var(--bg-base)]">
      {/* ═══════════════════════════════════
          STICKY HEADER — 56px, fixed top
         ═══════════════════════════════════ */}
      <header
        className="sticky top-0 z-50 flex h-[56px] w-full items-center justify-between border-b border-white/[0.06] px-4"
        style={{
          background:
            "linear-gradient(180deg, rgba(7,7,11,0.98) 0%, rgba(7,7,11,0.95) 100%)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        {/* Left: avatar + name + handle */}
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
            <Image
              src={avatarSrc}
              alt={creator.displayName}
              fill
              className="object-cover"
              sizes="40px"
              unoptimized={avatarSrc.startsWith("data:") || !avatarSrc.startsWith("/")}
            />
          </div>
          <div className="flex min-w-0 items-center gap-1.5">
            <span className="truncate text-[15px] font-semibold text-white">
              {creator?.displayName || "Creator"}
            </span>
            <span className="hidden truncate text-[14px] text-white/50 sm:inline">
              @{creator?.username || "creator"}
            </span>
          </div>
        </div>

        {/* Right: Message button */}
        <Link
          href={chatHref}
          className="flex min-h-[44px] items-center rounded-full bg-[var(--accent-pink)] px-5 text-[14px] font-semibold text-white shadow-[0_2px_12px_rgba(255,45,120,0.35)] transition-all duration-200 hover:brightness-110 active:scale-[0.97]"
        >
          Message
        </Link>
      </header>

      {/* ═══════════════════════════════════
          PROFILE INFO SECTION
         ═══════════════════════════════════ */}
      <section className="px-4 pt-6 pb-2">
        {/* Display Name */}
        <h1 className="text-[20px] font-medium text-white">
          {creator?.displayName}
          {creator?.verified && (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              className="ml-1.5 inline-block align-text-top"
              aria-label="Verified"
            >
              <circle cx="12" cy="12" r="11" fill="url(#hdr-gold)" />
              <path
                d="M9 12l2 2 4-4"
                stroke="#fff"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <defs>
                <linearGradient id="hdr-gold" x1="0" y1="0" x2="24" y2="24">
                  <stop offset="0%" stopColor="#f0c97a" />
                  <stop offset="100%" stopColor="#d4a853" />
                </linearGradient>
              </defs>
            </svg>
          )}
        </h1>

        {/* Handle */}
        <p className="mt-0.5 text-[14px] text-white/50">@{creator?.username}</p>

        {/* Location */}
        {creator?.location && (
          <p className="mt-1.5 flex items-center gap-1 text-[14px] text-white/50">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="shrink-0"
              aria-hidden
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {creator.location}
          </p>
        )}

        {/* Bio */}
        {creator?.bio && (
          <p className="mt-3 text-[15px] leading-[1.6] text-white/80 whitespace-pre-wrap">
            {creator.bio}
          </p>
        )}

        {/* Stats row: Posts · Fans · Likes */}
        <div className="mt-4 flex items-stretch border-y border-white/[0.08]">
          <StatItem
            value={formatCount((creator?.posts?.length || 0) + (creator?.photoCount ?? 0))}
            label="Posts"
          />
          <div className="w-px bg-white/[0.08]" />
          <StatItem value={formatCount(creator?.followerCount || 0)} label="Fans" />
          <div className="w-px bg-white/[0.08]" />
          <StatItem value={formatCount(creator?.totalLikes || 0)} label="Likes" />
        </div>
      </section>

      {/* ═══════════════════════════════════
          POST FEED
         ═══════════════════════════════════ */}
      <section className="flex-1">
        {(creator?.posts?.length ?? 0) > 0 ? (
          <ClientPostFeed
            creatorId={creator?.id || ""}
            creatorName={creator?.displayName || ""}
            creatorAvatar={creator?.avatarUrl || null}
            creatorHandle={creator?.username || ""}
            initialPosts={creator?.posts || []}
          />
        ) : (
          /* ── Empty state ── */
          <div className="flex flex-col items-center justify-center gap-3 py-20">
            <CameraIcon />
            <p className="text-[15px] text-white/40">No posts yet</p>
          </div>
        )}
      </section>

      {/* ── Own profile link ── */}
      {isOwnProfile && (
        <div className="px-4 py-3 text-center">
          <Link
            href="/creator/dashboard"
            className="inline-flex min-h-[44px] items-center rounded-lg px-4 py-2 text-[14px] font-medium text-[var(--accent-primary)] transition-colors hover:underline"
          >
            Edit profile & gallery
          </Link>
        </div>
      )}
    </div>
  );
}
