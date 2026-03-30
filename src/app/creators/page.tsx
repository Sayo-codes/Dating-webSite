import Link from "next/link";
import { getCreatorsList } from "@/features/creators/data";
import { CreatorCard } from "@/features/creators/components/CreatorCard";
import { PageContainer } from "@/shared/ui/PageContainer";
import { GlassCard } from "@/shared/ui/GlassCard";

export const metadata = {
  title: "Explore Creators ✦ Rsdate",
  description: "Browse verified creators on Rsdate",
};

export default async function CreatorsPage() {
  const creators = await getCreatorsList();

  return (
    <PageContainer>
      <div className="space-y-10">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="section-heading mb-1">✦ Browse</p>
            <h1 className="text-title font-[var(--font-heading)] text-2xl font-semibold leading-tight text-white sm:text-3xl">
              Explore Creators
            </h1>
            <p className="mt-2 text-sm text-white/50">
              Discover exclusive content from verified creators
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex min-h-[44px] items-center rounded px-2 py-2 text-sm text-[var(--text-muted)] transition-colors duration-200 hover:text-white focus-outline"
          >
            ← Back to home
          </Link>
        </header>

        {creators.length === 0 ? (
          <GlassCard padding="lg" className="flex flex-col items-center justify-center gap-4 py-16 text-center">
            <p className="text-[var(--text-secondary)]">No creators yet.</p>
            <p className="text-sm text-[var(--text-muted)]">
              Run <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-xs">npm run db:seed</code> in the project root to add demo creators (Eva, Jessie, Luna, Maya, Zoe, Ivy, Ruby, Stella).
            </p>
          </GlassCard>
        ) : (
          <ul className="grid grid-cols-1 gap-5 overflow-visible py-2 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-7 xl:grid-cols-4 xl:gap-8" role="list">
            {creators.map((creator) => (
              <li key={creator.id} className="overflow-visible pt-1">
                <CreatorCard creator={creator} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </PageContainer>
  );
}
