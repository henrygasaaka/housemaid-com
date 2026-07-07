import type { AppLocale } from "@/i18n/routing";

export const LOCALE_LABELS: Record<AppLocale, string> = {
  en: "English",
  ar: "العربية",
  hi: "हिन्दी",
  tl: "Tagalog",
  ru: "Русский",
  zh: "中文",
};

export const LOCALE_CODES: Record<AppLocale, string> = {
  en: "EN",
  ar: "AR",
  hi: "HI",
  tl: "TL",
  ru: "RU",
  zh: "ZH",
};

export const RTL_LOCALES: AppLocale[] = ["ar"];

export function isRtlLocale(locale: string): boolean {
  return RTL_LOCALES.includes(locale as AppLocale);
}
