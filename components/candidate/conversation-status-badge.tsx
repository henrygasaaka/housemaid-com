import type { ConversationStatus } from "@/lib/candidate-conversations";

const STATUS_META: Record<
  ConversationStatus,
  { label: string; color: string; bg: string }
> = {
  messaging: { label: "Messaging", color: "#6B7280", bg: "#F1EFF9" },
  interview_requested: {
    label: "Interview proposed",
    color: "#CA8A04",
    bg: "#FEF3E2",
  },
  interview_scheduled: {
    label: "Interview scheduled",
    color: "#1E3A8A",
    bg: "#DBEAFE",
  },
  interviewed: { label: "Interviewed", color: "#4C1D95", bg: "#EDE9FE" },
  hired: { label: "Hired", color: "#15803D", bg: "#E8F8EE" },
  declined: { label: "Not proceeding", color: "#9CA3AF", bg: "#F1EFF9" },
};

type ConversationStatusBadgeProps = {
  status: ConversationStatus;
};

export function ConversationStatusBadge({
  status,
}: ConversationStatusBadgeProps) {
  const meta = STATUS_META[status] ?? STATUS_META.messaging;

  return (
    <span
      className="inline-block rounded-[20px] px-2.5 py-[3px] text-[10.5px] font-bold"
      style={{ color: meta.color, background: meta.bg }}
    >
      {meta.label}
    </span>
  );
}
