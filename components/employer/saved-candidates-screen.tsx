"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ChevronLeft, Heart } from "lucide-react";
import { DiscoverCandidateCard } from "@/components/employer/discover-candidate-card";
import { EmployerBottomNav } from "@/components/employer/employer-bottom-nav";
import { useEmployerNav } from "@/components/employer/use-employer-nav";
import type { DiscoverCandidate } from "@/lib/discover-candidates";
import { fetchDiscoverCandidates } from "@/lib/discover-candidates-db";
import { createClient } from "@/lib/supabase";

type SavedCandidatesScreenProps = {
  initialSavedIds?: string[];
};

function EmptyState() {
  const t = useTranslations("employer.saved");
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-8 py-16 text-center">
      <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-blue-light">
        <Heart size={26} className="text-blue" aria-hidden />
      </div>
      <p className="m-0 text-[15px] font-bold text-navy">{t("empty")}</p>
      <p className="m-0 mt-2 max-w-[260px] text-[12.5px] leading-relaxed text-ink-soft">
        {t("emptyDesc")}
      </p>
    </div>
  );
}

export function SavedCandidatesScreen({
  initialSavedIds = [],
}: SavedCandidatesScreenProps) {
  const onNavigate = useEmployerNav();
  const t = useTranslations("employer.saved");
  const tAria = useTranslations("aria");
  const [savedIds, setSavedIds] = useState<Set<string>>(
    () => new Set(initialSavedIds)
  );
  const [candidates, setCandidates] = useState<DiscoverCandidate[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const supabase = createClient();
        const data = await fetchDiscoverCandidates(supabase);
        if (!cancelled) setCandidates(data);
      } catch (error) {
        console.error("[saved] Failed to load candidates:", error);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const savedCandidates = useMemo(
    () => candidates.filter((c) => savedIds.has(c.id)),
    [candidates, savedIds]
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
    <div className="flex min-h-full flex-1 flex-col bg-app-bg">
      <header className="flex items-center gap-2 border-b border-border bg-white px-4 py-3.5">
        <Link
          href="/employer/discover"
          className="flex border-none bg-transparent p-0.5"
          aria-label={tAria("goBack")}
        >
          <ChevronLeft size={20} className="text-ink" aria-hidden />
        </Link>
        <h1 className="font-head m-0 flex-1 text-[17px] font-semibold text-navy">
          {t("title")}
        </h1>
      </header>

      {savedCandidates.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid flex-1 grid-cols-2 gap-2.5 overflow-y-auto px-[18px] py-3.5">
          {savedCandidates.map((c) => (
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

      <EmployerBottomNav active="Saved" onNavigate={onNavigate} />
    </div>
  );
}
