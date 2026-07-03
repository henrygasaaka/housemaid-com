"use client";

import { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { getCandidateAuthCallbackUrl } from "@/lib/candidate-auth";
import { createClient } from "@/lib/supabase";

type GoogleAuthScreenProps = {
  mode: "login" | "signup";
};

export function GoogleAuthScreen({ mode }: GoogleAuthScreenProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function startGoogleAuth() {
      const supabase = createClient();
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: getCandidateAuthCallbackUrl(),
        },
      });

      if (!cancelled && oauthError) {
        setError(oauthError.message);
      }
    }

    startGoogleAuth();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="relative flex min-h-full flex-1 flex-col items-center justify-center bg-app-bg px-[30px]">
      <button
        type="button"
        onClick={() => router.back()}
        className="absolute left-4 top-4 flex cursor-pointer border-none bg-transparent p-1"
        aria-label="Go back"
      >
        <ChevronLeft size={20} className="text-ink" aria-hidden />
      </button>

      <svg width="40" height="40" viewBox="0 0 18 18" className="mb-[18px]" aria-hidden>
        <path
          fill="#4285F4"
          d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.71v2.26h2.92A8.78 8.78 0 0 0 17.64 9.2z"
        />
        <path
          fill="#34A853"
          d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.81.55-1.85.87-3.04.87-2.33 0-4.3-1.57-5-3.69H1v2.33A9 9 0 0 0 9 18z"
        />
        <path
          fill="#FBBC05"
          d="M4 10.74a5.4 5.4 0 0 1 0-3.48V4.93H1a9 9 0 0 0 0 8.14z"
        />
        <path
          fill="#EA4335"
          d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58A8.59 8.59 0 0 0 9 0 9 9 0 0 0 1 4.93l3 2.33C4.7 5.15 6.67 3.58 9 3.58z"
        />
      </svg>

      <p className="m-0 text-center text-[15.5px] font-bold text-navy">
        {error
          ? "Google sign-in failed"
          : mode === "login"
            ? "Log in with Google"
            : "Sign up with Google"}
      </p>
      <p className="mb-[22px] mt-1.5 text-center text-[12.5px] text-ink-soft">
        {error ?? "Redirecting you to Google…"}
      </p>

      {error && (
        <button
          type="button"
          onClick={() => router.push("/candidate/auth")}
          className="cursor-pointer rounded-[13px] border border-border bg-white px-4 py-2.5 text-[13px] font-semibold text-ink"
        >
          Back to login
        </button>
      )}
    </div>
  );
}
