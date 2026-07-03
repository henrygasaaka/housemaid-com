"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import type { LegalSection } from "@/lib/legal-types";

type LegalDocumentScreenProps = {
  title: string;
  lastUpdated: string;
  intro?: string;
  sections: LegalSection[];
};

export function LegalDocumentScreen({
  title,
  lastUpdated,
  intro,
  sections,
}: LegalDocumentScreenProps) {
  const router = useRouter();

  return (
    <div className="flex min-h-full flex-1 flex-col bg-white">
      <header className="flex items-center gap-2 border-b border-border px-4 py-3.5">
        <button
          type="button"
          onClick={() => router.back()}
          className="cursor-pointer border-none bg-transparent p-0.5"
          aria-label="Go back"
        >
          <ChevronLeft size={20} className="text-ink" aria-hidden />
        </button>
        <h1 className="font-head m-0 flex-1 text-[17px] font-semibold text-navy">
          {title}
        </h1>
      </header>

      <div className="flex-1 overflow-y-auto px-5 py-3 pb-8">
        <p className="m-0 text-[11.5px] text-ink-faint">
          Last updated: {lastUpdated}
        </p>
        {intro && (
          <p className="mb-4 mt-3 text-[13px] leading-relaxed text-ink-soft">
            {intro}
          </p>
        )}

        {sections.map((section) => (
          <div key={section.heading} className="mb-[18px]">
            <p className="m-0 mb-1.5 text-[13.5px] font-bold text-ink">
              {section.heading}
            </p>
            {section.body && (
              <p className="m-0 mb-1.5 text-[12.5px] leading-relaxed text-ink-soft">
                {section.body}
              </p>
            )}
            {section.items && (
              <ul className="m-0 list-disc pl-[18px]">
                {section.items.map((item) => (
                  <li
                    key={item}
                    className="text-[12.5px] leading-[1.7] text-ink-soft"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
