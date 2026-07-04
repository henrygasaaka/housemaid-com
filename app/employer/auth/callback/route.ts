import { NextResponse } from "next/server";
import { getSiteUrl } from "@/lib/candidate-auth";
import {
  ensureEmployerFromAuthUser,
  getEmployerPostAuthPath,
} from "@/lib/employer-auth";
import { createClient } from "@/lib/supabase/server";

function mapOAuthError(
  oauthError: string,
  errorDescription: string | null
): string {
  const description = errorDescription?.toLowerCase() ?? "";

  if (
    description.includes("unable to exchange external code") ||
    oauthError === "server_error"
  ) {
    return "google_exchange_failed";
  }

  return "auth_failed";
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const siteUrl = getSiteUrl();
  const next = searchParams.get("next");

  const oauthError = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  if (oauthError) {
    console.error("Employer OAuth provider error:", oauthError, errorDescription);
    const errorCode = mapOAuthError(oauthError, errorDescription);
    return NextResponse.redirect(`${siteUrl}/employer/auth?error=${errorCode}`);
  }

  const code = searchParams.get("code");

  if (!code) {
    console.error(
      "Employer auth callback missing code. Params:",
      Object.fromEntries(searchParams.entries())
    );
    return NextResponse.redirect(
      `${siteUrl}/employer/auth?error=missing_code`
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("Employer auth callback error:", error.message);
    return NextResponse.redirect(`${siteUrl}/employer/auth?error=auth_failed`);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(`${siteUrl}/employer/auth?error=no_user`);
  }

  try {
    await ensureEmployerFromAuthUser(supabase, user);
  } catch (ensureError) {
    console.error("Failed to ensure employer row:", ensureError);
    return NextResponse.redirect(`${siteUrl}/employer/auth?error=profile_failed`);
  }

  const destination = getEmployerPostAuthPath(next);
  return NextResponse.redirect(`${siteUrl}${destination}`);
}
