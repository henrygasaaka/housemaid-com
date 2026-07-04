export const JOB_FILTERS = [
  "All",
  "Full-Time",
  "Part-Time",
  "Live-In",
  "Live-Out",
] as const;

export type JobFilter = (typeof JOB_FILTERS)[number];

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
