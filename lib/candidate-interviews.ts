export type InterviewStatus = "confirmed" | "interviewed";

export type CandidateInterview = {
  id: string;
  employer: string;
  role: string;
  date: string;
  time: string;
  location: string;
  status: InterviewStatus;
  section: "upcoming" | "past";
  messageThreadId?: string;
};

export const CANDIDATE_INTERVIEWS: CandidateInterview[] = [
  {
    id: "upcoming-al-rashid",
    employer: "Al Rashid Family",
    role: "Housemaid / Live-in",
    date: "Monday, 14 July 2026",
    time: "10:00 AM",
    location: "Dubai, Jumeirah",
    status: "confirmed",
    section: "upcoming",
    messageThreadId: "al-rashid",
  },
  {
    id: "past-khan",
    employer: "The Khan Family",
    role: "Housemaid / Part-time",
    date: "Wednesday, 25 June 2026",
    time: "2:00 PM",
    location: "Dubai, Mirdif",
    status: "interviewed",
    section: "past",
  },
];

const STATUS_META: Record<
  InterviewStatus,
  { label: string; color: string; bg: string }
> = {
  confirmed: { label: "Confirmed", color: "#15803D", bg: "#E8F8EE" },
  interviewed: { label: "Interviewed", color: "#6B7280", bg: "#F3F4F6" },
};

export function getInterviewStatusMeta(status: InterviewStatus) {
  return STATUS_META[status];
}
