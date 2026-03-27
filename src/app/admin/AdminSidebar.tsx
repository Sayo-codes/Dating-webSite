"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const nav = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/models", label: "Models ✦" },
  { href: "/admin/messages", label: "Messages" },
  { href: "/admin/media-vault", label: "Media vault" },
  { href: "/admin/analytics", label: "Analytics" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`flex w-full shrink-0 flex-col border-b border-white/10 bg-[var(--bg-elevated)] transition-[width] duration-200 sm:border-b-0 sm:border-r ${
        collapsed ? "sm:w-16" : "sm:w-56"
      }`}
    >
      <div className="flex items-center justify-between border-b border-white/10 p-4 sm:px-4">
        <Link href="/admin" className="font-[var(--font-heading)] text-lg font-semibold text-white">
          {collapsed ? "A" : "Admin"}
        </Link>
        <button
          type="button"
          onClick={() => setCollapsed((v) => !v)}
          className="focus-outline inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-white/80 transition-colors hover:bg-white/5 hover:text-white"
          aria-label={collapsed ? "Expand admin sidebar" : "Collapse admin sidebar"}
          title={collapsed ? "Expand" : "Collapse"}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>
      <nav className={`flex-1 space-y-0.5 p-4 ${collapsed ? "max-sm:hidden sm:px-2" : ""}`} aria-label="Admin">
        {nav.map(({ href, label }) => {
          const isActive =
            href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex min-h-[44px] items-center rounded-xl py-3 text-sm font-medium transition-colors duration-200 ${
                isActive
                  ? "bg-white/10 text-white"
                  : "text-[var(--text-secondary)] hover:bg-white/5 hover:text-white"
              } ${collapsed ? "justify-center px-2 text-center text-[11px] sm:min-h-[40px]" : "px-4"}`}
              title={collapsed ? label : undefined}
            >
              <span className={collapsed ? "sr-only sm:not-sr-only sm:leading-tight" : ""}>
                {collapsed ? label.split(" ")[0] : label}
              </span>
              {collapsed && <span className="sr-only">{label}</span>}
            </Link>
          );
        })}
      </nav>
      <div className={`border-t border-white/10 p-4 ${collapsed ? "max-sm:hidden sm:px-2" : ""}`}>
        <Link
          href="/"
          className={`flex min-h-[44px] items-center text-sm text-[var(--text-muted)] transition-colors duration-200 hover:text-white ${
            collapsed ? "justify-center text-[11px]" : ""
          }`}
          title={collapsed ? "Back to site" : undefined}
        >
          {collapsed ? "←" : "← Back to site"}
        </Link>
      </div>
    </aside>
  );
}
