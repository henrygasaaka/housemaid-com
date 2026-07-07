"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ChevronLeft, Shield, User } from "lucide-react";
import { Logo } from "@/components/logo";
import { DiscoverCandidateCard } from "@/components/employer/discover-candidate-card";
import {
  DISCOVER_FILTERS,
  fetchDiscoverCandidates,
  filterDiscoverCandidates,
  getDiscoverFilterLabel,
} from "@/lib/discover-candidates-db";
import type { DiscoverCandidate } from "@/lib/discover-candidates";
import { useEmployerAuth } from "@/components/employer/use-employer-auth";
import { createClient } from "@/lib/supabase";

function DiscoverSkeleton() {
  return (
    <div className="grid flex-1 grid-cols-2 gap-2.5 px-[18px] pt-3.5">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-[280px] animate-pulse rounded-2xl border border-border bg-white"
        />
      ))}
    </div>
  );
}

function DiscoverEmptyState() {
  const t = useTranslations("employer.discover");
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-8 py-16 text-center">
      <p className="m-0 text-[15px] font-bold text-navy">{t("empty")}</p>
      <p className="m-0 mt-2 max-w-[280px] text-[12.5px] leading-relaxed text-ink-soft">
        {t("emptyDesc")}
      </p>
    </div>
  );
}

export function EmployerDiscoverFeed() {
  const t = useTranslations();
  const tDiscover = useTranslations("employer.discover");
  const tCommon = useTranslations("common");
  const tAria = useTranslations("aria");
  const tErrors = useTranslations("errors");
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [activeFilter, setActiveFilter] = useState(0);
  const [candidates, setCandidates] = useState<DiscoverCandidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const { isGuest: guestMode } = useEmployerAuth();

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const supabase = createClient();
        const data = await fetchDiscoverCandidates(supabase);
        if (cancelled) return;
        setCandidates(data);
        setLoadError(null);
      } catch (error) {
        if (cancelled) return;
        console.error("[discover] Failed to load candidates:", error);
        setLoadError(
          error instanceof Error ? error.message : tErrors("loadCandidates")
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const visibleCandidates = useMemo(
    () =>
      filterDiscoverCandidates(candidates, DISCOVER_FILTERS[activeFilter]!),
    [candidates, activeFilter]
  );

  function toggleSave(e: React.MouseEvent, id: string) {
    e.preventDefault();
    e.stopPropagation();
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleMessage(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
  }

  return (
    <div className="flex min-h-full min-w-0 flex-1 flex-col overflow-x-hidden bg-app-bg">
      <div className="flex items-center justify-between px-[18px] pt-4">
        <div className="flex items-center gap-1.5">
          <Link
            href="/"
            className="flex border-none bg-transparent p-1"
            aria-label={tAria("goBack")}
          >
            <ChevronLeft size={20} className="text-ink" aria-hidden />
          </Link>
          <Logo accent="blue" />
        </div>
        {guestMode && (
          <span className="flex items-center gap-[5px] rounded-[20px] bg-[#FEF3E2] px-2.5 py-[5px] text-[11.5px] font-bold text-[#D97706]">
            <User size={12} aria-hidden />
            {tCommon("guestMode")}
          </span>
        )}
      </div>

      <div className="px-[18px] pt-3">
        <h2 className="font-head m-0 text-lg font-semibold text-navy">
          {tDiscover("title")}
        </h2>
        <p className="m-0 mt-0.5 text-xs text-ink-soft">
          {tDiscover("subtitle")}
        </p>
      </div>

      <div className="min-w-0 overflow-hidden pt-2.5">
        <div className="no-scrollbar flex gap-1.5 overflow-x-auto px-[18px]">
          {DISCOVER_FILTERS.map((f, i) => (
            <button
              key={f}
              type="button"
              onClick={() => setActiveFilter(i)}
              className={`shrink-0 cursor-pointer rounded-[20px] px-3 py-1.5 text-[11.5px] font-semibold whitespace-nowrap ${
                i === activeFilter
                  ? "border-none bg-blue text-white"
                  : "border border-border bg-white text-ink"
              }`}
            >
              {getDiscoverFilterLabel((key) => t(key), f)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <DiscoverSkeleton />
      ) : loadError ? (
        <div className="flex flex-1 flex-col items-center justify-center px-8 py-16 text-center">
          <p className="m-0 text-[14px] font-semibold text-navy">{loadError}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-4 cursor-pointer rounded-[11px] border-none bg-blue px-4 py-2.5 text-[13px] font-bold text-white"
          >
            {tCommon("tryAgain")}
          </button>
        </div>
      ) : candidates.length === 0 ? (
        <DiscoverEmptyState />
      ) : visibleCandidates.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center px-8 py-16 text-center">
          <p className="m-0 text-[15px] font-bold text-navy">
            {tDiscover("filterEmpty")}
          </p>
          <p className="m-0 mt-2 max-w-[260px] text-[12.5px] leading-relaxed text-ink-soft">
            {tDiscover("filterEmptyDesc")}
          </p>
        </div>
      ) : (
        <div className="grid flex-1 grid-cols-2 gap-2.5 px-[18px] pt-3.5">
          {visibleCandidates.map((c) => (
            <DiscoverCandidateCard
              key={c.id}
              candidate={c}
              isSaved={savedIds.has(c.id)}
              onSave={(e) => toggleSave(e, c.id)}
              onMessage={handleMessage}
            />
          ))}
        </div>
      )}

      <div className="px-[18px] py-3.5">
        <div className="flex items-start gap-2.5 rounded-xl bg-blue-light p-3.5">
          <Shield
            size={15}
            className="mt-px shrink-0 text-[#1E3A8A]"
            aria-hidden
          />
          <div>
            <p className="m-0 text-[12.5px] font-bold text-[#1E3A8A]">
              {tCommon("verifiedProfilesBanner")}
            </p>
            <p className="m-0 mt-px text-[11.5px] text-[#1E3A8A]">
              {tCommon("verifiedProfilesDesc")}
            </p>
          </div>
        </div>

        {guestMode && (
          <div className="mt-3 flex items-center gap-3 rounded-xl border border-border bg-white p-3.5">
            <div className="flex min-w-0 flex-1 items-start gap-2.5">
              <User
                size={16}
                className="mt-px shrink-0 text-purple"
                aria-hidden
              />
              <div className="min-w-0">
                <p className="m-0 text-[12.5px] font-bold text-navy">
                  {tCommon("browsingAsGuest")}
                </p>
                <p className="m-0 mt-0.5 text-[11.5px] leading-snug text-ink-soft">
                  {tCommon("guestBrowseHint", {
                    logIn: tCommon("logInLower"),
                    create: tCommon("createLower"),
                  })}
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Link
                href="/employer/auth?next=/employer/discover"
                className="flex cursor-pointer items-center justify-center rounded-[11px] border-[1.5px] border-purple bg-white px-3 py-2 text-[11.5px] font-bold text-purple no-underline"
              >
                {tCommon("logIn")}
              </Link>
              <Link
                href="/employer/auth?next=/employer/discover"
                className="flex cursor-pointer items-center justify-center rounded-[11px] border-none bg-purple px-3 py-2 text-[11.5px] font-bold text-white no-underline"
              >
                {tCommon("create")}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
