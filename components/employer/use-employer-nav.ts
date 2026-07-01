"use client";

import { useRouter } from "next/navigation";
import type { EmployerNavItem } from "@/components/employer/employer-bottom-nav";

const ROUTES: Partial<Record<EmployerNavItem, string>> = {
  Discover: "/employer/discover",
  Saved: "/employer/saved",
  Profile: "/employer/profile",
};

export function useEmployerNav() {
  const router = useRouter();

  return (item: EmployerNavItem) => {
    const href = ROUTES[item];
    if (href) router.push(href);
  };
}
