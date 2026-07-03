type LogoProps = {
  accent?: "purple" | "blue";
  size?: number;
};

export function Logo({ accent = "purple", size = 15 }: LogoProps) {
  const stroke = accent === "blue" ? "#2563EB" : "#6C2BD9";
  const gradFrom = accent === "blue" ? "#5B7CFF" : "#9B6BFF";
  const gradTo = accent === "blue" ? "#3B5BFE" : "#6B3FE0";

  return (
    <div className="relative flex items-center">
      <span
        className="font-extrabold tracking-[-0.2px] text-[#1F2937]"
        style={{ fontSize: size + 2 }}
      >
        Housemaid
        <span
          className="font-extrabold bg-clip-text text-transparent"
          style={{
            backgroundImage: `linear-gradient(135deg, ${gradFrom}, ${gradTo})`,
          }}
        >
          .com
        </span>
      </span>
      <svg
        width={size * 0.9}
        height={size * 0.9}
        viewBox="0 0 24 24"
        fill="none"
        className="ml-px shrink-0"
        style={{ marginTop: -size * 0.7 }}
        aria-hidden
      >
        <path
          d="M12 21s-7-4.35-7-9.5C5 8.5 7.2 6.5 9.6 6.5c1.4 0 2.4.7 2.4 1.7C12 7.2 13 6.5 14.4 6.5 16.8 6.5 19 8.5 19 11.5 19 16.65 12 21 12 21z"
          stroke={stroke}
          strokeWidth="1.6"
          fill="none"
        />
      </svg>
    </div>
  );
}
