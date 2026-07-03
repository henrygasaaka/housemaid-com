"use client";

import { useState } from "react";
import { Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import { TopBar } from "@/components/ui/top-bar";
import { ScreenHeading } from "@/components/ui/screen-heading";
import { PrimaryButton } from "@/components/ui/primary-button";
import { PrivacyNote } from "@/components/candidate/security-footer";

type OtpScreenProps = {
  flow?: "login" | "signup";
};

export function OtpScreen({ flow = "signup" }: OtpScreenProps) {
  const router = useRouter();
  const [code, setCode] = useState(["", "", "", "", "", ""]);

  function handleDigit(i: number, val: string) {
    if (!/^\d?$/.test(val)) return;
    const next = [...code];
    next[i] = val;
    setCode(next);
  }

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <TopBar onBack={() => router.back()} accent="purple" />
      <ScreenHeading
        icon={<Shield size={24} className="text-purple" aria-hidden />}
        title="Enter verification code"
        subtitle={
          <>
            We&apos;ve sent a 6-digit code to <br />
            <span className="font-bold text-ink">+971 50 123 4567</span>
          </>
        }
        accent="purple"
      />
      <div className="flex justify-center gap-2 px-[18px] py-6">
        {code.map((d, i) => (
          <input
            key={i}
            value={d}
            onChange={(e) => handleDigit(i, e.target.value)}
            maxLength={1}
            inputMode="numeric"
            aria-label={`Digit ${i + 1}`}
            className="h-[50px] w-[42px] rounded-[10px] border border-border text-center text-lg font-bold text-ink outline-none"
          />
        ))}
      </div>
      <div className="flex-1 text-center">
        <p className="m-0 text-[12.5px] text-ink-soft">
          Didn&apos;t receive the code?
        </p>
        <p className="mt-1 text-[13px] font-bold text-purple">Resend in 00:25</p>
      </div>
      <div className="px-[18px] pb-[22px] pt-2.5">
        <PrimaryButton onClick={() => router.push("/candidate/onboard")}>
          Verify
        </PrimaryButton>
        <PrivacyNote />
      </div>
    </div>
  );
}
