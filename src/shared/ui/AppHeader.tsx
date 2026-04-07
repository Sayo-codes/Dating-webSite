"use client";

import Link from "next/image";
import LinkNext from "next/link";
import { useState, useEffect } from "react";

/**
 * Minimal, ultra-smooth premium brand header for Rsdate.
 * Strictly features the logo and a "Sign Up / Login" or "Explore" CTA.
 * No mobile hamburger menus, no account dropdowns.
 */
export function AppHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => setIsLoggedIn(r.ok))
      .catch(() => setIsLoggedIn(false));
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[60] flex h-16 items-center border-b transition-all duration-500 ease-in-out ${
        scrolled 
          ? "bg-[#0a0a0f]/95 border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl" 
          : "bg-transparent border-transparent"
      }`}
      style={{
        transform: "translateZ(0)",
        willChange: "transform, background-color, border-color, backdrop-filter",
      }}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-10">
        
        {/* Logo - Minimal & Premium */}
        <LinkNext
          href="/"
          className="flex items-center gap-2.5 transition-transform hover:scale-[1.02] active:scale-[0.98]"
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
        </LinkNext>

        {/* Minimal Action Item */}
        <div>
          {isLoggedIn ? (
            <LinkNext 
              href="/creators"
              className="text-xs font-bold uppercase tracking-[0.2em] text-[#f0c97a] transition-all hover:text-white"
            >
              ✦ Explore
            </LinkNext>
          ) : (
             <LinkNext 
              href="/register" 
              className="rounded-full bg-gradient-to-r from-[#d4a853] to-[#ff2d78] px-5 py-2 text-xs font-bold uppercase tracking-widest text-white shadow-lg transition-transform hover:scale-105"
            >
              Join ✦
            </LinkNext>
          )}
        </div>

      </div>
    </header>
  );
}
