import type { NextConfig } from "next";

// Derive hostname from S3_PUBLIC_URL so uploaded images are allowed by Next.js
function s3RemotePattern(): { protocol: "https"; hostname: string; pathname: string } | null {
  const raw = process.env.S3_PUBLIC_URL ?? "";
  if (!raw) return null;
  try {
    const { hostname } = new URL(raw);
    return { protocol: "https", hostname, pathname: "/**" };
  } catch {
    return null;
  }
}

const s3Pattern = s3RemotePattern();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      // Wildcard fallback — covers any HTTPS CDN / S3 bucket you configure
      {
        protocol: "https",
        hostname: "**.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.r2.dev",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.digitaloceanspaces.com",
        pathname: "/**",
      },
      // Dynamic entry from S3_PUBLIC_URL env var (catches custom CDN domains)
      ...(s3Pattern ? [s3Pattern] : []),
    ],
  },
};

export default nextConfig;
