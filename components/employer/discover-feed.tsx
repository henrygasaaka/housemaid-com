"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Lock, Shield, User } from "lucide-react";
import { Logo } from "@/components/logo";
import { DiscoverCandidateCard } from "@/components/employer/discover-candidate-card";
import {
  DISCOVER_CANDIDATES,
} from "@/lib/discover-candidates";

const FILTERS = ["All", "Full-Time", "Part-Time", "Live-In", "Live-Out"];

export function EmployerDiscoverFeed() {
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set());
  const [activeFilter, setActiveFilter] = useState(0);
  const guestMode = true;

  function toggleSave(e: React.MouseEvent, id: number) {
    e.preventDefault();
    e.stopPropagation();
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleMessage(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
  }

  return (
    <div className="flex min-h-full min-w-0 flex-1 flex-col overflow-x-hidden bg-app-bg">
      <div className="flex items-center justify-between px-[18px] pt-4">
        <div className="flex items-center gap-1.5">
          <Link
            href="/"
            className="flex border-none bg-transparent p-1"
            aria-label="Go back"
          >
            <ChevronLeft size={20} className="text-ink" aria-hidden />
          </Link>
          <Logo accent="blue" />
        </div>
        {guestMode && (
          <span className="flex items-center gap-[5px] rounded-[20px] bg-[#FEF3E2] px-2.5 py-[5px] text-[11.5px] font-bold text-[#D97706]">
            <User size={12} aria-hidden />
            Guest mode
          </span>
        )}
      </div>

      <div className="px-[18px] pt-3">
        <h2 className="font-head m-0 text-lg font-semibold text-navy">
          Discover
        </h2>
        <p className="m-0 mt-0.5 text-xs text-ink-soft">
          Browse verified candidates anonymously.
        </p>
      </div>

      <div className="min-w-0 overflow-hidden pt-2.5">
        <div className="no-scrollbar flex gap-1.5 overflow-x-auto px-[18px]">
        {FILTERS.map((f, i) => (
          <button
            key={f}
            type="button"
            onClick={() => setActiveFilter(i)}
            className={`shrink-0 cursor-pointer rounded-[20px] px-3 py-1.5 text-[11.5px] font-semibold whitespace-nowrap ${
              i === activeFilter
                ? "border-none bg-blue text-white"
                : "border border-border bg-white text-ink"
            }`}
          >
            {f}
          </button>
        ))}
        </div>
      </div>

      <div className="grid flex-1 grid-cols-2 gap-2.5 px-[18px] pt-3.5">
        {DISCOVER_CANDIDATES.map((c) => (
          <DiscoverCandidateCard
            key={c.id}
            candidate={c}
            isSaved={savedIds.has(c.id)}
            onSave={(e) => toggleSave(e, c.id)}
            onMessage={handleMessage}
          />
        ))}
      </div>

      <div className="px-[18px] py-3.5">
        <div className="flex items-start gap-2.5 rounded-xl bg-blue-light p-3.5">
          <Shield
            size={15}
            className="mt-px shrink-0 text-[#1E3A8A]"
            aria-hidden
          />
          <div>
            <p className="m-0 text-[12.5px] font-bold text-[#1E3A8A]">
              100% verified profiles
            </p>
            <p className="m-0 mt-px text-[11.5px] text-[#1E3A8A]">
              All candidates are background checked for your safety.
            </p>
          </div>
        </div>

        {guestMode && (
          <div className="flex cursor-pointer flex-wrap items-center justify-center gap-[7px] pt-3 text-center">
            <Lock size={13} className="text-ink-soft" aria-hidden />
            <span className="text-[11.5px] font-semibold text-ink-soft">
              Browsing as guest — create a free account to message candidates.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
