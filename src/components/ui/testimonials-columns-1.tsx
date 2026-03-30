"use client";

import { motion } from "motion/react";
import Image from "next/image";
import React from "react";

/* ─── Types ─────────────────────────────────────────────────────────────────── */
interface Testimonial {
  name: string;
  location: string;
  quote: string;
  rating: number;
  avatar: string;
  verified?: boolean;
  accentColor?: string;
}

/* ─── Data ───────────────────────────────────────────────────────────────────── */
export const TESTIMONIALS: Testimonial[] = [
  {
    name: "James M.",
    location: "New York, USA",
    quote:
      "This platform is genuinely incredible. The creators are attentive, real, and the private chat quality is unlike anything else. Worth every penny.",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    verified: true,
    accentColor: "#d4a853",
  },
  {
    name: "Carlos R.",
    location: "Miami, USA",
    quote:
      "I was skeptical at first, but the verification and privacy made all the difference. The experience is luxurious and discreet. Highly recommend.",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    verified: true,
    accentColor: "#ff2d78",
  },
  {
    name: "Alex T.",
    location: "London, UK",
    quote:
      "The creators are so responsive and real. I've tried other platforms and nothing comes close to Velvet Signal's quality and exclusivity.",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    verified: true,
    accentColor: "#c778ff",
  },
  {
    name: "David R.",
    location: "Dubai, UAE",
    quote:
      "Elite experience from start to finish. The support team is amazingly helpful and the VIP tier gets you access to incredible talent.",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=face",
    verified: true,
    accentColor: "#d4a853",
  },
  {
    name: "Marcus S.",
    location: "Sydney, Australia",
    quote:
      "I appreciate how private and secure everything feels. Premium interface, real connections, zero drama. This is the gold standard.",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1463453091185-61582044d556?w=100&h=100&fit=crop&crop=face",
    verified: true,
    accentColor: "#ff2d78",
  },
  {
    name: "Thomas H.",
    location: "Amsterdam, NL",
    quote:
      "Signed up three months ago and never looked back. The featured creators are exceptional and the platform keeps getting better every week.",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=100&h=100&fit=crop&crop=face",
    verified: true,
    accentColor: "#d4a853",
  },
  {
    name: "Ryan K.",
    location: "Toronto, Canada",
    quote:
      "The security features and anonymity controls are unmatched. I feel completely safe and the quality of connections is extraordinary.",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&h=100&fit=crop&crop=face",
    verified: true,
    accentColor: "#c778ff",
  },
  {
    name: "Luca M.",
    location: "Milan, Italy",
    quote:
      "Pure luxury from the moment you log in. The design, the creators, the experience — everything exudes class. Worth every subscription cent.",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop&crop=face",
    verified: true,
    accentColor: "#ff2d78",
  },
  {
    name: "Daniel W.",
    location: "Berlin, Germany",
    quote:
      "I've been a member for six months and the experience is consistently top-tier. Genuine connections, beautiful interface, unbeatable privacy.",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face",
    verified: true,
    accentColor: "#d4a853",
  },
];

/* ─── Star Rating ────────────────────────────────────────────────────────────── */
function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} style={{ color: "#d4a853" }} aria-hidden>
          ★
        </span>
      ))}
    </div>
  );
}

/* ─── Single Card ────────────────────────────────────────────────────────────── */
function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const accent = testimonial.accentColor ?? "#d4a853";
  return (
    <div
      className="mb-4 rounded-2xl p-5 transition-all duration-300 hover:scale-[1.02]"
      style={{
        background:
          "linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)",
        border: `1px solid rgba(255,255,255,0.08)`,
        boxShadow: `0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)`,
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Stars */}
      <StarRating count={testimonial.rating} />

      {/* Quote */}
      <p className="mt-3 text-sm leading-relaxed italic" style={{ color: "rgba(255,255,255,0.72)" }}>
        &ldquo;{testimonial.quote}&rdquo;
      </p>

      {/* Author */}
      <div className="mt-4 flex items-center gap-3">
        {/* Avatar */}
        <div
          className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full"
          style={{ border: `1.5px solid ${accent}55` }}
        >
          <Image
            src={testimonial.avatar}
            alt={testimonial.name}
            fill
            className="object-cover"
            sizes="40px"
          />
        </div>

        {/* Name + location */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-sm font-semibold text-white leading-none">
              {testimonial.name}
            </span>
            {testimonial.verified && (
              <span
                className="shrink-0 rounded-full px-1.5 py-0.5 text-[0.5rem] font-bold uppercase tracking-wider"
                style={{
                  background: `${accent}18`,
                  border: `1px solid ${accent}30`,
                  color: accent,
                }}
              >
                ✓ Verified
              </span>
            )}
          </div>
          <p className="mt-0.5 text-xs" style={{ color: "rgba(255,255,255,0.38)" }}>
            {testimonial.location}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── Animated Column ────────────────────────────────────────────────────────── */
function TestimonialColumn({
  testimonials,
  duration = 30,
  reverse = false,
  className = "",
}: {
  testimonials: Testimonial[];
  duration?: number;
  reverse?: boolean;
  className?: string;
}) {
  // Duplicate for seamless loop
  const doubled = [...testimonials, ...testimonials];

  return (
    <div className={`overflow-hidden ${className}`} aria-hidden={reverse}>
      <motion.div
        animate={{ y: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{
          duration,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
      >
        {doubled.map((t, i) => (
          <TestimonialCard key={`${t.name}-${i}`} testimonial={t} />
        ))}
      </motion.div>
    </div>
  );
}

/* ─── Main Export ────────────────────────────────────────────────────────────── */
export function TestimonialsColumns() {
  // Split into three columns
  const col1 = TESTIMONIALS.slice(0, 3);
  const col2 = TESTIMONIALS.slice(3, 6);
  const col3 = TESTIMONIALS.slice(6, 9);

  return (
    <div className="relative w-full overflow-hidden" style={{ height: "560px" }}>
      {/* Top fade */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-20"
        style={{
          background: "linear-gradient(180deg, #07070b 0%, transparent 100%)",
        }}
      />
      {/* Bottom fade */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-20"
        style={{
          background: "linear-gradient(0deg, #07070b 0%, transparent 100%)",
        }}
      />

      {/* Columns grid — 1 on mobile, 2 on sm, 3 on lg */}
      <div className="h-full grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 px-1">
        <TestimonialColumn testimonials={col1} duration={28} />
        {/* 2nd column: hidden on mobile, visible on sm+ */}
        <TestimonialColumn
          testimonials={col2}
          duration={34}
          reverse
          className="hidden sm:block"
        />
        {/* 3rd column: hidden on mobile+sm, visible on lg+ */}
        <TestimonialColumn
          testimonials={col3}
          duration={30}
          className="hidden lg:block"
        />
      </div>
    </div>
  );
}
