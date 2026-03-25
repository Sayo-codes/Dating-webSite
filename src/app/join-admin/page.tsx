import Link from "next/link";
import { redirect } from "next/navigation";
import { PageContainer } from "@/shared/ui/PageContainer";
import { getCurrentUser } from "@/shared/lib/auth";
import { JoinAdminClient } from "@/features/auth/components/JoinAdminClient";

export const metadata = {
  title: "Join as admin ✦ Velvet Signal",
  description: "Use your agency invite code to unlock admin access.",
};

export default async function JoinAdminPage() {
  const user = await getCurrentUser();
  if (user?.role === "admin") {
    redirect("/admin");
  }

  const inviteConfigured = Boolean(process.env.ADMIN_INVITE_SECRET?.trim());

  return (
    <PageContainer size="narrow" className="min-h-screen items-center justify-center gap-8 px-4 py-10 sm:py-14">
      <div className="w-full max-w-md space-y-6">
        <header className="text-center">
          <p className="section-heading mb-2">✦ Agency access</p>
          <h1 className="font-[var(--font-heading)] text-2xl font-semibold text-white sm:text-3xl">
            Become an admin
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
            You need an account first. Then enter the invite code the owner sent you (not the same as your password).
          </p>
        </header>

        {!inviteConfigured && (
          <div
            className="rounded-xl border border-amber-400/25 bg-amber-500/10 px-4 py-3 text-center text-sm text-amber-100/90"
            role="status"
          >
            Admin invite is not turned on yet (missing <code className="text-white/80">ADMIN_INVITE_SECRET</code> on
            the server). Add it in <code className="text-white/80">.env</code> / Vercel env, then restart.
          </div>
        )}

        {!user ? (
          <div className="rounded-2xl border border-white/10 bg-[var(--bg-elevated)] p-6 text-center text-sm text-[var(--text-secondary)]">
            <p className="mb-4">Sign up or log in, then come back to this page.</p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/register?next=/join-admin"
                className="pill-button-primary focus-outline inline-flex min-h-[48px] items-center justify-center rounded-full px-6 py-3 text-sm font-semibold"
              >
                Create account
              </Link>
              <Link
                href="/login?next=/join-admin"
                className="focus-outline inline-flex min-h-[48px] items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-white/90 hover:bg-white/10"
              >
                Log in
              </Link>
            </div>
          </div>
        ) : (
          <JoinAdminClient email={user.email} />
        )}

        <p className="text-center text-xs text-[var(--text-muted)]">
          Link to share:{" "}
          <span className="text-white/50">your-site.com/join-admin</span>
          <br />
          Share the code separately (Slack, 1Password, etc.) — don&apos;t put it in the URL.
        </p>
      </div>
    </PageContainer>
  );
}
