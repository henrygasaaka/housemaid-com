"use client";

type PrimaryButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  outline?: boolean;
  accent?: "purple" | "blue";
  type?: "button" | "submit";
};

export function PrimaryButton({
  children,
  onClick,
  disabled,
  outline,
  accent = "purple",
  type = "button",
}: PrimaryButtonProps) {
  const accentClass = accent === "purple" ? "text-purple" : "text-blue";
  const bgClass = accent === "purple" ? "bg-purple" : "bg-blue";
  const borderClass = accent === "purple" ? "border-purple" : "border-blue";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`flex w-full cursor-pointer items-center justify-center gap-2 rounded-[13px] py-[15px] text-[15px] font-bold ${
        outline
          ? `border-[1.5px] bg-white ${borderClass} ${accentClass}`
          : disabled
            ? "cursor-default bg-[#D8D5EA] text-white"
            : `${bgClass} border-none text-white`
      }`}
    >
      {children}
    </button>
  );
}
