"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GlassCard, PrimaryButton, SecondaryButton, Input } from "@/shared/ui";

type FieldErrors = {
  email?: string;
  username?: string;
  password?: string;
  age?: string;
};

type RegisterFormProps = {
  /** After registration (e.g. `/join-admin` for agency invites) */
  redirectAfterRegister?: string;
};

export function RegisterForm({ redirectAfterRegister }: RegisterFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);

  function validate(): boolean {
    const next: FieldErrors = {};
    const trimmedEmail = email.trim();
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail) {
      next.email = "Email is required.";
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(trimmedEmail)) {
      next.email = "Enter a valid email address.";
    }

    if (!trimmedUsername) {
      next.username = "Username is required.";
    } else if (trimmedUsername.length < 3) {
      next.username = "Username must be at least 3 characters.";
    }

    if (!trimmedPassword) {
      next.password = "Password is required.";
    } else if (trimmedPassword.length < 8) {
      next.password = "Password must be at least 8 characters.";
    }

    if (!ageConfirmed) {
      next.age = "You must confirm you are 18+ to join.";
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
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = data.error ?? "Registration failed";
        const detail = data.detail;
        setError(detail ? `${msg}: ${detail}` : msg);
        return;
      }
      if (data.requiresVerification) {
        const q = new URLSearchParams({ email });
        if (redirectAfterRegister) q.set("next", redirectAfterRegister);
        router.push(`/verify-email?${q.toString()}`);
        return;
      }
      router.push(redirectAfterRegister ?? "/");
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
            label="Username"
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              if (fieldErrors.username) {
                setFieldErrors((prev) => ({ ...prev, username: undefined }));
              }
            }}
            required
            autoComplete="username"
            placeholder="username"
          />
          {fieldErrors.username && (
            <p className="text-xs text-red-300">{fieldErrors.username}</p>
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
            minLength={8}
            autoComplete="new-password"
            placeholder="At least 8 characters"
          />
          {fieldErrors.password && (
            <p className="text-xs text-red-300">{fieldErrors.password}</p>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="inline-flex items-start gap-2 text-sm text-[var(--text-secondary)]">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border-white/30 bg-transparent text-[var(--accent-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:ring-offset-2 focus:ring-offset-[var(--bg-base)]"
              checked={ageConfirmed}
              onChange={(e) => {
                setAgeConfirmed(e.target.checked);
                if (fieldErrors.age) {
                  setFieldErrors((prev) => ({ ...prev, age: undefined }));
                }
              }}
            />
            <span>
              I confirm that I am 18+ and agree to the{" "}
              <span className="underline underline-offset-2">Terms</span> and{" "}
              <span className="underline underline-offset-2">Privacy Policy</span>.
            </span>
          </label>
          {fieldErrors.age && (
            <p className="text-xs text-red-300">{fieldErrors.age}</p>
          )}
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <PrimaryButton
            type="submit"
            className="min-w-0 flex-1"
            disabled={loading}
            loading={loading}
          >
            {loading ? "Creating account…" : "Create account"}
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
