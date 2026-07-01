import { ChevronDown, Globe } from "lucide-react";

export function LanguagePicker() {
  return (
    <div className="flex items-center gap-[3px] rounded-[20px] border border-border px-2.5 py-[5px] text-[12.5px] font-medium text-ink">
      <Globe size={13} aria-hidden />
      EN
      <ChevronDown size={12} aria-hidden />
    </div>
  );
}
