"use client";

import Flag from "react-world-flags";

type CountryFlagProps = {
  code: string;
  height?: number;
  className?: string;
};

export function CountryFlag({
  code,
  height = 16,
  className = "inline-block shrink-0 rounded-[2px] object-cover",
}: CountryFlagProps) {
  const normalized = code?.trim().toUpperCase();
  if (!normalized || normalized.length !== 2) return null;

  return (
    <Flag
      code={normalized}
      height={height}
      className={className}
      fallback={<span className="inline-block shrink-0" style={{ width: height * 1.5, height }} />}
    />
  );
}
