"use client";

type RadioCardProps = {
  selected: boolean;
  title: string;
  subtitle: string;
  badge?: string;
  onClick: () => void;
  accent?: "purple" | "blue";
};

export function RadioCard({
  selected,
  title,
  subtitle,
  badge,
  onClick,
  accent = "purple",
}: RadioCardProps) {
  const accentBorder = accent === "purple" ? "border-purple" : "border-blue";
  const accentBg = accent === "purple" ? "bg-purple-light" : "bg-blue-light";
  const accentDot = accent === "purple" ? "bg-purple" : "bg-blue";
  const accentRing = accent === "purple" ? "border-purple" : "border-blue";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`mb-2.5 flex w-full cursor-pointer items-center gap-3 rounded-[13px] border-[1.5px] px-3.5 py-[13px] text-left ${
        selected ? `${accentBorder} ${accentBg}` : "border-border bg-white"
      }`}
    >
      <div
        className={`flex h-[19px] w-[19px] shrink-0 items-center justify-center rounded-full border-2 ${
          selected ? accentRing : "border-[#D1D0DC]"
        }`}
      >
        {selected && (
          <div className={`h-[9px] w-[9px] rounded-full ${accentDot}`} />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-[7px]">
          <p className="m-0 text-sm font-bold text-ink">{title}</p>
          {badge && (
            <span className="rounded-md bg-green-light px-[7px] py-0.5 text-[10.5px] font-bold text-green">
              {badge}
            </span>
          )}
        </div>
        <p className="m-0 mt-0.5 text-xs text-ink-soft">{subtitle}</p>
      </div>
    </button>
  );
}
