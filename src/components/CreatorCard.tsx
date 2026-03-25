"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Gift, Lock, MapPin, MessageCircle } from "lucide-react";
import type { CreatorListItem } from "@/lib/types/creator";

/** Matches Figma outer radius (~44px); inner = outer minus border width. */
const R_OUT = 44;
const BORDER = 3;
const R_IN = R_OUT - BORDER;

const IMG_FALLBACK =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='560' viewBox='0 0 400 560'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%231a1525'/%3E%3Cstop offset='100%25' style='stop-color:%233d2a4a'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill='url(%23g)' width='400' height='560' rx='44'/%3E%3C/svg%3E";

export type CreatorCardProps = {
  name: string;
  age: number;
  location: string;
  imageUrl: string | null;
  creatorId: string;
  isVIP?: boolean;
  /**
   * Profile path `/creators/[username]`. If omitted, derived from `name` (best-effort).
   */
  username?: string;
  className?: string;
  /** Discover-only: optional, not in Figma. */
  matchPercent?: number;
  showLockedOverlay?: boolean;
  isSubscribed?: boolean;
  onFollow?: () => void;
};

function slugFromName(name: string): string {
  const s = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return s.length > 0 ? s : "creator";
}

function displayAgeFromId(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return 22 + (h % 17);
}

export function creatorListItemToCardProps(creator: CreatorListItem): CreatorCardProps {
  return {
    creatorId: creator.id,
    username: creator.username,
    name: creator.displayName,
    age: displayAgeFromId(creator.id),
    location: creator.location?.trim() || "Near you",
    imageUrl: creator.galleryThumbnail ?? creator.avatarUrl,
    isVIP: creator.verified,
  };
}

export function CreatorCard({
  name,
  age,
  location,
  imageUrl,
  creatorId,
  isVIP = false,
  username: usernameProp,
  className = "",
  matchPercent,
  showLockedOverlay,
  isSubscribed,
  onFollow,
}: CreatorCardProps) {
  const router = useRouter();
  const username = usernameProp ?? slugFromName(name);
  const profileHref = `/creators/${username}`;
  const hasCreatorTarget = Boolean(creatorId);
  const chatHref = hasCreatorTarget
    ? `/messages?creator=${encodeURIComponent(creatorId)}`
    : profileHref;
  const tipHref = hasCreatorTarget
    ? `/premium?creator=${encodeURIComponent(creatorId)}`
    : "/premium";

  const src = imageUrl && imageUrl.length > 0 ? imageUrl : IMG_FALLBACK;
  const unoptimized = src.startsWith("data:") || !src.startsWith("/");
  const locationLine = location?.trim() || "Near you";

  const handleFollow = () => {
    if (onFollow) {
      onFollow();
      return;
    }
    router.push(profileHref);
  };

  const borderRadiusOuter = `${R_OUT}px`;
  const borderRadiusInner = `${R_IN}px`;

  return (
    <article
      className={`group/cc relative w-full max-w-full origin-center overflow-visible transition-transform duration-300 ease-out [aspect-ratio:5/7] hover:z-10 hover:scale-[1.02] ${className}`.trim()}
    >
      {/* Thick glowing gradient frame (Figma: energetic orange/pink rim → site pink + gold) */}
      <div
        className="h-full w-full transition-[box-shadow,filter] duration-300 ease-out [background:linear-gradient(135deg,#ffb38a_0%,#ff2d78_38%,#d4a853_72%,#ff5a9a_100%)] p-[3px] shadow-[0_0_0_1px_rgba(255,45,120,0.2),0_8px_32px_rgba(0,0,0,0.5),0_0_40px_-6px_rgba(255,45,120,0.45),0_0_56px_-12px_rgba(212,168,83,0.35)] group-hover/cc:shadow-[0_0_0_2px_rgba(255,45,120,0.35),0_16px_48px_rgba(0,0,0,0.55),0_0_56px_-4px_rgba(255,45,120,0.55),0_0_72px_-8px_rgba(212,168,83,0.45)]"
        style={{ borderRadius: borderRadiusOuter }}
      >
        <div
          className="flex h-full min-h-0 flex-col overflow-hidden bg-[#07070b]"
          style={{ borderRadius: borderRadiusInner }}
        >
          {/* Photo region (~85% feel): image + bottom glass row */}
          <div className="relative min-h-0 flex-1">
            <Link
              href={profileHref}
              className="absolute inset-x-0 top-0 bottom-[6rem] z-[1] block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a853] focus-visible:ring-offset-2 focus-visible:ring-offset-[#07070b]"
              aria-label={`Open ${name} profile`}
            />

            <Image
              src={src}
              alt=""
              fill
              className={`object-cover object-top transition-transform duration-500 ease-out group-hover/cc:scale-[1.03] ${
                showLockedOverlay ? "scale-105 blur-[14px]" : ""
              }`}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 320px"
              unoptimized={unoptimized}
              priority={false}
            />

            {/* Warm “golden hour” wash (Figma lighting → pink/gold on dark) */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-t from-[#07070b] via-[#07070b]/20 to-transparent"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-tr from-transparent via-[#d4a853]/12 to-[#ff2d78]/25"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -right-[20%] -top-[5%] z-[2] h-[58%] w-[75%] rounded-full bg-[#ffb366]/25 blur-[56px]"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -right-[10%] top-[15%] z-[2] h-[40%] w-[55%] rounded-full bg-[#ff2d78]/15 blur-[40px]"
            />

            {showLockedOverlay && (
              <div className="absolute inset-0 z-[15] flex flex-col items-center justify-center gap-2 bg-[#07070b]/45 backdrop-blur-[2px]">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#d4a853]/45 bg-black/55 text-[#f0c97a]">
                  <Lock className="h-[22px] w-[22px]" strokeWidth={2} aria-hidden />
                </div>
                <span className="text-[10px] font-medium uppercase tracking-widest text-white/90">
                  Subscribe ✦
                </span>
              </div>
            )}

            {matchPercent != null && (
              <span
                className={`absolute left-3 top-3 z-20 rounded-full px-2.5 py-1 text-[11px] font-bold tabular-nums text-white shadow-md ${
                  matchPercent >= 85
                    ? "bg-gradient-to-r from-[#d4a853] to-[#f0c97a] text-[#1a1208]"
                    : "bg-[#ff2d78]"
                }`}
              >
                {matchPercent}%
              </span>
            )}

            {isVIP && (
              <span
                className="absolute right-3 top-3 z-20 rounded-full bg-[#d4a853] px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[#1a1208]"
                style={{ boxShadow: "0 0 20px rgba(212,168,83,0.55), 0 2px 8px rgba(0,0,0,0.35)" }}
              >
                VIP
              </span>
            )}

            {/* Figma: full-width glass band; text left, two icons right in one row */}
            <div className="absolute inset-x-0 bottom-0 z-20">
              <div
                className="flex items-center justify-between gap-3 border-t border-white/[0.1] px-4 py-3 backdrop-blur-[14px]"
                style={{
                  background: "linear-gradient(180deg, rgba(7,7,11,0.2) 0%, rgba(7,7,11,0.72) 45%, rgba(7,7,11,0.88) 100%)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
                }}
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-[var(--font-heading)] text-[15px] font-bold leading-tight tracking-tight text-white sm:text-base">
                    {name}, {age}
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-[13px] font-normal leading-snug text-[#f0c97a]">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-[#f0c97a]" strokeWidth={2} aria-hidden />
                    <span className="truncate">{locationLine}</span>
                  </p>
                </div>

                <div className="flex shrink-0 flex-row items-center gap-2.5">
                  {/* Figma: light rounded-square + pink gift */}
                  <Link
                    href={tipHref}
                    onClick={(e) => e.stopPropagation()}
                    className="focus-outline flex h-11 w-11 items-center justify-center rounded-2xl bg-white/95 text-[#ff2d78] shadow-[0_4px_14px_rgba(0,0,0,0.25)] transition-transform hover:scale-105 active:scale-95"
                    aria-label={`Send a tip to ${name}`}
                  >
                    <Gift className="h-[20px] w-[20px]" strokeWidth={2.25} aria-hidden />
                  </Link>
                  {/* Figma: pink circle + white chat */}
                  <Link
                    href={chatHref}
                    onClick={(e) => e.stopPropagation()}
                    className="focus-outline flex h-11 w-11 items-center justify-center rounded-full bg-[#ff2d78] text-white shadow-[0_4px_18px_rgba(255,45,120,0.5)] transition-transform hover:scale-105 active:scale-95"
                    aria-label={`Message ${name}`}
                  >
                    <MessageCircle className="h-[20px] w-[20px]" strokeWidth={2.25} aria-hidden />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Figma: dedicated footer band with wide pill button */}
          <div
            className="relative z-20 shrink-0 border-t border-white/[0.06] bg-[#121015] px-4 py-3 sm:py-3.5"
            style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)" }}
          >
            <button
              type="button"
              onClick={handleFollow}
              className="focus-outline w-full rounded-full bg-gradient-to-r from-[#ff2d78] to-[#d4a853] py-3.5 text-center text-[15px] font-semibold tracking-wide text-white shadow-[0_6px_24px_rgba(255,45,120,0.4)] transition-[filter,transform] duration-200 hover:brightness-[1.08] hover:shadow-[0_8px_28px_rgba(212,168,83,0.35)] active:scale-[0.99] sm:py-4"
            >
              {isSubscribed ? "Following ✦" : "Follow +"}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
