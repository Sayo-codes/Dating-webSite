"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GlassCard, PrimaryButton, Input } from "@/shared/ui";

type Props = {
  email: string;
};

export function JoinAdminClient({ email }: Props) {
  const router = useRouter();
  const [secret, setSecret] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!secret.trim()) {
      setError("Enter the invite code.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/claim-admin-invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret: secret.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError((data as { error?: string }).error ?? "Something went wrong.");
        return;
      }
      router.push("/admin");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <GlassCard padding="lg" className="border-[rgba(212,168,83,0.2)]">
      <p className="mb-4 text-sm text-[var(--text-secondary)]">
        Signed in as <span className="text-white/90">{email}</span>
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <div
            className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
            role="alert"
          >
            {error}
          </div>
        )}
        <Input
          label="Invite code"
          type="password"
          autoComplete="off"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          placeholder="Paste code from the owner"
        />
        <PrimaryButton type="submit" disabled={loading} loading={loading} className="w-full">
          {loading ? "Verifying…" : "Unlock admin hub ✦"}
        </PrimaryButton>
      </form>
      <p className="mt-4 text-center text-xs text-[var(--text-muted)]">
        Wrong account?{" "}
        <form action="/api/auth/logout" method="POST" className="inline">
          <button
            type="submit"
            className="text-[#d4a853] underline-offset-2 hover:underline"
          >
            Log out
          </button>
        </form>
      </p>
    </GlassCard>
  );
}
