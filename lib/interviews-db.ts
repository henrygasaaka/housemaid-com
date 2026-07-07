import type { SupabaseClient } from "@supabase/supabase-js";
import {
  employerDisplayName,
  type EmployerRow,
} from "@/lib/messaging-db";
import type { CandidateInterview, InterviewStatus } from "@/lib/candidate-interviews";

/** Verified via PostgREST — interview fields live on conversations. */
export type InterviewConversationRow = {
  id: string;
  created_at: string;
  updated_at: string;
  candidate_id: string;
  employer_id: string;
  status:
    | "interview_requested"
    | "interview_scheduled"
    | "interviewed"
    | string;
  interview_date: string | null;
  interview_time: string | null;
};

const INTERVIEW_STATUSES = [
  "interview_requested",
  "interview_scheduled",
  "interviewed",
] as const;

type InterviewConversationWithEmployer = InterviewConversationRow & {
  employers: EmployerRow | EmployerRow[] | null;
};

function pickEmployer(
  employers: EmployerRow | EmployerRow[] | null
): EmployerRow | null {
  if (!employers) return null;
  return Array.isArray(employers) ? employers[0] ?? null : employers;
}

function mapInterviewStatus(dbStatus: string): InterviewStatus {
  switch (dbStatus) {
    case "interview_requested":
      return "proposed";
    case "interview_scheduled":
      return "confirmed";
    case "interviewed":
      return "interviewed";
    default:
      return "confirmed";
  }
}

function mapInterviewSection(dbStatus: string): "upcoming" | "past" {
  return dbStatus === "interviewed" ? "past" : "upcoming";
}

import type { AppTranslateFn } from "@/lib/i18n-types";

function formatInterviewDate(value: string | null, t?: AppTranslateFn): string {
  if (!value) return t ? t("time.toBeConfirmed") : "To be confirmed";
  const parsed = new Date(value.includes("T") ? value : `${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatInterviewTime(value: string | null, t?: AppTranslateFn): string {
  if (!value) return t ? t("time.toBeConfirmed") : "To be confirmed";

  const timeMatch = value.match(/^(\d{1,2}):(\d{2})(?::\d{2})?/);
  if (timeMatch) {
    const hours = Number.parseInt(timeMatch[1]!, 10);
    const minutes = timeMatch[2]!;
    const date = new Date();
    date.setHours(hours, Number.parseInt(minutes, 10), 0, 0);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  return value;
}

export function mapInterviewConversationRow(
  row: InterviewConversationWithEmployer,
  t?: AppTranslateFn
): CandidateInterview {
  const employer = pickEmployer(row.employers);

  return {
    id: row.id,
    employer: employerDisplayName(employer, t),
    role: "—",
    date: formatInterviewDate(row.interview_date, t),
    time: formatInterviewTime(row.interview_time, t),
    location: "—",
    status: mapInterviewStatus(row.status),
    section: mapInterviewSection(row.status),
    messageThreadId: row.id,
  };
}

export async function fetchCandidateInterviews(
  supabase: SupabaseClient,
  candidateId: string,
  t?: AppTranslateFn
): Promise<CandidateInterview[]> {
  const { data, error } = await supabase
    .from("conversations")
    .select("*, employers(*)")
    .eq("candidate_id", candidateId)
    .in("status", [...INTERVIEW_STATUSES])
    .order("interview_date", { ascending: true, nullsFirst: false });

  if (error) {
    console.error("[interviews] Failed to load interviews:", error.message);
    throw new Error(error.message);
  }

  const rows = (data ?? []) as InterviewConversationWithEmployer[];

  return rows
    .map((row) => mapInterviewConversationRow(row, t))
    .sort((a, b) => {
      if (a.section !== b.section) {
        return a.section === "upcoming" ? -1 : 1;
      }
      return a.date.localeCompare(b.date);
    });
}
