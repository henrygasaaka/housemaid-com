"use client";

import { Check } from "lucide-react";

type StepIndicatorProps = {
  steps: readonly string[];
  current: number;
  accent?: "purple" | "blue";
};

export function StepIndicator({
  steps,
  current,
  accent = "purple",
}: StepIndicatorProps) {
  const accentBg = accent === "purple" ? "bg-purple" : "bg-blue";
  const accentText = accent === "purple" ? "text-purple" : "text-blue";

  return (
    <div className="min-w-0 overflow-hidden px-[18px] pb-1 pt-2.5">
      <div className="flex min-w-0 items-center overflow-hidden">
        {steps.map((label, i) => {
          const stepNum = i + 1;
          const done = stepNum < current;
          const active = stepNum === current;

          return (
            <div key={label} className="contents">
              <div className="flex min-w-0 flex-1 flex-col items-center overflow-hidden">
                <div
                  className={`flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    done || active
                      ? `${accentBg} text-white`
                      : "bg-[#E9E7F2] text-ink-faint"
                  }`}
                >
                  {done ? <Check size={13} aria-hidden /> : stepNum}
                </div>
                <span
                  className={`mt-1 max-w-full truncate text-[9.5px] ${
                    active
                      ? `${accentText} font-semibold`
                      : "font-medium text-ink-faint"
                  }`}
                >
                  {label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`mb-3.5 h-0.5 flex-1 ${
                    stepNum < current ? accentBg : "bg-[#E9E7F2]"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
