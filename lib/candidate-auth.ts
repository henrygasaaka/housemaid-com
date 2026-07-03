import type { SupabaseClient } from "@supabase/supabase-js";
import { CANDIDATE_STATUS } from "@/lib/candidate-profile";

export const CANDIDATE_AUTH_CALLBACK_PATH = "/candidate/auth/callback";

const DEFAULT_SITE_URL = "http://localhost:3000";

/** Google OAuth redirect URI — must be allowlisted in Google Cloud Console. */
export function getSupabaseAuthCallbackUrl() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  if (!supabaseUrl) {
    return "https://YOUR_PROJECT.supabase.co/auth/v1/callback";
  }
  return `${supabaseUrl}/auth/v1/callback`;
}

/** Canonical app origin for OAuth/magic-link redirects (must match Supabase redirect allow list). */
export function getSiteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (configured) return configured;

  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  return DEFAULT_SITE_URL;
}

export function getCandidateAuthCallbackUrl() {
  return `${getSiteUrl()}${CANDIDATE_AUTH_CALLBACK_PATH}`;
}

export async function getCandidatePostAuthPath(
  supabase: SupabaseClient,
  userId: string
): Promise<"/candidate/dashboard" | "/candidate/onboard"> {
  const { data, error } = await supabase
    .from("candidates")
    .select("id, status")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    console.error("Failed to check candidate profile:", error.message);
    return "/candidate/onboard";
  }

  if (data?.status === CANDIDATE_STATUS.ACTIVE) {
    return "/candidate/dashboard";
  }

  return "/candidate/onboard";
}
