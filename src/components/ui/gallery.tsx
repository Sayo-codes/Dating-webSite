"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from "motion/react";
import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useEffect, useRef, useState } from "react";

/* ─── Types ──────────────────────────────────────────────────────────────────── */
export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  /** Creator name displayed on the card */
  creator?: string;
  /** e.g. "Verified ✦ Elite"  */
  badge?: string;
  /** Accent colour for the card glow (defaults to gold) */
  accentColor?: string;
}

interface PhotoGalleryProps {
  images: GalleryImage[];
  /** Section heading; default "Featured Creators ✦" */
  heading?: string;
  /** CTA button label; default "Browse All Creators ✦" */
  ctaLabel?: string;
  /** CTA button href; default "/creators" */
  ctaHref?: string;
}

/* ─── Helpers ─────────────────────────────────────────────────────────────────── */
const clamp = (n: number, min: number, max: number) =>
  Math.min(Math.max(n, min), max);

function useMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [breakpoint]);
  return isMobile;
}

/* ─── Single Card ─────────────────────────────────────────────────────────────── */
function GalleryCard({
  image,
  index,
  total,
  onClick,
  isMobile,
}: {
  image: GalleryImage;
  index: number;
  total: number;
  onClick: (id: string) => void;
  isMobile: boolean;
}) {
  const accent = image.accentColor ?? "#d4a853";

  /* Spread cards in an arc */
  const spread = isMobile ? 8 : 14;
  const baseRotate = ((index - (total - 1) / 2) / (total - 1)) * spread;

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  /* Softer spring config on mobile */
  const springCfg = isMobile
    ? { stiffness: 120, damping: 22, mass: 0.8 }
    : { stiffness: 220, damping: 28, mass: 1 };

  const rotateX = useSpring(useTransform(y, [-80, 80], [6, -6]), springCfg);
  const rotateY = useSpring(useTransform(x, [-80, 80], [-8, 8]), springCfg);
  const scale = useSpring(1, springCfg);
  const z = useSpring(0, springCfg);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isMobile) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      x.set(clamp(e.clientX - cx, -80, 80));
      y.set(clamp(e.clientY - cy, -80, 80));
    },
    [isMobile, x, y]
  );

  const handleMouseEnter = useCallback(() => {
    if (isMobile) return;
    scale.set(1.06);
    z.set(30);
  }, [isMobile, scale, z]);

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
    scale.set(1);
    z.set(0);
  }, [x, y, scale, z]);

  /* Staggered entrance */
  const enterDelay = index * 0.07;

  return (
    <motion.div
      className="relative flex-shrink-0 cursor-pointer select-none"
      style={{
        width: isMobile ? 160 : 200,
        height: isMobile ? 230 : 280,
        zIndex: z,
        originX: 0.5,
        originY: 1,
      }}
      initial={{ opacity: 0, y: isMobile ? 20 : 40, rotate: baseRotate }}
      animate={{ opacity: 1, y: 0, rotate: baseRotate }}
      transition={{
        delay: enterDelay,
        duration: isMobile ? 0.4 : 0.6,
        ease: [0.33, 1, 0.68, 1],
      }}
      whileHover={isMobile ? {} : { rotate: 0, zIndex: 50 }}
      onClick={() => onClick(image.id)}
      aria-label={`View ${image.creator ?? image.alt}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick(image.id)}
    >
      <motion.div
        style={{
          rotateX: isMobile ? 0 : rotateX,
          rotateY: isMobile ? 0 : rotateY,
          scale,
          perspective: 800,
          width: "100%",
          height: "100%",
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative rounded-2xl overflow-hidden"
      >
        {/* Photo */}
        <Image
          src={image.src}
          alt={image.alt}
          fill
          className="object-cover object-top"
          sizes="(max-width: 768px) 160px, 200px"
          draggable={false}
        />

        {/* Gradient overlay – bottom fade */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, transparent 40%, rgba(7,7,11,0.85) 100%)",
          }}
        />

        {/* Accent glow border */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            boxShadow: `inset 0 0 0 1px ${accent}33, 0 8px 32px rgba(0,0,0,0.5)`,
          }}
        />

        {/* Shimmer sheen */}
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-2xl"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 60%)",
            originX: 0,
          }}
          initial={{ opacity: 0 }}
          whileHover={{ opacity: isMobile ? 0 : 1 }}
          transition={{ duration: 0.25 }}
        />

        {/* Badge */}
        {image.badge && (
          <div
            className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[0.55rem] font-bold uppercase tracking-widest"
            style={{
              background: `${accent}20`,
              border: `1px solid ${accent}50`,
              color: accent,
              backdropFilter: "blur(6px)",
            }}
          >
            {image.badge}
          </div>
        )}

        {/* Creator name */}
        {image.creator && (
          <div className="absolute bottom-3 left-3 right-3">
            <p
              className="text-sm font-semibold text-white leading-tight truncate"
              style={{ textShadow: "0 1px 8px rgba(0,0,0,0.8)" }}
            >
              {image.creator}
            </p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ─── Lightbox ────────────────────────────────────────────────────────────────── */
function Lightbox({
  image,
  onClose,
}: {
  image: GalleryImage;
  onClose: () => void;
}) {
  const accent = image.accentColor ?? "#d4a853";

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Viewing ${image.creator ?? image.alt}`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{ background: "rgba(7,7,11,0.92)", backdropFilter: "blur(16px)" }}
      />

      {/* Card */}
      <motion.div
        className="relative z-10 rounded-3xl overflow-hidden"
        style={{
          width: "min(90vw, 420px)",
          aspectRatio: "3/4",
          boxShadow: `0 32px 80px rgba(0,0,0,0.8), 0 0 60px ${accent}30`,
          border: `1px solid ${accent}40`,
        }}
        initial={{ scale: 0.88, opacity: 0, y: 24 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.88, opacity: 0, y: 24 }}
        transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={image.src}
          alt={image.alt}
          fill
          className="object-cover object-top"
          sizes="420px"
          priority
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, transparent 45%, rgba(7,7,11,0.9) 100%)",
          }}
        />
        {image.creator && (
          <div className="absolute bottom-5 left-5 right-5">
            {image.badge && (
              <span
                className="inline-block mb-1.5 px-2.5 py-0.5 rounded-full text-[0.6rem] font-bold uppercase tracking-widest"
                style={{
                  background: `${accent}25`,
                  border: `1px solid ${accent}55`,
                  color: accent,
                }}
              >
                {image.badge}
              </span>
            )}
            <p className="text-lg font-bold text-white">{image.creator}</p>
          </div>
        )}

        {/* Close button */}
        <button
          className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-colors"
          style={{
            background: "rgba(7,7,11,0.7)",
            border: "1px solid rgba(255,255,255,0.12)",
            backdropFilter: "blur(8px)",
          }}
          onClick={onClose}
          aria-label="Close preview"
        >
          ✕
        </button>
      </motion.div>
    </motion.div>
  );
}

/* ─── Main Export ─────────────────────────────────────────────────────────────── */
export function PhotoGallery({
  images,
  heading = "Featured Creators ✦",
  ctaLabel = "Browse All Creators ✦",
  ctaHref = "/creators",
}: PhotoGalleryProps) {
  const isMobile = useMobile(768);
  const [activeId, setActiveId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeImage = images.find((img) => img.id === activeId) ?? null;

  /* ── Drag-to-scroll (desktop only) ── */
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (isMobile) return;
      isDragging.current = true;
      startX.current = e.pageX - (containerRef.current?.offsetLeft ?? 0);
      scrollLeft.current = containerRef.current?.scrollLeft ?? 0;
      containerRef.current?.setPointerCapture(e.pointerId);
    },
    [isMobile]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging.current || isMobile) return;
      const x = e.pageX - (containerRef.current?.offsetLeft ?? 0);
      const walk = (x - startX.current) * 1.2;
      if (containerRef.current) {
        containerRef.current.scrollLeft = scrollLeft.current - walk;
      }
    },
    [isMobile]
  );

  const onPointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  return (
    <section className="relative overflow-hidden" aria-labelledby="gallery-heading">
      {/* ── Ambient glows ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/3 h-[500px] w-[500px] rounded-full opacity-[0.07] blur-[140px]"
        style={{ background: "#d4a853" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 right-1/4 h-[400px] w-[400px] rounded-full opacity-[0.06] blur-[120px]"
        style={{ background: "#ff2d78" }}
      />

      {/* ── Section header ── */}
      <div className="relative z-10 px-4 text-center sm:px-6 lg:px-10 mb-10 sm:mb-14">
        <p className="section-heading mb-2 flex items-center justify-center gap-2">
          ✦ Exclusive Profiles
        </p>
        <h2
          id="gallery-heading"
          className="font-[var(--font-heading)] text-2xl font-bold sm:text-3xl lg:text-4xl"
        >
          {heading.includes("✦") ? (
            <>
              {heading.replace(" ✦", "")}{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #f0c97a, #d4a853, #ff2d78)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                ✦
              </span>
            </>
          ) : (
            heading
          )}
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/50">
          Handpicked profiles from our most sought-after creators. Premium
          connections, total discretion.
        </p>
      </div>

      {/* ── Card strip ── */}
      <div
        ref={containerRef}
        className="relative z-10 flex items-end justify-start sm:justify-center gap-4 sm:gap-5 px-6 sm:px-10 pb-8 overflow-x-auto scrollbar-none"
        style={{
          cursor: isMobile ? "default" : isDragging.current ? "grabbing" : "grab",
          perspectiveOrigin: "50% 100%",
          perspective: 1200,
          /* hide scrollbar cross-browser */
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {images.map((img, i) => (
          <GalleryCard
            key={img.id}
            image={img}
            index={i}
            total={images.length}
            onClick={setActiveId}
            isMobile={isMobile}
          />
        ))}
      </div>

      {/* ── CTA ── */}
      <div className="relative z-10 mt-8 flex justify-center px-4">
        <Link
          href={ctaHref}
          id="gallery-cta"
          className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold text-white transition-all duration-250 focus-outline"
          style={{
            background: "linear-gradient(135deg, #d4a853 0%, #ff2d78 100%)",
            boxShadow: "0 0 28px rgba(212,168,83,0.4), 0 4px 16px rgba(0,0,0,0.4)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.boxShadow =
              "0 0 44px rgba(212,168,83,0.65), 0 8px 24px rgba(0,0,0,0.5)";
            (e.currentTarget as HTMLAnchorElement).style.transform =
              "scale(1.03) translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.boxShadow =
              "0 0 28px rgba(212,168,83,0.4), 0 4px 16px rgba(0,0,0,0.4)";
            (e.currentTarget as HTMLAnchorElement).style.transform =
              "scale(1) translateY(0)";
          }}
        >
          {ctaLabel}
        </Link>
      </div>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {activeImage && (
          <Lightbox image={activeImage} onClose={() => setActiveId(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
