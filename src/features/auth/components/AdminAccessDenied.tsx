"use client";

import Link from "next/link";
import { GlassCard, PrimaryButton } from "@/shared/ui";

type Props = {
  email?: string;
};

/**
 * Shown when user is signed in but tried to open /admin without admin role.
 */
export function AdminAccessDenied({ email }: Props) {
  return (
    <GlassCard padding="lg" className="border-[rgba(255,45,120,0.2)]">
      <p className="section-heading mb-2 text-[#f0c97a]">✦ Admin access</p>
      <h1 className="font-[var(--font-heading)] text-xl font-semibold text-white sm:text-2xl">
        This account can&apos;t open the admin hub
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
        You&apos;re already signed in
        {email ? (
          <>
            {" "}
            as <span className="text-white/90">{email}</span>
          </>
        ) : null}
        , but only users with the <strong className="text-[#d4a853]">admin</strong> role can use agency tools
        (Creators, Messages, Media vault).
      </p>
      <p className="mt-3 text-sm text-[var(--text-muted)]">
        Promote this user in your database (e.g. <code className="text-white/70">npx tsx set-admin.js</code> or Prisma
        Studio → <code className="text-white/70">role = admin</code>), then refresh or log in again.
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <form action="/api/auth/logout" method="POST" className="min-w-0 sm:flex-1">
          <PrimaryButton type="submit" className="w-full">
            Log out & use another account
          </PrimaryButton>
        </form>
        <Link
          href="/creators"
          className="focus-outline inline-flex min-h-[44px] w-full min-w-0 flex-1 items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-medium text-white/90 backdrop-blur transition-[color,background-color,border-color,transform] duration-200 hover:border-white/30 hover:bg-white/10 active:scale-[0.98] sm:flex-1"
        >
          ✦ Explore Creators
        </Link>
      </div>
    </GlassCard>
  );
}
