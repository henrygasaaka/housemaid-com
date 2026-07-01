"use client";

import { useState } from "react";
import {
  CANDIDATE_CONVERSATIONS,
  type Conversation,
} from "@/lib/candidate-conversations";
import { CandidateMessagesInbox } from "@/components/candidate/candidate-messages-inbox";
import { CandidateMessageThread } from "@/components/candidate/candidate-message-thread";

export function CandidateMessages() {
  const [conversations, setConversations] = useState(CANDIDATE_CONVERSATIONS);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);

  const activeConversation = activeThreadId
    ? conversations.find((c) => c.id === activeThreadId)
    : undefined;

  function handleOpenThread(id: string) {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c))
    );
    setActiveThreadId(id);
  }

  function handleUpdateConversation(updated: Conversation) {
    setConversations((prev) =>
      prev.map((c) => (c.id === updated.id ? updated : c))
    );
  }

  if (activeConversation) {
    return (
      <CandidateMessageThread
        conversation={activeConversation}
        onBack={() => setActiveThreadId(null)}
        onUpdateConversation={handleUpdateConversation}
      />
    );
  }

  return (
    <CandidateMessagesInbox
      conversations={conversations}
      onOpenThread={handleOpenThread}
    />
  );
}
