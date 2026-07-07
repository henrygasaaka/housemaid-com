"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Briefcase, Check, ChevronLeft, MapPin } from "lucide-react";
import {
  JOB_FILTERS,
  filterJobs,
  getJobFilterLabel,
  type CandidateJob,
  type JobFilter,
} from "@/lib/candidate-jobs";
import {
  expressJobInterest,
  fetchCandidateJobInterests,
  fetchCandidateJobs,
} from "@/lib/jobs-db";
import { CandidateBottomNav } from "@/components/candidate/candidate-bottom-nav";
import { useCandidateNav } from "@/components/candidate/use-candidate-nav";
import { createClient } from "@/lib/supabase";

function JobCard({
  job,
  interested,
  saving,
  onExpressInterest,
}: {
  job: CandidateJob;
  interested: boolean;
  saving: boolean;
  onExpressInterest: () => void;
}) {
  const t = useTranslations("common");
  const tJobs = useTranslations("candidate.jobs");
  const tTime = useTranslations("time");

  return (
    <div className="rounded-[14px] border border-border bg-white p-3.5">
      <p className="m-0 text-[14.5px] font-extrabold text-navy">
        {job.familyName}
      </p>
      <p className="m-0 mt-1 flex items-center gap-1 text-[12px] text-ink-soft">
        <MapPin size={11} className="shrink-0 text-ink-faint" aria-hidden />
        {job.location}
      </p>

      <p className="m-0 mt-2.5 text-[13px] font-bold text-ink">{job.role}</p>
      <p className="m-0 mt-1 text-[13px] font-bold text-purple">{job.salary}</p>

      <div className="mt-2.5 flex flex-wrap gap-1.5">
        {job.requirements.map((req) => (
          <span
            key={req}
            className="rounded-md bg-purple-light px-2 py-[3px] text-[10px] font-semibold text-[#4C1D95]"
          >
            {req}
          </span>
        ))}
      </div>

      <p className="m-0 mt-2.5 text-[10.5px] text-ink-faint">
        {tTime("posted", { posted: job.posted })}
      </p>

      <button
        type="button"
        onClick={onExpressInterest}
        disabled={interested || saving}
        className={`mt-3 flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-[11px] py-2.5 text-[13px] font-bold ${
          interested
            ? "border-none bg-green text-white"
            : "border-[1.5px] border-purple bg-white text-purple"
        } ${interested || saving ? "cursor-default opacity-100" : ""}`}
      >
        {interested ? (
          <>
            {t("interested")}
            <Check size={14} strokeWidth={3} aria-hidden />
          </>
        ) : saving ? (
          t("saving")
        ) : (
          t("expressInterest")
        )}
      </button>
    </div>
  );
}

function JobsSkeleton() {
  return (
    <div className="space-y-2.5 animate-pulse">
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-52 rounded-[14px] border border-border bg-white" />
      ))}
    </div>
  );
}

function EmptyState() {
  const t = useTranslations("candidate.jobs");
  return (
    <div className="flex flex-col items-center px-6 py-12 text-center">
      <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-purple-light">
        <Briefcase size={26} className="text-purple" aria-hidden />
      </div>
      <p className="m-0 max-w-[260px] text-[13px] leading-relaxed text-ink-soft">
        {t("empty")}
      </p>
    </div>
  );
}

function FilterEmptyState() {
  const t = useTranslations("candidate.jobs");
  return (
    <div className="flex flex-col items-center px-6 py-10 text-center">
      <p className="m-0 max-w-[260px] text-[13px] leading-relaxed text-ink-soft">
        {t("filterEmpty")}
      </p>
    </div>
  );
}

export function CandidateJobs() {
  const router = useRouter();
  const onNavigate = useCandidateNav();
  const t = useTranslations();
  const tJobs = useTranslations("candidate.jobs");
  const tCommon = useTranslations("common");
  const tAria = useTranslations("aria");
  const tErrors = useTranslations("errors");
  const [jobs, setJobs] = useState<CandidateJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<JobFilter>("All");
  const [interestedIds, setInterestedIds] = useState<Set<string>>(new Set());
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/candidate/auth");
        return;
      }

      try {
        const [jobRows, interestIds] = await Promise.all([
          fetchCandidateJobs(supabase),
          fetchCandidateJobInterests(supabase, user.id),
        ]);
        if (cancelled) return;
        setJobs(jobRows);
        setInterestedIds(interestIds);
        setLoadError(null);
      } catch (error) {
        if (cancelled) return;
        console.error("[jobs] Failed to load:", error);
        setLoadError(
          error instanceof Error ? error.message : tErrors("loadJobs")
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [router]);

  const visibleJobs = filterJobs(jobs, activeFilter);
  const hasJobs = jobs.length > 0;

  async function handleExpressInterest(jobId: string) {
    if (interestedIds.has(jobId) || savingId) return;

    setSavingId(jobId);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace("/candidate/auth");
      setSavingId(null);
      return;
    }

    const result = await expressJobInterest(supabase, user.id, jobId);
    setSavingId(null);

    if (result.ok || result.reason === "missing_table") {
      setInterestedIds((prev) => new Set(prev).add(jobId));
      return;
    }

    console.error("[jobs] Express interest failed:", result.message);
  }

  return (
    <div className="flex min-h-full min-w-0 flex-1 flex-col overflow-x-hidden bg-app-bg">
      <header className="flex items-center gap-2 border-b border-border bg-white px-4 py-3.5">
        <Link
          href="/candidate/dashboard"
          className="flex border-none bg-transparent p-0.5"
          aria-label={tAria("goBack")}
        >
          <ChevronLeft size={20} className="text-ink" aria-hidden />
        </Link>
        <h1 className="font-head m-0 flex-1 text-[17px] font-semibold text-navy">
          {tJobs("title")}
        </h1>
      </header>

      <div className="px-[18px] pt-3">
        <p className="m-0 text-[12px] text-ink-soft">{tJobs("subtitle")}</p>
      </div>

      <div className="min-w-0 overflow-hidden pt-2.5">
        <div className="no-scrollbar flex gap-1.5 overflow-x-auto px-[18px]">
          {JOB_FILTERS.map((filter) => {
            const active = filter === activeFilter;
            return (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`shrink-0 cursor-pointer rounded-[20px] px-3 py-1.5 text-[11.5px] font-semibold whitespace-nowrap ${
                  active
                    ? "border-none bg-purple text-white"
                    : "border border-border bg-white text-ink"
                }`}
              >
                {getJobFilterLabel((key) => t(key), filter)}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-[18px] py-3.5">
        {loading ? (
          <JobsSkeleton />
        ) : loadError ? (
          <div className="flex flex-col items-center px-6 py-12 text-center">
            <p className="m-0 text-[14px] font-semibold text-navy">{loadError}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 cursor-pointer rounded-[11px] border-none bg-purple px-4 py-2.5 text-[13px] font-bold text-white"
            >
              {tCommon("tryAgain")}
            </button>
          </div>
        ) : !hasJobs ? (
          <EmptyState />
        ) : visibleJobs.length === 0 ? (
          <FilterEmptyState />
        ) : (
          <div className="space-y-2.5">
            {visibleJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                interested={interestedIds.has(job.id)}
                saving={savingId === job.id}
                onExpressInterest={() => handleExpressInterest(job.id)}
              />
            ))}
          </div>
        )}
      </div>

      <CandidateBottomNav active="Jobs" onNavigate={onNavigate} />
    </div>
  );
}
