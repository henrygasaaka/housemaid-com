"use client";

import {
  Calendar,
  Heart,
  Home,
  MessageCircle,
  User,
} from "lucide-react";

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
  label: string;
  icon: React.ReactNode;
}[] = [
  {
    id: "Discover",
    label: "Discover",
    icon: <Home size={20} strokeWidth={2} aria-hidden />,
  },
  {
    id: "Saved",
    label: "Saved",
    icon: <Heart size={20} strokeWidth={2} aria-hidden />,
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
    id: "Profile",
    label: "Profile",
    icon: <User size={20} strokeWidth={2} aria-hidden />,
  },
];

export function EmployerBottomNav({
  active,
  onNavigate,
}: EmployerBottomNavProps) {
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
              isActive ? "text-blue" : "text-ink-faint"
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
