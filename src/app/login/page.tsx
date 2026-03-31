import { redirect } from "next/navigation";
import { safeInternalPath } from "@/shared/lib/safe-redirect";
import { getCurrentUser } from "@/shared/lib/auth";
import { LoginView } from "./login-view";
import { AdminAccessDenied } from "@/features/auth/components/AdminAccessDenied";
import { PageContainer } from "@/shared/ui/PageContainer";
import Link from "next/link";

export const metadata = {
  title: "Log in - Rsdate",
  description: "Sign in to your account to connect with creators and exclusive matches.",
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

  return <LoginView redirectTo={redirectTo} />;
}
