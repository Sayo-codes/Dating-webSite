"use client";

import * as React from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ImageSlider } from "@/features/auth/components/ImageSlider";
import { ArrowLeft } from "lucide-react";


import { Input, PrimaryButton } from "@/shared/ui";

interface RegisterViewProps {
  redirectAfterRegister?: string;
}

export function RegisterView({ redirectAfterRegister }: RegisterViewProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const images = [
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=900&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=900&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1504051771394-dd2e66b2e08f?w=900&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1517841905240-4722065025b7?w=900&auto=format&fit=crop&q=80",
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email.trim() || !username.trim() || !password.trim()) {
      setError("Please fill in all text fields.");
      return;
    }
    if (!ageConfirmed) {
      setError("You must confirm you are 18+ to join.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

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
    <div className="w-full min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-5xl h-[700px] grid grid-cols-1 lg:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl border border-[var(--accent-gold)]/20 glass-card">
        {/* Left Side - Image Slider */}
        <div className="hidden lg:block relative h-full">
          <ImageSlider images={images} interval={4000} />
        </div>

        {/* Right Side - Registration Form */}
        <div className="w-full h-full flex flex-col items-center p-8 md:p-12 relative overflow-y-auto">
          <Link
            href="/"
            className="absolute top-6 left-6 inline-flex items-center text-sm text-[var(--text-muted)] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Home
          </Link>
          
          <div className="w-full max-w-sm mt-8">
            <h1 className="text-display text-3xl mb-2 text-center lg:text-left text-gradient-gold pb-1 animate-fade-up">
              Join Rsdate Free
            </h1>
            <p className="text-subtitle mb-8 text-center lg:text-left animate-fade-up-delay-1">
              Create an account to connect with premium creators and exclusive matches
            </p>



            <form onSubmit={handleSubmit} className="space-y-4 animate-fade-up-delay-3 pb-8">
              {error && (
                <div className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200" role="alert">
                  {error}
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

              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium text-[var(--text-secondary)]">
                  Username
                </label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. jdoe123"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-[var(--text-secondary)]">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  required
                  minLength={8}
                />
              </div>

              <div className="pt-2 pb-2">
                <label className="inline-flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 rounded border-white/30 bg-transparent text-[var(--accent-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:ring-offset-2 focus:ring-offset-[var(--bg-base)]"
                    checked={ageConfirmed}
                    onChange={(e) => setAgeConfirmed(e.target.checked)}
                  />
                  <span>
                    I confirm that I am 18+ and agree to the{" "}
                    <span className="underline underline-offset-2 hover:text-white transition-colors cursor-pointer">Terms</span> and{" "}
                    <span className="underline underline-offset-2 hover:text-white transition-colors cursor-pointer">Privacy Policy</span>.
                  </span>
                </label>
              </div>
              
              <PrimaryButton type="submit" className="w-full mt-2" disabled={loading} loading={loading}>
                {loading ? "Creating Account..." : "Sign Up"}
              </PrimaryButton>

              <p className="text-center text-sm text-[var(--text-muted)] pt-4 animate-fade-up-delay-4">
                Already have an account?{" "}
                <Link href="/login" className="font-medium text-[var(--accent-pink)] hover:text-[#ff6fa3] hover:underline underline-offset-4">
                  Log in
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
