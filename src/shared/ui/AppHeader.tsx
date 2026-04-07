"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { MessageCircle, Menu, X, CircleUser, Bell, LogOut, Compass, LayoutDashboard, ShieldCheck } from "lucide-react";

export function AppHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [user, setUser] = useState<{ id: string; username: string; email: string; role: string; avatarUrl: string | null } | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setUser(data?.user ?? null))
      .catch(() => setUser(null));
  }, []);

  useEffect(() => {
    if (!user) return;
    async function fetchUnread() {
      try {
        const res = await fetch("/api/conversations/unread-count");
        if (res.ok) {
          const data = (await res.json()) as { count: number };
          setUnreadCount(data.count ?? 0);
        }
      } catch { /* ignore */ }
    }
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menus on path change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  // Click outside to close user menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { href: "/creators", label: "Explore", icon: Compass },
    ...(user?.role === "creator" ? [{ href: "/creator/dashboard", label: "Dashboard", icon: LayoutDashboard }] : []),
    ...(user?.role === "admin" ? [{ href: "/admin/messages", label: "Admin", icon: ShieldCheck }] : []),
  ];

  const hasAvatar = Boolean(user?.avatarUrl?.trim());

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[60] transition-all duration-500 ease-in-out border-b ${
        scrolled || mobileMenuOpen 
          ? "bg-[#0a0a0f]/95 border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl" 
          : "bg-transparent border-transparent"
      }`}
      style={{
        transform: "translateZ(0)",
        willChange: "transform, background-color, border-color, backdrop-filter",
      }}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
        
        {/* Logo */}
        <Link
          href="/"
          className="relative z-50 flex items-center gap-2.5 transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl shadow-[0_0_15px_rgba(212,168,83,0.3)]"
            style={{ background: "linear-gradient(135deg, #d4a853 0%, #ff2d78 100%)" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 9l10 13 10-13L12 2z" fill="white" />
              <path d="M2 9h20M7 2l-5 7 10 13M17 2l5 7-10 13" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
            </svg>
          </span>
          <span className="font-[var(--font-heading)] text-2xl font-bold tracking-tight bg-gradient-to-r from-[#f0c97a] via-[#d4a853] to-[#ff2d78] bg-clip-text text-transparent" style={{ WebkitBackgroundClip: "text" }}>
            Rsdate
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-2 md:flex">
          {user && navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
                pathname === href
                  ? "bg-[#d4a853]/15 text-[#f0c97a] ring-1 ring-[#d4a853]/30"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {user ? (
            <>
              {/* Messages */}
              <Link
                href="/messages"
                className={`relative flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 ${
                  pathname === "/messages" ? "bg-[#ff2d78]/10 text-[#ff2d78]" : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                <MessageCircle size={22} strokeWidth={2} />
                {unreadCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-[#ff2d78] px-1 text-[10px] font-bold text-white shadow-lg animate-pulse">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </Link>

              {/* User Dropdown (Desktop) */}
              <div className="relative hidden md:block" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/5 transition-all hover:border-[#d4a853]/50"
                >
                  {hasAvatar ? (
                    <Image src={user.avatarUrl!} alt="" fill className="object-cover" unoptimized />
                  ) : (
                    <CircleUser size={24} className="text-[#d4a853]" strokeWidth={1.5} />
                  )}
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-3 w-56 transform overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0f]/95 p-1.5 shadow-2xl backdrop-blur-2xl transition-all animate-in fade-in slide-in-from-top-2">
                    <div className="px-3 py-2 border-b border-white/5 mb-1">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">Logged in as</p>
                      <p className="text-sm font-medium text-white truncate">{user.email}</p>
                    </div>
                    <form action="/api/auth/logout" method="POST">
                      <button type="submit" className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/60 transition-colors hover:bg-white/5 hover:text-white">
                        <LogOut size={16} /> Log out
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="hidden items-center gap-3 sm:flex">
              <Link href="/login" className="px-4 py-2 text-sm font-semibold text-white/80 hover:text-white transition-colors">
                Login
              </Link>
              <Link href="/register" className="pill-button-primary rounded-full px-6 py-2 text-sm font-bold shadow-lg transition-transform hover:scale-105 active:scale-95">
                Sign Up ✦
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/5 hover:text-white md:hidden"
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-16 z-[55] bg-[#07070b]/98 backdrop-blur-3xl animate-in fade-in md:hidden">
          <nav className="flex flex-col p-6 gap-2">
            {!user && (
              <div className="grid grid-cols-2 gap-4 mb-8">
                <Link href="/login" className="flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 py-4 text-sm font-bold text-white">
                  Login
                </Link>
                <Link href="/register" className="pill-button-primary flex items-center justify-center rounded-2xl py-4 text-sm font-bold shadow-xl">
                  Sign Up ✦
                </Link>
              </div>
            )}
            
            {user && navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-4 rounded-2xl px-5 py-4 text-lg font-bold transition-all ${
                  pathname === href ? "bg-[#d4a853]/10 text-[#f0c97a] ring-1 ring-[#d4a853]/20" : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={22} className={pathname === href ? "text-[#f0c97a]" : "text-white/30"} />
                {label}
              </Link>
            ))}

            {user && (
              <div className="mt-auto pt-8 border-t border-white/10">
                <div className="px-5 mb-6">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20">Account</p>
                  <p className="text-white/80 font-medium truncate">{user.email}</p>
                </div>
                <form action="/api/auth/logout" method="POST">
                  <button type="submit" className="flex w-full items-center gap-4 rounded-2xl px-5 py-4 text-lg font-bold text-red-500 transition-colors hover:bg-red-500/5">
                    <LogOut size={22} /> Log out
                  </button>
                </form>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
