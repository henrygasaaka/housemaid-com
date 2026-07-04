"use client";

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
  candidateName = "this candidate",
  actionLabel = "messaging",
  onCreateAccount,
  onLogin,
  onDismiss,
}: AccountGateSheetProps) {
  return (
    <BottomSheet open={open} onDismiss={onDismiss}>
      <p className="mb-1.5 mt-1 text-center text-[17px] font-extrabold text-navy">
        Create your free employer account
      </p>
      <p className="mb-[18px] text-center text-[12.5px] text-ink-soft">
        You&apos;re one step away from {actionLabel} {candidateName}.
      </p>

      <PrimaryButton accent="blue" onClick={onCreateAccount}>
        Create Account
      </PrimaryButton>

      <button
        type="button"
        onClick={onLogin}
        className="mt-2.5 flex w-full cursor-pointer items-center justify-center rounded-[13px] border border-border bg-white py-[13px] text-[14.5px] font-bold text-ink"
      >
        Log In
      </button>

      <p className="mt-3 text-center text-[10.5px] leading-normal text-ink-faint">
        By continuing, you agree to our{" "}
        <span className="font-semibold text-blue">Terms of Service</span> and{" "}
        <span className="font-semibold text-blue">Privacy Policy</span>.
      </p>
    </BottomSheet>
  );
}
