"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import type { Conversation } from "@/lib/candidate-conversations";
import {
  fetchCandidateConversations,
  markConversationRead,
} from "@/lib/messaging-db";
import { CandidateMessagesInbox } from "@/components/candidate/candidate-messages-inbox";
import { CandidateMessageThread } from "@/components/candidate/candidate-message-thread";
import { createClient } from "@/lib/supabase";

function InboxSkeleton() {
  return (
    <div className="flex flex-1 flex-col animate-pulse px-[18px] pt-4">
      {[0, 1, 2].map((i) => (
        <div key={i} className="mb-3 flex gap-3 border-b border-[#F1EFF9] pb-3">
          <div className="h-12 w-12 rounded-full bg-border" />
          <div className="flex-1">
            <div className="mb-2 h-4 w-32 rounded bg-border" />
            <div className="h-3 w-48 rounded bg-border" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function CandidateMessages() {
  const router = useRouter();
  const t = useTranslations();
  const tMessages = useTranslations("candidate.messages");
  const tCommon = useTranslations("common");
  const tErrors = useTranslations("errors");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadConversations = useCallback(async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace("/candidate/auth");
      return null;
    }

    setUserId(user.id);
    const data = await fetchCandidateConversations(supabase, user.id, (key, values) =>
      t(key, values)
    );
    setConversations(data);
    return user.id;
  }, [router, t]);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      try {
        await loadConversations();
        if (!cancelled) setLoadError(null);
      } catch (error) {
        if (cancelled) return;
        console.error("[messages] Failed to load conversations:", error);
        setLoadError(
          error instanceof Error ? error.message : tErrors("loadMessages")
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    bootstrap();
    return () => {
      cancelled = true;
    };
  }, [loadConversations]);

  const activeConversation = activeThreadId
    ? conversations.find((c) => c.id === activeThreadId)
    : undefined;

  async function handleOpenThread(id: string) {
    const conversation = conversations.find((c) => c.id === id);
    if (!conversation || !userId) {
      setActiveThreadId(id);
      return;
    }

    const supabase = createClient();
    await markConversationRead(
      supabase,
      conversation.id,
      userId,
      conversation.candidateId,
      conversation.employerId
    );

    setConversations((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              unreadCount: 0,
              messages: c.messages.map((m) =>
                m.from === "employer" ? { ...m, status: "read" as const } : m
              ),
            }
          : c
      )
    );
    setActiveThreadId(id);
  }

  function handleUpdateConversation(updated: Conversation) {
    setConversations((prev) =>
      prev.map((c) => (c.id === updated.id ? updated : c))
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-full flex-1 flex-col bg-app-bg">
        <header className="flex items-center gap-2 border-b border-border bg-white px-4 py-3.5">
          <h1 className="font-head m-0 flex-1 text-[17px] font-semibold text-navy">
            {tMessages("title")}
          </h1>
        </header>
        <InboxSkeleton />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex min-h-full flex-1 flex-col items-center justify-center bg-app-bg px-6 text-center">
        <p className="m-0 text-[14px] font-semibold text-navy">{loadError}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-4 cursor-pointer rounded-[11px] border-none bg-purple px-4 py-2.5 text-[13px] font-bold text-white"
        >
          {tCommon("tryAgain")}
        </button>
      </div>
    );
  }

  if (activeConversation && userId) {
    return (
      <CandidateMessageThread
        conversation={activeConversation}
        userId={userId}
        onBack={() => setActiveThreadId(null)}
        onUpdateConversation={handleUpdateConversation}
      />
    );
  }

  return (
    <CandidateMessagesInbox
      conversations={conversations}
      onOpenThread={(id) => void handleOpenThread(id)}
    />
  );
}
