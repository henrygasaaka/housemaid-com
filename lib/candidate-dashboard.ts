import type { SupabaseClient } from "@supabase/supabase-js";
import {
  mapRowToProfile,
  type CandidateRow,
} from "@/lib/candidate-db";
import type { CandidateProfile } from "@/lib/candidate-profile";
import type { AppTranslateFn } from "@/lib/i18n-types";

type CompletionField = {
  key: string;
  filled: (profile: Partial<CandidateProfile>) => boolean;
};

/** Fields that contribute to profile completion (aligned with onboard wizard). */
const COMPLETION_FIELDS: CompletionField[] = [
  { key: "firstName", filled: (p) => Boolean(p.firstName?.trim()) },
  { key: "lastName", filled: (p) => Boolean(p.lastName?.trim()) },
  { key: "phoneNumber", filled: (p) => Boolean(p.phone?.trim()) },
  { key: "nationality", filled: (p) => Boolean(p.nationality) },
  { key: "gender", filled: (p) => Boolean(p.gender) },
  { key: "emirate", filled: (p) => Boolean(p.emirate) },
  { key: "district", filled: (p) => Boolean(p.district) },
  { key: "visaStatus", filled: (p) => Boolean(p.visa) },
  { key: "availability", filled: (p) => Boolean(p.availability?.trim()) },
  { key: "experience", filled: (p) => Boolean(p.experience) },
  { key: "skills", filled: (p) => Boolean(p.skills?.length) },
  { key: "languages", filled: (p) => Boolean(p.languages?.length) },
  { key: "aboutYou", filled: (p) => Boolean(p.about?.trim()) },
  {
    key: "profilePhoto",
    filled: (p) => Boolean(p.photoUrl || p.photoUploaded),
  },
  {
    key: "salaryRange",
    filled: (p) => Boolean(p.salaryMin?.trim() && p.salaryMax?.trim()),
  },
  { key: "employmentType", filled: (p) => Boolean(p.employmentType) },
  {
    key: "videoIntro",
    filled: (p) => Boolean(p.videoStoragePath || p.videoUploaded),
  },
];

export type ProfileCompletion = {
  percent: number;
  missing: string[];
};

export function calculateProfileCompletion(
  profile: Partial<CandidateProfile>
): ProfileCompletion {
  const filled = COMPLETION_FIELDS.filter((field) => field.filled(profile));
  const percent = Math.round((filled.length / COMPLETION_FIELDS.length) * 100);
  const missing = COMPLETION_FIELDS.filter((field) => !field.filled(profile)).map(
    (field) => field.key
  );
  return { percent, missing };
}

export function getCompletionHint(t: AppTranslateFn, missing: string[]): string {
  if (missing.length === 0) {
    return t("completionFields.hints.complete");
  }
  if (missing.includes("videoIntro")) {
    return t("completionFields.hints.videoIntro");
  }
  const top = missing.slice(0, 2);
  if (top.length === 1) {
    return t("completionFields.hints.single", {
      field: t(`completionFields.${top[0]}`),
    });
  }
  return t("completionFields.hints.double", {
    field1: t(`completionFields.${top[0]}`),
    field2: t(`completionFields.${top[1]}`),
  });
}

export type CandidateDashboardStats = {
  /** No view-tracking table exists yet — always 0 until backend is added. */
  viewsThisWeek: number;
  savesCount: number;
  /** No interview-requests table exists yet — always 0 until backend is added. */
  interviewRequests: number;
};

export type CandidateDashboardData = {
  firstName: string;
  profile: Partial<CandidateProfile>;
  status: CandidateRow["status"];
  completion: ProfileCompletion;
  stats: CandidateDashboardStats;
};

export async function fetchCandidateDashboard(
  supabase: SupabaseClient,
  userId: string
): Promise<CandidateDashboardData | null> {
  const { data: row, error: rowError } = await supabase
    .from("candidates")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (rowError) {
    console.error("[dashboard] Failed to load candidate:", rowError.message);
    throw new Error(rowError.message);
  }

  if (!row) return null;

  const candidateRow = row as CandidateRow;
  const profile = mapRowToProfile(candidateRow);
  const completion = calculateProfileCompletion(profile);

  let savesCount = 0;
  const { count, error: savesError } = await supabase
    .from("saved_candidates")
    .select("*", { count: "exact", head: true })
    .eq("candidate_id", userId);

  if (savesError) {
    console.error("[dashboard] Failed to load save count:", savesError.message);
  } else if (count != null) {
    savesCount = count;
  }

  const firstName =
    candidateRow.first_name?.trim() ||
    profile.firstName?.trim() ||
    "there";

  return {
    firstName,
    profile,
    status: candidateRow.status ?? null,
    completion,
    stats: {
      viewsThisWeek: 0,
      savesCount,
      interviewRequests: 0,
    },
  };
}
