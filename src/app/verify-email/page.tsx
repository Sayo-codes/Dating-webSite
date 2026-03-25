import { VerifyEmailForm } from "@/features/auth/components/VerifyEmailForm";
import { PageContainer } from "@/shared/ui/PageContainer";
import { safeInternalPath } from "@/shared/lib/safe-redirect";

export const metadata = {
  title: "Verify email",
  description: "Enter the code we sent to your email",
};

type SearchParams = { searchParams: Promise<{ email?: string; next?: string }> };

export default async function VerifyEmailPage({ searchParams }: SearchParams) {
  const { email, next } = await searchParams;
  const afterVerify = safeInternalPath(next) ?? "/";

  return (
    <PageContainer className="min-h-screen items-center justify-center px-4 py-8">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <p className="section-heading mb-2">Check your inbox</p>
          <h1 className="text-title font-[var(--font-heading)] text-2xl font-semibold text-white">
            Verify your email
          </h1>
          <p className="mt-2 text-caption text-sm text-white/60">
            We sent a 6-digit code. Enter it below.
          </p>
        </div>
        <VerifyEmailForm initialEmail={email ?? ""} redirectAfterVerify={afterVerify} />
      </div>
    </PageContainer>
  );
}
