"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

/* ─── Animation Variants ─────────────────────────────────────────────────────── */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const imageVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const floatingVariants = {
  animate: {
    y: [0, -8, 0],
    transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
  },
};

/* ─── Data ────────────────────────────────────────────────────────────────────── */
const STATS = [
  { value: "18,230+", label: "Members", icon: "👥" },
  { value: "100%", label: "Face-Verified", icon: "✓" },
  { value: "92%", label: "Response Rate", icon: "💬" },
];

const IMAGES = [
  "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=500&h=650&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&h=650&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&h=650&fit=crop&crop=face",
];

/* ─── Component ───────────────────────────────────────────────────────────────── */
export function HeroSection() {
  return (
    <section
      className="relative w-full overflow-hidden py-16 sm:py-24 lg:py-32"
      style={{ background: "#07070b" }}
      aria-labelledby="hero-heading"
    >
      {/* ── Background atmospheric glows ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-[10%] top-[10%] h-[600px] w-[600px] rounded-full opacity-[0.12] blur-[160px]"
        style={{
          background:
            "radial-gradient(circle, #d4a853 0%, transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-[5%] top-[20%] h-[500px] w-[500px] rounded-full opacity-[0.09] blur-[140px]"
        style={{
          background:
            "radial-gradient(circle, #ff2d78 0%, transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[5%] left-[40%] h-[400px] w-[400px] rounded-full opacity-[0.07] blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, #c778ff 0%, transparent 70%)",
        }}
      />

      {/* ── Main grid layout ── */}
      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-10">
        {/* ─── Left Column: Text ─── */}
        <motion.div
          className="flex flex-col items-center text-center lg:items-start lg:text-left"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Tagline badge */}
          <motion.div variants={itemVariants} className="mb-6">
            <span
              className="inline-flex items-center gap-2 rounded-full border px-5 py-2 text-xs font-semibold uppercase tracking-[0.22em]"
              style={{
                borderColor: "rgba(212,168,83,0.4)",
                background: "rgba(212,168,83,0.08)",
                color: "#f0c97a",
                backdropFilter: "blur(12px)",
              }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{
                  background: "#3dff9a",
                  boxShadow: "0 0 8px rgba(61,255,154,0.9)",
                  animation: "pulse-online 2s ease-in-out infinite",
                }}
              />
              Private · Exclusive · Verified
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            id="hero-heading"
            className="font-[var(--font-heading)] text-5xl font-bold leading-[1.08] tracking-[-0.03em] text-white sm:text-6xl lg:text-7xl"
            variants={itemVariants}
            style={{ textShadow: "0 2px 40px rgba(0,0,0,0.5)" }}
          >
            Find Your{" "}
            <span
              style={{
                background:
                  "linear-gradient(135deg, #f0c97a 0%, #d4a853 35%, #ff2d78 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Spark ✦
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="mt-6 max-w-lg text-lg leading-relaxed sm:text-xl"
            style={{
              color: "rgba(255,255,255,0.7)",
              textShadow: "0 1px 20px rgba(0,0,0,0.4)",
            }}
            variants={itemVariants}
          >
            Meet high-quality creators &amp; genuine connections in
            a&nbsp;luxurious,&nbsp;safe space.{" "}
            <span style={{ color: "rgba(255,255,255,0.9)" }}>
              Private. Exclusive. Verified.
            </span>
          </motion.p>

          {/* Feature line */}
          <motion.p
            className="mt-4 flex items-center gap-2 text-base font-medium tracking-wide sm:text-lg"
            style={{
              background:
                "linear-gradient(135deg, #f0c97a 0%, #ff6fa3 50%, #ff2d78 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
            variants={itemVariants}
          >
            <span
              style={{
                WebkitTextFillColor: "initial",
                filter: "none",
              }}
            >
              🚀
            </span>
            Non-stop fun 24h — Connect with models anytime on Rsdate
          </motion.p>

          {/* CTA Button */}
          <motion.div
            className="mt-10 flex flex-wrap justify-center gap-4 lg:justify-start"
            variants={itemVariants}
          >
            <Link
              href="/register"
              id="hero-cta-primary"
              className="pill-button-primary focus-outline inline-flex min-h-[58px] w-full items-center justify-center rounded-full px-10 text-base font-bold tracking-wide sm:w-auto sm:text-lg"
            >
              Join Here ✦
            </Link>
          </motion.div>

          {/* Trust line */}
          <motion.p
            className="mt-6 text-xs font-medium uppercase tracking-wide sm:text-sm"
            style={{ color: "rgba(255,255,255,0.35)" }}
            variants={itemVariants}
          >
            Over 18,000 members &nbsp;·&nbsp; Verified profiles &nbsp;·&nbsp;
            100% private
          </motion.p>

          {/* Stats */}
          <motion.div
            className="mt-12 flex flex-wrap justify-center gap-8 lg:justify-start"
            variants={itemVariants}
          >
            {STATS.map((stat, index) => (
              <div key={index} className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full text-base"
                  style={{
                    background: "rgba(212,168,83,0.12)",
                    border: "1px solid rgba(212,168,83,0.25)",
                    color: "#d4a853",
                  }}
                >
                  {stat.icon}
                </div>
                <div>
                  <p
                    className="font-[var(--font-heading)] text-xl font-bold tabular-nums"
                    style={{
                      background:
                        "linear-gradient(135deg, #f0c97a, #d4a853)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {stat.value}
                  </p>
                  <p
                    className="text-xs uppercase tracking-widest"
                    style={{ color: "rgba(255,255,255,0.4)" }}
                  >
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* ─── Right Column: Image Collage ─── */}
        <motion.div
          className="relative mx-auto h-[420px] w-full max-w-lg sm:h-[540px] lg:mx-0 lg:max-w-none"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Decorative floating glows */}
          <motion.div
            className="absolute -top-4 left-1/4 h-16 w-16 rounded-full"
            style={{ background: "rgba(255,45,120,0.2)" }}
            variants={floatingVariants}
            animate="animate"
          />
          <motion.div
            className="absolute bottom-0 right-1/4 h-12 w-12 rounded-lg"
            style={{ background: "rgba(199,120,255,0.2)" }}
            variants={floatingVariants}
            animate="animate"
          />
          <motion.div
            className="absolute right-[10%] top-[15%] h-10 w-10 rounded-full"
            style={{ background: "rgba(212,168,83,0.2)" }}
            variants={floatingVariants}
            animate="animate"
          />

          {/* Main Center Image — largest */}
          <motion.div
            className="absolute left-1/2 top-0 -translate-x-1/2 overflow-hidden rounded-2xl"
            style={{
              width: "clamp(200px, 55%, 280px)",
              height: "clamp(260px, 65%, 350px)",
              border: "1px solid rgba(212,168,83,0.25)",
              boxShadow:
                "0 24px 60px rgba(0,0,0,0.6), 0 0 30px rgba(212,168,83,0.12)",
            }}
            variants={imageVariants}
          >
            <div className="relative h-full w-full overflow-hidden rounded-2xl p-1">
              <div className="relative h-full w-full overflow-hidden rounded-xl">
                <Image
                  src={IMAGES[0]}
                  alt="Featured creator portrait"
                  fill
                  className="object-cover object-top"
                  sizes="280px"
                  priority
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, transparent 50%, rgba(7,7,11,0.7) 100%)",
                  }}
                />
              </div>
            </div>
            {/* Badge overlay */}
            <div
              className="absolute bottom-3 left-3 right-3 flex items-center gap-1.5"
            >
              <span
                className="rounded-full px-2 py-0.5 text-[0.55rem] font-bold uppercase tracking-widest"
                style={{
                  background: "rgba(212,168,83,0.2)",
                  border: "1px solid rgba(212,168,83,0.4)",
                  color: "#d4a853",
                  backdropFilter: "blur(6px)",
                }}
              >
                Verified ✦ Elite
              </span>
            </div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            className="absolute right-0 overflow-hidden rounded-2xl sm:right-[2%]"
            style={{
              top: "35%",
              width: "clamp(160px, 42%, 230px)",
              height: "clamp(210px, 52%, 290px)",
              border: "1px solid rgba(255,45,120,0.2)",
              boxShadow:
                "0 20px 50px rgba(0,0,0,0.5), 0 0 24px rgba(255,45,120,0.08)",
            }}
            variants={imageVariants}
          >
            <div className="relative h-full w-full overflow-hidden rounded-2xl p-1">
              <div className="relative h-full w-full overflow-hidden rounded-xl">
                <Image
                  src={IMAGES[1]}
                  alt="Featured creator portrait"
                  fill
                  className="object-cover object-top"
                  sizes="230px"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, transparent 50%, rgba(7,7,11,0.7) 100%)",
                  }}
                />
              </div>
            </div>
            <div className="absolute bottom-3 left-3">
              <span
                className="rounded-full px-2 py-0.5 text-[0.55rem] font-bold uppercase tracking-widest"
                style={{
                  background: "rgba(255,45,120,0.2)",
                  border: "1px solid rgba(255,45,120,0.4)",
                  color: "#ff2d78",
                  backdropFilter: "blur(6px)",
                }}
              >
                VIP ✦ Online
              </span>
            </div>
          </motion.div>

          {/* Bottom-left Image */}
          <motion.div
            className="absolute bottom-0 left-0 overflow-hidden rounded-2xl sm:left-[2%]"
            style={{
              width: "clamp(140px, 38%, 200px)",
              height: "clamp(180px, 46%, 250px)",
              border: "1px solid rgba(199,120,255,0.2)",
              boxShadow:
                "0 16px 44px rgba(0,0,0,0.5), 0 0 20px rgba(199,120,255,0.06)",
            }}
            variants={imageVariants}
          >
            <div className="relative h-full w-full overflow-hidden rounded-2xl p-1">
              <div className="relative h-full w-full overflow-hidden rounded-xl">
                <Image
                  src={IMAGES[2]}
                  alt="Featured creator portrait"
                  fill
                  className="object-cover object-top"
                  sizes="200px"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, transparent 50%, rgba(7,7,11,0.7) 100%)",
                  }}
                />
              </div>
            </div>
            <div className="absolute bottom-3 left-3">
              <span
                className="rounded-full px-2 py-0.5 text-[0.55rem] font-bold uppercase tracking-widest"
                style={{
                  background: "rgba(199,120,255,0.2)",
                  border: "1px solid rgba(199,120,255,0.4)",
                  color: "#c778ff",
                  backdropFilter: "blur(6px)",
                }}
              >
                Featured
              </span>
            </div>
          </motion.div>

          {/* Decorative connecting lines */}
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.06]"
            aria-hidden
          >
            <line
              x1="50%"
              y1="30%"
              x2="85%"
              y2="55%"
              stroke="#d4a853"
              strokeWidth="1"
            />
            <line
              x1="50%"
              y1="30%"
              x2="20%"
              y2="70%"
              stroke="#ff2d78"
              strokeWidth="1"
            />
          </svg>
        </motion.div>
      </div>

      {/* ── Scroll hint ── */}
      <div
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in"
        aria-hidden
        style={{ color: "rgba(255,255,255,0.25)", animationDelay: "1.8s" }}
      >
        <span className="text-[0.55rem] uppercase tracking-[0.25em]">
          Scroll
        </span>
        <div
          className="h-10 w-px rounded-full"
          style={{
            background:
              "linear-gradient(180deg, rgba(212,168,83,0.6), transparent)",
            animation: "float 1.8s ease-in-out infinite",
          }}
        />
      </div>
    </section>
  );
}
