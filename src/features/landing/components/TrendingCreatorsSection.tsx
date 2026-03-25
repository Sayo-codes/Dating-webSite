import Link from "next/link";

const TRENDING = [
    {
        rank: 1,
        initials: "SK",
        name: "Sophia K.",
        age: 26,
        type: "Elite Model",
        gradient: "linear-gradient(135deg, #c778ff 0%, #ff2d78 100%)",
        online: true,
        rating: "4.9",
        chats: "3.8k",
    },
    {
        rank: 2,
        initials: "AV",
        name: "Aria V.",
        age: 24,
        type: "VIP Model",
        gradient: "linear-gradient(135deg, #d4a853 0%, #ff2d78 100%)",
        online: true,
        rating: "4.8",
        chats: "2.1k",
    },
    {
        rank: 3,
        initials: "ZB",
        name: "Zara B.",
        age: 28,
        type: "Elite Model",
        gradient: "linear-gradient(135deg, #d4a853 0%, #c778ff 100%)",
        online: true,
        rating: "4.8",
        chats: "2.9k",
    },
    {
        rank: 4,
        initials: "NR",
        name: "Nova R.",
        age: 25,
        type: "VIP Model",
        gradient: "linear-gradient(135deg, #22d3ee 0%, #c778ff 100%)",
        online: false,
        rating: "4.7",
        chats: "4.2k",
    },
    {
        rank: 5,
        initials: "LM",
        name: "Luna M.",
        age: 23,
        type: "Verified",
        gradient: "linear-gradient(135deg, #ff2d78 0%, #d4a853 100%)",
        online: true,
        rating: "4.7",
        chats: "1.5k",
    },
    {
        rank: 6,
        initials: "MJ",
        name: "Mila J.",
        age: 25,
        type: "Verified",
        gradient: "linear-gradient(135deg, #ff6fa3 0%, #c778ff 100%)",
        online: true,
        rating: "4.6",
        chats: "1.1k",
    },
    {
        rank: 7,
        initials: "EV",
        name: "Eva V.",
        age: 28,
        type: "VIP Model",
        gradient: "linear-gradient(135deg, #22d3ee 0%, #d4a853 100%)",
        online: false,
        rating: "4.6",
        chats: "680",
    },
];

function RankBadge({ rank }: { rank: number }) {
    const isTop3 = rank <= 3;
    return (
        <span
            className="absolute -top-2 -left-2 z-10 flex h-7 w-7 items-center justify-center rounded-full text-[0.65rem] font-bold"
            style={
                isTop3
                    ? {
                        background: "var(--gradient-gold)",
                        color: "#07070b",
                        boxShadow: "0 0 12px rgba(212,168,83,0.6)",
                    }
                    : {
                        background: "rgba(255,255,255,0.08)",
                        border: "1px solid rgba(255,255,255,0.12)",
                        color: "rgba(255,255,255,0.5)",
                    }
            }
        >
            #{rank}
        </span>
    );
}

export function TrendingCreatorsSection() {
    return (
        <section className="section-shell" aria-labelledby="trending-heading">
            <div className="px-4 sm:px-6 lg:px-10">
                <p className="section-heading mb-1.5 flex items-center gap-2">
                    <span>🔥</span> Trending Now
                </p>
                <h2
                    id="trending-heading"
                    className="text-display text-2xl sm:text-3xl font-bold"
                >
                    Hottest Creators{" "}
                    <span
                        style={{
                            background: "linear-gradient(135deg, #ff6fa3, #ff2d78)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                        }}
                    >
                        This Week
                    </span>
                </h2>
            </div>

            <div className="grid gap-4 px-4 sm:px-6 lg:px-10 sm:grid-cols-2 lg:grid-cols-4">
                {TRENDING.map((creator, i) => (
                    <div
                        key={creator.name}
                        className="glass-card glass-card--interactive relative cursor-pointer animate-fade-up"
                        style={{ animationDelay: `${i * 60}ms` }}
                    >
                        <RankBadge rank={creator.rank} />
                        <div className="flex flex-col gap-3 p-5">
                            {/* Avatar */}
                            <div className="relative h-16 w-16">
                                <div
                                    className="absolute inset-0 rounded-2xl opacity-60 blur-sm"
                                    style={{ background: creator.gradient }}
                                />
                                <div
                                    className="relative flex h-full w-full items-center justify-center rounded-2xl text-xl font-bold text-white"
                                    style={{ background: creator.gradient }}
                                >
                                    {creator.initials}
                                </div>
                                {creator.online && (
                                    <span
                                        className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-[#07070b]"
                                        style={{ background: "#3dff9a", boxShadow: "0 0 8px rgba(61,255,154,0.8)" }}
                                    />
                                )}
                            </div>

                            {/* Info */}
                            <div>
                                <p className="font-semibold text-white">{creator.name} · {creator.age}</p>
                                <p className="text-xs text-white/45 mt-0.5">{creator.type}</p>
                            </div>

                            {/* Stats row */}
                            <div className="flex items-center justify-between text-xs text-white/50">
                                <span className="flex items-center gap-1">
                                    <span style={{ color: "#d4a853" }}>★</span>
                                    <span>{creator.rating}</span>
                                </span>
                                <span>{creator.chats} chats</span>
                            </div>

                            {/* Button */}
                            <Link
                                href="/creators"
                                className="focus-outline mt-1 flex w-full items-center justify-center rounded-full py-2 text-center text-xs font-semibold text-white transition-all duration-200 hover:scale-105"
                                style={{ background: "var(--gradient-primary)", boxShadow: "0 4px 16px rgba(212,168,83,0.25)" }}
                                aria-label={`Chat with ${creator.name}`}
                            >
                                Chat Now
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
