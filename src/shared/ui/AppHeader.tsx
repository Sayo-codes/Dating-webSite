"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export function AppHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<{ role: string } | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setUser(data?.user ?? null))
      .catch(() => setUser(null));
  }, []);

  // Fetch unread message count when logged in
  useEffect(() => {
    if (!user) return;
    async function fetchUnread() {
      try {
        const res = await fetch("/api/conversations/unread-count");
        if (res.ok) {
          const data = (await res.json()) as { count: number };
          setUnreadCount(data.count ?? 0);
        }
      } catch {
        // silently fail
      }
    }
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000); // poll every 30s
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => setMenuOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { href: "/creators", label: "✦ Explore Creators" },
    ...(user?.role === "creator" ? [{ href: "/creator/dashboard", label: "Dashboard" }] : []),
    ...(user?.role === "admin" ? [{ href: "/admin", label: "Admin" }] : []),
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
          ? "bg-[rgba(7,7,11,0.92)] shadow-[0_4px_24px_rgba(0,0,0,0.5)] border-b border-[rgba(212,168,83,0.12)]"
          : "bg-transparent border-b border-transparent"
        }`}
      style={{ backdropFilter: scrolled ? "blur(20px)" : "blur(0px)", WebkitBackdropFilter: scrolled ? "blur(20px)" : "blur(0px)" }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-10 h-16">

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 focus-outline min-h-[44px] shrink-0"
          aria-label="Velvet Signal home"
        >
          {/* Gem icon */}
          <span className="relative flex h-8 w-8 items-center justify-center rounded-xl"
            style={{ background: "linear-gradient(135deg, #d4a853 0%, #ff2d78 100%)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M12 2L2 9l10 13 10-13L12 2z" fill="rgba(255,255,255,0.9)" />
              <path d="M2 9h20M7 2l-5 7 10 13M17 2l5 7-10 13" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
            </svg>
          </span>
          <span
            className="font-[var(--font-heading)] text-xl font-bold tracking-tight"
            style={{
              background: "linear-gradient(135deg, #f0c97a 0%, #d4a853 45%, #ff2d78 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Velvet Signal
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`focus-outline rounded-full px-4 py-2 text-sm font-medium min-h-[44px] flex items-center transition-all duration-200 ${pathname === href
                  ? "bg-[rgba(212,168,83,0.15)] text-[#f0c97a]"
                  : "text-white/75 hover:text-white hover:bg-white/8"
                }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right side actions */}
        <div className="hidden md:flex items-center gap-2">
          {/* Messages icon - only when logged in */}
          {user && (
            <Link
              href="/messages"
              className={`focus-outline relative flex h-11 w-11 items-center justify-center rounded-full transition-all duration-200 ${pathname === "/messages"
                  ? "bg-[rgba(212,168,83,0.15)] text-[#f0c97a]"
                  : "text-white/70 hover:text-white hover:bg-white/8"
                }`}
              aria-label={`Messages${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
              title="Messages"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#ff2d78] px-1.5 text-[10px] font-bold text-white shadow-[0_0_8px_rgba(255,45,120,0.6)] animate-scale-in">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </Link>
          )}

          {!user ? (
            <>
              <Link
                href="/login"
                className="focus-outline rounded-full px-4 py-2 text-sm font-medium min-h-[44px] flex items-center text-white/75 transition-all duration-200 hover:text-white hover:bg-white/8"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="focus-outline rounded-full px-4 py-2 text-sm font-medium min-h-[44px] flex items-center text-white/80 transition-all duration-200 hover:text-white hover:bg-white/8"
              >
                Sign Up
              </Link>
              <Link
                href="/register"
                className="focus-outline pill-button-primary inline-flex items-center px-5 py-2 text-sm min-h-[44px]"
              >
                Join Now ✦
              </Link>
            </>
          ) : (
            <form action="/api/auth/logout" method="POST">
              <button
                type="submit"
                className="focus-outline rounded-full px-4 py-2.5 text-sm font-medium min-h-[44px] flex items-center text-white/60 transition-colors duration-200 hover:bg-white/5 hover:text-white"
              >
                Log out
              </button>
            </form>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          className="focus-outline flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white/90 transition-all duration-200 hover:bg-white/10 active:scale-95 md:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          <span className="relative flex h-5 w-5 flex-col justify-center gap-[5px]">
            <span className={`block h-0.5 w-5 rounded-full bg-current transition-all duration-300 ${menuOpen ? "translate-y-[7px] rotate-45" : ""}`} />
            <span className={`block h-0.5 w-5 rounded-full bg-current transition-all duration-300 ${menuOpen ? "opacity-0 scale-x-0" : ""}`} />
            <span className={`block h-0.5 w-5 rounded-full bg-current transition-all duration-300 ${menuOpen ? "-translate-y-[7px] -rotate-45" : ""}`} />
          </span>
        </button>
      </div>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-x-0 bottom-0 z-40 md:hidden transition-all duration-400 ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        style={{ top: "64px", background: "rgba(7,7,11,0.97)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)" }}
        aria-hidden={!menuOpen}
      >
        {/* Gold top border */}
        <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent, rgba(212,168,83,0.4), transparent)" }} />

        <nav className="flex flex-col gap-1 p-5 pt-6" aria-label="Main mobile">
          {navLinks.map(({ href, label }, i) => (
            <Link
              key={href}
              href={href}
              className={`focus-outline flex min-h-[52px] items-center rounded-2xl px-5 text-base font-medium transition-all duration-200 ${pathname === href ? "bg-[rgba(212,168,83,0.12)] text-[#f0c97a]" : "text-white/80 hover:bg-white/8 hover:text-white"
                }`}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {label}
            </Link>
          ))}

          {/* Messages link in mobile with badge */}
          {user && (
            <Link
              href="/messages"
              className={`focus-outline flex min-h-[52px] items-center justify-between rounded-2xl px-5 text-base font-medium transition-all duration-200 ${pathname === "/messages" ? "bg-[rgba(212,168,83,0.12)] text-[#f0c97a]" : "text-white/80 hover:bg-white/8 hover:text-white"
                }`}
            >
              <span className="flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                Messages
              </span>
              {unreadCount > 0 && (
                <span className="flex h-6 min-w-[24px] items-center justify-center rounded-full bg-[#ff2d78] px-2 text-xs font-bold text-white">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </Link>
          )}

          {!user && (
            <>
              <Link
                href="/login"
                className="focus-outline flex min-h-[52px] items-center rounded-2xl px-5 text-base font-medium text-white/80 hover:bg-white/8 hover:text-white transition-all duration-200"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="focus-outline flex min-h-[52px] items-center rounded-2xl px-5 text-base font-medium text-white/80 hover:bg-white/8 hover:text-white transition-all duration-200"
              >
                Sign Up
              </Link>
              <div className="mt-3 px-2">
                <Link
                  href="/register"
                  className="pill-button-primary focus-outline flex w-full min-h-[52px] items-center justify-center rounded-2xl text-base font-semibold"
                >
                  Join Now ✦
                </Link>
              </div>
            </>
          )}

          {user && (
            <form action="/api/auth/logout" method="POST" className="mt-3 border-t border-white/10 pt-4">
              <button
                type="submit"
                className="focus-outline flex min-h-[52px] w-full items-center rounded-2xl px-5 text-base font-medium text-white/60 hover:bg-white/8 hover:text-white transition-all duration-200"
              >
                Log out
              </button>
            </form>
          )}
        </nav>
      </div>
    </header>
  );
}
