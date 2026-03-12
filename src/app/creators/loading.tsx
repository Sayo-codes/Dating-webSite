import { PageContainer } from "@/shared/ui/PageContainer";
import { SkeletonCard, Skeleton } from "@/shared/ui/Skeleton";

export default function CreatorsLoading() {
  return (
    <PageContainer>
      <div className="space-y-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-9 w-40" />
          </div>
          <Skeleton className="h-5 w-28" />
        </div>
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <li key={i}>
              <SkeletonCard hasImage lines={2} />
            </li>
          ))}
        </ul>
      </div>
    </PageContainer>
  );
}
