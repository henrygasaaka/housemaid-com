"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { MessageCircle, Pencil } from "lucide-react";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { PrimaryButton } from "@/components/ui/primary-button";

type MessageComposerSheetProps = {
  open: boolean;
  candidateName: string;
  onSend: (message: string) => void;
  onDismiss: () => void;
};

type View = "suggestions" | "custom";

function SuggestionCard({
  icon,
  iconBg,
  children,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  iconBg: string;
  children: React.ReactNode;
  label?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mb-2.5 flex w-full cursor-pointer items-start gap-3 rounded-[13px] border border-border bg-white p-[13px] text-left"
    >
      <div
        className={`flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full ${iconBg}`}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="m-0 text-[13px] leading-snug text-ink">{children}</p>
        {label && (
          <p className="mb-0 mt-1.5 text-[11px] font-semibold text-blue">
            {label}
          </p>
        )}
      </div>
    </button>
  );
}

export function MessageComposerSheet({
  open,
  candidateName,
  onSend,
  onDismiss,
}: MessageComposerSheetProps) {
  const tCommon = useTranslations("common");
  const [view, setView] = useState<View>("suggestions");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!open) {
      setView("suggestions");
      setMessage("");
    }
  }, [open]);

  function handleDismiss() {
    setView("suggestions");
    setMessage("");
    onDismiss();
  }

  function send(text: string) {
    onSend(text);
    setView("suggestions");
    setMessage("");
  }

  const quickMessage = tCommon("quickMessageTemplate", { candidateName });
  const simpleGreeting = tCommon("simpleGreetingTemplate", { candidateName });

  return (
    <BottomSheet open={open} onDismiss={handleDismiss}>
      {view === "suggestions" ? (
        <>
          <p className="mb-4 mt-1 text-[17px] font-extrabold text-navy">
            {tCommon("sendMessageTo", { candidateName })}
          </p>

          <SuggestionCard
            icon={<MessageCircle size={16} className="text-blue" aria-hidden />}
            iconBg="bg-blue-light"
            label={tCommon("quickMessage")}
            onClick={() => send(quickMessage)}
          >
            {quickMessage}
          </SuggestionCard>

          <SuggestionCard
            icon={<MessageCircle size={16} className="text-blue" aria-hidden />}
            iconBg="bg-blue-light"
            label={tCommon("simpleGreeting")}
            onClick={() => send(simpleGreeting)}
          >
            {simpleGreeting}
          </SuggestionCard>

          <SuggestionCard
            icon={<Pencil size={15} className="text-ink-soft" aria-hidden />}
            iconBg="bg-[#EDE9F5]"
            onClick={() => setView("custom")}
          >
            {tCommon("writeYourOwn")}
          </SuggestionCard>
        </>
      ) : (
        <>
          <p className="mb-4 mt-1 text-[17px] font-extrabold text-navy">
            {tCommon("writeYourOwn")}
          </p>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={tCommon("writeMessageTo", { candidateName })}
            rows={4}
            className="mb-3 w-full resize-none rounded-xl border border-border bg-white px-3.5 py-3 text-[13px] text-ink outline-none placeholder:text-ink-faint focus:border-blue"
          />

          <PrimaryButton
            accent="blue"
            disabled={!message.trim()}
            onClick={() => send(message.trim())}
          >
            {tCommon("sendMessage")}
          </PrimaryButton>

          <button
            type="button"
            onClick={() => {
              setView("suggestions");
              setMessage("");
            }}
            className="mt-3 w-full cursor-pointer border-none bg-transparent text-center text-[13px] font-semibold text-ink-soft"
          >
            {tCommon("backToSuggestions")}
          </button>
        </>
      )}
    </BottomSheet>
  );
}
