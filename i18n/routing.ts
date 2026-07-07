export const locales = ["en", "ar", "hi", "tl", "ru", "zh"] as const;
export type AppLocale = (typeof locales)[number];

export const defaultLocale: AppLocale = "en";
export const LOCALE_COOKIE_NAME = "NEXT_LOCALE";

export function isAppLocale(value: string | undefined): value is AppLocale {
  return locales.includes(value as AppLocale);
}
