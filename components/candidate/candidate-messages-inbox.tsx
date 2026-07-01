"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { Conversation } from "@/lib/candidate-conversations";
import { CandidateBottomNav } from "@/components/candidate/candidate-bottom-nav";
import { ConversationStatusBadge } from "@/components/candidate/conversation-status-badge";
import { useCandidateNav } from "@/components/candidate/use-candidate-nav";

type CandidateMessagesInboxProps = {
  conversations: Conversation[];
  onOpenThread: (id: string) => void;
};

export function CandidateMessagesInbox({
  conversations,
  onOpenThread,
}: CandidateMessagesInboxProps) {
  const onNavigate = useCandidateNav();

  return (
    <div className="flex min-h-full flex-1 flex-col bg-app-bg">
      <header className="flex items-center gap-2 border-b border-border bg-white px-4 py-3.5">
        <Link
          href="/candidate/dashboard"
          className="flex border-none bg-transparent p-0.5"
          aria-label="Go back"
        >
          <ChevronLeft size={20} className="text-ink" aria-hidden />
        </Link>
        <h1 className="font-head m-0 flex-1 text-[17px] font-semibold text-navy">
          Messages
        </h1>
      </header>

      <div className="flex-1 overflow-y-auto">
        {conversations.map((convo) => {
          const unread = convo.unreadCount > 0;
          return (
            <button
              key={convo.id}
              type="button"
              onClick={() => onOpenThread(convo.id)}
              className="flex w-full cursor-pointer items-center gap-3 border-b border-[#F1EFF9] bg-transparent px-[18px] py-3 text-left"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-purple-light">
                <span className="text-[13px] font-bold text-purple">
                  {convo.initials}
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p
                    className={`m-0 truncate text-[13.5px] text-ink ${
                      unread ? "font-extrabold" : "font-bold"
                    }`}
                  >
                    {convo.employerName}
                  </p>
                  <span className="shrink-0 text-[10.5px] text-ink-faint">
                    {convo.lastTime}
                  </span>
                </div>
                <p
                  className={`m-0 mt-0.5 truncate text-[12px] ${
                    unread
                      ? "font-semibold text-ink"
                      : "font-normal text-ink-soft"
                  }`}
                >
                  {convo.lastPreview}
                </p>
                {convo.status !== "messaging" && (
                  <div className="mt-1">
                    <ConversationStatusBadge status={convo.status} />
                  </div>
                )}
              </div>

              {unread && (
                <span className="flex h-[18px] min-w-[18px] shrink-0 items-center justify-center rounded-full bg-[#E0245E] px-1.5 text-[10px] font-bold text-white">
                  {convo.unreadCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <CandidateBottomNav active="Messages" onNavigate={onNavigate} />
    </div>
  );
}
