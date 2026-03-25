"use client";

import Link from "next/link";
import Image from "next/image";
import { Bell, CircleUser, MessageCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Props = {
  title: string;
  unreadCount: number;
  user: {
    username: string;
    email: string;
    avatarUrl: string | null;
  };
};

const iconClass =
  "h-[22px] w-[22px] shrink-0 transition-all duration-200 ease-out group-hover:scale-110";

export function DashboardHeader({ title, unreadCount, user }: Props) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const hasAvatar = Boolean(user.avatarUrl?.trim());

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!menuRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  return (
    <header
      className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#07070b]/92 backdrop-blur-xl"
      style={{ WebkitBackdropFilter: "blur(20px)" }}
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 px-4 sm:h-16 sm:px-6 lg:px-10">
        <h1 className="min-w-0 font-[var(--font-heading)] text-base font-semibold tracking-tight text-white sm:text-lg">
          <span
            className="bg-gradient-to-r from-[#f0c97a] via-[#d4a853] to-[#ff2d78] bg-clip-text text-transparent"
            style={{ WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
          >
            {title}
          </span>
        </h1>

        <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
          <Link
            href="/messages"
            className="group relative flex h-11 w-11 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/[0.08] hover:text-[#ff2d78]"
            aria-label={`Messages${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
          >
            <MessageCircle className={iconClass} strokeWidth={2} aria-hidden />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#ff2d78] px-1 text-[10px] font-bold text-white shadow-[0_0_12px_rgba(255,45,120,0.55)]">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </Link>

          <button
            type="button"
            className="group flex h-11 w-11 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/[0.08] hover:text-[#f0c97a]"
            aria-label="Notifications"
          >
            <Bell className={iconClass} strokeWidth={2} aria-hidden />
          </button>

          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-[rgba(212,168,83,0.35)] bg-white/[0.04] ring-offset-2 ring-offset-[#07070b] transition-all hover:border-[#d4a853] hover:bg-white/[0.07] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a853]"
              aria-expanded={open}
              aria-haspopup="menu"
              aria-label="Account menu"
            >
              {hasAvatar ? (
                <Image
                  src={user.avatarUrl!}
                  alt=""
                  width={44}
                  height={44}
                  className="h-full w-full object-cover"
                  unoptimized={
                    user.avatarUrl!.startsWith("data:") || !user.avatarUrl!.startsWith("/")
                  }
                />
              ) : (
                <CircleUser
                  className="h-6 w-6 text-[#d4a853]/90 transition-transform duration-200 ease-out hover:scale-105"
                  strokeWidth={2}
                  aria-hidden
                />
              )}
            </button>

            {open && (
              <div
                className="absolute right-0 mt-2 w-52 overflow-hidden rounded-xl border border-white/10 bg-[rgba(14,12,20,0.98)] py-1 shadow-[0_16px_48px_rgba(0,0,0,0.55)]"
                role="menu"
              >
                <p className="border-b border-white/10 px-4 py-2 text-xs text-white/45 truncate">{user.email}</p>
                <Link
                  href="/creators"
                  role="menuitem"
                  className="block px-4 py-2.5 text-sm text-white/85 hover:bg-white/8"
                  onClick={() => setOpen(false)}
                >
                  ✦ Explore Creators
                </Link>
                <Link
                  href="/premium"
                  role="menuitem"
                  className="block px-4 py-2.5 text-sm text-white/85 hover:bg-white/8"
                  onClick={() => setOpen(false)}
                >
                  Premium
                </Link>
                <form action="/api/auth/logout" method="POST" className="border-t border-white/10 pt-1">
                  <button
                    type="submit"
                    role="menuitem"
                    className="w-full px-4 py-2.5 text-left text-sm text-white/55 hover:bg-white/8 hover:text-white"
                  >
                    Log out
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
