"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ChevronLeft, MapPin } from "lucide-react";
import {
  CANDIDATE_JOBS,
  JOB_FILTERS,
  filterJobs,
  type CandidateJob,
  type JobFilter,
} from "@/lib/candidate-jobs";
import { CandidateBottomNav } from "@/components/candidate/candidate-bottom-nav";
import { useCandidateNav } from "@/components/candidate/use-candidate-nav";

function JobCard({
  job,
  interested,
  onExpressInterest,
}: {
  job: CandidateJob;
  interested: boolean;
  onExpressInterest: () => void;
}) {
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
        Posted {job.posted}
      </p>

      <button
        type="button"
        onClick={onExpressInterest}
        disabled={interested}
        className={`mt-3 flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-[11px] py-2.5 text-[13px] font-bold ${
          interested
            ? "border-none bg-green text-white"
            : "border-[1.5px] border-purple bg-white text-purple"
        } ${interested ? "cursor-default" : ""}`}
      >
        {interested ? (
          <>
            Interested
            <Check size={14} strokeWidth={3} aria-hidden />
          </>
        ) : (
          "Express Interest"
        )}
      </button>
    </div>
  );
}

type CandidateJobsProps = {
  jobs?: CandidateJob[];
};

export function CandidateJobs({ jobs = CANDIDATE_JOBS }: CandidateJobsProps) {
  const onNavigate = useCandidateNav();
  const [activeFilter, setActiveFilter] = useState<JobFilter>("All");
  const [interestedIds, setInterestedIds] = useState<Set<string>>(new Set());

  const visibleJobs = filterJobs(jobs, activeFilter);

  function handleExpressInterest(id: string) {
    setInterestedIds((prev) => new Set(prev).add(id));
  }

  return (
    <div className="flex min-h-full min-w-0 flex-1 flex-col overflow-x-hidden bg-app-bg">
      <header className="flex items-center gap-2 border-b border-border bg-white px-4 py-3.5">
        <Link
          href="/candidate/dashboard"
          className="flex border-none bg-transparent p-0.5"
          aria-label="Go back"
        >
          <ChevronLeft size={20} className="text-ink" aria-hidden />
        </Link>
        <h1 className="font-head m-0 flex-1 text-[17px] font-semibold text-navy">
          Jobs
        </h1>
      </header>

      <div className="px-[18px] pt-3">
        <p className="m-0 text-[12px] text-ink-soft">Open positions near you</p>
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
              {filter}
            </button>
          );
        })}
        </div>
      </div>

      <div className="flex-1 space-y-2.5 overflow-y-auto px-[18px] py-3.5">
        {visibleJobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            interested={interestedIds.has(job.id)}
            onExpressInterest={() => handleExpressInterest(job.id)}
          />
        ))}
      </div>

      <CandidateBottomNav active="Jobs" onNavigate={onNavigate} />
    </div>
  );
}
