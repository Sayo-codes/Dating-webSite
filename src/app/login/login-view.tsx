"use client";

import * as React from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ImageSlider } from "@/features/auth/components/ImageSlider";
import { ArrowLeft } from "lucide-react";

import { Input, PrimaryButton, SecondaryButton } from "@/shared/ui";

interface LoginViewProps {
  redirectTo?: string;
}

export function LoginView({ redirectTo }: LoginViewProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }

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
      const user = data.user;
      const dest =
        redirectTo && redirectTo !== ""
          ? redirectTo
          : user?.role === "admin"
            ? "/admin"
            : "/";
      router.push(dest);
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

        {/* Right Side - Login Form */}
        <div className="w-full h-full flex flex-col items-center justify-center p-8 md:p-12 relative overflow-y-auto">
          <Link
            href="/"
            className="absolute top-6 left-6 inline-flex items-center text-sm text-[var(--text-muted)] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Home
          </Link>
          
          <div className="w-full max-w-sm mt-8">
            <h1 className="text-display text-3xl mb-2 text-center lg:text-left text-gradient-gold pb-1 animate-fade-up">
              Welcome to Rsdate
            </h1>
            <p className="text-subtitle mb-8 text-center lg:text-left animate-fade-up-delay-1">
              Sign in to connect with premium creators and exclusive matches
            </p>



            <form onSubmit={handleSubmit} className="space-y-6 animate-fade-up-delay-3">
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
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium text-[var(--text-secondary)]">
                    Password
                  </label>
                  <Link href="/forgot-password" className="text-sm font-medium text-[var(--accent-gold)] hover:text-[#f0c97a] hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
              
              <PrimaryButton type="submit" className="w-full" disabled={loading} loading={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </PrimaryButton>
            </form>

            <p className="text-center text-sm text-[var(--text-muted)] mt-8 animate-fade-up-delay-4">
              Don't have an account?{" "}
              <Link href="/register" className="font-medium text-[var(--accent-pink)] hover:text-[#ff6fa3] hover:underline underline-offset-4">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
