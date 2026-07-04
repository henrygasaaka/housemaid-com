"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronLeft, Mail, Shield } from "lucide-react";
import { Logo } from "@/components/logo";
import { LanguagePicker } from "@/components/ui/language-picker";
import { GoogleIcon } from "@/components/candidate/google-icon";
import { SecurityFooter } from "@/components/candidate/security-footer";
import { buildEmployerOAuthRedirect } from "@/lib/employer-auth";
import { createClient } from "@/lib/supabase";

type EmployerAuthWelcomeScreenProps = {
  mode: "login" | "signup";
  authError?: string | null;
  nextPath?: string;
};

export function EmployerAuthWelcomeScreen({
  mode,
  authError,
  nextPath = "/employer/discover",
}: EmployerAuthWelcomeScreenProps) {
  const isLogin = mode === "login";
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(authError ?? null);

  useEffect(() => {
    if (typeof window === "undefined" || !window.location.hash) return;

    const hashParams = new URLSearchParams(window.location.hash.slice(1));
    const hashError =
      hashParams.get("error_description") ?? hashParams.get("error");

    if (hashError && !authError) {
      const description = hashError.toLowerCase();
      if (
        description.includes("unable to exchange external code") ||
        hashParams.get("error") === "server_error"
      ) {
        setError(
          "Google sign-in failed: Supabase could not verify your Google credentials. Check Google Cloud Console and Supabase Google provider settings."
        );
      }
    }

    const cleanUrl = window.location.pathname + window.location.search;
    window.history.replaceState(null, "", cleanUrl);
  }, [authError]);

  async function handleGoogleAuth() {
    setGoogleLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: buildEmployerOAuthRedirect(nextPath),
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
            href={isLogin ? "/" : "/employer/auth"}
            className="flex border-none bg-transparent p-1"
            aria-label="Go back"
          >
            <ChevronLeft size={20} className="text-ink" aria-hidden />
          </Link>
          <Logo accent="blue" />
        </div>
        <LanguagePicker />
      </div>

      <div className="flex-1 overflow-y-auto px-6">
        <div className="relative mx-auto my-8 flex h-24 w-24 items-center justify-center rounded-full bg-blue-light">
          <Shield size={40} className="text-blue" aria-hidden />
        </div>

        <h2 className="m-0 text-center text-[27px] font-extrabold text-navy">
          {isLogin ? "Welcome Back!" : "Create your account"}
        </h2>
        <p className="mb-[22px] mt-1.5 text-center text-sm text-ink-soft">
          {isLogin
            ? "Log in to browse and message candidates"
            : "Find the perfect match for your household"}
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
          className="mb-2.5 flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-[14px] border-none bg-blue py-[15px] disabled:cursor-default disabled:opacity-70"
        >
          <GoogleIcon variant="white" />
          <span className="text-[15px] font-bold text-white">
            {googleLoading ? "Redirecting…" : "Continue with Google"}
          </span>
        </button>

        <div className="mb-[22px] flex cursor-default items-center justify-center gap-2.5 rounded-[14px] border border-border py-[15px] opacity-60">
          <Mail size={17} className="text-navy" aria-hidden />
          <span className="text-[15px] font-bold text-navy">
            Email sign-in coming soon
          </span>
        </div>

        <p className="m-0 text-center text-[13px] text-ink-soft">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
        </p>
        <Link
          href={
            isLogin
              ? `/employer/auth/signup${nextPath !== "/employer/discover" ? `?next=${encodeURIComponent(nextPath)}` : ""}`
              : `/employer/auth${nextPath !== "/employer/discover" ? `?next=${encodeURIComponent(nextPath)}` : ""}`
          }
          className="mt-1 block cursor-pointer text-center text-[14.5px] font-bold text-blue no-underline"
        >
          {isLogin ? "Create Account" : "Log In"}
        </Link>
      </div>

      <SecurityFooter />
    </div>
  );
}
