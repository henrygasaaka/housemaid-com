"use client";

import { useState } from "react";
import { ChevronDown, Phone } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { TopBar } from "@/components/ui/top-bar";
import { ScreenHeading } from "@/components/ui/screen-heading";
import { TextField } from "@/components/ui/text-field";
import { PrimaryButton } from "@/components/ui/primary-button";
import { PrivacyNote } from "@/components/candidate/security-footer";

type PhoneEntryScreenProps = {
  flow?: "login" | "signup";
};

export function PhoneEntryScreen({ flow = "signup" }: PhoneEntryScreenProps) {
  const router = useRouter();
  const t = useTranslations("auth");
  const tCommon = useTranslations("common");
  const [phone, setPhone] = useState("50 123 4567");
  const isLogin = flow === "login";

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <TopBar onBack={() => router.back()} accent="purple" />
      <ScreenHeading
        icon={<Phone size={26} className="text-purple" aria-hidden />}
        title={isLogin ? t("phoneWelcomeBack") : t("phoneWhatsYourNumber")}
        subtitle={
          isLogin ? t("phoneLoginSubtitle") : t("phoneSignupSubtitle")
        }
        accent="purple"
      />
      <div className="flex-1 px-[18px] pt-2.5">
        <div className="mb-3 flex items-center gap-2 rounded-xl border border-border px-3.5 py-3">
          <span className="text-sm font-semibold text-ink">{tCommon("uae")}</span>
          <span className="text-sm font-semibold text-ink">{tCommon("countryCode")}</span>
          <ChevronDown size={14} className="text-ink-faint" aria-hidden />
        </div>
        <TextField value={phone} onChange={setPhone} />
      </div>
      <div className="px-[18px] pb-[22px] pt-2.5">
        <PrimaryButton
          onClick={() =>
            router.push(`/candidate/auth/otp?flow=${flow}`)
          }
        >
          {isLogin ? t("logIn") : tCommon("continue")}
        </PrimaryButton>
        <PrivacyNote />
      </div>
    </div>
  );
}
