"use client";

import { useTranslations } from "next-intl";
import type { ConversationStatus } from "@/lib/candidate-conversations";

const STATUS_KEYS: Record<
  ConversationStatus,
  | "messaging"
  | "interviewProposed"
  | "interviewScheduled"
  | "interviewed"
  | "hired"
  | "declined"
> = {
  messaging: "messaging",
  interview_requested: "interviewProposed",
  interview_scheduled: "interviewScheduled",
  interviewed: "interviewed",
  hired: "hired",
  declined: "declined",
};

const STATUS_COLORS: Record<
  ConversationStatus,
  { color: string; bg: string }
> = {
  messaging: { color: "#6B7280", bg: "#F1EFF9" },
  interview_requested: { color: "#CA8A04", bg: "#FEF3E2" },
  interview_scheduled: { color: "#1E3A8A", bg: "#DBEAFE" },
  interviewed: { color: "#4C1D95", bg: "#EDE9FE" },
  hired: { color: "#15803D", bg: "#E8F8EE" },
  declined: { color: "#9CA3AF", bg: "#F1EFF9" },
};

type ConversationStatusBadgeProps = {
  status: ConversationStatus;
};

export function ConversationStatusBadge({
  status,
}: ConversationStatusBadgeProps) {
  const t = useTranslations("candidate.conversationStatus");
  const colors = STATUS_COLORS[status] ?? STATUS_COLORS.messaging;
  const labelKey = STATUS_KEYS[status] ?? "messaging";

  return (
    <span
      className="inline-block rounded-[20px] px-2.5 py-[3px] text-[10.5px] font-bold"
      style={{ color: colors.color, background: colors.bg }}
    >
      {t(labelKey)}
    </span>
  );
}
