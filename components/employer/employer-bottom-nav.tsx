"use client";

import {
  Calendar,
  Heart,
  Home,
  MessageCircle,
  User,
} from "lucide-react";
import { useTranslations } from "next-intl";

export type EmployerNavItem =
  | "Discover"
  | "Saved"
  | "Messages"
  | "Interviews"
  | "Profile";

type EmployerBottomNavProps = {
  active?: EmployerNavItem;
  onNavigate?: (item: EmployerNavItem) => void;
};

const NAV_ITEMS: {
  id: EmployerNavItem;
  labelKey: "discover" | "saved" | "messages" | "interviews" | "profile";
  icon: React.ReactNode;
}[] = [
  {
    id: "Discover",
    labelKey: "discover",
    icon: <Home size={20} strokeWidth={2} aria-hidden />,
  },
  {
    id: "Saved",
    labelKey: "saved",
    icon: <Heart size={20} strokeWidth={2} aria-hidden />,
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
    id: "Profile",
    labelKey: "profile",
    icon: <User size={20} strokeWidth={2} aria-hidden />,
  },
];

export function EmployerBottomNav({
  active,
  onNavigate,
}: EmployerBottomNavProps) {
  const t = useTranslations("nav.employer");

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
              isActive ? "text-blue" : "text-ink-faint"
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
