"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  FileText,
  HelpCircle,
  LogOut,
  MapPin,
  Shield,
  User,
} from "lucide-react";
import { FreshnessDot } from "@/components/employer/freshness-dot";
import {
  MARIA_PROFILE_DISPLAY,
  type CandidateProfileDisplay,
} from "@/lib/candidate-profile-display";
import { CandidateBottomNav } from "@/components/candidate/candidate-bottom-nav";
import { useCandidateNav } from "@/components/candidate/use-candidate-nav";

function StatPill({ label }: { label: string }) {
  return (
    <span className="rounded-[20px] bg-purple-light px-2.5 py-[5px] text-[11px] font-semibold text-[#4C1D95]">
      {label}
    </span>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 mt-4 text-[13px] font-bold text-ink first:mt-0">
      {children}
    </p>
  );
}

function NotificationToggle({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      aria-label="Notifications"
      onClick={() => onChange(!enabled)}
      className={`relative h-6 w-11 shrink-0 cursor-pointer rounded-full border-none transition-colors ${
        enabled ? "bg-purple" : "bg-border"
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-all ${
          enabled ? "left-[22px]" : "left-0.5"
        }`}
      />
    </button>
  );
}

function SettingsLinkRow({
  icon,
  label,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 border-b border-[#F1EFF9] py-3.5 no-underline last:border-b-0"
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-light text-purple">
        {icon}
      </span>
      <span className="flex-1 text-[13px] font-semibold text-ink">{label}</span>
      <ChevronRight size={16} className="shrink-0 text-ink-faint" aria-hidden />
    </Link>
  );
}

type CandidateProfileScreenProps = {
  profile?: CandidateProfileDisplay;
};

export function CandidateProfileScreen({
  profile = MARIA_PROFILE_DISPLAY,
}: CandidateProfileScreenProps) {
  const router = useRouter();
  const onNavigate = useCandidateNav();
  const [notificationsOn, setNotificationsOn] = useState(true);

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
          My Profile
        </h1>
        <Link
          href="/candidate/onboard"
          className="cursor-pointer border-none bg-transparent p-0 text-[13px] font-bold text-purple no-underline"
        >
          Edit
        </Link>
      </header>

      <div className="flex-1 overflow-y-auto px-[18px] pb-4 pt-5">
        <div className="mb-4 flex flex-col items-center text-center">
          <div className="relative mb-3 h-[88px] w-[88px] overflow-hidden rounded-full border-2 border-purple-light">
            <Image
              src={profile.photoUrl}
              alt=""
              fill
              className="object-cover"
              sizes="88px"
              priority
            />
          </div>
          <p className="font-head m-0 text-[18px] font-bold text-navy">
            {profile.name}
          </p>
          <p className="m-0 mt-1 text-[13px] text-ink-soft">
            {profile.nationalityFlag} Philippines
          </p>
          <p className="m-0 mt-1 flex items-center justify-center gap-1 text-[12px] text-ink-soft">
            <MapPin size={12} className="text-ink-faint" aria-hidden />
            {profile.location}
          </p>
          <div className="mt-2">
            <FreshnessDot lastActive={profile.lastActive} showLabel />
          </div>
        </div>

        <div className="mb-1 flex min-w-0 flex-wrap justify-center gap-1.5">
          {profile.stats.map((stat) => (
            <StatPill key={stat} label={stat} />
          ))}
        </div>

        <SectionTitle>About</SectionTitle>
        <p className="m-0 text-[12.5px] leading-relaxed text-ink-soft">
          {profile.bio}
        </p>

        <SectionTitle>Skills</SectionTitle>
        <div className="flex min-w-0 flex-wrap gap-1.5">
          {profile.skills.map((skill) => (
            <span
              key={skill}
              className="rounded-lg bg-purple-light px-2.5 py-[5px] text-[11px] font-semibold text-[#4C1D95]"
            >
              {skill}
            </span>
          ))}
        </div>

        <SectionTitle>Languages</SectionTitle>
        <p className="m-0 text-[12.5px] text-ink-soft">
          {profile.languages.join(", ")}
        </p>

        <SectionTitle>Employment history</SectionTitle>
        <div className="space-y-2.5">
          {profile.employmentHistory.map((job) => (
            <div key={`${job.role}-${job.years}`} className="flex gap-2.5">
              <div className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-purple-light">
                <Briefcase size={13} className="text-purple" aria-hidden />
              </div>
              <div>
                <p className="m-0 text-[12.5px] font-bold text-ink">
                  {job.role}
                </p>
                <p className="m-0 mt-px text-[11.5px] text-ink-soft">
                  {job.employer} · {job.location}
                </p>
                <p className="m-0 mt-px text-[10.5px] text-ink-faint">
                  {job.years}
                </p>
              </div>
            </div>
          ))}
        </div>

        <SectionTitle>Salary expectation</SectionTitle>
        <p className="m-0 text-[13px] font-bold text-purple">{profile.salary}</p>

        <SectionTitle>Availability</SectionTitle>
        <p className="m-0 text-[12.5px] text-ink-soft">{profile.availability}</p>

        <div className="my-5 border-t border-border" />

        <p className="m-0 mb-1 text-[13px] font-bold text-ink">Settings</p>
        <div className="rounded-[14px] border border-border bg-white px-3.5">
          <SettingsLinkRow
            icon={<User size={15} aria-hidden />}
            label="Edit Profile"
            href="/candidate/onboard"
          />
          <SettingsLinkRow
            icon={<FileText size={15} aria-hidden />}
            label="My Documents"
            href="/candidate/documents"
          />

          <div className="flex items-center gap-3 border-b border-[#F1EFF9] py-3.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-light text-purple">
              <Bell size={15} aria-hidden />
            </span>
            <span className="flex-1 text-[13px] font-semibold text-ink">
              Notifications
            </span>
            <NotificationToggle
              enabled={notificationsOn}
              onChange={setNotificationsOn}
            />
          </div>

          <SettingsLinkRow
            icon={<FileText size={15} aria-hidden />}
            label="Terms of Service"
            href="/candidate/terms"
          />
          <SettingsLinkRow
            icon={<Shield size={15} aria-hidden />}
            label="Privacy Policy"
            href="/candidate/privacy"
          />
          <SettingsLinkRow
            icon={<HelpCircle size={15} aria-hidden />}
            label="Help & Support"
            href="/candidate/support"
          />

          <button
            type="button"
            onClick={() => router.push("/candidate/auth")}
            className="flex w-full cursor-pointer items-center gap-3 border-none bg-transparent py-3.5"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FEE2E2] text-[#E0245E]">
              <LogOut size={15} aria-hidden />
            </span>
            <span className="text-[13px] font-bold text-[#E0245E]">Log Out</span>
          </button>
        </div>
      </div>

      <CandidateBottomNav active="Profile" onNavigate={onNavigate} />
    </div>
  );
}
