type ScreenHeadingProps = {
  icon?: React.ReactNode;
  title: string;
  subtitle?: React.ReactNode;
  accent?: "purple" | "blue";
};

export function ScreenHeading({
  icon,
  title,
  subtitle,
  accent = "purple",
}: ScreenHeadingProps) {
  const bgClass = accent === "purple" ? "bg-purple-light" : "bg-blue-light";

  return (
    <div className="px-6 pb-2 pt-[18px] text-center">
      {icon && (
        <div
          className={`mx-auto mb-3.5 flex h-16 w-16 items-center justify-center rounded-full ${bgClass}`}
        >
          {icon}
        </div>
      )}
      <h2 className="font-head m-0 text-[21px] font-semibold leading-snug text-navy">
        {title}
      </h2>
      {subtitle && (
        <p className="m-0 mt-2 text-[13.5px] leading-normal text-ink-soft">
          {subtitle}
        </p>
      )}
    </div>
  );
}
