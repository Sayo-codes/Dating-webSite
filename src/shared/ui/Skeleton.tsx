import type { HTMLAttributes } from "react";

type SkeletonProps = HTMLAttributes<HTMLDivElement> & {
  className?: string;
};

export function Skeleton({ className = "", ...props }: SkeletonProps) {
  return (
    <div
      className={`skeleton ${className}`.trim()}
      aria-hidden
      {...props}
    />
  );
}

export function SkeletonBox({
  className = "",
  ...props
}: SkeletonProps) {
  return <Skeleton className={className} {...props} />;
}

export function SkeletonText({
  lines = 1,
  className = "",
}: { lines?: number; className?: string }) {
  return (
    <div className={`space-y-2 ${className}`.trim()} aria-hidden>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-4 max-w-full"
          style={{
            width: lines > 1 && i === lines - 1 ? "75%" : undefined,
          }}
        />
      ))}
    </div>
  );
}

export function SkeletonAvatar({ className = "" }: { className?: string }) {
  return (
    <Skeleton
      className={`rounded-full aspect-square shrink-0 ${className}`.trim()}
      aria-hidden
    />
  );
}

export function SkeletonCard({
  hasImage = true,
  lines = 2,
  className = "",
}: {
  hasImage?: boolean;
  lines?: number;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col overflow-hidden bg-[#07070b] max-md:rounded-[20px] md:rounded-[41px] border border-white/10 ${className}`.trim()}
      aria-hidden
    >
      {hasImage && (
        <Skeleton className="aspect-[10/14] w-full shrink-0 rounded-none!" />
      )}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <Skeleton className="h-5 w-2/3" />
        <SkeletonText lines={lines} className="mt-1" />
        <Skeleton className="mt-2 h-10 w-full rounded-full" />
      </div>
    </div>
  );
}

export function SkeletonList({
  count = 4,
  className = "",
}: { count?: number; className?: string }) {
  return (
    <ul className={`divide-y divide-white/5 ${className}`.trim()} aria-hidden>
      {Array.from({ length: count }).map((_, i) => (
        <li key={i} className="flex min-h-[44px] items-center gap-3 p-4 sm:p-3">
          <SkeletonAvatar className="h-12 w-12" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function SkeletonConversationList({ count = 6 }: { count?: number }) {
  return (
    <div className="flex flex-col">
      <Skeleton className="mb-4 h-6 w-24" />
      <SkeletonList count={count} />
    </div>
  );
}
