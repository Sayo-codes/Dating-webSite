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

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    const onClickOutside = (e: MouseEvent) => {
      if (menuOpen && !(e.target as Element).closest('header')) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener("keydown", onKeyDown);
      document.addEventListener("mousedown", onClickOutside);
    }
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, [menuOpen]);

  // Logged-out: no nav links (Login / Join Now buttons handle auth)
  const guestNavLinks: { href: string; label: string }[] = [];

  // Logged-in app links
  const authNavLinks = [
    { href: "/creators", label: "✦ Explore" },
    ...(user?.role === "creator" ? [{ href: "/creator/dashboard", label: "Dashboard" }] : []),
    ...(user?.role === "admin" ? [{ href: "/admin", label: "Admin" }] : []),
  ];

  const navLinks = user ? authNavLinks : guestNavLinks;

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 border-b border-white/10 bg-[#0a0a0f]/95 backdrop-blur-xl ${scrolled ? "shadow-[0_4px_24px_rgba(0,0,0,0.5)]" : ""}`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-10 h-16">

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 focus-outline min-h-[44px] shrink-0"
          aria-label="Rsdate home"
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
            Rsdate
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
            <div className="flex items-center gap-2">
              {/* Login — ghost border button */}
              <Link
                href="/login"
                className="focus-outline inline-flex min-h-[42px] items-center justify-center rounded-full border px-5 text-sm font-semibold text-white/85 transition-all duration-200 hover:border-[rgba(212,168,83,0.6)] hover:bg-[rgba(212,168,83,0.08)] hover:text-[#f0c97a]"
                style={{ borderColor: "rgba(255,255,255,0.22)" }}
              >
                Login
              </Link>
              {/* Sign Up — solid gold-to-pink pill */}
              <Link
                href="/register"
                className="focus-outline pill-button-primary inline-flex min-h-[42px] items-center justify-center rounded-full px-5 text-sm font-bold"
              >
                Sign Up ✦
              </Link>
            </div>
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
          className="focus-outline flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-all duration-200 hover:bg-white/10 active:scale-95 md:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          <span className="relative flex w-6 flex-col justify-center gap-[6px]">
            <span className={`block bg-white w-6 h-0.5 transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block bg-white w-6 h-0.5 transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block bg-white w-6 h-0.5 transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </span>
        </button>
      </div>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-x-0 bottom-0 z-[9999] md:hidden w-full bg-[#0a0a0f] backdrop-blur-xl border-t border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.9)] transition-all duration-300 ease-in-out overflow-hidden ${menuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}
        style={{ top: "64px" }}
        aria-hidden={!menuOpen}
      >
        <nav className="flex flex-col" aria-label="Main mobile">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="focus-outline min-h-[56px] px-6 py-4 text-base text-white border-b border-white/8 hover:bg-[#d4a853]/10 hover:text-[#d4a853] w-full flex items-center transition-colors duration-200"
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}

          {/* Messages link in mobile with badge */}
          {user && (
            <Link
              href="/messages"
              className="focus-outline min-h-[56px] px-6 py-4 text-base text-white border-b border-white/8 hover:bg-[#d4a853]/10 hover:text-[#d4a853] w-full flex items-center justify-between transition-colors duration-200"
              onClick={() => setMenuOpen(false)}
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
                className="focus-outline min-h-[56px] px-6 py-4 text-base text-white border-b border-white/8 hover:bg-[#d4a853]/10 hover:text-[#d4a853] w-full flex items-center transition-colors duration-200"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
              <div className="px-6 py-4">
                <Link
                  href="/register"
                  className="w-full bg-[#d4a853] text-black font-bold rounded-full py-4 text-center mt-2 flex items-center justify-center text-base"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign Up ✦
                </Link>
              </div>
            </>
          )}

          {user && (
            <form action="/api/auth/logout" method="POST" className="w-full">
              <button
                type="submit"
                className="focus-outline min-h-[56px] px-6 py-4 text-base text-white border-b border-white/8 hover:bg-[#d4a853]/10 hover:text-[#d4a853] w-full flex items-center transition-colors duration-200"
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
