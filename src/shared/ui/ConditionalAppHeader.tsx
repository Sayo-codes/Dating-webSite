"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AppHeader } from "./AppHeader";

/**
 * Hide marketing header on `/` when logged in — logged-in home uses `DashboardHeader` instead.
 */
export function ConditionalAppHeader() {
  const pathname = usePathname();
  const [showMarketingHeader, setShowMarketingHeader] = useState(true);

  if (pathname === "/") return null;
  useEffect(() => {
    if (pathname !== "/") {
      setShowMarketingHeader(true);
      return;
    }
    let cancelled = false;
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled) return;
        setShowMarketingHeader(!data?.user);
      })
      .catch(() => {
        if (!cancelled) setShowMarketingHeader(true);
      });
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  if (pathname.startsWith("/admin")) return null;

  if (!showMarketingHeader) return null;
  return <AppHeader />;
}
