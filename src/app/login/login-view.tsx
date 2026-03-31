"use client";

import * as React from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ImageSlider } from "@/features/auth/components/ImageSlider";
import { ArrowLeft } from "lucide-react";

const GoogleIcon = () => (
  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const AppleIcon = () => (
  <svg className="w-4 h-4 mr-2 text-white" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.05 20.28c-.98.68-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 13.25 3.51 5.96 9.05 5.68c1.23.05 2.38.7 3.03.7.67 0 2.02-.79 3.45-.67 1.48.05 2.82.72 3.65 1.93-3.15 1.84-2.65 5.94.46 7.24-1.08 2.65-2.58 4.79-4.59 5.4zm-4.32-15.3c-.22-2.45 2.02-4.58 4.38-4.98.54 2.66-2.18 4.78-4.38 4.98z"/>
  </svg>
);
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 animate-fade-up-delay-2">
              <button
                type="button"
                className="inline-flex h-[44px] items-center justify-center rounded-xl bg-white/5 border border-white/10 text-sm font-medium transition-colors hover:bg-white/10 hover:border-[#d4a853]/50 focus:outline-none"
                onClick={() => setError("Google login is coming soon.")}
              >
                <GoogleIcon />
                Google
              </button>
              <button
                type="button"
                className="inline-flex h-[44px] items-center justify-center rounded-xl bg-white/5 border border-white/10 text-sm font-medium transition-colors hover:bg-white/10 hover:border-[#d4a853]/50 focus:outline-none"
                onClick={() => setError("Apple login is coming soon.")}
              >
                <AppleIcon />
                Apple
              </button>
            </div>

            <div className="relative mb-6 animate-fade-up-delay-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[var(--bg-card)] px-3 text-[var(--text-muted)]">Or continue with email</span>
              </div>
            </div>

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
                  <Link href="#" className="text-sm font-medium text-[var(--accent-gold)] hover:text-[#f0c97a] hover:underline">
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
