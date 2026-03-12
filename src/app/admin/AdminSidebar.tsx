"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/creators", label: "Creators" },
  { href: "/admin/messages", label: "Messages" },
  { href: "/admin/analytics", label: "Analytics" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-white/10 bg-[var(--bg-elevated)] sm:w-56 sm:border-b-0 sm:border-r">
      <div className="border-b border-white/10 p-4 sm:px-5">
        <Link href="/admin" className="font-[var(--font-heading)] text-lg font-semibold text-white">
          Admin
        </Link>
      </div>
      <nav className="flex-1 space-y-0.5 p-4" aria-label="Admin">
        {nav.map(({ href, label }) => {
          const isActive =
            href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex min-h-[44px] items-center rounded-xl px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                isActive
                  ? "bg-white/10 text-white"
                  : "text-[var(--text-secondary)] hover:bg-white/5 hover:text-white"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-white/10 p-4">
        <Link href="/" className="flex min-h-[44px] items-center text-sm text-[var(--text-muted)] transition-colors duration-200 hover:text-white">
          ← Back to site
        </Link>
      </div>
    </aside>
  );
}
