"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
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
  fetchCandidateProfileDisplay,
  type CandidateProfileDisplay,
} from "@/lib/candidate-profile-display";
import { CandidateBottomNav } from "@/components/candidate/candidate-bottom-nav";
import { useCandidateNav } from "@/components/candidate/use-candidate-nav";
import { createClient } from "@/lib/supabase";

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
  const tAria = useTranslations("aria");
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      aria-label={tAria("notifications")}
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

function ProfileSkeleton() {
  return (
    <div className="flex min-h-full min-w-0 flex-1 flex-col overflow-x-hidden bg-app-bg animate-pulse">
      <header className="flex items-center gap-2 border-b border-border bg-white px-4 py-3.5">
        <div className="h-5 w-5 rounded bg-border" />
        <div className="mx-auto h-5 w-24 rounded bg-border" />
        <div className="h-4 w-8 rounded bg-border" />
      </header>
      <div className="flex flex-col items-center px-[18px] pt-5">
        <div className="mb-3 h-[88px] w-[88px] rounded-full bg-border" />
        <div className="mb-2 h-5 w-40 rounded bg-border" />
        <div className="h-4 w-28 rounded bg-border" />
      </div>
    </div>
  );
}

export function CandidateProfileScreen({
  profile: profileOverride,
}: CandidateProfileScreenProps) {
  const router = useRouter();
  const onNavigate = useCandidateNav();
  const t = useTranslations("candidate.profile");
  const tCommon = useTranslations("common");
  const tAria = useTranslations("aria");
  const tErrors = useTranslations("errors");
  const [notificationsOn, setNotificationsOn] = useState(true);
  const [profile, setProfile] = useState<CandidateProfileDisplay | null>(
    profileOverride ?? null
  );
  const [loading, setLoading] = useState(!profileOverride);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (profileOverride) return;

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
        const data = await fetchCandidateProfileDisplay(supabase, user.id);
        if (cancelled) return;

        if (!data) {
          router.replace("/candidate/onboard");
          return;
        }

        setProfile(data);
        setLoadError(null);
      } catch (error) {
        if (cancelled) return;
        console.error("[profile] Failed to load:", error);
        setLoadError(
          error instanceof Error
            ? error.message
            : tErrors("loadProfileShort")
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [profileOverride, router]);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/candidate/auth");
  }

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (loadError || !profile) {
    return (
      <div className="flex min-h-full flex-1 flex-col items-center justify-center bg-app-bg px-6 text-center">
        <p className="m-0 text-[14px] font-semibold text-navy">
          {loadError ?? tCommon("profileNotFound")}
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-4 cursor-pointer rounded-[11px] border-none bg-purple px-4 py-2.5 text-[13px] font-bold text-white"
        >
          {tCommon("tryAgain")}
        </button>
      </div>
    );
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
          {t("title")}
        </h1>
        <Link
          href="/candidate/onboard"
          className="cursor-pointer border-none bg-transparent p-0 text-[13px] font-bold text-purple no-underline"
        >
          {t("edit")}
        </Link>
      </header>

      <div className="flex-1 overflow-y-auto px-[18px] pb-4 pt-5">
        <div className="mb-4 flex flex-col items-center text-center">
          <div className="relative mb-3 flex h-[88px] w-[88px] items-center justify-center overflow-hidden rounded-full border-2 border-purple-light bg-purple-light">
            {profile.photoUrl ? (
              <Image
                src={profile.photoUrl}
                alt=""
                fill
                className="object-cover"
                sizes="88px"
                priority
              />
            ) : (
              <User size={36} className="text-purple" aria-hidden />
            )}
          </div>
          <p className="font-head m-0 text-[18px] font-bold text-navy">
            {profile.name}
          </p>
          {profile.nationality && (
            <p className="m-0 mt-1 text-[13px] text-ink-soft">
              {profile.nationality}
            </p>
          )}
          <p className="m-0 mt-1 flex items-center justify-center gap-1 text-[12px] text-ink-soft">
            <MapPin size={12} className="text-ink-faint" aria-hidden />
            {profile.location}
          </p>
          <div className="mt-2">
            <FreshnessDot lastActive={profile.lastActive} showLabel />
          </div>
        </div>

        <div className="mb-1 flex min-w-0 flex-wrap justify-center gap-1.5">
          {profile.stats.length > 0 ? (
            profile.stats.map((stat) => <StatPill key={stat} label={stat} />)
          ) : (
            <p className="m-0 text-[12px] text-ink-faint">
              {tCommon("completeProfileForStats")}
            </p>
          )}
        </div>

        <SectionTitle>{t("about")}</SectionTitle>
        <p className="m-0 text-[12.5px] leading-relaxed text-ink-soft">
          {profile.bio}
        </p>

        <SectionTitle>{t("skills")}</SectionTitle>
        {profile.skills.length > 0 ? (
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
        ) : (
          <p className="m-0 text-[12.5px] text-ink-faint">{tCommon("noSkillsAdded")}</p>
        )}

        <SectionTitle>{t("languages")}</SectionTitle>
        <p className="m-0 text-[12.5px] text-ink-soft">
          {profile.languages.length > 0
            ? profile.languages.join(", ")
            : "—"}
        </p>

        <SectionTitle>{t("employmentHistory")}</SectionTitle>
        {profile.employmentHistory.length > 0 ? (
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
        ) : (
          <p className="m-0 text-[12.5px] text-ink-faint">
            {tCommon("employmentHistoryNotAvailable")}
          </p>
        )}

        <SectionTitle>{t("salaryExpectation")}</SectionTitle>
        <p className="m-0 text-[13px] font-bold text-purple">{profile.salary}</p>

        <SectionTitle>{t("availability")}</SectionTitle>
        <p className="m-0 text-[12.5px] text-ink-soft">{profile.availability}</p>

        <div className="my-5 border-t border-border" />

        <p className="m-0 mb-1 text-[13px] font-bold text-ink">{tCommon("settings")}</p>
        <div className="rounded-[14px] border border-border bg-white px-3.5">
          <SettingsLinkRow
            icon={<User size={15} aria-hidden />}
            label={t("editProfile")}
            href="/candidate/onboard"
          />
          <SettingsLinkRow
            icon={<FileText size={15} aria-hidden />}
            label={t("myDocuments")}
            href="/candidate/documents"
          />

          <div className="flex items-center gap-3 border-b border-[#F1EFF9] py-3.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-light text-purple">
              <Bell size={15} aria-hidden />
            </span>
            <span className="flex-1 text-[13px] font-semibold text-ink">
              {tCommon("notifications")}
            </span>
            <NotificationToggle
              enabled={notificationsOn}
              onChange={setNotificationsOn}
            />
          </div>

          <SettingsLinkRow
            icon={<FileText size={15} aria-hidden />}
            label={tCommon("termsOfService")}
            href="/candidate/terms"
          />
          <SettingsLinkRow
            icon={<Shield size={15} aria-hidden />}
            label={tCommon("privacyPolicy")}
            href="/candidate/privacy"
          />
          <SettingsLinkRow
            icon={<HelpCircle size={15} aria-hidden />}
            label={tCommon("helpSupport")}
            href="/candidate/support"
          />

          <button
            type="button"
            onClick={() => void handleLogout()}
            className="flex w-full cursor-pointer items-center gap-3 border-none bg-transparent py-3.5"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FEE2E2] text-[#E0245E]">
              <LogOut size={15} aria-hidden />
            </span>
            <span className="text-[13px] font-bold text-[#E0245E]">
              {tCommon("logOut")}
            </span>
          </button>
        </div>
      </div>

      <CandidateBottomNav active="Profile" onNavigate={onNavigate} />
    </div>
  );
}
