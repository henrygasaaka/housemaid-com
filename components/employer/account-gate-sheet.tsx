"use client";

import { useTranslations } from "next-intl";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { PrimaryButton } from "@/components/ui/primary-button";

type AccountGateSheetProps = {
  open: boolean;
  candidateName?: string;
  actionLabel?: string;
  onCreateAccount: () => void;
  onLogin: () => void;
  onDismiss: () => void;
};

export function AccountGateSheet({
  open,
  candidateName,
  actionLabel,
  onCreateAccount,
  onLogin,
  onDismiss,
}: AccountGateSheetProps) {
  const tCommon = useTranslations("common");

  const resolvedCandidateName = candidateName ?? tCommon("thisCandidate");
  const resolvedActionLabel = actionLabel ?? tCommon("actionMessaging");

  return (
    <BottomSheet open={open} onDismiss={onDismiss}>
      <p className="mb-1.5 mt-1 text-center text-[17px] font-extrabold text-navy">
        {tCommon("gateCreateAccount")}
      </p>
      <p className="mb-[18px] text-center text-[12.5px] text-ink-soft">
        {tCommon("gateOneStepAway", {
          actionLabel: resolvedActionLabel,
          candidateName: resolvedCandidateName,
        })}
      </p>

      <PrimaryButton accent="blue" onClick={onCreateAccount}>
        {tCommon("createAccount")}
      </PrimaryButton>

      <button
        type="button"
        onClick={onLogin}
        className="mt-2.5 flex w-full cursor-pointer items-center justify-center rounded-[13px] border border-border bg-white py-[13px] text-[14.5px] font-bold text-ink"
      >
        {tCommon("logIn")}
      </button>

      <p className="mt-3 text-center text-[10.5px] leading-normal text-ink-faint">
        {tCommon("gateTermsAgree", {
          terms: tCommon("termsOfService"),
          privacy: tCommon("privacyPolicy"),
        })}
      </p>
    </BottomSheet>
  );
}
