"use client";

type TextFieldProps = {
  icon?: React.ReactNode;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
};

export function TextField({
  icon,
  placeholder,
  value,
  onChange,
  type = "text",
}: TextFieldProps) {
  return (
    <div className="mb-4 flex items-center gap-2.5 rounded-xl border border-border px-3.5 py-3">
      {icon}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 border-none bg-transparent text-sm text-ink outline-none placeholder:text-ink-faint"
      />
    </div>
  );
}
