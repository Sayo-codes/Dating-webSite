"use client";

import { useState } from "react";
import { GlassCard, Input, PrimaryButton, SecondaryButton } from "@/shared/ui";

type Props = { initialEmail: string };

export function VerifyEmailForm({ initialEmail }: Props) {
  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSent, setResendSent] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), code }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Verification failed");
        return;
      }
      setSuccess(true);
      window.location.href = "/creators";
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (!email.trim()) {
      setError("Enter your email first.");
      return;
    }
    setError("");
    setResendLoading(true);
    try {
      const res = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Could not resend code");
        return;
      }
      setResendSent(true);
    } finally {
      setResendLoading(false);
    }
  }

  const alertClasses = "rounded-xl border px-4 py-3 text-sm";
  const errorAlert = "border-red-400/30 bg-red-500/10 text-red-200";
  const successAlert = "border-emerald-400/30 bg-emerald-500/10 text-emerald-200";

  return (
    <GlassCard padding="lg">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {error && (
          <div className={`${alertClasses} ${errorAlert}`} role="alert">
            {error}
          </div>
        )}
        {resendSent && (
          <div className={`${alertClasses} ${successAlert}`}>
            New code sent. Check your email.
          </div>
        )}
        {success && (
          <div className={`${alertClasses} ${successAlert}`}>
            Email verified. Redirecting…
          </div>
        )}
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          placeholder="you@example.com"
        />
        <div className="flex flex-col gap-2">
          <label
            htmlFor="verify-code"
            className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--text-muted)]"
          >
            Verification code
          </label>
          <input
            id="verify-code"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            required
            maxLength={6}
            autoComplete="one-time-code"
            inputMode="numeric"
            className="input-base focus-outline w-full rounded-[var(--radius-md)] text-center text-lg tracking-[0.4em] text-white placeholder-white/40"
            placeholder="000000"
          />
        </div>
        <div className="flex flex-col gap-3">
          <PrimaryButton type="submit" className="w-full" disabled={loading || success}>
            {loading ? "Verifying…" : success ? "Redirecting…" : "Verify email"}
          </PrimaryButton>
          <SecondaryButton
            type="button"
            className="w-full"
            disabled={resendLoading}
            onClick={handleResend}
          >
            {resendLoading ? "Sending…" : "Resend code"}
          </SecondaryButton>
        </div>
      </form>
    </GlassCard>
  );
}
