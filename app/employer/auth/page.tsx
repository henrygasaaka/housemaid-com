import { EmployerAuthWelcomeScreen } from "@/components/employer/employer-auth-welcome-screen";
import {
  getSupabaseAuthCallbackUrl,
} from "@/lib/candidate-auth";
import { getEmployerAuthCallbackUrl } from "@/lib/employer-auth";

function getAuthErrorMessage(error?: string) {
  if (!error) return null;

  if (error === "google_exchange_failed") {
    const supabaseCallback = getSupabaseAuthCallbackUrl();
    return [
      "Google sign-in failed: Supabase could not verify your Google credentials.",
      "",
      "Fix in Google Cloud Console → Credentials → your OAuth client:",
      `• Authorized redirect URI: ${supabaseCallback}`,
      "",
      "Fix in Supabase Dashboard → Authentication → Providers → Google:",
      "• Client ID and Client Secret must exactly match that Google OAuth client.",
      "• Use a Web application client (not iOS/Android).",
    ].join("\n");
  }

  const messages: Record<string, string> = {
    auth_failed: "Sign-in failed. Please try again.",
    missing_code: `Sign-in was interrupted. Ensure ${getEmployerAuthCallbackUrl()} is in Supabase redirect URLs.`,
    no_user: "We couldn't verify your account. Please try again.",
    profile_failed:
      "Signed in, but we couldn't finish setting up your employer profile. Please try again.",
  };

  return messages[error] ?? "Something went wrong.";
}

type PageProps = {
  searchParams: Promise<{ error?: string; next?: string }>;
};

export default async function EmployerAuthPage({ searchParams }: PageProps) {
  const { error, next } = await searchParams;
  const authError = getAuthErrorMessage(error);

  return (
    <EmployerAuthWelcomeScreen
      mode="login"
      authError={authError}
      nextPath={next ?? "/employer/discover"}
    />
  );
}
