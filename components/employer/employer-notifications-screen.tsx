"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Bell, ChevronLeft, Eye, Heart, Shield } from "lucide-react";
import { EmployerBottomNav } from "@/components/employer/employer-bottom-nav";
import { useEmployerNav } from "@/components/employer/use-employer-nav";

const NOTIFICATION_IDS = [
  { id: "reply", icon: "bell", iconBg: "bg-blue-light", timeKey: "oneHourAgo" },
  { id: "saved", icon: "heart", iconBg: "bg-[#FFF1F2]", timeKey: "threeHoursAgo" },
  { id: "viewed", icon: "eye", iconBg: "bg-blue-light", timeKey: "yesterday" },
  { id: "verified", icon: "shield", iconBg: "bg-green-light", timeKey: "twoDaysAgo" },
] as const;

export function EmployerNotificationsScreen() {
  const onNavigate = useEmployerNav();
  const t = useTranslations("employer.notifications");
  const tAria = useTranslations("aria");

  const icons = {
    bell: <Bell size={15} className="text-blue" aria-hidden />,
    heart: <Heart size={15} className="text-[#E11D48]" aria-hidden />,
    eye: <Eye size={15} className="text-blue" aria-hidden />,
    shield: <Shield size={15} className="text-green" aria-hidden />,
  };

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

      <div className="flex-1 overflow-y-auto px-[18px] py-2.5">
        {NOTIFICATION_IDS.map((item, index) => (
          <div
            key={item.id}
            className={`flex items-start gap-3 py-3 ${
              index < NOTIFICATION_IDS.length - 1
                ? "border-b border-[#F1EFF9]"
                : ""
            }`}
          >
            <div
              className={`flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full ${item.iconBg}`}
            >
              {icons[item.icon]}
            </div>
            <div className="min-w-0 flex-1">
              <p className="m-0 text-[13px] font-semibold leading-snug text-ink">
                {t(item.id)}
              </p>
              <p className="m-0 mt-0.5 text-[11px] text-ink-faint">
                {t(item.timeKey)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <EmployerBottomNav onNavigate={onNavigate} />
    </div>
  );
}
