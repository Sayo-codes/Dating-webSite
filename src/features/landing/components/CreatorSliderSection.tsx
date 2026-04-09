"use client";

import Link from "next/link";
import { useRef } from "react";

const FEATURED_CREATORS = [
    {
        initials: "AV",
        name: "Aria V.",
        age: 24,
        tags: ["VIP", "LIVE"],
        gradient: "linear-gradient(135deg, #d4a853 0%, #ff2d78 100%)",
        online: true,
        chats: "2.1k",
    },
    {
        initials: "SK",
        name: "Sophia K.",
        age: 26,
        tags: ["ELITE", "EXCLUSIVE"],
        gradient: "linear-gradient(135deg, #c778ff 0%, #ff2d78 100%)",
        online: true,
        chats: "3.8k",
    },
    {
        initials: "LM",
        name: "Luna M.",
        age: 23,
        tags: ["VERIFIED"],
        gradient: "linear-gradient(135deg, #ff2d78 0%, #d4a853 100%)",
        online: true,
        chats: "1.5k",
    },
    {
        initials: "NR",
        name: "Nova R.",
        age: 25,
        tags: ["VIP", "VIDEO"],
        gradient: "linear-gradient(135deg, #22d3ee 0%, #c778ff 100%)",
        online: false,
        chats: "4.2k",
    },
    {
        initials: "ZB",
        name: "Zara B.",
        age: 28,
        tags: ["ELITE"],
        gradient: "linear-gradient(135deg, #d4a853 0%, #c778ff 100%)",
        online: true,
        chats: "2.9k",
    },
    {
        initials: "IK",
        name: "Isla K.",
        age: 22,
        tags: ["VERIFIED", "NEW"],
        gradient: "linear-gradient(135deg, #ff6fa3 0%, #d4a853 100%)",
        online: true,
        chats: "890",
    },
];

export function CreatorSliderSection() {
    const sliderRef = useRef<HTMLDivElement>(null);

    const scroll = (dir: "left" | "right") => {
        if (!sliderRef.current) return;
        sliderRef.current.scrollBy({ left: dir === "right" ? 280 : -280, behavior: "smooth" });
    };

    return (
        <section className="section-shell" aria-labelledby="creator-slider-heading">
            {/* Header row */}
            <div className="flex items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
                <div>
                    <p className="section-heading mb-1">Featured Creators</p>
                    <h2 id="creator-slider-heading" className="text-display text-2xl sm:text-3xl font-bold">
                        Meet Our{" "}
                        <span
                            style={{
                                background: "linear-gradient(135deg, #f0c97a, #d4a853)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                backgroundClip: "text",
                            }}
                        >
                            Top Models
                        </span>
                    </h2>
                </div>
                {/* Arrow controls */}
                <div className="hidden items-center gap-2 sm:flex">
                    {(["left", "right"] as const).map((dir) => (
                        <button
                            key={dir}
                            onClick={() => scroll(dir)}
                            className="focus-outline flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-150 active:scale-90 hover:border-[rgba(212,168,83,0.5)] hover:bg-[rgba(212,168,83,0.08)] hover:shadow-[0_0_12px_rgba(212,168,83,0.2)]"
                            style={{ borderColor: "rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.04)" }}
                            aria-label={`Scroll ${dir}`}
                        >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                                <path
                                    d={dir === "left" ? "M10 3L5 8L10 13" : "M6 3L11 8L6 13"}
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>
                    ))}
                </div>
            </div>

            {/* Slider */}
            <div
                ref={sliderRef}
                className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                aria-label="Featured creators list"
            >
                {FEATURED_CREATORS.map((creator, i) => (
                    <div
                        key={creator.name}
                        className="glass-card glass-card--interactive shimmer-overlay flex-shrink-0 w-[220px] sm:w-[240px] cursor-pointer"
                        style={{ animationDelay: `${i * 80}ms` }}
                    >
                        <div className="flex flex-col gap-3 p-4">
                            {/* Avatar with ring */}
                            <div className="relative mx-auto h-24 w-24">
                                <div
                                    className="absolute inset-0 rounded-[22px] opacity-70 blur-md"
                                    style={{ background: creator.gradient }}
                                />
                                <div
                                    className="relative h-full w-full rounded-[22px] flex items-center justify-center text-2xl font-bold text-white"
                                    style={{ background: creator.gradient }}
                                >
                                    {creator.initials}
                                </div>
                                {creator.online && (
                                    <span
                                        className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-[#07070b]"
                                        style={{ background: "#3dff9a", boxShadow: "0 0 8px rgba(61,255,154,0.8)" }}
                                    />
                                )}
                            </div>

                            {/* Info */}
                            <div className="text-center">
                                <p className="text-sm font-semibold text-white">{creator.name} · {creator.age}</p>
                                <p className="mt-0.5 text-[0.65rem] text-white/45">
                                    {creator.chats} chats
                                </p>
                            </div>

                            {/* Tags */}
                            <div className="flex flex-wrap justify-center gap-1">
                                {creator.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="rounded-full px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wider"
                                        style={{
                                            background: "rgba(212,168,83,0.12)",
                                            border: "1px solid rgba(212,168,83,0.28)",
                                            color: "#f0c97a",
                                        }}
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            {/* CTA */}
                            <Link
                                href="/creators"
                                className="focus-outline flex w-full items-center justify-center rounded-full py-2.5 text-center text-xs font-semibold text-white transition-all duration-150 active:scale-95 hover:scale-105 hover:shadow-[0_4px_20px_rgba(212,168,83,0.4)]"
                                style={{ background: "var(--gradient-primary)" }}
                                aria-label={`Chat with ${creator.name}`}
                            >
                                Chat Now ✦
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
