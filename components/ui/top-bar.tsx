"use client";

import { ChevronLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { Logo } from "@/components/logo";
import { LanguagePicker } from "@/components/ui/language-picker";

type TopBarProps = {
  onBack?: () => void;
  accent?: "purple" | "blue";
};

export function TopBar({ onBack, accent = "purple" }: TopBarProps) {
  const t = useTranslations("aria");

  return (
    <div className="flex items-center justify-between px-[18px] pt-4 pb-1.5">
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="flex cursor-pointer border-none bg-transparent p-1"
          aria-label={t("goBack")}
        >
          <ChevronLeft size={20} className="text-ink" aria-hidden />
        </button>
      ) : (
        <div className="w-5" />
      )}
      <Logo accent={accent} />
      <LanguagePicker />
    </div>
  );
}
