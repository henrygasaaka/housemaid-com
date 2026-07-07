import type { SupabaseClient } from "@supabase/supabase-js";
import { mapRowToProfile, type CandidateRow } from "@/lib/candidate-db";
import type { CandidateProfile } from "@/lib/candidate-profile";
import {
  EMPLOYMENT_LABELS,
  VISA_LABELS,
} from "@/lib/candidate-profile";
import { getCountryName, normalizeNationalityCode } from "@/lib/countries";
import type { EmploymentHistoryEntry } from "@/lib/discover-candidates";

export type CandidateProfileDisplay = {
  name: string;
  nationality: string;
  nationalityCode: string;
  location: string;
  photoUrl: string | null;
  lastActive: string;
  stats: string[];
  bio: string;
  skills: string[];
  languages: string[];
  employmentHistory: EmploymentHistoryEntry[];
  salary: string;
  availability: string;
};

/** @deprecated Emoji flags replaced by react-world-flags via nationalityCode. */
export const NATIONALITY_FLAGS: Record<string, string> = {
  Philippines: "🇵🇭",
  Kenya: "🇰🇪",
  "Sri Lanka": "🇱🇰",
  Bangladesh: "🇧🇩",
  India: "🇮🇳",
  Indonesia: "🇮🇩",
  Nepal: "🇳🇵",
  Ethiopia: "🇪🇹",
  Uganda: "🇺🇬",
  Other: "🌍",
};

/** Maps `last_active_at` to labels understood by FreshnessDot. */
export function lastActiveFromDate(iso: string | null | undefined): string {
  if (!iso) return "30+ days ago";

  const days = (Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24);
  if (days < 1) return "today";
  if (days < 2) return "yesterday";
  if (days < 7) return "this week";
  if (days < 14) return "2 weeks ago";
  if (days < 21) return "3 weeks ago";
  return "30+ days ago";
}

function formatSalary(
  row: CandidateRow,
  profile: Partial<CandidateProfile>
): string {
  if (row.salary_min != null && row.salary_max != null) {
    return `AED ${row.salary_min.toLocaleString()} - ${row.salary_max.toLocaleString()}/mo`;
  }
  if (profile.salaryMin?.trim() && profile.salaryMax?.trim()) {
    return `AED ${profile.salaryMin} - ${profile.salaryMax}/mo`;
  }
  return "—";
}

function buildStats(profile: Partial<CandidateProfile>): string[] {
  const stats: string[] = [];
  if (profile.experience) stats.push(profile.experience);
  if (profile.visa) {
    stats.push(VISA_LABELS[profile.visa] || profile.visa);
  }
  if (profile.employmentType) {
    stats.push(
      EMPLOYMENT_LABELS[profile.employmentType] || profile.employmentType
    );
  }
  return stats;
}

export function mapToCandidateProfileDisplay(
  row: CandidateRow,
  profile: Partial<CandidateProfile>
): CandidateProfileDisplay {
  const name =
    [profile.firstName?.trim(), profile.lastName?.trim()]
      .filter(Boolean)
      .join(" ") || "—";
  const nationalityCode = normalizeNationalityCode(profile.nationality || "");
  const nationalityName = getCountryName(nationalityCode);
  const location =
    [profile.emirate, profile.district].filter(Boolean).join(", ") || "—";

  return {
    name,
    nationality: nationalityName || nationalityCode,
    nationalityCode,
    location,
    photoUrl: profile.photoUrl ?? null,
    lastActive: lastActiveFromDate(row.last_active_at),
    stats: buildStats(profile),
    bio: profile.about?.trim() || "—",
    skills: profile.skills ?? [],
    languages: profile.languages ?? [],
    employmentHistory: [],
    salary: formatSalary(row, profile),
    availability: profile.availability?.trim() || "—",
  };
}

export async function fetchCandidateProfileDisplay(
  supabase: SupabaseClient,
  userId: string
): Promise<CandidateProfileDisplay | null> {
  const { data: row, error } = await supabase
    .from("candidates")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    console.error("[profile] Failed to load candidate:", error.message);
    throw new Error(error.message);
  }

  if (!row) return null;

  const candidateRow = row as CandidateRow;
  return mapToCandidateProfileDisplay(
    candidateRow,
    mapRowToProfile(candidateRow)
  );
}
