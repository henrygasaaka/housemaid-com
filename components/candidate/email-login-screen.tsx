"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { TopBar } from "@/components/ui/top-bar";
import { ScreenHeading } from "@/components/ui/screen-heading";
import { TextField } from "@/components/ui/text-field";
import { PrimaryButton } from "@/components/ui/primary-button";
import { PrivacyNote } from "@/components/candidate/security-footer";
import { getCandidateAuthCallbackUrl } from "@/lib/candidate-auth";
import { createClient } from "@/lib/supabase";

export function EmailLoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSendMagicLink() {
    const trimmed = email.trim();
    if (!trimmed) return;

    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email: trimmed,
      options: {
        emailRedirectTo: getCandidateAuthCallbackUrl(),
      },
    });

    setLoading(false);

    if (otpError) {
      setError(otpError.message);
      return;
    }

    setSent(true);
  }

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <TopBar onBack={() => router.back()} accent="purple" />
      <ScreenHeading
        icon={<Mail size={24} className="text-purple" aria-hidden />}
        title={sent ? "Check your email" : "Log in with email"}
        subtitle={
          sent
            ? `We sent a magic link to ${email.trim()}`
            : "Enter the email you signed up with"
        }
        accent="purple"
      />
      <div className="flex-1 px-[18px] pt-2.5">
        {!sent ? (
          <>
            <TextField
              icon={<Mail size={15} className="text-ink-faint" aria-hidden />}
              placeholder="Email address"
              value={email}
              onChange={setEmail}
              type="email"
            />
            {error && (
              <p className="mt-1 text-center text-[12.5px] text-[#B91C1C]">
                {error}
              </p>
            )}
          </>
        ) : (
          <p className="m-0 text-center text-[13px] leading-relaxed text-ink-soft">
            Tap the link in your email to sign in. You can close this page and
            return once you&apos;ve confirmed.
          </p>
        )}
      </div>
      <div className="px-[18px] pb-[22px] pt-2.5">
        {!sent ? (
          <PrimaryButton
            onClick={handleSendMagicLink}
            disabled={!email.trim() || loading}
          >
            {loading ? "Sending…" : "Send magic link"}
          </PrimaryButton>
        ) : (
          <PrimaryButton onClick={() => setSent(false)}>Use a different email</PrimaryButton>
        )}
        <PrivacyNote />
      </div>
    </div>
  );
}
