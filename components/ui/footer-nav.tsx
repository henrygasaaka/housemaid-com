"use client";

import { ArrowLeft, ArrowRight, Shield } from "lucide-react";
import { PrimaryButton } from "@/components/ui/primary-button";

type FooterNavProps = {
  onContinue: () => void;
  onBack?: () => void;
  continueLabel?: string;
  disabled?: boolean;
  accent?: "purple" | "blue";
};

export function FooterNav({
  onContinue,
  onBack,
  continueLabel = "Continue",
  disabled,
  accent = "purple",
}: FooterNavProps) {
  return (
    <div className="px-[18px] pb-[22px] pt-2.5">
      <div className="mb-2">
        <PrimaryButton
          onClick={onContinue}
          accent={accent}
          disabled={disabled}
        >
          {continueLabel}
          <ArrowRight size={16} aria-hidden />
        </PrimaryButton>
      </div>
      {onBack && (
        <PrimaryButton onClick={onBack} accent={accent} outline>
          <ArrowLeft size={16} aria-hidden />
          Back
        </PrimaryButton>
      )}
      <p className="mt-3 flex items-center justify-center gap-[5px] text-center text-[11px] text-ink-faint">
        <Shield size={12} aria-hidden />
        Your information is safe with us. We will never share your data.
      </p>
    </div>
  );
}
