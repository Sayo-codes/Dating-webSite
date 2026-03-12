import Link from "next/link";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { PageContainer } from "@/shared/ui/PageContainer";

export const metadata = {
  title: "Log in",
  description: "Sign in to your account",
};

export default function LoginPage() {
  return (
    <PageContainer size="narrow" className="min-h-screen items-center justify-center gap-8 px-4 py-8 sm:gap-10 sm:py-10">
      <div className="w-full max-w-full space-y-6 sm:space-y-8">
        <header className="text-center">
          <p className="section-heading mb-2">Welcome back</p>
          <h1 className="text-title font-[var(--font-heading)] text-2xl font-semibold leading-tight text-white sm:text-3xl">
            Log in
          </h1>
          <p className="mt-3 text-subtitle text-sm leading-relaxed">
            New here?{" "}
            <Link href="/register" className="font-medium text-white underline underline-offset-2 transition-colors duration-200 hover:no-underline hover:text-white/90">
              Join free
            </Link>
          </p>
        </header>
        <LoginForm />
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
