"use client";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#05060a] text-white">
        <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center gap-6 px-4 py-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
            Something went wrong
          </p>
          <h1 className="text-2xl font-semibold leading-tight text-white">
            We couldn&apos;t load this page.
          </h1>
          <p className="max-w-md text-sm text-white/70">
            {error.message || "An unexpected error occurred."}
          </p>
          <button
            type="button"
            onClick={reset}
            className="pill-button-primary focus-outline min-h-[44px] px-6 py-3 text-sm font-medium"
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}

