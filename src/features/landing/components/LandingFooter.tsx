import Link from "next/link";

const FOOTER_LINKS = {
  Platform: [
    { label: "How it Works", href: "#why-velvet" },
    { label: "Explore Creators", href: "/creators" },
  ],
  Account: [
    { label: "Sign Up Free", href: "/register" },
    { label: "Login", href: "/login" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Policy", href: "#" },
  ],
} as const;

export function LandingFooter() {
  return (
    <footer
      className="relative mt-10 border-t"
      style={{ borderColor: "rgba(212,168,83,0.12)" }}
    >
      {/* Top gold divider line */}
      <div
        aria-hidden
        className="absolute -top-px left-0 h-px w-full"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(212,168,83,0.35), rgba(255,45,120,0.2), transparent)",
        }}
      />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-10">
        <div className="grid gap-10 md:grid-cols-[1fr_auto_auto_auto]">

          {/* Brand */}
          <div className="flex flex-col gap-4">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2.5 focus-outline w-fit"
              aria-label="Rsdate home"
            >
              <span
                className="flex h-9 w-9 items-center justify-center rounded-xl"
                style={{ background: "linear-gradient(135deg, #d4a853 0%, #ff2d78 100%)" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M12 2L2 9l10 13 10-13L12 2z" fill="rgba(255,255,255,0.92)" />
                  <path
                    d="M2 9h20M7 2l-5 7 10 13M17 2l5 7-10 13"
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth="0.5"
                  />
                </svg>
              </span>
              <span
                className="font-[var(--font-heading)] text-xl font-bold tracking-tight"
                style={{
                  background: "linear-gradient(135deg, #f0c97a 0%, #d4a853 45%, #ff2d78 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Rsdate
              </span>
            </Link>

            <p className="max-w-[220px] text-xs leading-relaxed text-white/40">
              The luxury creator &amp; dating platform for genuine, private connections.
            </p>

            {/* Trust badge */}
            <span
              className="inline-flex w-fit items-center gap-1.5 rounded-full border px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.15em]"
              style={{
                borderColor: "rgba(212,168,83,0.25)",
                background: "rgba(212,168,83,0.06)",
                color: "#d4a853",
              }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{
                  background: "#3dff9a",
                  boxShadow: "0 0 6px rgba(61,255,154,0.8)",
                  animation: "pulse-online 2s ease-in-out infinite",
                }}
              />
              100% Verified · Private
            </span>
          </div>

          {/* Nav columns */}
          {(Object.entries(FOOTER_LINKS) as [string, readonly { label: string; href: string }[]][]).map(
            ([group, links]) => (
              <div key={group} className="flex flex-col gap-4">
                <p
                  className="text-[0.65rem] font-bold uppercase tracking-[0.2em]"
                  style={{ color: "#d4a853" }}
                >
                  {group}
                </p>
                <ul className="flex flex-col gap-2.5">
                  {links.map(({ label, href }) => (
                    <li key={label}>
                      <Link
                        href={href}
                        className="focus-outline text-sm text-white/45 transition-colors duration-200 hover:text-white/80"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )
          )}
        </div>

        {/* Bottom bar */}
        <div
          className="mt-14 flex flex-col items-center gap-4 border-t pt-8 text-center sm:flex-row sm:justify-between"
          style={{ borderColor: "rgba(255,255,255,0.07)" }}
        >
          <p className="text-[0.7rem] text-white/28">
            © {new Date().getFullYear()} Rsdate. All rights reserved.
          </p>
          <p className="text-[0.7rem] text-white/28">
            Private. Exclusive. ✦ Verified Connections.
          </p>
        </div>
      </div>
    </footer>
  );
}
