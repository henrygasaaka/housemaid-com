export type InterviewStatus = "proposed" | "confirmed" | "interviewed";

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

const STATUS_META: Record<
  InterviewStatus,
  { label: string; color: string; bg: string }
> = {
  proposed: { label: "Proposed", color: "#CA8A04", bg: "#FEF3E2" },
  confirmed: { label: "Confirmed", color: "#15803D", bg: "#E8F8EE" },
  interviewed: { label: "Interviewed", color: "#6B7280", bg: "#F3F4F6" },
};

export function getInterviewStatusMeta(status: InterviewStatus) {
  return STATUS_META[status];
}
