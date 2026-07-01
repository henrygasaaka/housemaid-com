export const CANDIDATE_STEPS = [
  "Basic Info",
  "Location & Visa",
  "Experience & Skills",
  "Media",
  "Review",
] as const;

export type CandidateProfile = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  nationality: string;
  gender: string;
  emirate: string;
  district: string;
  visa: string;
  availability: string;
  experience: string;
  skills: string[];
  languages: string[];
  about: string;
  salaryMin: string;
  salaryMax: string;
  employmentType: string;
  days: string[];
  photoUploaded: boolean;
  videoUploaded: boolean;
};

export const INITIAL_CANDIDATE_PROFILE: CandidateProfile = {
  firstName: "Maria",
  lastName: "Santos",
  email: "maria.santos@gmail.com",
  phone: "50 123 4567",
  nationality: "Philippines",
  gender: "Female",
  emirate: "Dubai",
  district: "Al Barsha",
  visa: "own",
  availability: "Available immediately",
  experience: "3 - 5 years",
  skills: ["Cleaning", "Cooking", "Childcare"],
  languages: ["English", "Tagalog"],
  about: "",
  salaryMin: "2,500",
  salaryMax: "3,000",
  employmentType: "livein",
  days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  photoUploaded: false,
  videoUploaded: false,
};

export const VISA_LABELS: Record<string, string> = {
  own: "Own visa",
  visit: "Visit visa",
  cancelled: "Cancelled visa",
  sponsored: "Sponsored visa",
  sponsorship: "Looking for sponsorship",
};

export const STORAGE_KEY = "housemaid-candidate-profile";

export function loadProfile(): CandidateProfile {
  if (typeof window === "undefined") return INITIAL_CANDIDATE_PROFILE;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_CANDIDATE_PROFILE;
    return { ...INITIAL_CANDIDATE_PROFILE, ...JSON.parse(raw) };
  } catch {
    return INITIAL_CANDIDATE_PROFILE;
  }
}

export function saveProfile(profile: CandidateProfile) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}
