import Link from "next/link";
import { RegisterForm } from "@/features/auth/components/RegisterForm";
import { PageContainer } from "@/shared/ui/PageContainer";
import { safeInternalPath } from "@/shared/lib/safe-redirect";

export const metadata = {
  title: "Join",
  description: "Create your account",
};

type Props = { searchParams: Promise<{ next?: string }> };

export default async function RegisterPage({ searchParams }: Props) {
  const { next } = await searchParams;
  const nextPath = safeInternalPath(next);

  return (
    <PageContainer size="narrow" className="min-h-screen items-center justify-center gap-8 px-4 py-8 sm:gap-10 sm:py-10">
      <div className="w-full max-w-full space-y-6 sm:space-y-8">
        <header className="text-center">
          <p className="section-heading mb-2">Create account</p>
          <h1 className="text-title font-[var(--font-heading)] text-2xl font-semibold leading-tight text-white sm:text-3xl">
            Join free
          </h1>
          <p className="mt-3 text-subtitle text-sm leading-relaxed">
            Already have an account?{" "}
            <Link
              href={nextPath ? `/login?next=${encodeURIComponent(nextPath)}` : "/login"}
              className="font-medium text-white underline underline-offset-2 transition-colors duration-200 hover:no-underline hover:text-white/90"
            >
              Log in
            </Link>
          </p>
        </header>
        <RegisterForm redirectAfterRegister={nextPath} />
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
