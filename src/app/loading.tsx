import { Skeleton, SkeletonText, SkeletonBox } from "@/shared/ui/Skeleton";

export default function RootLoading() {
  return (
    <div className="min-h-screen text-white">
      <main className="page-content mx-auto flex min-h-screen max-w-6xl flex-col gap-16">
        <section
          className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-center"
          aria-hidden
        >
          <div className="space-y-6">
            <Skeleton className="h-8 w-36 rounded-full" />
            <div className="space-y-3">
              <Skeleton className="h-10 w-full max-w-md rounded-lg" />
              <Skeleton className="h-10 w-4/5 max-w-sm rounded-lg" />
            </div>
            <SkeletonText lines={3} className="max-w-xl" />
            <div className="flex flex-wrap gap-4">
              <Skeleton className="h-12 w-28 rounded-full" />
              <Skeleton className="h-12 w-24 rounded-full" />
            </div>
          </div>
          <SkeletonBox className="aspect-[4/5] w-full max-w-sm rounded-[var(--radius-card)] lg:aspect-square" />
        </section>
      </main>
    </div>
  );
}
