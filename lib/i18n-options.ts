import type { AppTranslateFn } from "@/lib/i18n-types";
import { getCountryName, normalizeNationalityCode } from "@/lib/countries";

/** @deprecated Use COUNTRY_CODES from lib/countries — kept for reference. */
export const NATIONALITY_VALUES = [
  "Philippines",
  "Kenya",
  "Sri Lanka",
  "Bangladesh",
  "India",
  "Indonesia",
  "Nepal",
  "Ethiopia",
  "Uganda",
  "Other",
] as const;

const NATIONALITY_KEYS = [
  "philippines",
  "kenya",
  "sriLanka",
  "bangladesh",
  "india",
  "indonesia",
  "nepal",
  "ethiopia",
  "uganda",
  "other",
] as const;

export const EMIRATE_VALUES = [
  "Dubai",
  "Abu Dhabi",
  "Sharjah",
  "Ajman",
  "Ras Al Khaimah",
  "Fujairah",
  "Umm Al Quwain",
] as const;

const EMIRATE_KEYS = [
  "dubai",
  "abuDhabi",
  "sharjah",
  "ajman",
  "rasAlKhaimah",
  "fujairah",
  "ummAlQuwain",
] as const;

export const DISTRICT_VALUES = [
  "Al Barsha",
  "Deira",
  "Al Nahda",
  "Khalifa City",
  "Jumeirah",
  "Mirdif",
  "Marina",
  "Al Quoz",
  "Downtown",
] as const;

const DISTRICT_KEYS = [
  "alBarsha",
  "deira",
  "alNahda",
  "khalifaCity",
  "jumeirah",
  "mirdif",
  "marina",
  "alQuoz",
  "downtown",
] as const;

export const AVAILABILITY_VALUES = [
  "Available immediately",
  "Within 1 week",
  "Within 2 weeks",
  "Within 1 month",
  "Currently employed",
] as const;

const AVAILABILITY_KEYS = [
  "availableImmediately",
  "withinOneWeek",
  "withinTwoWeeks",
  "withinOneMonth",
  "currentlyEmployed",
] as const;

export const EXPERIENCE_VALUES = [
  "Less than 1 year",
  "1 - 3 years",
  "3 - 5 years",
  "5+ years",
] as const;

const EXPERIENCE_KEYS = [
  "lessThanOneYear",
  "oneToThreeYears",
  "threeToFiveYears",
  "fivePlusYears",
] as const;

export const SKILL_VALUES = [
  "Cleaning",
  "Cooking",
  "Childcare",
  "Laundry",
  "Ironing",
  "Elderly care",
  "Pet care",
  "Car washing",
  "Gardening",
  "Tutoring",
  "Disabled care",
  "Other",
] as const;

const SKILL_KEYS = [
  "cleaning",
  "cooking",
  "childcare",
  "laundry",
  "ironing",
  "elderlyCare",
  "petCare",
  "carWashing",
  "gardening",
  "tutoring",
  "disabledCare",
  "other",
] as const;

export const SKILL_ICONS: Record<(typeof SKILL_VALUES)[number], string> = {
  Cleaning: "🧹",
  Cooking: "🍳",
  Childcare: "🍼",
  Laundry: "🧺",
  Ironing: "👕",
  "Elderly care": "🧑‍🦳",
  "Pet care": "🐾",
  "Car washing": "🚗",
  Gardening: "🌿",
  Tutoring: "📖",
  "Disabled care": "♿",
  Other: "···",
};

export const LANGUAGE_VALUES = [
  "English",
  "Arabic",
  "Tagalog",
  "Hindi",
  "Urdu",
  "Tamil",
  "French",
  "Other",
] as const;

const LANGUAGE_KEYS = [
  "english",
  "arabic",
  "tagalog",
  "hindi",
  "urdu",
  "tamil",
  "french",
  "other",
] as const;

export const DAY_VALUES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

const DAY_KEYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;

function labelFromPairs(
  t: AppTranslateFn,
  namespace: string,
  value: string,
  values: readonly string[],
  keys: readonly string[]
): string {
  const idx = values.indexOf(value);
  return idx >= 0 ? t(`${namespace}.${keys[idx]}`) : value;
}

export function getNationalityLabel(_t: AppTranslateFn, value: string): string {
  return getCountryName(normalizeNationalityCode(value));
}

export function getEmirateLabel(t: AppTranslateFn, value: string): string {
  return labelFromPairs(t, "options.emirates", value, EMIRATE_VALUES, EMIRATE_KEYS);
}

export function getDistrictLabel(t: AppTranslateFn, value: string): string {
  return labelFromPairs(t, "options.districts", value, DISTRICT_VALUES, DISTRICT_KEYS);
}

export function getAvailabilityLabel(t: AppTranslateFn, value: string): string {
  return labelFromPairs(t, "options.availability", value, AVAILABILITY_VALUES, AVAILABILITY_KEYS);
}

export function getExperienceLabel(t: AppTranslateFn, value: string): string {
  return labelFromPairs(t, "options.experience", value, EXPERIENCE_VALUES, EXPERIENCE_KEYS);
}

export function getSkillLabel(t: AppTranslateFn, value: string): string {
  return labelFromPairs(t, "options.skills", value, SKILL_VALUES, SKILL_KEYS);
}

export function getLanguageLabel(t: AppTranslateFn, value: string): string {
  return labelFromPairs(t, "options.languages", value, LANGUAGE_VALUES, LANGUAGE_KEYS);
}

export function getDayLabel(t: AppTranslateFn, value: string): string {
  return labelFromPairs(t, "options.days", value, DAY_VALUES, DAY_KEYS);
}

export function getGenderLabel(t: AppTranslateFn, value: string): string {
  if (value === "Female") return t("options.gender.female");
  if (value === "Male") return t("options.gender.male");
  return value;
}
