import type { AppTranslateFn } from "@/lib/i18n-types";

export const JOB_FILTERS = [
  "All",
  "Full-Time",
  "Part-Time",
  "Live-In",
  "Live-Out",
] as const;

export type JobFilter = (typeof JOB_FILTERS)[number];

const JOB_FILTER_I18N_KEYS: Record<JobFilter, string> = {
  All: "all",
  "Full-Time": "fullTime",
  "Part-Time": "partTime",
  "Live-In": "liveIn",
  "Live-Out": "liveOut",
};

export function getJobFilterLabel(t: AppTranslateFn, filter: JobFilter): string {
  return t(`options.filters.${JOB_FILTER_I18N_KEYS[filter]}`);
}

export type CandidateJob = {
  id: string;
  familyName: string;
  location: string;
  role: string;
  salary: string;
  requirements: string[];
  posted: string;
  employmentType: "Full-Time" | "Part-Time";
  workArrangement: "Live-In" | "Live-Out";
};

export function filterJobs(
  jobs: CandidateJob[],
  filter: JobFilter
): CandidateJob[] {
  if (filter === "All") return jobs;
  if (filter === "Full-Time" || filter === "Part-Time") {
    return jobs.filter((job) => job.employmentType === filter);
  }
  return jobs.filter((job) => job.workArrangement === filter);
}
