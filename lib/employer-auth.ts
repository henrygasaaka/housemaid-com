import type { SupabaseClient, User } from "@supabase/supabase-js";
import { getSiteUrl } from "@/lib/candidate-auth";
import { ensureEmployerRow } from "@/lib/messaging-db";

export const EMPLOYER_AUTH_CALLBACK_PATH = "/employer/auth/callback";
export const EMPLOYER_PENDING_ACTION_KEY = "housemaid-employer-pending-action";

export type EmployerPendingAction = "save" | "message" | "unlock";

export function getEmployerAuthCallbackUrl() {
  return `${getSiteUrl()}${EMPLOYER_AUTH_CALLBACK_PATH}`;
}

export function buildEmployerOAuthRedirect(returnPath: string) {
  const callback = new URL(getEmployerAuthCallbackUrl());
  callback.searchParams.set("next", returnPath);
  return callback.toString();
}

export function stashEmployerPendingAction(
  action: EmployerPendingAction,
  returnPath: string
) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(
    EMPLOYER_PENDING_ACTION_KEY,
    JSON.stringify({ action, returnPath })
  );
}

export function readStashedEmployerPendingAction(): {
  action: EmployerPendingAction;
  returnPath: string;
} | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(EMPLOYER_PENDING_ACTION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as {
      action?: EmployerPendingAction;
      returnPath?: string;
    };
    if (!parsed.action || !parsed.returnPath) return null;
    return { action: parsed.action, returnPath: parsed.returnPath };
  } catch {
    return null;
  }
}

export function clearStashedEmployerPendingAction() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(EMPLOYER_PENDING_ACTION_KEY);
}

export function employerDisplayNameFromUser(user: User): string {
  const meta = user.user_metadata ?? {};
  return (
    (typeof meta.full_name === "string" && meta.full_name.trim()) ||
    (typeof meta.name === "string" && meta.name.trim()) ||
    user.email?.split("@")[0] ||
    "Employer"
  );
}

export function employerEmailFromUser(user: User): string {
  return user.email ?? "";
}

export async function ensureEmployerFromAuthUser(
  supabase: SupabaseClient,
  user: User
) {
  const displayName = employerDisplayNameFromUser(user);
  await ensureEmployerRow(supabase, user.id, {
    fullName: displayName,
    familyName: displayName,
  });
}

export function getEmployerPostAuthPath(next: string | null): string {
  if (next && next.startsWith("/employer")) {
    return next;
  }
  return "/employer/discover";
}
