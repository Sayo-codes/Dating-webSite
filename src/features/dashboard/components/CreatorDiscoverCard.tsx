"use client";

import Image from "next/image";
import Link from "next/link";
import { Gift, Heart, Lock, MessageCircle } from "lucide-react";

export type DiscoverCardData = {
  id: string;
  username: string;
  displayName: string;
  imageUrl: string | null;
  matchPercent: number;
  distanceLabel: string;
  displayAge: number;
  showLockedOverlay: boolean;
  isSubscribed: boolean;
};

const imgFallback =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='560' viewBox='0 0 400 560'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%231a1525'/%3E%3Cstop offset='100%25' style='stop-color:%233d2a4a'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill='url(%23g)' width='400' height='560' rx='24'/%3E%3C/svg%3E";

const actionIconSize = 22;

type Props = {
  creator: DiscoverCardData;
};

export function CreatorDiscoverCard({ creator }: Props) {
  const href = `/creators/${creator.username}`;
  const src = creator.imageUrl && creator.imageUrl.length > 0 ? creator.imageUrl : imgFallback;

  return (
    <article className="group relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-[#121018] shadow-[0_12px_40px_rgba(0,0,0,0.45)] ring-1 ring-white/[0.06] transition-transform duration-300 hover:-translate-y-0.5 hover:ring-[rgba(212,168,83,0.25)] sm:rounded-[1.25rem]">
      <Link
        href={href}
        className="absolute inset-0 bottom-[3.25rem] z-0"
        aria-label={`Open ${creator.displayName} profile`}
      />

      <div className="relative h-full w-full">
        <Image
          src={src}
          alt=""
          fill
          className={`object-cover transition-transform duration-500 group-hover:scale-[1.03] ${
            creator.showLockedOverlay ? "scale-105 blur-[14px]" : ""
          }`}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          unoptimized={src.startsWith("data:") || !src.startsWith("/")}
        />

        {creator.showLockedOverlay && (
          <div className="absolute inset-0 z-[1] flex flex-col items-center justify-center gap-2 bg-[#07070b]/35">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#d4a853]/40 bg-black/50 text-[#f0c97a]">
              <Lock className="h-[22px] w-[22px]" strokeWidth={2} aria-hidden />
            </div>
            <span className="text-[10px] font-medium uppercase tracking-widest text-white/80">Subscribe ✦</span>
          </div>
        )}

        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] bg-gradient-to-t from-[#07070b] via-[#07070b]/75 to-transparent pt-16 pb-2"
          style={{ paddingBottom: "3.25rem" }}
        />

        <div
          className={`absolute left-2 top-2 z-[2] rounded-lg px-2 py-0.5 text-xs font-bold text-white shadow-lg sm:left-2.5 sm:top-2.5 ${
            creator.matchPercent >= 85
              ? "bg-gradient-to-r from-[#d4a853] to-[#f0c97a] text-[#1a1208]"
              : "bg-[#ff2d78]"
          }`}
        >
          {creator.matchPercent}%
        </div>

        <div className="absolute inset-x-0 bottom-10 z-[2] px-2.5 sm:bottom-11 sm:px-3">
          <div className="flex items-center gap-1.5">
            <h2 className="truncate font-[var(--font-heading)] text-sm font-semibold text-white drop-shadow-md sm:text-base">
              {creator.displayName}, {creator.displayAge}
            </h2>
            <span
              className="h-2 w-2 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]"
              title="Online"
              aria-hidden
            />
          </div>
          <p className="mt-0.5 truncate text-xs text-white/70 drop-shadow">{creator.distanceLabel}</p>
        </div>

        <div
          className="absolute inset-x-0 bottom-0 z-[3] flex items-center justify-around border-t border-white/[0.08] bg-[rgba(7,7,11,0.88)] px-1 py-2 backdrop-blur-md sm:py-2.5"
          onClick={(e) => e.preventDefault()}
        >
          <Link
            href={`/messages?creator=${encodeURIComponent(creator.id)}`}
            className="group/msg flex h-10 w-10 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/[0.08]"
            aria-label="Message"
            onClick={(e) => e.stopPropagation()}
          >
            <MessageCircle
              size={actionIconSize}
              strokeWidth={2}
              className="transition-all duration-200 ease-out group-hover/msg:scale-110 group-hover/msg:text-[#ff2d78]"
              aria-hidden
            />
          </Link>
          <Link
            href={`/premium?creator=${encodeURIComponent(creator.id)}`}
            className="group/tip flex h-10 w-10 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/[0.08]"
            aria-label="Tip"
            onClick={(e) => e.stopPropagation()}
          >
            <Gift
              size={actionIconSize}
              strokeWidth={2}
              className="transition-all duration-200 ease-out group-hover/tip:scale-110 group-hover/tip:text-[#f0c97a]"
              aria-hidden
            />
          </Link>
          <Link
            href={href}
            className="group/follow flex h-10 w-10 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/[0.08]"
            aria-label={creator.isSubscribed ? "Subscribed — view profile" : "View profile"}
            onClick={(e) => e.stopPropagation()}
          >
            <Heart
              size={actionIconSize}
              strokeWidth={2}
              className={`transition-all duration-200 ease-out group-hover/follow:scale-110 ${
                creator.isSubscribed
                  ? "fill-[#ff2d78] text-[#ff2d78] group-hover/follow:fill-[#f0c97a] group-hover/follow:text-[#f0c97a]"
                  : "fill-none text-white/70 group-hover/follow:text-[#ff2d78]"
              }`}
              aria-hidden
            />
          </Link>
        </div>
      </div>
    </article>
  );
}
