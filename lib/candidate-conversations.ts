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
  employerName: string;
  initials: string;
  status: ConversationStatus;
  lastPreview: string;
  lastTime: string;
  unreadCount: number;
  messages: ChatMessage[];
};

export const CANDIDATE_CONVERSATIONS: Conversation[] = [
  {
    id: "al-rashid",
    employerName: "Al Rashid Family",
    initials: "AR",
    status: "messaging",
    lastPreview: "Hi Maria, we'd like to schedule...",
    lastTime: "2h ago",
    unreadCount: 1,
    messages: [
      {
        id: "m1",
        from: "employer",
        text: "Hello Maria, we came across your profile and were impressed by your childcare experience.",
        time: "9:15 AM",
      },
      {
        id: "m2",
        from: "candidate",
        text: "Thank you! I'm very interested in learning more about your family and the role.",
        time: "9:28 AM",
        status: "read",
      },
      {
        id: "m3",
        from: "employer",
        text: "We are a family of four in Dubai Marina looking for a live-in housemaid.",
        time: "9:30 AM",
      },
      {
        id: "m4",
        from: "candidate",
        text: "That sounds wonderful. I have 5 years of experience and I'm available to start immediately.",
        time: "9:45 AM",
        status: "read",
      },
      {
        id: "m5",
        from: "employer",
        text: "Hi Maria, we'd like to schedule a video call to discuss the position. Are you available this week?",
        time: "11:02 AM",
      },
    ],
  },
  {
    id: "private-employer",
    employerName: "Private Employer",
    initials: "PE",
    status: "messaging",
    lastPreview: "Thank you for your interest.",
    lastTime: "Yesterday",
    unreadCount: 0,
    messages: [
      {
        id: "m1",
        from: "employer",
        text: "Hi Maria, I saw your profile on Housemaid.com and wanted to reach out.",
        time: "Yesterday",
      },
      {
        id: "m2",
        from: "candidate",
        text: "Hello! Thank you for contacting me. I'd be happy to discuss the opportunity.",
        time: "Yesterday",
        status: "read",
      },
      {
        id: "m3",
        from: "employer",
        text: "Thank you for your interest.",
        time: "Yesterday",
      },
    ],
  },
  {
    id: "khan-family",
    employerName: "The Khan Family",
    initials: "TK",
    status: "messaging",
    lastPreview: "Can you start next Monday?",
    lastTime: "3 days ago",
    unreadCount: 0,
    messages: [
      {
        id: "m1",
        from: "employer",
        text: "Hi Maria, we're looking for someone to help with cleaning and cooking in Sharjah.",
        time: "3 days ago",
      },
      {
        id: "m2",
        from: "candidate",
        text: "Hi! Yes, I have experience with both and I'm currently in Dubai.",
        time: "3 days ago",
        status: "read",
      },
      {
        id: "m3",
        from: "employer",
        text: "Can you start next Monday?",
        time: "3 days ago",
      },
    ],
  },
];

export function getConversation(id: string): Conversation | undefined {
  return CANDIDATE_CONVERSATIONS.find((c) => c.id === id);
}
