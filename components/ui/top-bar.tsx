"use client";

import { ChevronLeft, Globe, ChevronDown } from "lucide-react";
import { Logo } from "@/components/logo";

type TopBarProps = {
  onBack?: () => void;
  accent?: "purple" | "blue";
};

export function TopBar({ onBack, accent = "purple" }: TopBarProps) {
  return (
    <div className="flex items-center justify-between px-[18px] pt-4 pb-1.5">
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="flex cursor-pointer border-none bg-transparent p-1"
          aria-label="Go back"
        >
          <ChevronLeft size={20} className="text-ink" aria-hidden />
        </button>
      ) : (
        <div className="w-5" />
      )}
      <Logo accent={accent} />
      <div className="flex items-center gap-[3px] rounded-[20px] border border-border px-2.5 py-[5px] text-[12.5px] font-medium text-ink">
        <Globe size={13} aria-hidden />
        EN
        <ChevronDown size={12} aria-hidden />
      </div>
    </div>
  );
}
