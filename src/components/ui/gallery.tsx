"use client";

import React, { Ref, forwardRef, useState, useEffect } from "react";
import Image, { ImageProps } from "next/image";
// @ts-ignore
import { motion, useMotionValue, Variants } from "framer-motion";
import Link from "next/link";

/* ─── Types ──────────────────────────────────────────────────────────────────── */
export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  creator?: string;
  badge?: string;
  accentColor?: string;
}

interface PhotoGalleryProps {
  images: GalleryImage[];
  heading?: string;
  ctaLabel?: string;
  ctaHref?: string;
  animationDelay?: number;
}

/* ─── Helpers ────────────────────────────────────────────────────────────────── */
function getRandomNumberInRange(min: number, max: number): number {
  if (min >= max) throw new Error("Min value should be less than max value");
  return Math.random() * (max - min) + min;
}

function useIsMobile(breakpoint = 768) {
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

/* ─── MotionImage (forwardRef wrapper for next/image) ───────────────────────── */
const MotionImage = motion.create(
  forwardRef(function MotionImageInner(
    props: ImageProps,
    ref: Ref<HTMLImageElement>
  ) {
    return <Image ref={ref} {...props} />;
  })
);

const MotionDiv = motion.div as React.ComponentType<any>;

/* ─── Photo Card ─────────────────────────────────────────────────────────────── */
type Direction = "left" | "right";

function Photo({
  src,
  alt,
  className,
  direction,
  width,
  height,
  creator,
  badge,
  accentColor = "#d4a853",
  isMobile,
}: {
  src: string;
  alt: string;
  className?: string;
  direction?: Direction;
  width: number;
  height: number;
  creator?: string;
  badge?: string;
  accentColor?: string;
  isMobile: boolean;
}) {
  const [rotation, setRotation] = useState<number>(0);
  const x = useMotionValue(200);
  const y = useMotionValue(200);

  useEffect(() => {
    const randomRotation =
      getRandomNumberInRange(1, 4) * (direction === "left" ? -1 : 1);
    setRotation(randomRotation);
  }, [direction]);

  function handleMouse(event: React.MouseEvent) {
    if (isMobile) return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left);
    y.set(event.clientY - rect.top);
  }

  const resetMouse = () => {
    x.set(200);
    y.set(200);
  };

  /* ── Mobile-safe motion props ── */
  const dragProps = isMobile
    ? {}
    : {
        drag: true as const,
        dragConstraints: { left: 0, right: 0, top: 0, bottom: 0 },
      };

  const hoverAnimation = isMobile
    ? {}
    : {
        scale: 1.1,
        rotateZ: 2 * (direction === "left" ? -1 : 1),
        zIndex: 9999,
      };

  const tapAnimation = isMobile
    ? { scale: 1.04 }
    : { scale: 1.2, zIndex: 9999 };

  const dragAnimation = isMobile ? {} : { scale: 1.1, zIndex: 9999 };

  return (
    <MotionDiv
      {...dragProps}
      whileTap={tapAnimation}
      whileHover={hoverAnimation}
      whileDrag={dragAnimation}
      initial={{ rotate: 0 }}
      animate={{ rotate: rotation }}
      style={{ width, height, perspective: 400 }}
      className={`${className ?? ""} relative mx-auto shrink-0 ${
        isMobile ? "cursor-pointer" : "cursor-grab active:cursor-grabbing"
      }`}
      onMouseMove={handleMouse}
      onMouseLeave={resetMouse}
      draggable={false}
    >
      <div
        className="w-full h-full relative overflow-hidden rounded-3xl"
        style={{
          boxShadow: `0 12px 40px rgba(0,0,0,0.6), inset 0 0 0 1px ${accentColor}22`,
        }}
      >
        <MotionImage
          className="w-full h-full object-cover object-center rounded-3xl"
          fill
          src={src}
          alt={alt}
          sizes={`${width}px`}
          draggable={false}
        />

        {/* Bottom gradient for text */}
        <div
          className="absolute inset-0 pointer-events-none rounded-3xl"
          style={{
            background:
              "linear-gradient(180deg, transparent 35%, rgba(7,7,11,0.85) 100%)",
          }}
        />

        {/* Badge */}
        {badge && (
          <div
            className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[0.55rem] font-bold uppercase tracking-widest"
            style={{
              background: `${accentColor}20`,
              border: `1px solid ${accentColor}50`,
              color: accentColor,
              backdropFilter: "blur(6px)",
            }}
          >
            {badge}
          </div>
        )}

        {/* Creator name */}
        {creator && (
          <div className="absolute bottom-3 left-3 right-3">
            <p
              className="text-sm font-semibold text-white leading-tight truncate"
              style={{ textShadow: "0 1px 8px rgba(0,0,0,0.8)" }}
            >
              {creator}
            </p>
          </div>
        )}
      </div>
    </MotionDiv>
  );
}

/* ─── Main Export: PhotoGallery ───────────────────────────────────────────────── */
export function PhotoGallery({
  images,
  heading = "Featured Creators ✦",
  ctaLabel = "Browse All Creators ✦",
  ctaHref = "/creators",
  animationDelay = 0.5,
}: PhotoGalleryProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const isMobile = useIsMobile(768);

  useEffect(() => {
    const visibilityTimer = setTimeout(() => {
      setIsVisible(true);
    }, animationDelay * 1000);

    const animationTimer = setTimeout(() => {
      setIsLoaded(true);
    }, (animationDelay + 0.4) * 1000);

    return () => {
      clearTimeout(visibilityTimer);
      clearTimeout(animationTimer);
    };
  }, [animationDelay]);

  const containerVariants: Variants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: isMobile ? 0.08 : 0.15,
        delayChildren: 0.1,
      },
    },
  };

  /* ── Build photo layout from images data ── */
  const cardWidth = isMobile ? 160 : 220;
  const cardHeight = (cardWidth * 14) / 10;
  const gap = isMobile ? 120 : 160;
  const totalWidth = (images.length - 1) * gap;

  const photos = images.map((img, i) => {
    const xOffset = -totalWidth / 2 + i * gap;
    const yWave = Math.sin((i / (images.length - 1)) * Math.PI) * 20 + 10;
    return {
      ...img,
      order: i,
      x: `${xOffset}px`,
      y: `${yWave}px`,
      zIndex: images.length - i,
      direction: (i % 2 === 0 ? "left" : "right") as Direction,
    };
  });

  const photoVariants: Variants = {
    hidden: {
      x: 0,
      y: 0,
      rotate: 0,
      scale: 1,
    },
    visible: (custom: { x: string; y: string; order: number }) => ({
      x: custom.x,
      y: custom.y,
      rotate: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: isMobile ? 40 : 70,
        damping: isMobile ? 16 : 12,
        mass: isMobile ? 0.6 : 1,
        delay: custom.order * (isMobile ? 0.08 : 0.15),
      },
    }),
  };

  return (
    <section
      className="relative overflow-hidden"
      aria-labelledby="gallery-heading"
    >
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
      <div className="relative z-10 px-4 text-center sm:px-6 lg:px-10">
        <p className="section-heading mb-2 flex items-center justify-center gap-2">
          ✦ Exclusive Profiles
        </p>
        <h2
          id="gallery-heading"
          className="z-20 mx-auto max-w-2xl justify-center py-3 text-center font-[var(--font-heading)] text-3xl font-bold sm:text-4xl md:text-5xl lg:text-6xl"
        >
          <span className="text-white">
            {heading.replace(" ✦", "")}
          </span>{" "}
          <span
            style={{
              background:
                "linear-gradient(135deg, #f0c97a 0%, #d4a853 40%, #ff2d78 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            ✦
          </span>
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-white/50">
          Handpicked profiles from our most sought-after creators. Premium
          connections, total discretion.
        </p>
      </div>

      {/* ── Fan-out card stack ── */}
      <div className="relative mb-8 h-[350px] w-full items-center justify-center lg:flex">
        <MotionDiv
          className="relative mx-auto flex w-full max-w-7xl justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <MotionDiv
            className="relative flex w-full justify-center"
            variants={containerVariants}
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
          >
            <div
              className="relative"
              style={{ height: cardHeight, width: cardWidth }}
            >
              {[...photos].reverse().map((photo) => (
                <MotionDiv
                  key={photo.id}
                  className="absolute left-0 top-0"
                  style={{ zIndex: photo.zIndex }}
                  variants={photoVariants}
                  custom={{
                    x: photo.x,
                    y: photo.y,
                    order: photo.order,
                  }}
                >
                  <Photo
                    width={cardWidth}
                    height={cardHeight}
                    src={photo.src}
                    alt={photo.alt}
                    direction={photo.direction}
                    creator={photo.creator}
                    badge={photo.badge}
                    accentColor={photo.accentColor}
                    isMobile={isMobile}
                  />
                </MotionDiv>
              ))}
            </div>
          </MotionDiv>
        </MotionDiv>
      </div>

      {/* ── CTA Button ── */}
      <div className="relative z-10 flex w-full justify-center">
        <Link
          href={ctaHref}
          id="gallery-cta"
          className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold text-white transition-all duration-300 focus-outline"
          style={{
            background: "linear-gradient(135deg, #d4a853 0%, #ff2d78 100%)",
            boxShadow:
              "0 0 28px rgba(212,168,83,0.4), 0 4px 16px rgba(0,0,0,0.4)",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget;
            el.style.boxShadow =
              "0 0 44px rgba(212,168,83,0.65), 0 8px 24px rgba(0,0,0,0.5)";
            el.style.transform = "scale(1.03) translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget;
            el.style.boxShadow =
              "0 0 28px rgba(212,168,83,0.4), 0 4px 16px rgba(0,0,0,0.4)";
            el.style.transform = "scale(1) translateY(0)";
          }}
        >
          {ctaLabel}
        </Link>
      </div>
    </section>
  );
}
