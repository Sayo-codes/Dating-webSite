/**
 * Allow only same-origin relative paths (prevents open redirects).
 */
export function safeInternalPath(next: string | undefined | null): string | undefined {
  if (!next || typeof next !== "string") return undefined;
  const t = next.trim();
  if (!t.startsWith("/") || t.startsWith("//")) return undefined;
  if (t.includes("\\") || t.includes("\n") || t.includes("\r")) return undefined;
  return t;
}
