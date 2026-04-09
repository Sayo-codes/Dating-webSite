"use client";

import LinkNext from "next/link";
import { useState, useEffect, useRef } from "react";

/**
 * Ultra-minimal Rsdate Brand Bar.
 * Strictly features ONLY the logo.
 * Implements "Swipe Up to Hide" logic:
 * - When scrolling down: header hides (swipes up).
 * - When scrolling up: header reveals (swipes down).
 * GPU-accelerated for max performance and butter-smooth transitions.
 */
export function AppHeader() {
  const [isVisible, setIsVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // 1. Transparency logic (more than 10px scroll)
      setScrolled(currentScrollY > 10);

      // 2. Visibility logic (Swipe Up to Hide)
      // Show if scrolling up, hide if scrolling down (and past the header height)
      if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[60] flex h-16 items-center border-b transition-all duration-500 ease-in-out ${
        scrolled 
          ? "bg-[#0a0a0f]/95 border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl" 
          : "bg-transparent border-transparent"
      }`}
      style={{
        // Hardware acceleration for ultra-smooth hide/reveal transition
        transform: isVisible ? "translate3d(0, 0, 0)" : "translate3d(0, -100%, 0)",
        willChange: "transform, background-color, border-color, backdrop-filter",
      }}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-center px-4 sm:px-6 lg:px-10">
        
        {/* Logo - Minimal & Centered for absolute brand focus */}
        <LinkNext
          href="/"
          prefetch={true}
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

      </div>
    </header>
  );
}
