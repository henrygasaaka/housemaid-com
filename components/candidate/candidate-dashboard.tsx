"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  Bookmark,
  Calendar,
  ChevronRight,
  Eye,
  Settings,
} from "lucide-react";
import { CandidateBottomNav } from "@/components/candidate/candidate-bottom-nav";
import { useCandidateNav } from "@/components/candidate/use-candidate-nav";
import {
  fetchCandidateDashboard,
  getCompletionHint,
  type CandidateDashboardData,
} from "@/lib/candidate-dashboard";
import { createClient } from "@/lib/supabase";

function ProfileProgressRing({ percent }: { percent: number }) {
  const size = 56;
  const stroke = 5;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#EDE9FE"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#6C2BD9"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[13px] font-extrabold text-purple">
        {percent}%
      </span>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-app-bg animate-pulse">
      <header className="flex items-center justify-between px-[18px] pt-4">
        <div className="h-7 w-36 rounded-lg bg-border" />
        <div className="flex gap-3">
          <div className="h-5 w-5 rounded bg-border" />
          <div className="h-5 w-5 rounded bg-border" />
        </div>
      </header>
      <div className="flex-1 px-[18px] pt-4">
        <div className="mb-3.5 h-[88px] rounded-[14px] bg-border" />
        <div className="mb-4 grid grid-cols-3 gap-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-[88px] rounded-[13px] bg-border" />
          ))}
        </div>
        <div className="h-28 rounded-[14px] bg-border" />
      </div>
    </div>
  );
}

function formatStatValue(value: number) {
  return String(value);
}

export function CandidateDashboard() {
  const router = useRouter();
  const onNavigate = useCandidateNav();
  const [dashboard, setDashboard] = useState<CandidateDashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

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
        const data = await fetchCandidateDashboard(supabase, user.id);
        if (cancelled) return;

        if (!data) {
          router.replace("/candidate/onboard");
          return;
        }

        setDashboard(data);
        setLoadError(null);
      } catch (error) {
        if (cancelled) return;
        console.error("[dashboard] Failed to load candidate data:", error);
        setLoadError(
          error instanceof Error
            ? error.message
            : "Could not load your profile. Please try again."
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

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (loadError || !dashboard) {
    return (
      <div className="flex min-h-full flex-1 flex-col items-center justify-center bg-app-bg px-6 text-center">
        <p className="m-0 text-[14px] font-semibold text-navy">
          {loadError ?? "Profile not found"}
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-4 cursor-pointer rounded-[11px] border-none bg-purple px-4 py-2.5 text-[13px] font-bold text-white"
        >
          Try again
        </button>
      </div>
    );
  }

  const { firstName, completion, stats } = dashboard;
  const completionPercent = completion.percent;
  const showCompleteCta = completionPercent < 100;
  const completionHint = getCompletionHint(completion.missing);

  const statItems = [
    { icon: Eye, value: formatStatValue(stats.viewsThisWeek), label: "Views this week" },
    {
      icon: Bookmark,
      value: formatStatValue(stats.savesCount),
      label: "Saved by employers",
    },
    {
      icon: Calendar,
      value: formatStatValue(stats.interviewRequests),
      label: "Interview requests",
    },
  ] as const;

  return (
    <div className="flex min-h-full flex-1 flex-col bg-app-bg">
      <header className="flex items-center justify-between px-[18px] pt-4">
        <h1 className="font-head m-0 text-[20px] font-bold text-navy">
          Hi {firstName} 👋
        </h1>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="cursor-pointer border-none bg-transparent p-0"
            aria-label="Notifications"
          >
            <Bell size={20} className="text-ink" aria-hidden />
          </button>
          <button
            type="button"
            className="cursor-pointer border-none bg-transparent p-0"
            aria-label="Settings"
          >
            <Settings size={20} className="text-ink" aria-hidden />
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-[18px] pb-4 pt-4">
        <div className="mb-3.5 flex items-center gap-3.5 rounded-[14px] border border-border bg-white p-3.5">
          <ProfileProgressRing percent={completionPercent} />
          <div className="min-w-0 flex-1">
            <p className="m-0 text-[14px] font-bold text-navy">
              Your profile is {completionPercent}% complete
            </p>
            <p className="m-0 mt-1 text-[12px] leading-snug text-ink-soft">
              {completionHint}
            </p>
          </div>
        </div>

        <div className="mb-4 grid grid-cols-3 gap-2">
          {statItems.map(({ icon: Icon, value, label }) => (
            <div
              key={label}
              className="rounded-[13px] border border-border bg-white px-2 py-3 text-center"
            >
              <div className="mb-1.5 flex justify-center">
                <Icon size={17} className="text-purple" aria-hidden />
              </div>
              <p className="m-0 text-[17px] font-extrabold text-navy">{value}</p>
              <p className="m-0 mt-0.5 text-[9.5px] leading-tight text-ink-soft">
                {label}
              </p>
            </div>
          ))}
        </div>

        {showCompleteCta && (
          <div className="mb-4 rounded-[14px] bg-purple px-4 py-4">
            <p className="m-0 text-[14px] font-bold text-white">
              Complete your profile
            </p>
            <p className="m-0 mt-1 text-[12px] leading-snug text-white/85">
              Employers are more likely to contact candidates with complete
              profiles.
            </p>
            <Link
              href="/candidate/onboard"
              className="mt-3 flex cursor-pointer items-center justify-center gap-1 rounded-[11px] bg-white py-2.5 text-[13px] font-bold text-purple no-underline"
            >
              Complete your profile
              <ChevronRight size={16} aria-hidden />
            </Link>
          </div>
        )}

        <h2 className="font-head m-0 mb-2.5 text-[15px] font-bold text-navy">
          Recent activity
        </h2>
        <div className="rounded-[13px] border border-border bg-white px-3.5 py-6 text-center">
          <p className="m-0 text-[12.5px] font-semibold text-ink">
            No activity yet
          </p>
          <p className="m-0 mt-1 text-[11px] leading-snug text-ink-faint">
            Profile views, saves, and interview requests will appear here once
            employers start engaging with your profile.
          </p>
        </div>
      </div>

      <CandidateBottomNav active="Home" onNavigate={onNavigate} />
    </div>
  );
}
