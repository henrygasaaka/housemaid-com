"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { ChevronDown, Globe } from "lucide-react";
import { locales, type AppLocale } from "@/i18n/routing";
import { LOCALE_CODES, LOCALE_LABELS } from "@/lib/i18n-config";

const LOCALE_STORAGE_KEY = "locale";

function setLocaleCookie(locale: AppLocale) {
  document.cookie = `NEXT_LOCALE=${locale};path=/;max-age=${60 * 60 * 24 * 365};SameSite=Lax`;
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    /* ignore */
  }
}

export function LanguagePicker() {
  const locale = useLocale() as AppLocale;
  const t = useTranslations("aria");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(nextLocale: AppLocale) {
    if (nextLocale === locale) {
      setOpen(false);
      return;
    }
    setLocaleCookie(nextLocale);
    setOpen(false);
    router.refresh();
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex cursor-pointer items-center gap-[3px] rounded-[20px] border border-border bg-white px-2.5 py-[5px] text-[12.5px] font-medium text-ink"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("selectLanguage")}
      >
        <Globe size={13} aria-hidden />
        {LOCALE_CODES[locale]}
        <ChevronDown size={12} aria-hidden />
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute end-0 top-[calc(100%+4px)] z-50 min-w-[140px] overflow-hidden rounded-xl border border-border bg-white py-1 shadow-lg"
        >
          {locales.map((item) => (
            <li key={item} role="option" aria-selected={item === locale}>
              <button
                type="button"
                onClick={() => handleSelect(item)}
                className={`flex w-full cursor-pointer border-none bg-transparent px-3 py-2 text-start text-[12.5px] ${
                  item === locale
                    ? "font-bold text-purple"
                    : "font-medium text-ink"
                }`}
              >
                {LOCALE_LABELS[item]}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
