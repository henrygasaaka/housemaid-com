"use client";

import Link from "next/link";
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

const PROFILE_COMPLETION = 85;
const STATS = [
  { icon: Eye, value: "12", label: "Views this week" },
  { icon: Bookmark, value: "4", label: "Saved by employers" },
  { icon: Calendar, value: "1", label: "Interview requests" },
] as const;

const ACTIVITY = [
  {
    text: "An employer in Dubai viewed your profile",
    time: "2 hours ago",
  },
  {
    text: "Your profile was saved by an employer in Abu Dhabi",
    time: "Yesterday",
  },
  {
    text: "New interview request from a family in Sharjah",
    time: "2 days ago",
  },
] as const;

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

export function CandidateDashboard() {
  const onNavigate = useCandidateNav();
  const firstName = "Maria";
  const showCompleteCta = PROFILE_COMPLETION < 100;

  return (
    <div className="flex min-h-full flex-1 flex-col bg-app-bg">
      <header className="flex items-center justify-between px-[18px] pt-4">
        <h1 className="font-head m-0 text-[20px] font-bold text-navy">
          Hi {firstName} 👋
        </h1>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="relative cursor-pointer border-none bg-transparent p-0"
            aria-label="Notifications"
          >
            <Bell size={20} className="text-ink" aria-hidden />
            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-[#E0245E]" />
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
          <ProfileProgressRing percent={PROFILE_COMPLETION} />
          <div className="min-w-0 flex-1">
            <p className="m-0 text-[14px] font-bold text-navy">
              Your profile is {PROFILE_COMPLETION}% complete
            </p>
            <p className="m-0 mt-1 text-[12px] leading-snug text-ink-soft">
              Add a video intro and references to reach 100%.
            </p>
          </div>
        </div>

        <div className="mb-4 grid grid-cols-3 gap-2">
          {STATS.map(({ icon: Icon, value, label }) => (
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
        <div className="space-y-2">
          {ACTIVITY.map((item) => (
            <div
              key={item.text}
              className="rounded-[13px] border border-border bg-white px-3.5 py-3"
            >
              <p className="m-0 text-[12.5px] font-semibold leading-snug text-ink">
                {item.text}
              </p>
              <p className="m-0 mt-1 text-[11px] text-ink-faint">{item.time}</p>
            </div>
          ))}
        </div>
      </div>

      <CandidateBottomNav active="Home" onNavigate={onNavigate} />
    </div>
  );
}
