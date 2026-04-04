"use client";

import { useEffect } from "react";

export default function AdminModelsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[admin/models] page error:", error);
  }, [error]);

  return (
    <div className="page-content mx-auto flex max-w-lg flex-col items-center gap-6 px-4 py-24 text-center">
      <h2 className="font-[var(--font-heading)] text-xl font-bold text-white">
        Couldn&apos;t load this page
      </h2>
      <p className="text-sm text-white/50">
        A temporary connection hiccup occurred. This usually resolves itself
        instantly.
      </p>
      <button
        type="button"
        onClick={reset}
        className="rounded-full bg-[var(--accent-primary)] px-6 py-3 text-sm font-semibold text-[#05060a] transition-opacity hover:opacity-90"
      >
        Try again
      </button>
    </div>
  );
}
