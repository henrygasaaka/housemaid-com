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

export const CANDIDATE_JOBS: CandidateJob[] = [
  {
    id: "mansouri",
    familyName: "Al Mansouri Family",
    location: "Dubai, Arabian Ranches",
    role: "Live-in Housemaid",
    salary: "AED 2,500 - 3,000/mo",
    requirements: ["3+ years exp", "Cooking", "Childcare"],
    posted: "2 days ago",
    employmentType: "Full-Time",
    workArrangement: "Live-In",
  },
  {
    id: "private-employer",
    familyName: "Private Employer",
    location: "Abu Dhabi, Khalifa City",
    role: "Part-time Cleaner",
    salary: "AED 30-40/hour",
    requirements: ["Cleaning", "Ironing"],
    posted: "5 days ago",
    employmentType: "Part-Time",
    workArrangement: "Live-Out",
  },
  {
    id: "roberts",
    familyName: "The Roberts Family",
    location: "Sharjah, Al Nahda",
    role: "Full-time Nanny",
    salary: "AED 2,800/mo",
    requirements: ["Childcare", "English fluency"],
    posted: "1 week ago",
    employmentType: "Full-Time",
    workArrangement: "Live-In",
  },
];

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
