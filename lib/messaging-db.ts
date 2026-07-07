import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  ChatMessage,
  Conversation,
  ConversationStatus,
  OutboundStatus,
} from "@/lib/candidate-conversations";

/** Verified via PostgREST introspection. */
export type ConversationRow = {
  id: string;
  created_at: string;
  updated_at: string;
  candidate_id: string;
  employer_id: string;
  status: ConversationStatus;
};

export type MessageRow = {
  id: string;
  created_at: string;
  conversation_id: string;
  body: string;
  read_at: string | null;
  sender_id: string;
};

export function isMessageQuotaExceededError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const record = error as { message?: unknown; code?: unknown };
  const message = typeof record.message === "string" ? record.message : "";
  if (message.includes("MESSAGE_QUOTA_EXCEEDED")) return true;
  return record.code === "P0001" && message.includes("MESSAGE_QUOTA_EXCEEDED");
}

export type EmployerRow = {
  id: string;
  created_at?: string;
  updated_at?: string;
  phone: string | null;
  full_name: string | null;
  family_name: string | null;
};

type ConversationWithRelations = ConversationRow & {
  employers: EmployerRow | EmployerRow[] | null;
  messages: MessageRow[] | null;
};

function pickEmployer(
  employers: EmployerRow | EmployerRow[] | null
): EmployerRow | null {
  if (!employers) return null;
  return Array.isArray(employers) ? employers[0] ?? null : employers;
}

import type { AppTranslateFn } from "@/lib/i18n-types";

export function employerDisplayName(
  employer: EmployerRow | null,
  t?: AppTranslateFn
): string {
  return (
    employer?.full_name?.trim() ||
    employer?.family_name?.trim() ||
    (t ? t("common.employer") : "Employer")
  );
}

export function initialsFromName(name: string, t?: AppTranslateFn): string {
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0]![0] ?? ""}${parts[1]![0] ?? ""}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase() || (t ? t("time.initialsFallback") : "EM");
}

export function formatMessageTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function formatRelativeTime(iso: string, t?: AppTranslateFn): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / (1000 * 60));
  if (minutes < 1) return t ? t("time.justNow") : "Just now";
  if (minutes < 60) {
    return t
      ? t("time.minutesAgo", { minutes })
      : `${minutes}m ago`;
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return t ? t("time.hoursAgo", { hours }) : `${hours}h ago`;
  }
  const days = Math.floor(hours / 24);
  if (days === 1) return t ? t("time.yesterday") : "Yesterday";
  if (days < 7) {
    return t ? t("time.daysAgo", { days }) : `${days} days ago`;
  }
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function mapMessageRow(
  row: MessageRow,
  candidateId: string,
  viewerId: string
): ChatMessage {
  const fromCandidate = row.sender_id === candidateId;
  const isMine = row.sender_id === viewerId;

  let status: OutboundStatus | undefined;
  if (isMine) {
    status = row.read_at ? "read" : "sent";
  }

  return {
    id: row.id,
    from: fromCandidate ? "candidate" : "employer",
    text: row.body,
    time: formatMessageTime(row.created_at),
    status,
  };
}

export function mapConversationRow(
  row: ConversationWithRelations,
  viewerId: string,
  t?: AppTranslateFn
): Conversation {
  const employer = pickEmployer(row.employers);
  const employerName = employerDisplayName(employer, t);
  const messages = [...(row.messages ?? [])].sort(
    (a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );
  const lastMessage = messages.at(-1);
  const unreadCount = messages.filter(
    (message) =>
      message.sender_id !== viewerId && message.read_at == null
  ).length;

  return {
    id: row.id,
    candidateId: row.candidate_id,
    employerId: row.employer_id,
    employerName,
    initials: initialsFromName(employerName, t),
    status: row.status ?? "messaging",
    lastPreview: lastMessage?.body ?? (t ? t("common.noMessagesYet") : "No messages yet"),
    lastTime: lastMessage
      ? formatRelativeTime(lastMessage.created_at, t)
      : formatRelativeTime(row.created_at, t),
    unreadCount,
    messages: messages.map((message) =>
      mapMessageRow(message, row.candidate_id, viewerId)
    ),
  };
}

export async function fetchCandidateConversations(
  supabase: SupabaseClient,
  candidateId: string,
  t?: AppTranslateFn
): Promise<Conversation[]> {
  const { data, error } = await supabase
    .from("conversations")
    .select("*, employers(*), messages(*)")
    .eq("candidate_id", candidateId)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("[messaging] Failed to load conversations:", error.message);
    throw new Error(error.message);
  }

  const rows = (data ?? []) as ConversationWithRelations[];
  return rows.map((row) => mapConversationRow(row, candidateId, t));
}

export async function fetchEmployerConversations(
  supabase: SupabaseClient,
  employerId: string,
  t?: AppTranslateFn
): Promise<Conversation[]> {
  const { data, error } = await supabase
    .from("conversations")
    .select("*, employers(*), messages(*)")
    .eq("employer_id", employerId)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("[messaging] Failed to load employer conversations:", error.message);
    throw new Error(error.message);
  }

  const rows = (data ?? []) as ConversationWithRelations[];
  return rows.map((row) => mapConversationRow(row, employerId, t));
}

export async function markConversationRead(
  supabase: SupabaseClient,
  conversationId: string,
  viewerId: string,
  candidateId: string,
  employerId: string
) {
  const otherParticipantId =
    viewerId === candidateId ? employerId : candidateId;

  const { error } = await supabase
    .from("messages")
    .update({ read_at: new Date().toISOString() })
    .eq("conversation_id", conversationId)
    .eq("sender_id", otherParticipantId)
    .is("read_at", null);

  if (error) {
    console.error("[messaging] Failed to mark messages read:", error.message);
  }
}

export async function sendMessage(
  supabase: SupabaseClient,
  conversationId: string,
  senderId: string,
  body: string
): Promise<MessageRow> {
  const trimmed = body.trim();
  if (!trimmed) {
    throw new Error("Message cannot be empty.");
  }

  const { data, error } = await supabase
    .from("messages")
    .insert({
      conversation_id: conversationId,
      body: trimmed,
      sender_id: senderId,
    })
    .select("*")
    .single();

  if (error) {
    console.error("[messaging] Failed to send message:", error.message);
    throw new Error(error.message);
  }

  await supabase
    .from("conversations")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", conversationId);

  return data as MessageRow;
}

export async function findOrCreateConversation(
  supabase: SupabaseClient,
  candidateId: string,
  employerId: string
): Promise<ConversationRow> {
  const { data: existing, error: selectError } = await supabase
    .from("conversations")
    .select("*")
    .eq("candidate_id", candidateId)
    .eq("employer_id", employerId)
    .maybeSingle();

  if (selectError) {
    console.error("[messaging] Failed to lookup conversation:", selectError.message);
    throw new Error(selectError.message);
  }

  if (existing) return existing as ConversationRow;

  const { data, error } = await supabase
    .from("conversations")
    .insert({
      candidate_id: candidateId,
      employer_id: employerId,
      status: "messaging",
    })
    .select("*")
    .single();

  if (error) {
    console.error("[messaging] Failed to create conversation:", error.message);
    throw new Error(error.message);
  }

  return data as ConversationRow;
}

export async function ensureEmployerRow(
  supabase: SupabaseClient,
  employerId: string,
  profile?: { fullName?: string; familyName?: string; phone?: string }
) {
  const { data: existing } = await supabase
    .from("employers")
    .select("id")
    .eq("id", employerId)
    .maybeSingle();

  if (existing) return;

  const { error } = await supabase.from("employers").insert({
    id: employerId,
    full_name: profile?.fullName?.trim() || null,
    family_name: profile?.familyName?.trim() || null,
    phone: profile?.phone?.trim() || null,
  });

  if (error) {
    console.error("[messaging] Failed to ensure employer row:", error.message);
    throw new Error(error.message);
  }
}

export async function sendEmployerMessageToCandidate(
  supabase: SupabaseClient,
  employerId: string,
  candidateId: string,
  body: string,
  profile?: { fullName?: string; familyName?: string; phone?: string }
) {
  await ensureEmployerRow(supabase, employerId, profile);
  const conversation = await findOrCreateConversation(
    supabase,
    candidateId,
    employerId
  );
  return sendMessage(supabase, conversation.id, employerId, body);
}

export async function sendCandidateMessage(
  supabase: SupabaseClient,
  candidateId: string,
  conversationId: string,
  body: string
) {
  return sendMessage(supabase, conversationId, candidateId, body);
}
