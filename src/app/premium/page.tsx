import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/shared/lib/auth";
import { PageContainer } from "@/shared/ui/PageContainer";
import { PremiumContent } from "@/features/payments/components/PremiumContent";
import { PremiumTransactionHistory } from "@/features/payments/components/PremiumTransactionHistory";

export const metadata = {
  title: "Premium content",
  description: "Unlock premium content",
};

export default async function PremiumPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <PageContainer>
      <div className="space-y-8 sm:space-y-10">
        <nav>
          <Link
            href="/"
            className="inline-flex min-h-[44px] items-center rounded px-2 py-2 text-sm text-[var(--text-muted)] transition-colors duration-200 hover:text-white focus-outline"
          >
            ← Home
          </Link>
        </nav>
        <header>
          <h1 className="text-title font-[var(--font-heading)] text-2xl font-semibold leading-tight text-white sm:text-3xl">
            Premium content
          </h1>
        </header>
        <PremiumContent
          itemType="premium_demo"
          itemId="demo_article_1"
          amountCents={499}
          description="Unlock this exclusive article."
        >
          <div className="rounded-[var(--radius-card)] border border-white/10 bg-[var(--bg-elevated)] p-4 sm:p-6">
            <h2 className="font-[var(--font-heading)] text-xl font-semibold text-white">
              Exclusive article
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)]">
              This is the premium content. Only paying users can see it.
            </p>
          </div>
        </PremiumContent>
        <PremiumTransactionHistory />
      </div>
    </PageContainer>
  );
}
