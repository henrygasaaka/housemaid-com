"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Calendar,
  ChevronLeft,
  Clock,
  MapPin,
} from "lucide-react";
import {
  CANDIDATE_INTERVIEWS,
  getInterviewStatusMeta,
  type CandidateInterview,
} from "@/lib/candidate-interviews";
import { CandidateBottomNav } from "@/components/candidate/candidate-bottom-nav";
import { useCandidateNav } from "@/components/candidate/use-candidate-nav";

function InterviewStatusBadge({
  status,
}: {
  status: CandidateInterview["status"];
}) {
  const meta = getInterviewStatusMeta(status);

  return (
    <span
      className="inline-block rounded-[20px] px-2.5 py-[3px] text-[10.5px] font-bold"
      style={{ color: meta.color, background: meta.bg }}
    >
      {meta.label}
    </span>
  );
}

function InterviewCard({
  interview,
  onMessage,
}: {
  interview: CandidateInterview;
  onMessage?: () => void;
}) {
  const isUpcoming = interview.section === "upcoming";

  return (
    <div className="rounded-[14px] border border-border bg-white p-3.5">
      <div className="mb-2.5 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="m-0 text-[14px] font-bold text-ink">
            {interview.employer}
          </p>
          <p className="m-0 mt-0.5 text-[12px] font-semibold text-purple">
            {interview.role}
          </p>
        </div>
        <InterviewStatusBadge status={interview.status} />
      </div>

      <div className="space-y-1.5">
        <p className="m-0 flex items-center gap-2 text-[12px] text-ink-soft">
          <Calendar size={13} className="shrink-0 text-ink-faint" aria-hidden />
          {interview.date}
        </p>
        <p className="m-0 flex items-center gap-2 text-[12px] text-ink-soft">
          <Clock size={13} className="shrink-0 text-ink-faint" aria-hidden />
          {interview.time}
        </p>
        <p className="m-0 flex items-center gap-2 text-[12px] text-ink-soft">
          <MapPin size={13} className="shrink-0 text-ink-faint" aria-hidden />
          {interview.location}
        </p>
      </div>

      <div className="mt-3.5 flex gap-2">
        <button
          type="button"
          className="flex flex-1 cursor-pointer items-center justify-center rounded-[11px] border-[1.5px] border-purple bg-white py-2.5 text-[13px] font-bold text-purple"
        >
          View details
        </button>
        {isUpcoming && (
          <button
            type="button"
            onClick={onMessage}
            className="flex flex-1 cursor-pointer items-center justify-center rounded-[11px] border-none bg-purple py-2.5 text-[13px] font-bold text-white"
          >
            Message
          </button>
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center px-6 py-12 text-center">
      <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-purple-light">
        <Calendar size={26} className="text-purple" aria-hidden />
      </div>
      <p className="m-0 max-w-[260px] text-[13px] leading-relaxed text-ink-soft">
        No interviews yet. Keep your profile active to get noticed.
      </p>
    </div>
  );
}

type CandidateInterviewsProps = {
  interviews?: CandidateInterview[];
};

export function CandidateInterviews({
  interviews = CANDIDATE_INTERVIEWS,
}: CandidateInterviewsProps) {
  const router = useRouter();
  const onNavigate = useCandidateNav();

  const upcoming = interviews.filter((i) => i.section === "upcoming");
  const past = interviews.filter((i) => i.section === "past");
  const hasInterviews = interviews.length > 0;

  return (
    <div className="flex min-h-full flex-1 flex-col bg-app-bg">
      <header className="flex items-center gap-2 border-b border-border bg-white px-4 py-3.5">
        <Link
          href="/candidate/dashboard"
          className="flex border-none bg-transparent p-0.5"
          aria-label="Go back"
        >
          <ChevronLeft size={20} className="text-ink" aria-hidden />
        </Link>
        <h1 className="font-head m-0 flex-1 text-[17px] font-semibold text-navy">
          Interviews
        </h1>
      </header>

      <div className="flex-1 overflow-y-auto px-[18px] py-4">
        {!hasInterviews ? (
          <EmptyState />
        ) : (
          <>
            {upcoming.length > 0 && (
              <section className="mb-5">
                <h2 className="font-head m-0 mb-2.5 text-[15px] font-bold text-navy">
                  Upcoming
                </h2>
                <div className="space-y-2.5">
                  {upcoming.map((interview) => (
                    <InterviewCard
                      key={interview.id}
                      interview={interview}
                      onMessage={() => router.push("/candidate/messages")}
                    />
                  ))}
                </div>
              </section>
            )}

            {past.length > 0 && (
              <section>
                <h2 className="font-head m-0 mb-2.5 text-[15px] font-bold text-navy">
                  Past
                </h2>
                <div className="space-y-2.5">
                  {past.map((interview) => (
                    <InterviewCard key={interview.id} interview={interview} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>

      <CandidateBottomNav active="Interviews" onNavigate={onNavigate} />
    </div>
  );
}
