"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ChevronLeft,
  Heart,
  Mail,
  Phone,
  Shield,
  Sparkles,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { LanguagePicker } from "@/components/ui/language-picker";
import { GoogleIcon } from "@/components/candidate/google-icon";
import { SecurityFooter } from "@/components/candidate/security-footer";
import { CANDIDATE_WELCOME_PHOTO } from "@/lib/landing-photos/candidate-welcome";
import { getCandidateAuthCallbackUrl } from "@/lib/candidate-auth";
import { createClient } from "@/lib/supabase";

type AuthWelcomeScreenProps = {
  mode: "login" | "signup";
  authError?: string | null;
};

export function AuthWelcomeScreen({ mode, authError }: AuthWelcomeScreenProps) {
  const isLogin = mode === "login";
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(authError ?? null);

  async function handleGoogleAuth() {
    setGoogleLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: getCandidateAuthCallbackUrl(),
      },
    });

    if (oauthError) {
      setError(oauthError.message);
      setGoogleLoading(false);
    }
  }

  return (
    <div className="flex min-h-full flex-1 flex-col bg-white">
      <div className="flex items-center justify-between px-[18px] pt-4">
        <div className="flex items-center gap-1.5">
          <Link
            href={isLogin ? "/" : "/candidate/auth"}
            className="flex border-none bg-transparent p-1"
            aria-label="Go back"
          >
            <ChevronLeft size={20} className="text-ink" aria-hidden />
          </Link>
          <Logo accent="purple" />
        </div>
        <LanguagePicker />
      </div>

      <div className="flex-1 overflow-y-auto px-6">
        <div className="relative mx-auto my-3 text-center">
          <div className="relative mx-auto h-[300px] w-full max-w-[300px] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={CANDIDATE_WELCOME_PHOTO}
              alt=""
              className="block h-full w-full object-contain"
            />
            <Sparkles
              size={14}
              className="absolute right-[18px] top-3.5 text-[#F59E0B]"
              aria-hidden
            />
            <Heart
              size={18}
              className="absolute right-2.5 top-[38px] text-[#C9B8E8]"
              aria-hidden
            />
            {isLogin && (
              <Shield
                size={20}
                className="absolute left-3.5 top-6 text-purple"
                aria-hidden
              />
            )}
          </div>
        </div>

        <h2 className="m-0 text-center text-[27px] font-extrabold text-navy">
          {isLogin ? "Welcome Back!" : "Create your account"}
        </h2>
        <p className="mb-[22px] mt-1.5 text-center text-sm text-ink-soft">
          {isLogin ? "Login to your account" : "Find the right job in minutes"}
        </p>

        {error && (
          <p className="mb-3 whitespace-pre-line rounded-xl bg-red-50 px-3.5 py-2.5 text-center text-[12.5px] leading-relaxed text-[#B91C1C]">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={handleGoogleAuth}
          disabled={googleLoading}
          className="mb-2.5 flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-[14px] border-none bg-purple py-[15px] disabled:cursor-default disabled:opacity-70"
        >
          <GoogleIcon variant="white" />
          <span className="text-[15px] font-bold text-white">
            {googleLoading ? "Redirecting…" : "Continue with Google"}
          </span>
        </button>

        {isLogin && (
          <Link
            href="/candidate/auth/email"
            className="mb-2.5 flex cursor-pointer items-center justify-center gap-2.5 rounded-[14px] border border-border py-[15px] no-underline"
          >
            <Mail size={17} className="text-navy" aria-hidden />
            <span className="text-[15px] font-bold text-navy">
              Continue with Email
            </span>
          </Link>
        )}

        <Link
          href={`/candidate/auth/phone?flow=${isLogin ? "login" : "signup"}`}
          className="mb-[22px] flex cursor-pointer items-center justify-center gap-2.5 rounded-[14px] border border-border py-[15px] no-underline"
        >
          <Phone size={17} className="text-navy" aria-hidden />
          <span className="text-[15px] font-bold text-navy">
            Continue with Phone Number
          </span>
        </Link>

        <p className="m-0 text-center text-[13px] text-ink-soft">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
        </p>
        <Link
          href={isLogin ? "/candidate/auth/signup" : "/candidate/auth"}
          className="mt-1 block cursor-pointer text-center text-[14.5px] font-bold text-purple no-underline"
        >
          {isLogin ? "Create Account" : "Log In"}
        </Link>
      </div>

      <SecurityFooter />
    </div>
  );
}
