import Link from "next/link";

const PLANS = [
    {
        id: "free",
        name: "Free",
        price: "$0",
        period: "forever",
        tagline: "Get started today",
        features: [
            "Browse creator profiles",
            "View public content",
            "1 free intro message",
            "Basic search filters",
        ],
        cta: "Sign Up Free",
        ctaHref: "/register",
        highlighted: false,
        badge: null,
    },
    {
        id: "vip",
        name: "VIP",
        price: "$19.99",
        period: "per month",
        tagline: "Most popular",
        features: [
            "Unlimited messaging",
            "Access to VIP creators",
            "HD photo & video content",
            "Priority response queue",
            "Verified badge on profile",
        ],
        cta: "Start VIP — $19.99/mo",
        ctaHref: "/register",
        highlighted: true,
        badge: "Most Popular",
    },
    {
        id: "elite",
        name: "Elite",
        price: "$49.99",
        period: "per month",
        tagline: "The ultimate experience",
        features: [
            "Everything in VIP",
            "Exclusive Elite creators",
            "Live video sessions",
            "Personal concierge",
            "Early access to new talent",
            "No ads, ever",
        ],
        cta: "Go Elite — $49.99/mo",
        ctaHref: "/register",
        highlighted: false,
        badge: "Premium",
    },
];

function CheckIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
            <circle cx="7" cy="7" r="7" fill="rgba(212,168,83,0.15)" />
            <path d="M4 7L6 9L10 5" stroke="#d4a853" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export function PricingSection() {
    return (
        <section className="section-shell" aria-labelledby="pricing-heading">
            {/* Header */}
            <div className="px-4 text-center sm:px-6 lg:px-10">
                <p className="section-heading mb-2 flex items-center justify-center gap-2">
                    <span>💎</span> Pricing
                </p>
                <h2 id="pricing-heading" className="text-display text-2xl font-bold sm:text-3xl">
                    Choose Your{" "}
                    <span
                        style={{
                            background: "var(--gradient-text)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                        }}
                    >
                        Access Level
                    </span>
                </h2>
                <p className="mx-auto mt-3 max-w-md text-sm text-white/50">
                    Upgrade anytime. Cancel anytime. No hidden fees.
                </p>
            </div>

            {/* Cards */}
            <div className="grid gap-5 px-4 sm:px-6 lg:px-10 sm:grid-cols-2 lg:grid-cols-3 lg:items-start">
                {PLANS.map((plan) =>
                    plan.highlighted ? (
                        /* Highlighted VIP card */
                        <div
                            key={plan.id}
                            className="relative animate-fade-up animate-glow-pulse"
                            style={{
                                animationDelay: "0.1s",
                                borderRadius: "var(--radius-card)",
                            }}
                        >
                            {/* Glow ring */}
                            <div
                                className="absolute -inset-px rounded-[23px]"
                                style={{ background: "var(--gradient-primary)", padding: "1px" }}
                                aria-hidden
                            />
                            {/* Badge */}
                            {plan.badge && (
                                <div
                                    className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10 rounded-full px-4 py-1 text-xs font-bold text-[#07070b]"
                                    style={{ background: "var(--gradient-primary)" }}
                                >
                                    {plan.badge} ✦
                                </div>
                            )}
                            <div
                                className="relative h-full rounded-[22px] p-6"
                                style={{
                                    background: "linear-gradient(145deg, rgba(30,18,45,0.98) 0%, rgba(14,10,22,0.99) 100%)",
                                    backdropFilter: "blur(24px)",
                                }}
                            >
                                <PlanContent plan={plan} />
                            </div>
                        </div>
                    ) : (
                        /* Normal card */
                        <div
                            key={plan.id}
                            className="glass-card animate-fade-up"
                            style={{ padding: "24px", animationDelay: plan.id === "elite" ? "0.2s" : "0s" }}
                        >
                            {plan.badge && (
                                <div
                                    className="mb-3 inline-block rounded-full px-3 py-0.5 text-xs font-semibold"
                                    style={{
                                        background: "rgba(199,120,255,0.12)",
                                        border: "1px solid rgba(199,120,255,0.25)",
                                        color: "#c778ff",
                                    }}
                                >
                                    {plan.badge}
                                </div>
                            )}
                            <PlanContent plan={plan} />
                        </div>
                    )
                )}
            </div>

            {/* Guarantee */}
            <p className="px-4 text-center text-xs text-white/35 sm:px-6 lg:px-10">
                🔒 Secure payments · Cancel anytime · 30-day money-back guarantee
            </p>
        </section>
    );
}

function PlanContent({ plan }: { plan: (typeof PLANS)[number] }) {
    return (
        <div className="flex flex-col gap-5">
            {/* Plan name */}
            <div>
                <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                <p className="text-xs text-white/40 mt-0.5">{plan.tagline}</p>
            </div>

            {/* Price */}
            <div className="flex items-end gap-2">
                <span
                    className="text-4xl font-bold"
                    style={
                        plan.highlighted
                            ? {
                                background: "var(--gradient-primary)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                backgroundClip: "text",
                            }
                            : { color: "white" }
                    }
                >
                    {plan.price}
                </span>
                <span className="pb-1 text-sm text-white/40">{plan.period}</span>
            </div>

            {/* Divider */}
            <div className="divider-gold" style={{ margin: 0 }} />

            {/* Features */}
            <ul className="flex flex-col gap-2.5">
                {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-white/70">
                        <CheckIcon />
                        {f}
                    </li>
                ))}
            </ul>

            {/* CTA */}
            <Link
                href={plan.ctaHref}
                className={`focus-outline mt-2 flex min-h-[48px] w-full items-center justify-center rounded-full text-sm font-semibold transition-all duration-200 ${plan.highlighted
                        ? "pill-button-primary text-white hover:scale-105"
                        : "border border-[rgba(212,168,83,0.25)] bg-[rgba(212,168,83,0.06)] text-[#f0c97a] hover:border-[rgba(212,168,83,0.5)] hover:bg-[rgba(212,168,83,0.12)] hover:shadow-[0_0_16px_rgba(212,168,83,0.2)]"
                    }`}
            >
                {plan.cta}
            </Link>
        </div>
    );
}
