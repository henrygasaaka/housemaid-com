export type ConversationStatus =
  | "messaging"
  | "interview_requested"
  | "interview_scheduled"
  | "interviewed"
  | "hired"
  | "declined";

export type OutboundStatus = "sent" | "read";

export type ChatMessage = {
  id: string;
  from: "employer" | "candidate";
  text: string;
  time: string;
  status?: OutboundStatus;
};

export type Conversation = {
  id: string;
  candidateId: string;
  employerId: string;
  employerName: string;
  initials: string;
  status: ConversationStatus;
  lastPreview: string;
  lastTime: string;
  unreadCount: number;
  messages: ChatMessage[];
};
