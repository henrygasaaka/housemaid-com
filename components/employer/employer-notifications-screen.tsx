"use client";

import Link from "next/link";
import { Bell, ChevronLeft, Eye, Heart, Shield } from "lucide-react";
import { EmployerBottomNav } from "@/components/employer/employer-bottom-nav";
import { useEmployerNav } from "@/components/employer/use-employer-nav";

const NOTIFICATIONS = [
  {
    id: "reply",
    icon: <Bell size={15} className="text-blue" aria-hidden />,
    iconBg: "bg-blue-light",
    text: "Maria Santos replied to your message",
    time: "1 hour ago",
  },
  {
    id: "saved",
    icon: <Heart size={15} className="text-[#E11D48]" aria-hidden />,
    iconBg: "bg-[#FFF1F2]",
    text: "You saved Grace Wanjiru",
    time: "3 hours ago",
  },
  {
    id: "viewed",
    icon: <Eye size={15} className="text-blue" aria-hidden />,
    iconBg: "bg-blue-light",
    text: "You viewed Nilanthi Perera's profile",
    time: "Yesterday",
  },
  {
    id: "verified",
    icon: <Shield size={15} className="text-green" aria-hidden />,
    iconBg: "bg-green-light",
    text: "Your account is verified",
    time: "2 days ago",
  },
] as const;

export function EmployerNotificationsScreen() {
  const onNavigate = useEmployerNav();

  return (
    <div className="flex min-h-full flex-1 flex-col bg-app-bg">
      <header className="flex items-center gap-2 border-b border-border bg-white px-4 py-3.5">
        <Link
          href="/employer/discover"
          className="flex border-none bg-transparent p-0.5"
          aria-label="Go back"
        >
          <ChevronLeft size={20} className="text-ink" aria-hidden />
        </Link>
        <h1 className="font-head m-0 flex-1 text-[17px] font-semibold text-navy">
          Notifications
        </h1>
      </header>

      <div className="flex-1 overflow-y-auto px-[18px] py-2.5">
        {NOTIFICATIONS.map((item, index) => (
          <div
            key={item.id}
            className={`flex items-start gap-3 py-3 ${
              index < NOTIFICATIONS.length - 1
                ? "border-b border-[#F1EFF9]"
                : ""
            }`}
          >
            <div
              className={`flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full ${item.iconBg}`}
            >
              {item.icon}
            </div>
            <div className="min-w-0 flex-1">
              <p className="m-0 text-[13px] font-semibold leading-snug text-ink">
                {item.text}
              </p>
              <p className="m-0 mt-0.5 text-[11px] text-ink-faint">
                {item.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      <EmployerBottomNav onNavigate={onNavigate} />
    </div>
  );
}
