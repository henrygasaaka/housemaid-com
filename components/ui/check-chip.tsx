"use client";

import { Check } from "lucide-react";

type CheckChipProps = {
  label: string;
  icon: string;
  selected: boolean;
  onClick: () => void;
};

export function CheckChip({ label, icon, selected, onClick }: CheckChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex cursor-pointer items-center gap-2 rounded-[11px] border-[1.5px] px-3 py-[11px] text-left ${
        selected
          ? "border-purple bg-purple-light"
          : "border-border bg-white"
      }`}
    >
      <span className="text-[15px]" aria-hidden>
        {icon}
      </span>
      <span className="flex-1 text-[13px] font-medium text-ink">{label}</span>
      <div
        className={`flex h-[17px] w-[17px] shrink-0 items-center justify-center rounded border-[1.5px] ${
          selected ? "border-purple bg-purple" : "border-[#D1D0DC] bg-white"
        }`}
      >
        {selected && (
          <Check size={11} className="text-white" strokeWidth={3} />
        )}
      </div>
    </button>
  );
}
