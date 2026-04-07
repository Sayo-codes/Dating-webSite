"use client";

import { usePathname } from "next/navigation";
import { AppHeader } from "./AppHeader";

export function GlobalAppHeader() {
  const pathname = usePathname();
  
  // Only show the header on the root page (which maps to both public landing and logged-in home page)
  if (pathname !== "/") {
    return null;
  }

  return <AppHeader />;
}
