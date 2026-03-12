"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const MENU_LINKS = [
  { href: "/", label: "Home" },
  { href: "/creators", label: "Creators" },
  { href: "/messages", label: "Messages", auth: true },
  { href: "/premium", label: "Premium", auth: true },
  { href: "/creator/dashboard", label: "Dashboard", auth: true, role: "creator" },
  { href: "/admin", label: "Admin", auth: true, role: "admin" },
] as const;

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <span className="relative flex h-6 w-5 flex-col justify-center gap-1.5">
      <span
        className={`block h-0.5 w-5 bg-current transition-all ${open ? "translate-y-[5px] rotate-45" : ""}`}
      />
      <span className={`block h-0.5 w-5 bg-current transition-all ${open ? "opacity-0 scale-0" : ""}`} />
      <span
        className={`block h-0.5 w-5 bg-current transition-all ${open ? "-translate-y-[5px] -rotate-45" : ""}`}
      />
    </span>
  );
}

export function AppHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<{ role: string } | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setUser(data?.user ?? null))
      .catch(() => setUser(null));
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

  const filteredLinks = MENU_LINKS.filter((link) => {
    if (link.auth && !user) return false;
    if (link.role && user?.role !== link.role) return false;
    return true;
  });

  const guestLinks = [
    { href: "/login", label: "Login" },
    { href: "/register", label: "Join" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[var(--bg-base)]/95 shadow-[0_1px_0_0_rgba(255,255,255,0.05)] backdrop-blur supports-[backdrop-filter]:bg-[var(--bg-base)]/80">
      <div className="page-content mx-auto flex max-w-6xl items-center justify-between gap-4 py-3 sm:py-4">
        <Link
          href="/"
          className="font-[var(--font-heading)] text-lg font-semibold text-white focus-outline min-h-[44px] min-w-[44px] flex items-center"
        >
          Velvet
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {filteredLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`focus-outline rounded-full px-4 py-2.5 text-sm font-medium min-h-[44px] flex items-center transition-colors duration-200 ${
                pathname === href ? "bg-white/10 text-white" : "text-white/80 hover:bg-white/5 hover:text-white"
              }`}
            >
              {label}
            </Link>
          ))}
          {!user && guestLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="focus-outline rounded-full px-4 py-2.5 text-sm font-medium min-h-[44px] flex items-center text-white/80 transition-colors duration-200 hover:bg-white/5 hover:text-white"
            >
              {label}
            </Link>
          ))}
          {user && (
            <form action="/api/auth/logout" method="POST" className="ml-1">
              <button
                type="submit"
                className="focus-outline rounded-full px-4 py-2.5 text-sm font-medium min-h-[44px] flex items-center text-white/60 transition-colors duration-200 hover:bg-white/5 hover:text-white"
              >
                Log out
              </button>
            </form>
          )}
        </nav>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          className="focus-outline flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white/90 transition-colors duration-200 hover:bg-white/10 active:bg-white/15 md:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          <HamburgerIcon open={menuOpen} />
        </button>
      </div>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 z-40 bg-[var(--bg-base)]/98 backdrop-blur md:hidden ${menuOpen ? "visible" : "invisible pointer-events-none"}`}
        style={{ top: "var(--header-height)" }}
        aria-hidden={!menuOpen}
      >
        <nav
          className="flex flex-col gap-1 p-4 pt-6"
          aria-label="Main mobile"
        >
          {filteredLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="focus-outline flex min-h-[48px] items-center rounded-xl px-4 text-base font-medium text-white hover:bg-white/10"
            >
              {label}
            </Link>
          ))}
          {!user &&
            guestLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="focus-outline flex min-h-[48px] items-center rounded-xl px-4 text-base font-medium text-white hover:bg-white/10"
              >
                {label}
              </Link>
            ))}
          {user && (
            <form action="/api/auth/logout" method="POST" className="mt-2 border-t border-white/10 pt-4">
              <button
                type="submit"
                className="focus-outline flex min-h-[48px] w-full items-center rounded-xl px-4 text-base font-medium text-white/70 hover:bg-white/10"
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
