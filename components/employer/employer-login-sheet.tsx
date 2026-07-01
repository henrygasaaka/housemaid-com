"use client";

import { useEffect, useState } from "react";
import { Mail } from "lucide-react";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { TextField } from "@/components/ui/text-field";
import { PrimaryButton } from "@/components/ui/primary-button";
import { OAuthButton } from "@/components/employer/oauth-button";

type EmployerLoginSheetProps = {
  open: boolean;
  onLogin: () => void;
  onDismiss: () => void;
  onBack?: () => void;
};

export function EmployerLoginSheet({
  open,
  onLogin,
  onDismiss,
  onBack,
}: EmployerLoginSheetProps) {
  const [mode, setMode] = useState<"options" | "email">("options");
  const [contact, setContact] = useState("");

  function reset() {
    setMode("options");
    setContact("");
  }

  useEffect(() => {
    if (!open) reset();
  }, [open]);

  function handleDismiss() {
    reset();
    onDismiss();
  }

  function handleBack() {
    reset();
    if (onBack) onBack();
    else onDismiss();
  }

  if (mode === "email") {
    return (
      <BottomSheet open={open} onDismiss={handleDismiss}>
        <p className="mb-1.5 mt-1 text-center text-[17px] font-extrabold text-navy">
          Log in to your account
        </p>
        <p className="mb-[18px] text-center text-[12.5px] text-ink-soft">
          Enter the email you signed up with.
        </p>
        <TextField
          icon={<Mail size={15} className="text-ink-faint" aria-hidden />}
          placeholder="Email address"
          value={contact}
          onChange={setContact}
          type="email"
        />
        <PrimaryButton
          accent="blue"
          disabled={!contact.trim()}
          onClick={() => {
            onLogin();
            handleDismiss();
          }}
        >
          Log in
        </PrimaryButton>
        <button
          type="button"
          onClick={() => setMode("options")}
          className="mt-3.5 w-full cursor-pointer border-none bg-transparent text-center text-[13px] font-semibold text-ink-soft"
        >
          Back
        </button>
      </BottomSheet>
    );
  }

  return (
    <BottomSheet open={open} onDismiss={handleDismiss}>
      <p className="mb-1.5 mt-1 text-center text-[17px] font-extrabold text-navy">
        Log in to your account
      </p>
      <p className="mb-[18px] text-center text-[12.5px] text-ink-soft">
        Welcome back — pick up right where you left off.
      </p>

      <OAuthButton provider="google" primary onClick={onLogin} />
      <OAuthButton provider="apple" onClick={onLogin} />

      <button
        type="button"
        onClick={() => setMode("email")}
        className="mb-2.5 flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-[13px] border border-border py-[13px]"
      >
        <Mail size={17} className="text-blue" aria-hidden />
        <span className="text-[14.5px] font-bold text-ink">
          Continue with Email
        </span>
      </button>

      <button
        type="button"
        onClick={handleBack}
        className="mt-3.5 w-full cursor-pointer border-none bg-transparent text-center text-[13px] font-semibold text-ink-soft"
      >
        Back
      </button>
    </BottomSheet>
  );
}
