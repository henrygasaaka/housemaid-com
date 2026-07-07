import type { SupabaseClient } from "@supabase/supabase-js";
import { mapRowToProfile, type CandidateRow } from "@/lib/candidate-db";
import { CANDIDATE_STATUS, VISA_LABELS } from "@/lib/candidate-profile";
import { getCountryName, normalizeNationalityCode } from "@/lib/countries";
import { lastActiveFromDate } from "@/lib/candidate-profile-display";
import type { DiscoverCandidate } from "@/lib/discover-candidates";
import type { AppTranslateFn } from "@/lib/i18n-types";
const PHOTO_TONES = ["#C9B8E8", "#A7D8C9", "#F3C7A5", "#B8D4E8", "#E8C9B8"];

export const DISCOVER_FILTERS = [
  "All",
  "Full-Time",
  "Part-Time",
  "Live-In",
  "Live-Out",
] as const;

export type DiscoverFilter = (typeof DISCOVER_FILTERS)[number];

const DISCOVER_FILTER_I18N_KEYS: Record<DiscoverFilter, string> = {
  All: "all",
  "Full-Time": "fullTime",
  "Part-Time": "partTime",
  "Live-In": "liveIn",
  "Live-Out": "liveOut",
};

export function getDiscoverFilterLabel(
  t: AppTranslateFn,
  filter: DiscoverFilter
): string {
  return t(`options.filters.${DISCOVER_FILTER_I18N_KEYS[filter]}`);
}

function photoToneFromId(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash + id.charCodeAt(i)) % PHOTO_TONES.length;
  }
  return PHOTO_TONES[hash]!;
}

function mapEmploymentLabels(employmentType: string | null): {
  type: string;
  live: string;
} {
  switch (employmentType) {
    case "live_in":
      return { type: "", live: "Live-In" };
    case "live_out":
      return { type: "", live: "Live-Out" };
    case "full_time":
      return { type: "Full-Time", live: "" };
    case "part_time":
      return { type: "Part-Time", live: "" };
    default:
      return { type: "", live: "" };
  }
}

function formatExperience(years: string | null): string {
  if (!years) return "";
  if (years.includes("Exp")) return years;
  return `${years} Exp.`;
}

function formatRate(row: CandidateRow): string {
  if (row.salary_min != null && row.salary_max != null) {
    return `AED ${row.salary_min.toLocaleString()} - ${row.salary_max.toLocaleString()}/mo`;
  }
  return "—";
}

function formatAvailability(availability: string | null): string {
  if (!availability) return "—";
  if (availability === "Available immediately") return "Available Now";
  return availability;
}

export function mapRowToDiscoverCandidate(row: CandidateRow): DiscoverCandidate {
  const profile = mapRowToProfile(row);
  const name =
    [profile.firstName?.trim(), profile.lastName?.trim()]
      .filter(Boolean)
      .join(" ") || "Candidate";
  const nationalityCode = normalizeNationalityCode(profile.nationality || "");
  const nationalityName = getCountryName(nationalityCode);
  const { type, live } = mapEmploymentLabels(row.employment_type);
  const visaKey = row.visa_status ?? "";

  return {
    id: row.id,
    name,
    nationalityCode,
    nationality: nationalityName || nationalityCode,
    location:
      [profile.emirate, profile.district].filter(Boolean).join(", ") || "—",
    visa: VISA_LABELS[visaKey] || visaKey || "—",
    exp: formatExperience(row.years_experience),
    type,
    live,
    rate: formatRate(row),
    bio: profile.about?.trim() || "—",
    photoTone: photoToneFromId(row.id),
    photoUrl: row.photo_url ?? undefined,
    responseTime: "",
    lastActive: lastActiveFromDate(row.last_active_at),
    available: formatAvailability(row.availability),
    skills: row.skills ?? [],
    employmentHistory: [],
    references: {
      count: 0,
      summary: "References are not available yet.",
    },
  };
}

export function sortDiscoverCandidates(
  candidates: DiscoverCandidate[]
): DiscoverCandidate[] {
  const freshnessRank: Record<string, number> = {
    today: 0,
    yesterday: 1,
    "this week": 2,
    "2 weeks ago": 3,
    "3 weeks ago": 4,
    "30+ days ago": 5,
  };

  return [...candidates].sort((a, b) => {
    const rankA = freshnessRank[a.lastActive] ?? 6;
    const rankB = freshnessRank[b.lastActive] ?? 6;
    if (rankA !== rankB) return rankA - rankB;
    return a.name.localeCompare(b.name);
  });
}

export function filterDiscoverCandidates(
  candidates: DiscoverCandidate[],
  filter: DiscoverFilter
): DiscoverCandidate[] {
  if (filter === "All") return candidates;

  return candidates.filter((candidate) => {
    switch (filter) {
      case "Full-Time":
        return candidate.type === "Full-Time";
      case "Part-Time":
        return candidate.type === "Part-Time";
      case "Live-In":
        return candidate.live === "Live-In";
      case "Live-Out":
        return candidate.live === "Live-Out";
      default:
        return true;
    }
  });
}

export async function fetchDiscoverCandidates(
  supabase: SupabaseClient
): Promise<DiscoverCandidate[]> {
  const { data, error } = await supabase
    .from("candidates")
    .select("*")
    .eq("status", CANDIDATE_STATUS.ACTIVE)
    .order("last_active_at", { ascending: false, nullsFirst: false });

  if (error) {
    console.error("[discover] Failed to load candidates:", error.message);
    throw new Error(error.message);
  }

  const rows = (data ?? []) as CandidateRow[];
  return sortDiscoverCandidates(rows.map(mapRowToDiscoverCandidate));
}

export async function fetchDiscoverCandidateById(
  supabase: SupabaseClient,
  id: string
): Promise<DiscoverCandidate | null> {
  const { data, error } = await supabase
    .from("candidates")
    .select("*")
    .eq("id", id)
    .eq("status", CANDIDATE_STATUS.ACTIVE)
    .maybeSingle();

  if (error) {
    console.error("[discover] Failed to load candidate:", error.message);
    throw new Error(error.message);
  }

  if (!data) return null;

  return mapRowToDiscoverCandidate(data as CandidateRow);
}
