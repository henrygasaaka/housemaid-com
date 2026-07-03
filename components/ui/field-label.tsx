type FieldLabelProps = {
  children: React.ReactNode;
  required?: boolean;
};

export function FieldLabel({ children, required }: FieldLabelProps) {
  return (
    <label className="mb-[7px] block text-[13px] font-semibold text-ink">
      {children}
      {required && <span className="text-[#E0245E]"> *</span>}
    </label>
  );
}
