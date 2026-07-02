import type { SupabaseClient } from "@supabase/supabase-js";
import {
  mapRowToProfile,
  type CandidateRow,
} from "@/lib/candidate-db";
import type { CandidateProfile } from "@/lib/candidate-profile";

type CompletionField = {
  label: string;
  filled: (profile: Partial<CandidateProfile>) => boolean;
};

/** Fields that contribute to profile completion (aligned with onboard wizard). */
const COMPLETION_FIELDS: CompletionField[] = [
  { label: "first name", filled: (p) => Boolean(p.firstName?.trim()) },
  { label: "last name", filled: (p) => Boolean(p.lastName?.trim()) },
  { label: "phone number", filled: (p) => Boolean(p.phone?.trim()) },
  { label: "nationality", filled: (p) => Boolean(p.nationality) },
  { label: "gender", filled: (p) => Boolean(p.gender) },
  { label: "emirate", filled: (p) => Boolean(p.emirate) },
  { label: "district", filled: (p) => Boolean(p.district) },
  { label: "visa status", filled: (p) => Boolean(p.visa) },
  { label: "availability", filled: (p) => Boolean(p.availability?.trim()) },
  { label: "experience", filled: (p) => Boolean(p.experience) },
  { label: "skills", filled: (p) => Boolean(p.skills?.length) },
  { label: "languages", filled: (p) => Boolean(p.languages?.length) },
  { label: "about you", filled: (p) => Boolean(p.about?.trim()) },
  {
    label: "profile photo",
    filled: (p) => Boolean(p.photoUrl || p.photoUploaded),
  },
  { label: "salary range", filled: (p) => Boolean(p.salaryMin?.trim() && p.salaryMax?.trim()) },
  { label: "employment type", filled: (p) => Boolean(p.employmentType) },
  {
    label: "video intro",
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
    (field) => field.label
  );
  return { percent, missing };
}

export function getCompletionHint(missing: string[]): string {
  if (missing.length === 0) {
    return "Your profile is fully complete.";
  }
  if (missing.includes("video intro")) {
    return "Add a video intro to stand out to employers.";
  }
  const top = missing.slice(0, 2);
  if (top.length === 1) {
    return `Add your ${top[0]} to improve your profile.`;
  }
  return `Add your ${top[0]} and ${top[1]} to improve your profile.`;
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
    candidateRow.first_name?.trim() || profile.firstName?.trim() || "there";

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
