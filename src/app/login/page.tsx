import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { AdminAccessDenied } from "@/features/auth/components/AdminAccessDenied";
import { PageContainer } from "@/shared/ui/PageContainer";
import { safeInternalPath } from "@/shared/lib/safe-redirect";
import { getCurrentUser } from "@/shared/lib/auth";

export const metadata = {
  title: "Log in",
  description: "Sign in to your account",
};

type Props = {
  searchParams: Promise<{ next?: string }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const { next } = await searchParams;
  const redirectTo = safeInternalPath(next);
  const user = await getCurrentUser();

  // Already signed in — don't show an empty "log in again" screen
  if (user) {
    if (redirectTo === "/admin") {
      if (user.role === "admin") {
        redirect("/admin");
      }
      return (
        <PageContainer size="narrow" className="min-h-screen items-center justify-center gap-8 px-4 py-8 sm:gap-10 sm:py-10">
          <AdminAccessDenied email={user.email} />
          <p className="text-center">
            <Link
              href="/"
              className="inline-flex min-h-[44px] items-center justify-center rounded px-2 py-2 text-sm text-[var(--text-muted)] transition-colors duration-200 hover:text-white focus-outline"
            >
              ← Back to home
            </Link>
          </p>
        </PageContainer>
      );
    }

    if (redirectTo) {
      redirect(redirectTo);
    }

    redirect(user.role === "admin" ? "/admin" : "/");
  }

  return (
    <PageContainer size="narrow" className="min-h-screen items-center justify-center gap-8 px-4 py-8 sm:gap-10 sm:py-10">
      <div className="w-full max-w-full space-y-6 sm:space-y-8">
        <header className="text-center">
          <p className="section-heading mb-2">Welcome back</p>
          <h1 className="text-title font-[var(--font-heading)] text-2xl font-semibold leading-tight text-white sm:text-3xl">
            Log in
          </h1>
          {redirectTo === "/admin" && (
            <p className="mt-3 rounded-xl border border-[#d4a853]/20 bg-[#d4a853]/5 px-4 py-3 text-sm text-[var(--text-secondary)]">
              ✦ After signing in, you&apos;ll go to the <strong className="text-[#f0c97a]">admin hub</strong> if your
              account has admin access.
            </p>
          )}
          <p className="mt-3 text-subtitle text-sm leading-relaxed">
            New here?{" "}
            <Link
              href="/register"
              className="font-medium text-white underline underline-offset-2 transition-colors duration-200 hover:no-underline hover:text-white/90"
            >
              Join free
            </Link>
          </p>
        </header>
        <LoginForm redirectTo={redirectTo} />
        <p className="text-center">
          <Link
            href="/"
            className="inline-flex min-h-[44px] items-center justify-center rounded px-2 py-2 text-sm text-[var(--text-muted)] transition-colors duration-200 hover:text-white focus-outline"
          >
            ← Back to home
          </Link>
        </p>
      </div>
    </PageContainer>
  );
}
