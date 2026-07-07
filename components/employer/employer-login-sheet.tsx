"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Mail } from "lucide-react";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { TextField } from "@/components/ui/text-field";
import { PrimaryButton } from "@/components/ui/primary-button";
import { OAuthButton } from "@/components/employer/oauth-button";
import {
  buildEmployerOAuthRedirect,
  stashEmployerPendingAction,
  type EmployerPendingAction,
} from "@/lib/employer-auth";
import { createClient } from "@/lib/supabase";

type EmployerLoginSheetProps = {
  open: boolean;
  pendingAction?: EmployerPendingAction | null;
  onDismiss: () => void;
  onBack?: () => void;
};

export function EmployerLoginSheet({
  open,
  pendingAction = null,
  onDismiss,
  onBack,
}: EmployerLoginSheetProps) {
  const router = useRouter();
  const t = useTranslations("auth");
  const tCommon = useTranslations("common");
  const [mode, setMode] = useState<"options" | "email">("options");
  const [contact, setContact] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setMode("options");
    setContact("");
    setError(null);
    setGoogleLoading(false);
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

  function currentReturnPath() {
    if (typeof window === "undefined") return "/employer/discover";
    return window.location.pathname + window.location.search;
  }

  async function handleGoogleAuth() {
    setGoogleLoading(true);
    setError(null);

    const returnPath = currentReturnPath();
    if (pendingAction) {
      stashEmployerPendingAction(pendingAction, returnPath);
    }

    const supabase = createClient();
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: buildEmployerOAuthRedirect(returnPath),
      },
    });

    if (oauthError) {
      setError(oauthError.message);
      setGoogleLoading(false);
    }
  }

  function handleEmailContinue() {
    const returnPath = currentReturnPath();
    if (pendingAction) {
      stashEmployerPendingAction(pendingAction, returnPath);
    }
    handleDismiss();
    router.push(
      `/employer/auth?next=${encodeURIComponent(returnPath)}`
    );
  }

  if (mode === "email") {
    return (
      <BottomSheet open={open} onDismiss={handleDismiss}>
        <p className="mb-1.5 mt-1 text-center text-[17px] font-extrabold text-navy">
          {t("loginToYourAccount")}
        </p>
        <p className="mb-[18px] text-center text-[12.5px] text-ink-soft">
          {t("loginSheetEmailHint")}
        </p>
        <TextField
          icon={<Mail size={15} className="text-ink-faint" aria-hidden />}
          placeholder={t("emailAddressPlaceholder")}
          value={contact}
          onChange={setContact}
          type="email"
        />
        <PrimaryButton
          accent="blue"
          disabled={!contact.trim()}
          onClick={handleEmailContinue}
        >
          {tCommon("continue")}
        </PrimaryButton>
        <button
          type="button"
          onClick={() => setMode("options")}
          className="mt-3.5 w-full cursor-pointer border-none bg-transparent text-center text-[13px] font-semibold text-ink-soft"
        >
          {tCommon("back")}
        </button>
      </BottomSheet>
    );
  }

  return (
    <BottomSheet open={open} onDismiss={handleDismiss}>
      <p className="mb-1.5 mt-1 text-center text-[17px] font-extrabold text-navy">
        {t("loginToYourAccount")}
      </p>
      <p className="mb-[18px] text-center text-[12.5px] text-ink-soft">
        {t("loginSheetWelcome")}
      </p>

      {error && (
        <p className="mb-3 rounded-xl bg-red-50 px-3 py-2 text-center text-[12px] text-[#B91C1C]">
          {error}
        </p>
      )}

      <OAuthButton
        provider="google"
        primary
        disabled={googleLoading}
        onClick={() => void handleGoogleAuth()}
      />
      <OAuthButton
        provider="apple"
        disabled={googleLoading}
        onClick={() => void handleGoogleAuth()}
      />

      <button
        type="button"
        onClick={() => setMode("email")}
        className="mb-2.5 flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-[13px] border border-border py-[13px]"
      >
        <Mail size={17} className="text-blue" aria-hidden />
        <span className="text-[14.5px] font-bold text-ink">
          {t("continueWithEmail")}
        </span>
      </button>

      <button
        type="button"
        onClick={handleBack}
        className="mt-3.5 w-full cursor-pointer border-none bg-transparent text-center text-[13px] font-semibold text-ink-soft"
      >
        {tCommon("back")}
      </button>
    </BottomSheet>
  );
}
