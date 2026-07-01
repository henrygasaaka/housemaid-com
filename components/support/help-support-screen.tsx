"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronLeft, Mail, MessageCircle } from "lucide-react";
import type { FaqItem } from "@/lib/legal-types";
import {
  SUPPORT_EMAIL,
  SUPPORT_WHATSAPP_URL,
} from "@/lib/legal-types";

function FaqAccordionItem({
  question,
  answer,
  open,
  onToggle,
}: {
  question: string;
  answer: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-border last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full cursor-pointer items-center justify-between gap-3 border-none bg-transparent px-0 py-3.5 text-left"
      >
        <span className="text-[13px] font-semibold text-ink">{question}</span>
        <ChevronDown
          size={16}
          className={`shrink-0 text-ink-faint transition-transform ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden
        />
      </button>
      {open && (
        <p className="m-0 pb-3.5 text-[12.5px] leading-relaxed text-ink-soft">
          {answer}
        </p>
      )}
    </div>
  );
}

type HelpSupportScreenProps = {
  items: FaqItem[];
  emailAccent?: "blue" | "purple";
};

export function HelpSupportScreen({
  items,
  emailAccent = "blue",
}: HelpSupportScreenProps) {
  const router = useRouter();
  const [openId, setOpenId] = useState<string | null>(null);
  const emailClass = emailAccent === "purple" ? "bg-purple" : "bg-blue";

  return (
    <div className="flex min-h-full flex-1 flex-col bg-white">
      <header className="flex items-center gap-2 border-b border-border px-4 py-3.5">
        <button
          type="button"
          onClick={() => router.back()}
          className="cursor-pointer border-none bg-transparent p-0.5"
          aria-label="Go back"
        >
          <ChevronLeft size={20} className="text-ink" aria-hidden />
        </button>
        <h1 className="font-head m-0 flex-1 text-[17px] font-semibold text-navy">
          Help & Support
        </h1>
      </header>

      <div className="flex-1 overflow-y-auto px-[18px] py-4 pb-8">
        <div className="rounded-[14px] border border-border bg-app-bg px-3.5">
          {items.map((item) => (
            <FaqAccordionItem
              key={item.id}
              question={item.question}
              answer={item.answer}
              open={openId === item.id}
              onToggle={() =>
                setOpenId((current) =>
                  current === item.id ? null : item.id
                )
              }
            />
          ))}
        </div>

        <div className="mt-6 text-center">
          <p className="m-0 text-[14px] font-bold text-navy">
            Still need help?
          </p>
          <p className="m-0 mt-1 text-[12px] text-ink-soft">
            We typically respond within 24 hours.
          </p>

          <div className="mt-4 space-y-2.5">
            <a
              href={SUPPORT_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex cursor-pointer items-center justify-center gap-2 rounded-[13px] bg-green py-3.5 text-[14px] font-bold text-white no-underline"
            >
              <MessageCircle size={16} aria-hidden />
              WhatsApp
            </a>
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className={`flex cursor-pointer items-center justify-center gap-2 rounded-[13px] py-3.5 text-[14px] font-bold text-white no-underline ${emailClass}`}
            >
              <Mail size={16} aria-hidden />
              Email
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
