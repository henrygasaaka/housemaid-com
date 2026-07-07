"use client";

import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { BottomSheet } from "@/components/ui/bottom-sheet";

type SelectFieldProps = {
  icon?: React.ReactNode;
  value: string;
  options?: string[];
  onChange: (value: string) => void;
  placeholder?: string;
  getLabel?: (value: string) => string;
};

export function SelectField({
  icon,
  value,
  options = [],
  onChange,
  placeholder = "Select...",
  getLabel,
}: SelectFieldProps) {
  const [open, setOpen] = useState(false);
  const display = (v: string) => (getLabel && v ? getLabel(v) : v);

  return (
    <>
      <button
        type="button"
        onClick={() => options.length > 0 && setOpen(true)}
        className="mb-4 flex w-full cursor-pointer items-center gap-2.5 rounded-xl border border-border px-3.5 py-3 text-left"
      >
        {icon}
        <span
          className={`flex-1 text-sm ${value ? "text-ink" : "text-ink-faint"}`}
        >
          {value ? display(value) : placeholder}
        </span>
        <ChevronDown size={16} className="text-ink-faint" aria-hidden />
      </button>
      <BottomSheet open={open} onDismiss={() => setOpen(false)}>
        <div className="max-h-80 overflow-y-auto">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className="flex w-full cursor-pointer items-center justify-between border-b border-[#F1EFF9] px-1.5 py-3.5 text-left"
            >
              <span
                className={`text-[14.5px] text-ink ${
                  opt === value ? "font-bold" : "font-medium"
                }`}
              >
                {display(opt)}
              </span>
              {opt === value && (
                <Check size={16} className="text-purple" strokeWidth={3} />
              )}
            </button>
          ))}
        </div>
      </BottomSheet>
    </>
  );
}
