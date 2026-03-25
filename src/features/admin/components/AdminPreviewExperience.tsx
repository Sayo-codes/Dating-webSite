"use client";

import Link from "next/link";
import { LoginForm } from "@/features/auth/components/LoginForm";

const nav = [
  { label: "Dashboard", hint: "Live hub after sign-in" },
  { label: "Creators", hint: "Manage profiles" },
  { label: "Messages", hint: "Agency inbox" },
  { label: "Media vault", hint: "S3 + chat send" },
  { label: "Analytics", hint: "Stats" },
];

const mockCards = [
  { label: "Users", value: "1,284", accent: "from-[#d4a853]/20 to-[#ff2d78]/15" },
  { label: "Creators", value: "42", accent: "from-[#c778ff]/15 to-[#d4a853]/20" },
  { label: "Conversations", value: "3,901", accent: "from-[#ff2d78]/15 to-[#c778ff]/15" },
  { label: "Messages", value: "12,450", accent: "from-white/10 to-white/5" },
];

export function AdminPreviewExperience() {
  return (
    <div className="min-h-screen bg-[#07070b] text-white">
      <div
        className="border-b border-[rgba(212,168,83,0.15)] bg-[rgba(14,12,20,0.85)] px-4 py-3 text-center text-sm backdrop-blur-xl sm:px-6"
        style={{ WebkitBackdropFilter: "blur(20px)" }}
      >
        <span className="text-[#f0c97a]">✦ Preview mode</span>
        <span className="text-white/60">
          {" "}
          — sample numbers below. Sign in with an <strong className="text-white/90">admin</strong> account to open
          the real hub.
        </span>
      </div>

      <div className="flex min-h-[calc(100vh-52px)] flex-col sm:flex-row">
        {/* Sidebar (matches admin chrome) */}
        <aside className="flex w-full shrink-0 flex-col border-b border-white/10 bg-[var(--bg-elevated)] sm:w-56 sm:border-b-0 sm:border-r sm:border-white/10">
          <div className="border-b border-white/10 p-4 sm:px-5">
            <span className="font-[var(--font-heading)] text-lg font-semibold text-white">Admin</span>
            <p className="mt-0.5 text-[10px] uppercase tracking-wider text-[#d4a853]/70">Preview layout</p>
          </div>
          <nav className="flex-1 space-y-0.5 p-4" aria-label="Preview nav">
            {nav.map(({ label, hint }) => (
              <div
                key={label}
                className="flex min-h-[44px] cursor-default items-center rounded-xl px-4 py-3 text-sm text-[var(--text-secondary)]"
                title={hint}
              >
                {label}
              </div>
            ))}
          </nav>
          <div className="border-t border-white/10 p-4">
            <Link
              href="/"
              className="flex min-h-[44px] items-center text-sm text-[var(--text-muted)] transition-colors hover:text-white"
            >
              ← Back to site
            </Link>
          </div>
        </aside>

        <div className="min-w-0 flex-1 overflow-auto">
          <div className="page-content mx-auto max-w-6xl px-4 py-8 sm:px-6">
            <div className="space-y-8">
              <div>
                <h1 className="font-[var(--font-heading)] text-2xl font-semibold text-white sm:text-3xl">
                  ✦ Dashboard
                </h1>
                <p className="mt-1 text-sm text-white/55">
                  Overview of your platform — this is how the live admin home looks.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {mockCards.map(({ label, value, accent }) => (
                  <div
                    key={label}
                    className={`rounded-[var(--radius-card)] border border-white/10 bg-gradient-to-br ${accent} p-6`}
                  >
                    <p className="text-sm font-medium text-white/70">{label}</p>
                    <p className="mt-2 font-[var(--font-heading)] text-3xl font-semibold text-white">{value}</p>
                    <p className="mt-2 text-xs text-white/35">Demo figure</p>
                  </div>
                ))}
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <section className="rounded-[var(--radius-card)] border border-white/10 bg-[var(--bg-elevated)] p-6">
                  <h2 className="section-heading mb-4">Quick actions</h2>
                  <ul className="space-y-2 text-sm text-white/70">
                    <li className="flex items-center gap-2">
                      <span className="text-[#d4a853]">✦</span> Create creator profile
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#d4a853]">✦</span> View all conversations
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#d4a853]">✦</span> Media vault &amp; analytics
                    </li>
                  </ul>
                </section>
                <section
                  id="sign-in"
                  className="rounded-[var(--radius-card)] border border-[rgba(212,168,83,0.25)] bg-[rgba(18,14,28,0.9)] p-6 shadow-[0_0_40px_rgba(212,168,83,0.06)]"
                >
                  <h2 className="section-heading mb-1 text-[#f0c97a]">Sign in to real admin</h2>
                  <p className="mb-5 text-sm text-white/55">
                    Use your normal email and password. Your user must have role <code className="text-[#ff2d78]">admin</code> in
                    the database.
                  </p>
                  <LoginForm
                    redirectTo="/admin"
                    submitLabel="Enter admin hub ✦"
                    showCancel={false}
                  />
                  <p className="mt-4 text-center text-xs text-white/40">
                    Not admin yet? Run <code className="text-white/60">npx tsx set-admin.js</code> or set role in Prisma
                    Studio.
                  </p>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
