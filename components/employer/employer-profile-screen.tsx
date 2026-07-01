"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  FileText,
  Heart,
  HelpCircle,
  LogOut,
  Mail,
  MapPin,
  Shield,
  User,
} from "lucide-react";
import { EmployerBottomNav } from "@/components/employer/employer-bottom-nav";
import { useEmployerNav } from "@/components/employer/use-employer-nav";
import { FREE_MESSAGE_LIMIT } from "@/lib/employer-session";

const FREE_MESSAGES_USED = 2;

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
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-light text-blue">
        {icon}
      </span>
      <span className="flex-1 text-[13px] font-semibold text-ink">{label}</span>
      <ChevronRight size={16} className="shrink-0 text-ink-faint" aria-hidden />
    </Link>
  );
}

export function EmployerProfileScreen() {
  const router = useRouter();
  const onNavigate = useEmployerNav();
  const progressPercent = (FREE_MESSAGES_USED / FREE_MESSAGE_LIMIT) * 100;

  return (
    <div className="flex min-h-full flex-1 flex-col bg-app-bg">
      <header className="border-b border-border bg-white px-[18px] py-3.5">
        <h1 className="font-head m-0 text-[17px] font-semibold text-navy">
          My Account
        </h1>
      </header>

      <div className="flex-1 overflow-y-auto px-[18px] pb-4 pt-4">
        <div className="mb-4 rounded-[14px] border border-border bg-white p-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-light">
              <User size={24} className="text-blue" aria-hidden />
            </div>
            <div className="min-w-0">
              <p className="m-0 text-[15.5px] font-extrabold text-navy">
                Ahmed Al Rashid
              </p>
              <p className="m-0 mt-1 flex items-center gap-1 text-[12px] text-ink-soft">
                <Mail size={12} className="shrink-0 text-ink-faint" aria-hidden />
                ahmed.alrashid@gmail.com
              </p>
              <p className="m-0 mt-0.5 flex items-center gap-1 text-[12px] text-ink-soft">
                <MapPin size={12} className="shrink-0 text-ink-faint" aria-hidden />
                Dubai
              </p>
            </div>
          </div>
        </div>

        <div className="mb-4 rounded-[14px] border border-border bg-white p-4">
          <p className="m-0 text-[13px] font-bold text-ink">
            {FREE_MESSAGES_USED} of {FREE_MESSAGE_LIMIT} free messages used
          </p>
          <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-border">
            <div
              className="h-full rounded-full bg-blue"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <p className="m-0 mb-1 text-[13px] font-bold text-ink">Settings</p>
        <div className="rounded-[14px] border border-border bg-white px-3.5">
          <SettingsLinkRow
            icon={<User size={15} aria-hidden />}
            label="Edit Profile"
            href="/employer/discover"
          />
          <SettingsLinkRow
            icon={<Heart size={15} aria-hidden />}
            label="Saved Candidates"
            href="/employer/saved"
          />
          <SettingsLinkRow
            icon={<FileText size={15} aria-hidden />}
            label="Terms of Service"
            href="/employer/terms"
          />
          <SettingsLinkRow
            icon={<Shield size={15} aria-hidden />}
            label="Privacy Policy"
            href="/employer/privacy"
          />
          <SettingsLinkRow
            icon={<HelpCircle size={15} aria-hidden />}
            label="Help & Support"
            href="/employer/support"
          />

          <button
            type="button"
            onClick={() => router.push("/employer/discover")}
            className="flex w-full cursor-pointer items-center gap-3 border-none bg-transparent py-3.5"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FEE2E2] text-[#E0245E]">
              <LogOut size={15} aria-hidden />
            </span>
            <span className="text-[13px] font-bold text-[#E0245E]">Log Out</span>
          </button>
        </div>
      </div>

      <EmployerBottomNav active="Profile" onNavigate={onNavigate} />
    </div>
  );
}
