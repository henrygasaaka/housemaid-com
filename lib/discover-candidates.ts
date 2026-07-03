export type EmploymentHistoryEntry = {
  role: string;
  employer: string;
  location: string;
  years: string;
};

export type CandidateReferences = {
  count: number;
  summary: string;
};

export type DiscoverCandidate = {
  id: string;
  name: string;
  nationality: string;
  location: string;
  visa: string;
  exp: string;
  type: string;
  live: string;
  rate: string;
  bio: string;
  photoTone: string;
  photoUrl?: string;
  responseTime: string;
  lastActive: string;
  available: string;
  skills: string[];
  employmentHistory: EmploymentHistoryEntry[];
  references: CandidateReferences;
};

export function maskCandidateName(name: string): string {
  const parts = name.split(" ");
  if (parts.length < 2) return name;
  return `${parts[0]} ${parts[1]![0]}.`;
}
