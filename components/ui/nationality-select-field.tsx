"use client";

import { useMemo, useState } from "react";
import { Check, ChevronDown, Globe, Search } from "lucide-react";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import {
  COUNTRIES,
  getCountryName,
  normalizeNationalityCode,
  searchCountries,
} from "@/lib/countries";

type NationalitySelectFieldProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
};

export function NationalitySelectField({
  value,
  onChange,
  placeholder = "Select...",
  searchPlaceholder = "Search countries...",
}: NationalitySelectFieldProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const normalizedValue = normalizeNationalityCode(value);
  const selectedName = normalizedValue ? getCountryName(normalizedValue) : "";

  const filteredCountries = useMemo(
    () => searchCountries(query),
    [query]
  );

  function handleSelect(code: string) {
    onChange(code);
    setOpen(false);
    setQuery("");
  }

  function handleDismiss() {
    setOpen(false);
    setQuery("");
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mb-4 flex w-full cursor-pointer items-center gap-2.5 rounded-xl border border-border px-3.5 py-3 text-left"
      >
        <Globe size={15} className="shrink-0 text-ink-faint" aria-hidden />
        <span
          className={`flex-1 truncate text-sm ${
            normalizedValue ? "text-ink" : "text-ink-faint"
          }`}
        >
          {normalizedValue ? selectedName : placeholder}
        </span>
        <ChevronDown size={16} className="shrink-0 text-ink-faint" aria-hidden />
      </button>
      <BottomSheet open={open} onDismiss={handleDismiss}>
        <div className="mb-3 flex items-center gap-2 rounded-xl border border-border px-3 py-2.5">
          <Search size={15} className="shrink-0 text-ink-faint" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full border-none bg-transparent text-sm text-ink outline-none placeholder:text-ink-faint"
            autoFocus
          />
        </div>
        <div className="max-h-80 overflow-y-auto">
          {(query ? filteredCountries : COUNTRIES).map((country) => (
            <button
              key={country.code}
              type="button"
              onClick={() => handleSelect(country.code)}
              className="flex w-full cursor-pointer items-center justify-between border-b border-[#F1EFF9] px-1.5 py-3.5 text-left"
            >
              <span
                className={`truncate text-[14.5px] text-ink ${
                  country.code === normalizedValue ? "font-bold" : "font-medium"
                }`}
              >
                {country.name}
              </span>
              {country.code === normalizedValue && (
                <Check size={16} className="shrink-0 text-purple" strokeWidth={3} />
              )}
            </button>
          ))}
          {query && filteredCountries.length === 0 && (
            <p className="m-0 px-1.5 py-4 text-center text-sm text-ink-faint">
              No countries found
            </p>
          )}
        </div>
      </BottomSheet>
    </>
  );
}
