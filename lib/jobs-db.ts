import type { SupabaseClient } from "@supabase/supabase-js";
import {
  employerDisplayName,
  formatRelativeTime,
  type EmployerRow,
} from "@/lib/messaging-db";
import type { CandidateJob } from "@/lib/candidate-jobs";

/** Expected once migration 20260704100200 is applied in Supabase. */
export type JobPostingRow = {
  id: string;
  created_at: string;
  updated_at: string;
  employer_id: string;
  title: string;
  emirate: string | null;
  district: string | null;
  salary_min: number | null;
  salary_max: number | null;
  salary_period: "monthly" | "hourly" | string | null;
  employment_type: "full_time" | "part_time" | string | null;
  work_arrangement: "live_in" | "live_out" | string | null;
  requirements: string[] | null;
  status: string;
};

export type JobApplicationRow = {
  id: string;
  job_id: string;
  candidate_id: string;
  created_at: string;
  status: string;
};

type JobPostingWithEmployer = JobPostingRow & {
  employers: EmployerRow | EmployerRow[] | null;
};

function pickEmployer(
  employers: EmployerRow | EmployerRow[] | null
): EmployerRow | null {
  if (!employers) return null;
  return Array.isArray(employers) ? employers[0] ?? null : employers;
}

function isMissingTableError(error: { code?: string; message?: string }): boolean {
  return (
    error.code === "PGRST205" ||
    /could not find the table/i.test(error.message ?? "")
  );
}

function mapScheduleType(value: string | null): CandidateJob["employmentType"] {
  switch (value) {
    case "part_time":
      return "Part-Time";
    case "full_time":
    default:
      return "Full-Time";
  }
}

function mapWorkArrangement(
  value: string | null
): CandidateJob["workArrangement"] {
  switch (value) {
    case "live_out":
      return "Live-Out";
    case "live_in":
    default:
      return "Live-In";
  }
}

function formatJobSalary(row: JobPostingRow): string {
  const { salary_min: min, salary_max: max, salary_period: period } = row;
  const isHourly = period === "hourly";

  if (min != null && max != null) {
    if (isHourly) {
      return `AED ${min.toLocaleString()}-${max.toLocaleString()}/hour`;
    }
    if (min === max) {
      return `AED ${min.toLocaleString()}/mo`;
    }
    return `AED ${min.toLocaleString()} - ${max.toLocaleString()}/mo`;
  }

  if (min != null) {
    return isHourly
      ? `AED ${min.toLocaleString()}/hour`
      : `AED ${min.toLocaleString()}/mo`;
  }

  return "—";
}

function formatJobLocation(row: JobPostingRow): string {
  return [row.emirate, row.district].filter(Boolean).join(", ") || "—";
}

export function mapJobPostingRow(row: JobPostingWithEmployer): CandidateJob {
  const employer = pickEmployer(row.employers);

  return {
    id: row.id,
    familyName: employerDisplayName(employer),
    location: formatJobLocation(row),
    role: row.title,
    salary: formatJobSalary(row),
    requirements: row.requirements ?? [],
    posted: formatRelativeTime(row.created_at),
    employmentType: mapScheduleType(row.employment_type),
    workArrangement: mapWorkArrangement(row.work_arrangement),
  };
}

export async function fetchCandidateJobs(
  supabase: SupabaseClient
): Promise<CandidateJob[]> {
  const { data, error } = await supabase
    .from("job_postings")
    .select("*, employers(*)")
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (error) {
    if (isMissingTableError(error)) {
      console.warn(
        "[jobs] job_postings table not found — run supabase/migrations/20260704100200_create_job_postings.sql"
      );
      return [];
    }
    console.error("[jobs] Failed to load jobs:", error.message);
    throw new Error(error.message);
  }

  const rows = (data ?? []) as JobPostingWithEmployer[];
  return rows.map(mapJobPostingRow);
}

export async function fetchCandidateJobInterests(
  supabase: SupabaseClient,
  candidateId: string
): Promise<Set<string>> {
  const { data, error } = await supabase
    .from("job_applications")
    .select("job_id")
    .eq("candidate_id", candidateId);

  if (error) {
    if (isMissingTableError(error)) {
      return new Set();
    }
    console.error("[jobs] Failed to load interests:", error.message);
    throw new Error(error.message);
  }

  const rows = (data ?? []) as Pick<JobApplicationRow, "job_id">[];
  return new Set(rows.map((row) => row.job_id));
}

export async function expressJobInterest(
  supabase: SupabaseClient,
  candidateId: string,
  jobId: string
): Promise<{ ok: true } | { ok: false; reason: "missing_table" | "error"; message?: string }> {
  const { error } = await supabase.from("job_applications").insert({
    job_id: jobId,
    candidate_id: candidateId,
    status: "interested",
  });

  if (error) {
    if (isMissingTableError(error)) {
      return { ok: false, reason: "missing_table" };
    }
    if (error.code === "23505") {
      return { ok: true };
    }
    console.error("[jobs] Failed to express interest:", error.message);
    return { ok: false, reason: "error", message: error.message };
  }

  return { ok: true };
}
