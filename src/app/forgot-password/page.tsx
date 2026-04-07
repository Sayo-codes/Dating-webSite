"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Input, PrimaryButton } from "@/shared/ui";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Failed to send reset link");
        return;
      }
      setMessage("If an account exists, a reset link has been sent to your email.");
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 md:p-12 rounded-3xl border border-[var(--accent-gold)]/20 glass-card relative" style={{ transform: 'translateZ(0)' }}>
        <Link
          href="/login"
          className="absolute top-6 left-6 inline-flex items-center text-sm text-[var(--text-muted)] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </Link>
        
        <div className="mt-8 relative z-10">
          <h1 className="text-display text-2xl mb-2 text-gradient-gold pb-1 animate-fade-up">
            Reset Password
          </h1>
          <p className="text-subtitle mb-8 text-sm animate-fade-up-delay-1">
            Enter your email and we'll send you a link to reset your password.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6 animate-fade-up-delay-3">
            {error && (
              <div className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200" role="alert">
                {error}
              </div>
            )}
            {message && (
              <div className="rounded-xl border border-green-400/30 bg-green-500/10 px-4 py-3 text-sm text-green-200" role="alert">
                {message}
              </div>
            )}
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-[var(--text-secondary)]">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            
            <PrimaryButton type="submit" className="w-full" disabled={loading} loading={loading}>
              {loading ? "Sending..." : "Send Reset Link"}
            </PrimaryButton>
          </form>
        </div>
      </div>
    </div>
  );
}
