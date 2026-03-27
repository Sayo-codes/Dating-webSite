import Image from "next/image";

const TESTIMONIALS = [
    {
        initials: "JM",
        name: "James M.",
        location: "New York",
        rating: 5,
        quote:
            "This platform is genuinely incredible. The creators are attentive, real, and the private chat quality is unlike anything else. Worth every penny.",
        gradient: "linear-gradient(135deg, #d4a853, #ff2d78)",
        verified: true,
    },
    {
        initials: "CR",
        name: "Carlos R.",
        location: "Miami",
        rating: 5,
        quote:
            "I was skeptical at first, but the verification and privacy made all the difference. The experience is luxurious and discreet. Highly recommend.",
        gradient: "linear-gradient(135deg, #c778ff, #ff2d78)",
        verified: true,
    },
    {
        initials: "AT",
        name: "Alex T.",
        location: "London",
        rating: 5,
        quote:
            "The models are so responsive and real. I've tried other platforms and nothing comes close to Velvet Signal's quality and exclusivity.",
        gradient: "linear-gradient(135deg, #22d3ee, #c778ff)",
        verified: true,
    },
    {
        initials: "DR",
        name: "David R.",
        location: "Dubai",
        rating: 5,
        quote:
            "Elite experience from start to finish. Support team is amazingly helpful and the VIP tier gets you access to incredible talent.",
        gradient: "linear-gradient(135deg, #d4a853, #c778ff)",
        verified: true,
    },
    {
        initials: "MS",
        name: "Marcus S.",
        location: "Sydney",
        rating: 5,
        quote:
            "I appreciate how private and secure everything feels. Premium interface, real connections, zero drama. This is the gold standard.",
        gradient: "linear-gradient(135deg, #ff6fa3, #d4a853)",
        verified: true,
    },
    {
        initials: "TH",
        name: "Thomas H.",
        location: "Amsterdam",
        rating: 5,
        quote:
            "Signed up three months ago and never looked back. The featured models are exceptional and the platform keeps getting better.",
        gradient: "linear-gradient(135deg, #22d3ee, #d4a853)",
        verified: true,
    },
];

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

export function TestimonialsSection() {
    return (
        <section className="section-shell relative overflow-hidden" aria-labelledby="testimonials-heading">

            {/* ── IMAGE 3: Laughing couple — background accent conveying joy & trust ── */}
            <div className="absolute inset-0 overflow-hidden z-0">
                <Image
                    src="/images/landing/couple-outdoors.jpg"
                    alt=""
                    fill
                    className="object-cover object-[center_25%]"
                    sizes="100vw"
                    quality={75}
                    style={{ filter: "brightness(0.1) saturate(0.8) blur(3px)" }}
                />
                {/* Dark gradient overlay for readability */}
                <div
                    className="absolute inset-0"
                    aria-hidden
                    style={{
                        background:
                            "linear-gradient(180deg, rgba(7,7,11,0.95) 0%, rgba(7,7,11,0.5) 30%, rgba(7,7,11,0.5) 70%, rgba(7,7,11,0.95) 100%)",
                    }}
                />
                {/* Warm tint accent */}
                <div
                    className="absolute inset-0"
                    aria-hidden
                    style={{
                        background:
                            "radial-gradient(ellipse 60% 40% at 30% 50%, rgba(212,168,83,0.06) 0%, transparent 70%)",
                    }}
                />
            </div>

            {/* Header */}
            <div className="relative z-10 px-4 text-center sm:px-6 lg:px-10">
                <p className="section-heading mb-2 flex items-center justify-center gap-2">
                    <span>💬</span> Testimonials
                </p>
                <h2 id="testimonials-heading" className="text-display text-2xl font-bold sm:text-3xl">
                    What Our Members{" "}
                    <span
                        style={{
                            background: "linear-gradient(135deg, #f0c97a, #d4a853)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                        }}
                    >
                        Say
                    </span>
                </h2>
                <p className="mx-auto mt-3 max-w-lg text-sm text-white/50">
                    Thousands of members trust Velvet Signal for authentic, private connections.
                </p>
            </div>

            {/* Cards */}
            <div className="relative z-10 grid gap-4 px-4 sm:px-6 lg:px-10 sm:grid-cols-2 lg:grid-cols-3">
                {TESTIMONIALS.map((t, i) => (
                    <blockquote
                        key={t.name}
                        className="glass-card animate-fade-up"
                        style={{ padding: "24px", animationDelay: `${i * 80}ms` }}
                    >
                        {/* Stars */}
                        <StarRating count={t.rating} />

                        {/* Quote */}
                        <p className="mt-3 text-sm leading-relaxed text-white/70 italic">&ldquo;{t.quote}&rdquo;</p>

                        {/* Author */}
                        <footer className="mt-5 flex items-center gap-3">
                            <div
                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                                style={{ background: t.gradient }}
                            >
                                {t.initials}
                            </div>
                            <div>
                                <cite className="flex items-center gap-1.5 not-italic">
                                    <span className="text-sm font-semibold text-white">{t.name}</span>
                                    {t.verified && (
                                        <span
                                            className="rounded-full px-1.5 py-0.5 text-[0.55rem] font-bold uppercase tracking-wider"
                                            style={{
                                                background: "rgba(212,168,83,0.12)",
                                                border: "1px solid rgba(212,168,83,0.25)",
                                                color: "#d4a853",
                                            }}
                                        >
                                            ✓ Verified
                                        </span>
                                    )}
                                </cite>
                                <p className="text-xs text-white/40">{t.location}</p>
                            </div>
                        </footer>
                    </blockquote>
                ))}
            </div>
        </section>
    );
}
