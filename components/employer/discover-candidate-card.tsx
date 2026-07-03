"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Check,
  Clock,
  Heart,
  MapPin,
  MessageCircle,
} from "lucide-react";
import { FreshnessDot } from "@/components/employer/freshness-dot";
import {
  maskCandidateName,
  type DiscoverCandidate,
} from "@/lib/discover-candidates";

export type DiscoverCandidateCardProps = {
  candidate: DiscoverCandidate;
  isSaved: boolean;
  onSave: (e: React.MouseEvent) => void;
  onMessage: (e: React.MouseEvent) => void;
};

export function DiscoverCandidateCard({
  candidate: c,
  isSaved,
  onSave,
  onMessage,
}: DiscoverCandidateCardProps) {
  return (
    <Link
      href={`/employer/candidate/${c.id}`}
      className="block cursor-pointer overflow-hidden rounded-2xl border border-border bg-white no-underline"
    >
      <div
        className="relative h-[150px]"
        style={{ backgroundColor: c.photoTone }}
      >
        {c.photoUrl && (
          <Image
            src={c.photoUrl}
            alt=""
            fill
            className="object-cover"
            sizes="195px"
          />
        )}
        <div className="absolute left-2 top-2 flex items-center gap-[3px] rounded-[20px] bg-green px-[7px] py-[3px] text-[9.5px] font-bold text-white">
          <Check size={9} strokeWidth={3} aria-hidden />
          Verified
        </div>

        <button
          type="button"
          onClick={onSave}
          className="absolute right-2 top-2 flex h-[26px] w-[26px] cursor-pointer items-center justify-center rounded-full border-none bg-white/90"
          aria-label={isSaved ? "Unsave candidate" : "Save candidate"}
        >
          <Heart
            size={13}
            className={isSaved ? "text-[#E11D48]" : "text-ink"}
            fill={isSaved ? "#E11D48" : "none"}
          />
        </button>

        <div className="absolute bottom-2 left-2 rounded-[20px] bg-white/92 px-[7px] py-[3px] text-[9px] font-bold text-green">
          {c.available}
        </div>
      </div>

      <div className="p-2.5">
        <p className="m-0 text-[12.5px] font-bold text-ink">
          {maskCandidateName(c.name)} {c.nationality}
        </p>
        <p className="mb-1.5 mt-0.5 flex items-center gap-[3px] text-[10.5px] text-ink-soft">
          <MapPin size={9} aria-hidden />
          {c.location.split(",")[0]}
        </p>

        <div className="mb-1.5 flex flex-wrap gap-1">
          {c.skills.slice(0, 2).map((skill) => (
            <span
              key={skill}
              className="rounded-md bg-blue-light px-1.5 py-0.5 text-[9px] font-semibold text-[#1E3A8A]"
            >
              {skill}
            </span>
          ))}
        </div>

        <div className="mb-2 flex items-center justify-between">
          {c.responseTime ? (
            <p className="m-0 flex items-center gap-[3px] text-[10px] text-ink-faint">
              <Clock size={9} aria-hidden />
              Replies in {c.responseTime}
            </p>
          ) : (
            <span />
          )}
          <FreshnessDot lastActive={c.lastActive} />
        </div>

        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={onSave}
            className={`flex flex-1 cursor-pointer items-center justify-center gap-1 rounded-[9px] border py-1.5 text-[10px] font-semibold ${
              isSaved
                ? "border-[#E11D48] bg-[#FFF1F2] text-[#E11D48]"
                : "border-border bg-white text-ink-soft"
            }`}
          >
            <Heart size={11} fill={isSaved ? "#E11D48" : "none"} aria-hidden />
            Save
          </button>
          <button
            type="button"
            onClick={onMessage}
            className="flex flex-1 cursor-pointer items-center justify-center gap-1 rounded-[9px] border border-border bg-white py-1.5 text-[10px] font-semibold text-ink-soft"
          >
            <MessageCircle size={11} aria-hidden />
            Message
          </button>
        </div>
      </div>
    </Link>
  );
}
