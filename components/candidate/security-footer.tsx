import { Lock } from "lucide-react";

export function SecurityFooter() {
  return (
    <div className="mx-[18px] mb-[18px] mt-2.5 flex items-center gap-3 rounded-[14px] bg-purple-light p-3.5">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white">
        <Lock size={15} className="text-purple" aria-hidden />
      </div>
      <p className="m-0 text-[12.5px] leading-snug text-ink">
        We keep your information safe and secure
      </p>
    </div>
  );
}

export function PrivacyNote() {
  return (
    <p className="mt-3 flex items-center justify-center gap-[5px] text-center text-[11px] text-ink-faint">
      <Lock size={12} aria-hidden />
      We never share your data with anyone
    </p>
  );
}
