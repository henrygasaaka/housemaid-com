"use client";

import { useTranslations } from "next-intl";

type FreshnessTier = {
  labelKey:
    | "activeToday"
    | "activeThisWeek"
    | "activeTwoWeeksAgo"
    | "inactiveThirtyDays";
  color: string;
  dot: string;
};

const FRESHNESS_TIERS = {
  fresh: { labelKey: "activeToday", color: "#16A34A", dot: "#16A34A" },
  warm: { labelKey: "activeThisWeek", color: "#CA8A04", dot: "#F59E0B" },
  decaying: { labelKey: "activeTwoWeeksAgo", color: "#6B7280", dot: "#D1D0DC" },
  stale: { labelKey: "inactiveThirtyDays", color: "#9CA3AF", dot: "#E5E7EB" },
} satisfies Record<string, Omit<FreshnessTier, "labelKey"> & { labelKey: FreshnessTier["labelKey"] }>;

function getFreshness(lastActive: string): FreshnessTier {
  if (lastActive === "today" || lastActive === "now") {
    return FRESHNESS_TIERS.fresh;
  }
  if (lastActive === "yesterday" || lastActive === "this week") {
    return FRESHNESS_TIERS.warm;
  }
  if (lastActive === "2 weeks ago" || lastActive === "3 weeks ago") {
    return FRESHNESS_TIERS.decaying;
  }
  return FRESHNESS_TIERS.stale;
}

type FreshnessDotProps = {
  lastActive: string;
  showLabel?: boolean;
};

export function FreshnessDot({ lastActive, showLabel }: FreshnessDotProps) {
  const t = useTranslations("candidate.freshness");
  const tier = getFreshness(lastActive);

  return (
    <span className="flex items-center gap-[5px]">
      <span
        className="h-[7px] w-[7px] shrink-0 rounded-full"
        style={{ background: tier.dot }}
        aria-hidden
      />
      {showLabel && (
        <span
          className="text-[10.5px] font-semibold"
          style={{ color: tier.color }}
        >
          {t(tier.labelKey)}
        </span>
      )}
    </span>
  );
}
