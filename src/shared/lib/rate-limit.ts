const store = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 10; // per IP per window
const CLEANUP_INTERVAL = 60 * 1000;

function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}

function cleanup() {
  const now = Date.now();
  for (const [key, value] of store.entries()) {
    if (value.resetAt < now) store.delete(key);
  }
}

if (typeof setInterval !== "undefined") {
  setInterval(cleanup, CLEANUP_INTERVAL);
}

export function checkRateLimit(request: Request): { ok: true } | { ok: false; retryAfter: number } {
  const ip = getClientIp(request);
  const now = Date.now();
  const entry = store.get(ip);

  if (!entry) {
    store.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true };
  }

  if (entry.resetAt < now) {
    store.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true };
  }

  if (entry.count >= MAX_REQUESTS) {
    return { ok: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
  }

  entry.count += 1;
  return { ok: true };
}
