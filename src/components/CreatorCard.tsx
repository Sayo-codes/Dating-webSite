"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Gift, Lock, MapPin, MessageCircle } from "lucide-react";
import type { CreatorListItem } from "@/lib/types/creator";

const IMG_FALLBACK =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='560' viewBox='0 0 400 560'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%231a1525'/%3E%3Cstop offset='100%25' style='stop-color:%233d2a4a'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill='url(%23g)' width='400' height='560' rx='44'/%3E%3C/svg%3E";

export type CreatorCardProps = {
  name: string;
  age: number;
  location: string;
  imageUrl: string | null;
  creatorId: string;
  isVIP?: boolean;
  username?: string;
  className?: string;
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
  const age =
    creator.age != null && Number.isFinite(creator.age) ? creator.age : displayAgeFromId(creator.id);
  return {
    creatorId: creator.id,
    username: creator.username,
    name: creator.displayName,
    age,
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

  return (
    <article
      className={`group/cc relative w-full max-w-full origin-center overflow-visible transition-transform duration-300 ease-out hover:z-10 hover:scale-[1.02] max-md:aspect-[10/14] md:aspect-[3/5] max-md:max-h-[70vw] md:max-h-none ${className}`.trim()}
    >
      {/* Frame: thinner on mobile, full glow on md+ */}
      <div
        className="h-full w-full transition-[box-shadow,filter] duration-300 ease-out [background:linear-gradient(135deg,#ffb38a_0%,#ff2d78_38%,#d4a853_72%,#ff5a9a_100%)] p-[2px] shadow-[0_0_0_1px_rgba(255,45,120,0.2),0_6px_20px_rgba(0,0,0,0.45),0_0_28px_-8px_rgba(255,45,120,0.4)] max-md:rounded-[22px] md:p-[3px] md:rounded-[44px] md:shadow-[0_0_0_1px_rgba(255,45,120,0.2),0_8px_32px_rgba(0,0,0,0.5),0_0_40px_-6px_rgba(255,45,120,0.45),0_0_56px_-12px_rgba(212,168,83,0.35)] group-hover/cc:shadow-[0_0_0_2px_rgba(255,45,120,0.35),0_12px_36px_rgba(0,0,0,0.55),0_0_48px_-4px_rgba(255,45,120,0.5),0_0_56px_-8px_rgba(212,168,83,0.4)]"
      >
        <div className="flex h-full min-h-0 flex-col overflow-hidden bg-[#07070b] max-md:rounded-[20px] md:rounded-[41px]">
          <div className="relative min-h-0 flex-1">
            <Link
              href={profileHref}
              className="absolute inset-x-0 top-0 z-[1] block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a853] focus-visible:ring-offset-2 focus-visible:ring-offset-[#07070b] bottom-[3.35rem] max-md:bottom-[3.2rem] sm:bottom-[3.85rem] md:bottom-[4.5rem] lg:bottom-[4.75rem]"
              aria-label={`Open ${name} profile`}
            />

            <Image
              src={src}
              alt=""
              fill
              className={`object-cover object-[center_16%] transition-transform duration-500 ease-out group-hover/cc:scale-[1.03] max-md:object-[center_12%] ${
                showLockedOverlay ? "scale-105 blur-[14px]" : ""
              }`}
              sizes="(max-width: 640px) 45vw, (max-width: 1024px) 33vw, 320px"
              unoptimized={unoptimized}
              priority={false}
            />

            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-t from-[#07070b] via-[#07070b]/10 via-35% to-transparent max-md:via-25%"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-tr from-transparent via-[#d4a853]/10 to-[#ff2d78]/22"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -right-[22%] -top-[6%] z-[2] h-[52%] w-[72%] rounded-full bg-[#ffb366]/22 blur-[40px] max-md:blur-[28px]"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -right-[12%] top-[12%] z-[2] h-[36%] w-[50%] rounded-full bg-[#ff2d78]/12 blur-[32px]"
            />

            {showLockedOverlay && (
              <div className="absolute inset-0 z-[15] flex flex-col items-center justify-center gap-1.5 bg-[#07070b]/45 backdrop-blur-[2px]">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d4a853]/45 bg-black/55 text-[#f0c97a]">
                  <Lock className="h-[18px] w-[18px]" strokeWidth={2} aria-hidden />
                </div>
                <span className="text-[9px] font-medium uppercase tracking-widest text-white/90">Subscribe ✦</span>
              </div>
            )}



            {isVIP && (
              <span
                className="absolute right-1.5 top-1.5 z-20 rounded-full bg-[#d4a853] px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em] text-[#1a1208] sm:right-2 sm:top-2 sm:px-2.5 sm:text-[10px] md:px-3.5 md:text-[11px]"
                style={{ boxShadow: "0 0 14px rgba(212,168,83,0.45), 0 1px 6px rgba(0,0,0,0.35)" }}
              >
                VIP
              </span>
            )}

            <div className="absolute inset-x-0 bottom-0 z-20">
              <div
                className="flex items-center gap-1.5 border-t border-white/[0.1] px-2 py-1.5 backdrop-blur-[10px] sm:gap-2 sm:px-2.5 sm:py-2 md:gap-3 md:px-3.5 md:py-2.5"
                style={{
                  background: "linear-gradient(180deg, rgba(7,7,11,0.12) 0%, rgba(7,7,11,0.82) 50%, rgba(7,7,11,0.92) 100%)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
                }}
              >
                <div className="min-w-0 flex-1 pr-0.5">
                  <p className="line-clamp-2 break-words font-[var(--font-heading)] text-[12px] font-bold leading-tight tracking-tight text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)] sm:text-[13px] md:text-lg lg:text-xl">
                    <span className="text-white">{name}</span>
                    <span className="text-[#f0c97a]">, {age}</span>
                  </p>
                  <p className="mt-0.5 flex min-h-[1.1em] items-start gap-1 text-[10px] font-medium leading-snug text-[#f0c97a] drop-shadow-[0_1px_3px_rgba(0,0,0,0.85)] sm:text-[11px] md:text-[0.8125rem]">
                    <MapPin className="mt-0.5 h-2.5 w-2.5 shrink-0 text-[#f0c97a] sm:h-3 sm:w-3" strokeWidth={2.25} aria-hidden />
                    <span className="line-clamp-1 break-all">{locationLine}</span>
                  </p>
                </div>

                <div className="flex shrink-0 flex-row items-center gap-1 sm:gap-1.5 md:gap-2">
                  <Link
                    href={tipHref}
                    onClick={(e) => e.stopPropagation()}
                    className="focus-outline flex h-8 w-8 items-center justify-center rounded-lg bg-white/95 text-[#ff2d78] shadow-[0_2px_8px_rgba(0,0,0,0.25)] transition-transform hover:scale-[1.05] active:scale-95 sm:h-9 sm:w-9 sm:rounded-xl md:h-10 md:w-10 md:rounded-[13px] lg:h-[42px] lg:w-[42px]"
                    aria-label={`Send a tip to ${name}`}
                  >
                    <Gift className="h-[14px] w-[14px] sm:h-4 sm:w-4 md:h-[17px] md:w-[17px]" strokeWidth={2.25} aria-hidden />
                  </Link>
                  <Link
                    href={chatHref}
                    onClick={(e) => e.stopPropagation()}
                    className="focus-outline flex h-8 w-8 items-center justify-center rounded-full bg-[#ff2d78] text-white shadow-[0_2px_10px_rgba(255,45,120,0.4)] transition-transform hover:scale-[1.05] active:scale-95 sm:h-9 sm:w-9 md:h-10 md:w-10 lg:h-[42px] lg:w-[42px]"
                    aria-label={`Message ${name}`}
                  >
                    <MessageCircle className="h-[14px] w-[14px] sm:h-4 sm:w-4 md:h-[17px] md:w-[17px]" strokeWidth={2.25} aria-hidden />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-20 shrink-0 border-t border-white/[0.06] bg-[#121015] px-2 py-1 sm:px-2.5 sm:py-1.5 md:px-3.5 md:py-2">
            <button
              type="button"
              onClick={handleFollow}
              className="focus-outline w-full rounded-full bg-gradient-to-r from-[#ff2d78] to-[#d4a853] py-1.5 text-center text-[10px] font-semibold tracking-wide text-white shadow-[0_3px_12px_rgba(255,45,120,0.28)] transition-[filter,transform] duration-200 hover:brightness-[1.08] active:scale-[0.99] sm:py-2 sm:text-[11px] md:py-2.5 md:text-sm"
            >
              {isSubscribed ? "Following ✦" : "Follow +"}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
