import type { AppTranslateFn } from "@/lib/i18n-types";

export const CANDIDATE_STEP_KEYS = [
  "basicInfo",
  "locationVisa",
  "experienceSkills",
  "media",
  "review",
] as const;

/** @deprecated Use getCandidateSteps(t) for translated labels */
export const CANDIDATE_STEPS = [
  "Basic Info",
  "Location & Visa",
  "Experience & Skills",
  "Media",
  "Review",
] as const;

export function getCandidateSteps(t: AppTranslateFn): string[] {
  return CANDIDATE_STEP_KEYS.map((key) => t(`onboard.steps.${key}`));
}

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
  photoUrl: string | null;
  photoStoragePath: string | null;
  videoStoragePath: string | null;
  videoFileName: string | null;
};

export const INITIAL_CANDIDATE_PROFILE: CandidateProfile = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  nationality: "",
  gender: "",
  emirate: "",
  district: "",
  visa: "",
  availability: "Available immediately",
  experience: "",
  skills: [],
  languages: [],
  about: "",
  salaryMin: "",
  salaryMax: "",
  employmentType: "",
  days: [],
  photoUploaded: false,
  videoUploaded: false,
  photoUrl: null,
  photoStoragePath: null,
  videoStoragePath: null,
  videoFileName: null,
};

export const VISA_STATUS = {
  OWN: "own_visa",
  VISIT: "visit_visa",
  CANCELLED: "cancelled_visa",
  SPONSORED: "sponsored_visa",
  LOOKING_FOR_SPONSORSHIP: "looking_for_sponsorship",
} as const;

export type VisaStatus = (typeof VISA_STATUS)[keyof typeof VISA_STATUS];

/** Confirmed on Supabase enum `visa_status` as of introspection. */
export const VISA_STATUS_DB_VALUES = [
  VISA_STATUS.OWN,
  VISA_STATUS.VISIT,
  VISA_STATUS.CANCELLED,
  VISA_STATUS.SPONSORED,
  VISA_STATUS.LOOKING_FOR_SPONSORSHIP,
] as const;

/** Wizard options that require ALTER TYPE before they can be saved. */
export const VISA_STATUS_PENDING_DB_VALUES = [] as const;

const LEGACY_VISA_MAP: Record<string, VisaStatus> = {
  own: VISA_STATUS.OWN,
  visit: VISA_STATUS.VISIT,
  cancelled: VISA_STATUS.CANCELLED,
  sponsored: VISA_STATUS.SPONSORED,
  sponsorship: VISA_STATUS.LOOKING_FOR_SPONSORSHIP,
};

export function normalizeVisaStatus(value: string): string {
  if (!value) return "";
  return LEGACY_VISA_MAP[value] ?? value;
}

const VISA_LABEL_TEXT: Record<VisaStatus, string> = {
  own_visa: "Own visa",
  visit_visa: "Visit visa",
  cancelled_visa: "Cancelled visa",
  sponsored_visa: "Sponsored visa",
  looking_for_sponsorship: "Looking for sponsorship",
};

export const VISA_LABELS: Record<string, string> = {
  ...VISA_LABEL_TEXT,
  own: VISA_LABEL_TEXT.own_visa,
  visit: VISA_LABEL_TEXT.visit_visa,
  cancelled: VISA_LABEL_TEXT.cancelled_visa,
  sponsored: VISA_LABEL_TEXT.sponsored_visa,
  sponsorship: VISA_LABEL_TEXT.looking_for_sponsorship,
};

const VISA_I18N_KEYS: Record<string, string> = {
  own_visa: "ownVisa",
  visit_visa: "visitVisa",
  cancelled_visa: "cancelledVisa",
  sponsored_visa: "sponsoredVisa",
  looking_for_sponsorship: "lookingForSponsorship",
  own: "ownVisa",
  visit: "visitVisa",
  cancelled: "cancelledVisa",
  sponsored: "sponsoredVisa",
  sponsorship: "lookingForSponsorship",
};

export function getVisaLabel(t: AppTranslateFn, key: string): string {
  const i18nKey = VISA_I18N_KEYS[key];
  return i18nKey ? t(`options.visaLabels.${i18nKey}`) : VISA_LABELS[key] || key;
}

export const EMPLOYMENT_TYPE = {
  LIVE_IN: "live_in",
  LIVE_OUT: "live_out",
} as const;

export type EmploymentType =
  (typeof EMPLOYMENT_TYPE)[keyof typeof EMPLOYMENT_TYPE];

const LEGACY_EMPLOYMENT_MAP: Record<string, EmploymentType> = {
  livein: EMPLOYMENT_TYPE.LIVE_IN,
  liveout: EMPLOYMENT_TYPE.LIVE_OUT,
};

export function normalizeEmploymentType(value: string): string {
  if (!value) return "";
  return LEGACY_EMPLOYMENT_MAP[value] ?? value;
}

export const EMPLOYMENT_LABELS: Record<string, string> = {
  [EMPLOYMENT_TYPE.LIVE_IN]: "Live-in",
  [EMPLOYMENT_TYPE.LIVE_OUT]: "Live-out",
  livein: "Live-in",
  liveout: "Live-out",
};

const EMPLOYMENT_I18N_KEYS: Record<string, string> = {
  [EMPLOYMENT_TYPE.LIVE_IN]: "liveIn",
  [EMPLOYMENT_TYPE.LIVE_OUT]: "liveOut",
  livein: "liveIn",
  liveout: "liveOut",
};

export function getEmploymentLabel(t: AppTranslateFn, key: string): string {
  const i18nKey = EMPLOYMENT_I18N_KEYS[key];
  return i18nKey
    ? t(`options.employmentLabels.${i18nKey}`)
    : EMPLOYMENT_LABELS[key] || key;
}

export const STORAGE_KEY = "housemaid-candidate-profile";

/** Confirmed on Supabase enum `candidate_status` (column `status`). */
export const CANDIDATE_STATUS = {
  DRAFT: "draft",
  ACTIVE: "active",
  PAUSED: "paused",
} as const;

export type CandidateStatus =
  (typeof CANDIDATE_STATUS)[keyof typeof CANDIDATE_STATUS];

export const CANDIDATE_STATUS_DB_VALUES = [
  CANDIDATE_STATUS.DRAFT,
  CANDIDATE_STATUS.ACTIVE,
  CANDIDATE_STATUS.PAUSED,
] as const;

export function loadProfile(): CandidateProfile {
  if (typeof window === "undefined") return INITIAL_CANDIDATE_PROFILE;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_CANDIDATE_PROFILE;
    const parsed = {
      ...INITIAL_CANDIDATE_PROFILE,
      ...JSON.parse(raw),
    } as CandidateProfile;
    parsed.visa = normalizeVisaStatus(parsed.visa);
    parsed.employmentType = normalizeEmploymentType(parsed.employmentType);
    return parsed;
  } catch {
    return INITIAL_CANDIDATE_PROFILE;
  }
}

export function saveProfile(profile: CandidateProfile) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

export function clearProfileDraft() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(STORAGE_KEY);
}
