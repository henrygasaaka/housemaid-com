"use client";

import {
  Briefcase,
  Calendar,
  Home,
  MessageCircle,
  User,
} from "lucide-react";
import { useTranslations } from "next-intl";

export type CandidateNavItem =
  | "Home"
  | "Messages"
  | "Interviews"
  | "Jobs"
  | "Profile";

type CandidateBottomNavProps = {
  active: CandidateNavItem;
  onNavigate?: (item: CandidateNavItem) => void;
};

const NAV_ITEMS: {
  id: CandidateNavItem;
  labelKey: "home" | "messages" | "interviews" | "jobs" | "profile";
  icon: React.ReactNode;
}[] = [
  {
    id: "Home",
    labelKey: "home",
    icon: <Home size={20} strokeWidth={2} aria-hidden />,
  },
  {
    id: "Messages",
    labelKey: "messages",
    icon: <MessageCircle size={20} strokeWidth={2} aria-hidden />,
  },
  {
    id: "Interviews",
    labelKey: "interviews",
    icon: <Calendar size={20} strokeWidth={2} aria-hidden />,
  },
  {
    id: "Jobs",
    labelKey: "jobs",
    icon: <Briefcase size={20} strokeWidth={2} aria-hidden />,
  },
  {
    id: "Profile",
    labelKey: "profile",
    icon: <User size={20} strokeWidth={2} aria-hidden />,
  },
];

export function CandidateBottomNav({
  active,
  onNavigate,
}: CandidateBottomNavProps) {
  const t = useTranslations("nav.candidate");

  return (
    <nav className="mt-auto flex shrink-0 justify-around border-t border-border bg-white px-1 pb-4 pt-2.5">
      {NAV_ITEMS.map(({ id, labelKey, icon }) => {
        const isActive = id === active;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onNavigate?.(id)}
            className={`flex cursor-pointer flex-col items-center gap-[3px] border-none bg-transparent p-0 ${
              isActive ? "text-purple" : "text-ink-faint"
            }`}
          >
            {icon}
            <span
              className={`text-[9.5px] ${isActive ? "font-bold" : "font-medium"}`}
            >
              {t(labelKey)}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
