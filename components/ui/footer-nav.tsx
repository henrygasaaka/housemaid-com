"use client";

import { ArrowLeft, ArrowRight, Shield } from "lucide-react";
import { useTranslations } from "next-intl";
import { PrimaryButton } from "@/components/ui/primary-button";

type FooterNavProps = {
  onContinue: () => void;
  onBack?: () => void;
  continueLabel?: string;
  disabled?: boolean;
  loading?: boolean;
  accent?: "purple" | "blue";
  error?: string | null;
};

export function FooterNav({
  onContinue,
  onBack,
  continueLabel,
  disabled,
  loading,
  accent = "purple",
  error,
}: FooterNavProps) {
  const t = useTranslations("common");

  return (
    <div className="px-[18px] pb-[22px] pt-2.5">
      {error && (
        <p className="mb-2 rounded-xl bg-red-50 px-3.5 py-2.5 text-center text-[12.5px] leading-relaxed text-[#B91C1C]">
          {error}
        </p>
      )}
      <div className="mb-2">
        <PrimaryButton
          onClick={onContinue}
          accent={accent}
          disabled={disabled || loading}
        >
          {loading ? t("saving") : (continueLabel ?? t("continue"))}
          {!loading && <ArrowRight size={16} aria-hidden />}
        </PrimaryButton>
      </div>
      {onBack && (
        <PrimaryButton onClick={onBack} accent={accent} outline>
          <ArrowLeft size={16} aria-hidden />
          {t("back")}
        </PrimaryButton>
      )}
      <p className="mt-3 flex items-center justify-center gap-[5px] text-center text-[11px] text-ink-faint">
        <Shield size={12} aria-hidden />
        {t("footerNavSafe")}
      </p>
    </div>
  );
}
