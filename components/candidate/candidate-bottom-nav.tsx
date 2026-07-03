"use client";

import {
  Briefcase,
  Calendar,
  Home,
  MessageCircle,
  User,
} from "lucide-react";

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
  label: string;
  icon: React.ReactNode;
}[] = [
  {
    id: "Home",
    label: "Home",
    icon: <Home size={20} strokeWidth={2} aria-hidden />,
  },
  {
    id: "Messages",
    label: "Messages",
    icon: <MessageCircle size={20} strokeWidth={2} aria-hidden />,
  },
  {
    id: "Interviews",
    label: "Interviews",
    icon: <Calendar size={20} strokeWidth={2} aria-hidden />,
  },
  {
    id: "Jobs",
    label: "Jobs",
    icon: <Briefcase size={20} strokeWidth={2} aria-hidden />,
  },
  {
    id: "Profile",
    label: "Profile",
    icon: <User size={20} strokeWidth={2} aria-hidden />,
  },
];

export function CandidateBottomNav({
  active,
  onNavigate,
}: CandidateBottomNavProps) {
  return (
    <nav className="mt-auto flex shrink-0 justify-around border-t border-border bg-white px-1 pb-4 pt-2.5">
      {NAV_ITEMS.map(({ id, label, icon }) => {
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
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
