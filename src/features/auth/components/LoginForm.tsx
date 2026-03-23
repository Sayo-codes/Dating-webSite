"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GlassCard, PrimaryButton, SecondaryButton, Input } from "@/shared/ui";

type FieldErrors = {
  email?: string;
  password?: string;
};

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);

  function validate(): boolean {
    const next: FieldErrors = {};
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail) {
      next.email = "Email is required.";
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(trimmedEmail)) {
      next.email = "Enter a valid email address.";
    }

    if (!trimmedPassword) {
      next.password = "Password is required.";
    }

    setFieldErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!validate()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Login failed");
        return;
      }
      router.push("/creators");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <GlassCard padding="lg">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {error && (
          <div
            className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
            role="alert"
          >
            {error}
          </div>
        )}
        <div className="flex flex-col gap-1.5">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (fieldErrors.email) {
                setFieldErrors((prev) => ({ ...prev, email: undefined }));
              }
            }}
            required
            autoComplete="email"
            placeholder="you@example.com"
          />
          {fieldErrors.email && (
            <p className="text-xs text-red-300">{fieldErrors.email}</p>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (fieldErrors.password) {
                setFieldErrors((prev) => ({ ...prev, password: undefined }));
              }
            }}
            required
            autoComplete="current-password"
            placeholder="••••••••"
          />
          {fieldErrors.password && (
            <p className="text-xs text-red-300">{fieldErrors.password}</p>
          )}
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <PrimaryButton
            type="submit"
            className="min-w-0 flex-1"
            disabled={loading}
            loading={loading}
          >
            {loading ? "Signing in…" : "Log in"}
          </PrimaryButton>
          <Link href="/" className="min-w-0 flex-1 sm:flex-none">
            <SecondaryButton type="button" className="w-full">
              Cancel
            </SecondaryButton>
          </Link>
        </div>
      </form>
    </GlassCard>
  );
}
