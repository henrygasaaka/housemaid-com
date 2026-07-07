"use client";

import { ChevronLeft, Lock, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { Logo } from "@/components/logo";
import { LanguagePicker } from "@/components/ui/language-picker";
import { PrimaryButton } from "@/components/ui/primary-button";
import { FREE_MESSAGE_LIMIT } from "@/lib/employer-session";

type PaywallScreenProps = {
  used?: number;
  limit?: number;
  variant?: "messaging" | "profile";
  onUnlock: () => void;
  onBack: () => void;
};

export function PaywallScreen({
  used = FREE_MESSAGE_LIMIT,
  limit = FREE_MESSAGE_LIMIT,
  variant = "messaging",
  onUnlock,
  onBack,
}: PaywallScreenProps) {
  const t = useTranslations("employer.paywall");
  const tCommon = useTranslations("common");
  const tAria = useTranslations("aria");
  const isProfile = variant === "profile";

  const features = isProfile
    ? [
        t("profileFeatures.history"),
        t("profileFeatures.unmasked"),
        t("profileFeatures.oneTime"),
      ]
    : [
        t("messagingFeatures.unlimited"),
        t("messagingFeatures.smartFilters"),
        t("messagingFeatures.oneTime"),
      ];

  return (
    <div className="absolute inset-0 z-[60] flex min-h-full flex-1 flex-col bg-white px-[22px]">
      <div className="flex items-center justify-between pt-4">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onBack}
            className="-ml-2 flex cursor-pointer border-none bg-transparent p-1"
            aria-label={tAria("goBack")}
          >
            <ChevronLeft size={20} className="text-ink" aria-hidden />
          </button>
          <Logo accent="blue" />
        </div>
        <LanguagePicker />
      </div>

      <div className="flex flex-1 flex-col items-center justify-center text-center">
        {!isProfile && (
          <span className="mb-[22px] rounded-[20px] bg-[#FEF3E2] px-3 py-[5px] text-[11.5px] font-bold text-[#D97706]">
            {t("freeMessagesUsed", { used, limit })}
          </span>
        )}

        <div className={`relative mx-auto mb-4 h-[90px] w-[90px] ${isProfile ? "my-[22px]" : ""}`}>
          <div className="absolute inset-0 rounded-full bg-blue-light" />
          <Sparkles
            size={13}
            className="absolute left-0.5 top-1 text-[#C7D2FE]"
            aria-hidden
          />
          <Sparkles
            size={10}
            className="absolute bottom-2 right-0 text-[#C7D2FE]"
            aria-hidden
          />
          <Sparkles
            size={11}
            className="absolute right-[-2px] top-2.5 text-[#C7D2FE]"
            aria-hidden
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-[52px] w-[52px] items-center justify-center rounded-2xl bg-blue shadow-[0_8px_18px_rgba(59,91,254,0.35)]">
              <Lock size={24} className="text-white" strokeWidth={2.3} />
            </div>
          </div>
        </div>

        <h2 className="font-head m-0 text-[21px] font-semibold leading-snug text-navy">
          {isProfile ? t("unlockProfileTitle") : t("unlockMessagingTitle")}
        </h2>
        <p className="mb-[18px] mt-2 text-[13px] leading-normal text-ink-soft">
          {isProfile ? t("unlockProfileDesc") : t("unlockMessagingDesc")}
        </p>

        <ul className="mb-[18px] m-0 list-none space-y-2 p-0 text-left">
          {features.map((item) => (
            <li
              key={item}
              className="flex items-center gap-2 text-[12.5px] text-ink-soft"
            >
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue" />
              {item}
            </li>
          ))}
        </ul>

        <p className="m-0 text-[32px] font-extrabold text-blue">{tCommon("aed100")}</p>
        <p className="mb-1.5 mt-0 text-xs text-ink-soft">{tCommon("oneTimePayment")}</p>
        {!isProfile && (
          <p className="m-0 max-w-[280px] text-[11px] text-ink-faint">
            {t("freeAllowanceHint", { limit })}
          </p>
        )}
      </div>

      <div className="pb-6">
        <PrimaryButton accent="blue" onClick={onUnlock}>
          {tCommon("unlockAccess")}
        </PrimaryButton>
        <p className="mt-3 flex items-center justify-center gap-[5px] text-center text-[11.5px] text-ink-faint">
          <Lock size={12} aria-hidden />
          {tCommon("noSubscription")}
        </p>
      </div>
    </div>
  );
}
