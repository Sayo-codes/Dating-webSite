"use client";

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
      "The creators are so responsive and real. I've tried other platforms and nothing comes close to Rsdate's quality and exclusivity.",
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
      className="rounded-2xl p-5"
      style={{
        background:
          "linear-gradient(145deg, rgba(25,18,38,0.92) 0%, rgba(14,10,22,0.96) 100%)",
        border: `1px solid rgba(255,255,255,0.08)`,
        boxShadow: `0 4px 16px rgba(0,0,0,0.4)`,
        /* No backdropFilter — too expensive on mobile (forces GPU texture per card) */
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
/*
  CSS-driven scroll: runs on the GPU compositor thread — zero JS per frame.
  Much lighter than Framer Motion's JS-driven animation on mobile.
*/
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
  const animationName = reverse ? "testimonial-scroll-up" : "testimonial-scroll-down";

  return (
    <div className={`overflow-hidden w-full ${className}`} aria-hidden={reverse}>
      <div
        className="flex flex-col gap-4 pb-4"
        style={{
          animation: `${animationName} ${duration}s linear infinite`,
          willChange: "transform",
        }}
      >
        {doubled.map((t, i) => (
          <TestimonialCard key={`${t.name}-${i}`} testimonial={t} />
        ))}
      </div>
    </div>
  );
}

/* ─── Main Export ────────────────────────────────────────────────────────────── */
export function TestimonialsColumns() {
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        height: "600px",
        /* Isolate this section from rest of page layout */
        contain: "strict",
      }}
    >
      {/* Top fade */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-24"
        style={{
          background: "linear-gradient(180deg, #07070b 0%, transparent 100%)",
        }}
      />
      {/* Bottom fade */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24"
        style={{
          background: "linear-gradient(0deg, #07070b 0%, transparent 100%)",
        }}
      />

      {/* Columns wrapper */}
      <div className="flex h-full w-full gap-4 px-2 sm:px-4">

        {/* Mobile: 1 Column — fewer cards to reduce paint area */}
        <div className="flex w-full sm:hidden">
          <TestimonialColumn testimonials={TESTIMONIALS.slice(0, 6)} duration={50} />
        </div>

        {/* Tablet: 2 Columns */}
        <div className="hidden sm:flex lg:hidden w-full gap-4">
          <TestimonialColumn
            testimonials={TESTIMONIALS.filter((_, i) => i % 2 === 0)}
            duration={35}
          />
          <TestimonialColumn
            testimonials={TESTIMONIALS.filter((_, i) => i % 2 === 1)}
            duration={45}
            reverse
          />
        </div>

        {/* Desktop: 3 Columns */}
        <div className="hidden lg:flex w-full gap-4">
          <TestimonialColumn
            testimonials={TESTIMONIALS.filter((_, i) => i % 3 === 0)}
            duration={42}
          />
          <TestimonialColumn
            testimonials={TESTIMONIALS.filter((_, i) => i % 3 === 1)}
            duration={50}
            reverse
          />
          <TestimonialColumn
            testimonials={TESTIMONIALS.filter((_, i) => i % 3 === 2)}
            duration={45}
          />
        </div>

      </div>
    </div>
  );
}
