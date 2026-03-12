import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

/** Append pool options to DATABASE_URL to avoid "connection pool timeout" (default limit is 5). */
function getDatasourceUrl(baseUrl: string): string {
  const hasParams = baseUrl.includes("?");
  const params = [
    !baseUrl.includes("connection_limit=") && "connection_limit=20",
    !baseUrl.includes("connect_timeout=") && "connect_timeout=30",
    !baseUrl.includes("pool_timeout=") && "pool_timeout=30",
  ]
    .filter(Boolean)
    .join("&");
  if (!params) return baseUrl;
  return baseUrl + (hasParams ? "&" : "?") + params;
}

function getPrismaClient(): PrismaClient {
  const url = process.env.DATABASE_URL;
  if (!url || url.trim() === "") {
    const message =
      "DATABASE_URL is not set. Copy .env.example to .env in the project root and set DATABASE_URL to your PostgreSQL connection string (e.g. postgresql://user:password@localhost:5432/website).";
    console.error("[prisma] Environment variable DATABASE_URL not found.", message);
    throw new Error(message);
  }
  const datasourceUrl = getDatasourceUrl(url);
  return new PrismaClient({
    datasources: { db: { url: datasourceUrl } },
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? getPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
