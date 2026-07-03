"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, Send } from "lucide-react";
import type {
  ChatMessage,
  Conversation,
  OutboundStatus,
} from "@/lib/candidate-conversations";
import { ConversationStatusBadge } from "@/components/candidate/conversation-status-badge";

function MessageTicks({ status }: { status: OutboundStatus }) {
  return (
    <span className="ml-1 text-[10px] text-white/75" aria-hidden>
      {status === "read" ? "✓✓" : "✓"}
    </span>
  );
}

type CandidateMessageThreadProps = {
  conversation: Conversation;
  onBack: () => void;
  onUpdateConversation: (conversation: Conversation) => void;
};

function formatTime() {
  return new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function CandidateMessageThread({
  conversation,
  onBack,
  onUpdateConversation,
}: CandidateMessageThreadProps) {
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState(conversation.messages);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(conversation.messages);
    setDraft("");
  }, [conversation.id, conversation.messages]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  function handleSend() {
    const text = draft.trim();
    if (!text) return;

    const newMessage: ChatMessage = {
      id: `local-${Date.now()}`,
      from: "candidate",
      text,
      time: formatTime(),
      status: "sent",
    };

    const nextMessages = [...messages, newMessage];
    setMessages(nextMessages);
    setDraft("");

    onUpdateConversation({
      ...conversation,
      messages: nextMessages,
      lastPreview: text,
      lastTime: "Just now",
      unreadCount: 0,
    });

    window.setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === newMessage.id ? { ...m, status: "read" as const } : m
        )
      );
    }, 1200);
  }

  return (
    <div className="flex min-h-full flex-1 flex-col bg-app-bg">
      <header className="flex items-center gap-2.5 border-b border-border bg-white px-3.5 py-3">
        <button
          type="button"
          onClick={onBack}
          className="cursor-pointer border-none bg-transparent p-0.5"
          aria-label="Back to inbox"
        >
          <ChevronLeft size={20} className="text-ink" aria-hidden />
        </button>

        <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full bg-purple-light">
          <span className="text-[12px] font-bold text-purple">
            {conversation.initials}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <p className="m-0 truncate text-[14px] font-bold text-ink">
            {conversation.employerName}
          </p>
        </div>

        <ConversationStatusBadge status={conversation.status} />
      </header>

      <div
        ref={scrollRef}
        className="flex flex-1 flex-col gap-2.5 overflow-y-auto px-4 py-4"
      >
        {messages.map((message) => {
          const isMine = message.from === "candidate";

          return (
            <div
              key={message.id}
              className={`flex ${isMine ? "justify-end" : "justify-start"}`}
            >
              <div className="max-w-[78%]">
                <div
                  className={`px-3.5 py-2.5 text-[13px] leading-relaxed ${
                    isMine
                      ? "rounded-[14px_14px_4px_14px] bg-purple text-white"
                      : "rounded-[14px_14px_14px_4px] border border-border bg-white text-ink"
                  }`}
                >
                  {message.text}
                  {isMine && message.status && (
                    <MessageTicks status={message.status} />
                  )}
                </div>
                <p
                  className={`m-0 mt-1 px-1 text-[10px] text-ink-faint ${
                    isMine ? "text-right" : "text-left"
                  }`}
                >
                  {message.time}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-2 border-t border-border bg-white px-3.5 pb-[18px] pt-2.5">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
          placeholder="Type a message..."
          className="flex-1 rounded-[20px] border border-border px-4 py-[11px] text-[13.5px] text-ink outline-none placeholder:text-ink-faint focus:border-purple"
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={!draft.trim()}
          className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border-none bg-purple disabled:cursor-default disabled:opacity-50"
          aria-label="Send message"
        >
          <Send size={16} className="text-white" aria-hidden />
        </button>
      </div>
    </div>
  );
}
