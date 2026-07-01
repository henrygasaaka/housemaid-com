"use client";

import { useRouter } from "next/navigation";
import type { CandidateNavItem } from "@/components/candidate/candidate-bottom-nav";

const ROUTES: Partial<Record<CandidateNavItem, string>> = {
  Home: "/candidate/dashboard",
  Messages: "/candidate/messages",
  Interviews: "/candidate/interviews",
  Jobs: "/candidate/jobs",
  Profile: "/candidate/profile",
};

export function useCandidateNav() {
  const router = useRouter();

  return (item: CandidateNavItem) => {
    const href = ROUTES[item];
    if (href) router.push(href);
  };
}
