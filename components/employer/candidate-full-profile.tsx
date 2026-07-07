"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Briefcase,
  Check,
  ChevronLeft,
  Clock,
  Heart,
  Home as HomeIcon,
  Lock,
  MapPin,
  MessageCircle,
  Pause,
  Play,
  Shield,
  Star,
} from "lucide-react";
import { AccountGateSheet } from "@/components/employer/account-gate-sheet";
import { EmployerLoginSheet } from "@/components/employer/employer-login-sheet";
import { MessageComposerSheet } from "@/components/employer/message-composer-sheet";
import { PaywallScreen } from "@/components/employer/paywall-screen";
import { FreshnessDot } from "@/components/employer/freshness-dot";
import { useEmployerAuth } from "@/components/employer/use-employer-auth";
import { maskCandidateName, type DiscoverCandidate } from "@/lib/discover-candidates";
import {
  clearStashedEmployerPendingAction,
  employerDisplayNameFromUser,
  readStashedEmployerPendingAction,
} from "@/lib/employer-auth";
import {
  isMessageQuotaExceededError,
  sendEmployerMessageToCandidate,
} from "@/lib/messaging-db";
import { createClient } from "@/lib/supabase";
import {
  canSendFreeMessage,
  FREE_MESSAGE_LIMIT,
  INITIAL_EMPLOYER_PAYWALL,
  loadEmployerPaywallState,
  saveEmployerPaywallState,
  type EmployerPaywallState,
} from "@/lib/employer-session";

type CandidateFullProfileProps = {
  candidate: DiscoverCandidate;
};

type PendingAction = "save" | "message" | "unlock" | null;
type PaywallVariant = "messaging" | "profile";

function InfoPill({
  label,
  icon,
}: {
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <span className="flex max-w-full items-center gap-[5px] rounded-[20px] bg-[#F1EFF9] px-2.5 py-[5px] text-[11.5px] font-semibold text-ink">
      {icon}
      <span className="truncate">{label}</span>
    </span>
  );
}

type ProfileActionButtonProps = {
  icon: React.ReactNode;
  label: string;
  filled?: boolean;
  accent?: "blue" | "green";
  disabled?: boolean;
  onClick?: () => void;
};

function ProfileActionButton({
  icon,
  label,
  filled,
  accent = "blue",
  disabled,
  onClick,
}: ProfileActionButtonProps) {
  const filledBg = accent === "green" ? "bg-green" : "bg-blue";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex w-full min-w-0 cursor-pointer items-center justify-center gap-1 rounded-[11px] px-1 py-2.5 text-[11px] font-bold sm:text-[12.5px] ${
        disabled ? "cursor-default opacity-80" : ""
      } ${
        filled
          ? `${filledBg} border-none text-white`
          : "border border-border bg-white text-ink"
      }`}
    >
      <span className="shrink-0">{icon}</span>
      <span className="truncate">{label}</span>
    </button>
  );
}

export function CandidateFullProfile({ candidate: c }: CandidateFullProfileProps) {
  const pathname = usePathname();
  const tCommon = useTranslations("common");
  const tEmployer = useTranslations("employer.candidateProfile");
  const tAria = useTranslations("aria");
  const tErrors = useTranslations("errors");
  const { loading: authLoading, isGuest } = useEmployerAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [playingVideo, setPlayingVideo] = useState(false);
  const [paywall, setPaywall] = useState<EmployerPaywallState>(
    INITIAL_EMPLOYER_PAYWALL
  );
  const [gateOpen, setGateOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [composerOpen, setComposerOpen] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [messageError, setMessageError] = useState<string | null>(null);
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [paywallVariant, setPaywallVariant] = useState<PaywallVariant>("messaging");
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);

  const isUnlocked = paywall.hasUnlockedProfile;

  useEffect(() => {
    if (authLoading) return;
    setPaywall(loadEmployerPaywallState());
  }, [authLoading]);

  useEffect(() => {
    if (authLoading || isGuest) return;

    const stashed = readStashedEmployerPendingAction();
    if (!stashed || stashed.returnPath !== pathname) return;

    clearStashedEmployerPendingAction();
    completePendingAction(loadEmployerPaywallState(), stashed.action);
  }, [authLoading, isGuest, pathname]);

  function persistPaywall(next: EmployerPaywallState) {
    setPaywall(next);
    saveEmployerPaywallState(next);
  }

  function completePendingAction(state: EmployerPaywallState, action: PendingAction) {
    if (action === "save") {
      setIsSaved(true);
      return;
    }
    if (action === "message") {
      openMessageFlow(state);
      return;
    }
    if (action === "unlock") {
      openUnlockFlow(state);
    }
  }

  function openMessageFlow(state: EmployerPaywallState) {
    if (!canSendFreeMessage(state)) {
      setPendingAction("message");
      setPaywallVariant("messaging");
      setPaywallOpen(true);
      return;
    }
    setComposerOpen(true);
  }

  function openUnlockFlow(state: EmployerPaywallState) {
    if (state.hasUnlockedProfile) return;
    setPendingAction("unlock");
    setPaywallVariant("profile");
    setPaywallOpen(true);
  }

  async function handleSendMessage(message: string) {
    setMessageError(null);
    setSendingMessage(true);

    try {
      const supabase = createClient();
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!authUser) {
        setMessageError(tErrors("pleaseLogInToMessage"));
        return;
      }

      const displayName = employerDisplayNameFromUser(authUser);

      await sendEmployerMessageToCandidate(
        supabase,
        authUser.id,
        c.id,
        message,
        {
          fullName: displayName,
          familyName: displayName,
        }
      );

      persistPaywall({
        ...paywall,
        freeMessagesSent: paywall.freeMessagesSent + 1,
      });
      setComposerOpen(false);
    } catch (error) {
      console.error("[employer] Failed to send message:", error);
      if (isMessageQuotaExceededError(error)) {
        setMessageError(null);
        setComposerOpen(false);
        persistPaywall({
          ...paywall,
          freeMessagesSent: Math.max(
            paywall.freeMessagesSent,
            FREE_MESSAGE_LIMIT
          ),
        });
        setPendingAction("message");
        setPaywallVariant("messaging");
        setPaywallOpen(true);
        return;
      }
      setMessageError(
        error instanceof Error ? error.message : tErrors("sendMessage")
      );
    } finally {
      setSendingMessage(false);
    }
  }

  function requireAccount(action: PendingAction) {
    if (authLoading) return true;
    if (!isGuest) return false;
    setPendingAction(action);
    setGateOpen(true);
    return true;
  }

  function handleSave() {
    if (requireAccount("save")) return;
    setIsSaved((s) => !s);
  }

  function handleMessage() {
    if (requireAccount("message")) return;
    openMessageFlow(paywall);
  }

  function handleViewProfile() {
    if (isUnlocked) return;
    if (requireAccount("unlock")) return;
    openUnlockFlow(paywall);
  }

  function openLoginSheet() {
    setGateOpen(false);
    setLoginOpen(true);
  }

  function handleUnlock() {
    const next: EmployerPaywallState = { ...paywall };

    if (pendingAction === "unlock" || paywallVariant === "profile") {
      next.hasUnlockedProfile = true;
    } else {
      next.hasUnlockedPremium = true;
    }

    persistPaywall(next);
    setPaywallOpen(false);
    const action = pendingAction;
    setPendingAction(null);

    if (action === "message") {
      setComposerOpen(true);
    }
  }

  const firstName = c.name.split(" ")[0];
  const actionLabel =
    pendingAction === "save"
      ? "saving"
      : pendingAction === "unlock"
        ? "viewing"
        : "messaging";

  return (
    <div
      className="relative flex min-h-full min-w-0 flex-1 flex-col bg-app-bg"
      style={{ overflowX: "hidden", maxWidth: "100%", width: "100%" }}
    >
      <div
        className="relative h-80 shrink-0 overflow-hidden"
        style={{ backgroundColor: c.photoTone }}
      >
        {c.photoUrl && (
          <Image
            src={c.photoUrl}
            alt=""
            fill
            className="object-cover"
            sizes="390px"
            priority
          />
        )}

        <div className="absolute left-3.5 right-3.5 top-3.5 flex justify-between">
          <Link
            href="/employer/discover"
            className="flex rounded-full bg-white/85 p-[7px]"
            aria-label={tAria("goBack")}
          >
            <ChevronLeft size={18} className="text-ink" aria-hidden />
          </Link>
          <button
            type="button"
            onClick={handleSave}
            className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-none ${
              isSaved ? "bg-green" : "bg-white/85"
            }`}
            aria-label={
              isSaved ? tAria("unsaveCandidate") : tAria("saveCandidate")
            }
          >
            <Heart
              size={15}
              className={isSaved ? "text-white" : "text-ink"}
              fill={isSaved ? "#fff" : "none"}
            />
          </button>
        </div>

        <div className="absolute left-3.5 top-14 flex items-center gap-1 rounded-[20px] bg-green px-[9px] py-1 text-[10.5px] font-bold text-white">
          <Check size={10} strokeWidth={3} aria-hidden />
          Verified
        </div>

        <div className="absolute right-3.5 top-14 flex items-center gap-[5px] rounded-[20px] bg-white/90 px-[9px] py-1 text-[10px] font-bold">
          <FreshnessDot lastActive={c.lastActive} showLabel />
        </div>

        {playingVideo && (
          <div className="absolute inset-0 flex items-center justify-center bg-[rgba(15,27,61,0.55)]">
            <p className="rounded-[20px] bg-black/30 px-4 py-2 text-[12.5px] font-semibold text-white">
              Playing {c.name.split(" ")[0]}&apos;s intro video...
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={() => setPlayingVideo((p) => !p)}
          className="absolute left-1/2 top-1/2 flex h-[58px] w-[58px] -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-none bg-black/35"
          aria-label={
            playingVideo ? tAria("pauseVideo") : tAria("playIntroVideo")
          }
        >
          {playingVideo ? (
            <Pause size={22} className="fill-white text-white" aria-hidden />
          ) : (
            <Play size={22} className="fill-white text-white" aria-hidden />
          )}
        </button>

        <div className="absolute bottom-3 right-3.5 rounded-[20px] bg-green px-2.5 py-1 text-[10.5px] font-bold text-white">
          {c.available}
        </div>
      </div>

      <div className="flex-1 overflow-x-hidden overflow-y-auto px-[18px] py-4">
        <p className="font-head m-0 text-[19px] font-bold text-navy">
          {isUnlocked ? c.name : maskCandidateName(c.name)} {c.nationality}
        </p>
        <p className="mb-2.5 mt-[3px] flex items-center gap-1 text-[12.5px] text-ink-soft">
          <MapPin size={12} aria-hidden />
          {isUnlocked ? c.location : `${c.location.split(",")[0]}, —`}
        </p>

        <div className="mb-3.5 flex min-w-0 flex-wrap gap-1.5">
          {c.visa && c.visa !== "—" && (
            <InfoPill label={c.visa} icon={<Shield size={11} aria-hidden />} />
          )}
          {c.exp && (
            <InfoPill label={c.exp} icon={<Star size={11} aria-hidden />} />
          )}
          {c.type && (
            <InfoPill label={c.type} icon={<Clock size={11} aria-hidden />} />
          )}
          {c.live && (
            <InfoPill
              label={c.live}
              icon={<HomeIcon size={11} aria-hidden />}
            />
          )}
          {c.rate && c.rate !== "—" && (
            <InfoPill label={c.rate} icon={<span aria-hidden>💰</span>} />
          )}
        </div>

        <div className="mb-4 flex min-w-0 flex-wrap gap-2">
          {([tCommon("identity"), tCommon("visa"), tCommon("references")] as const).map((label) => (
            <div
              key={label}
              className="flex min-w-0 flex-1 basis-[calc(33.333%-0.375rem)] items-center gap-[5px] rounded-[9px] bg-green-light px-2 py-[7px]"
            >
              <Check size={12} className="shrink-0 text-green" strokeWidth={3} />
              <span className="truncate text-[10.5px] font-semibold text-[#15803D]">
                {label}
              </span>
            </div>
          ))}
        </div>

        <p className="mb-1.5 text-[13px] font-bold text-ink">About</p>
        <p className="mb-3.5 text-[12.5px] leading-relaxed text-ink-soft">
          {c.bio}
        </p>

        <p className="mb-2 text-[13px] font-bold text-ink">Skills</p>
        <div className="mb-4 flex min-w-0 flex-wrap gap-1.5">
          {c.skills.map((skill) => (
            <span
              key={skill}
              className="rounded-lg bg-blue-light px-2.5 py-[5px] text-[11px] font-semibold text-[#1E3A8A]"
            >
              {skill}
            </span>
          ))}
        </div>

        {isUnlocked ? (
          <>
            <p className="mb-2 text-[13px] font-bold text-ink">
              {tEmployer("employmentHistory")}
            </p>
            <div className="mb-4">
              {c.employmentHistory.map((job) => (
                <div key={`${job.role}-${job.years}`} className="mb-2.5 flex gap-2.5">
                  <div className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-blue-light">
                    <Briefcase size={13} className="text-blue" aria-hidden />
                  </div>
                  <div>
                    <p className="m-0 text-[12.5px] font-bold text-ink">
                      {job.role}
                    </p>
                    <p className="m-0 mt-px text-[11.5px] text-ink-soft">
                      {job.employer} · {job.location}
                    </p>
                    <p className="m-0 mt-px text-[10.5px] text-ink-faint">
                      {job.years}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <p className="mb-2 text-[13px] font-bold text-ink">References</p>
            <div className="mb-4 rounded-xl bg-green-light p-3.5">
              <p className="m-0 flex items-center gap-[5px] text-xs font-bold text-[#15803D]">
                <Check size={13} strokeWidth={3} aria-hidden />
                {c.references.count} verified reference
                {c.references.count !== 1 ? "s" : ""}
              </p>
              <p className="mb-0 mt-[5px] text-xs leading-normal text-[#15803D]">
                {c.references.summary}
              </p>
            </div>
          </>
        ) : (
          <div className="relative mb-4 min-w-0 overflow-hidden">
            <div className="pointer-events-none min-w-0 select-none overflow-hidden blur-[4px]">
              <p className="mb-2 text-[13px] font-bold text-ink">
                {tEmployer("employmentHistory")}
              </p>
              <div className="mb-2.5 flex gap-2.5">
                <div className="h-[30px] w-[30px] shrink-0 rounded-full bg-blue-light" />
                <div>
                  <p className="m-0 text-[12.5px] font-bold text-ink">
                    {c.employmentHistory[0]?.role || tCommon("previousRole")}
                  </p>
                  <p className="m-0 mt-px text-[11.5px] text-ink-soft">
                    {c.employmentHistory[0]?.employer || tCommon("previousEmployer")} ·
                    ●●●●●●
                  </p>
                  <p className="m-0 mt-px text-[10.5px] text-ink-faint">
                    ●●●● - ●●●●
                  </p>
                </div>
              </div>
              <p className="mb-2 mt-3 text-[13px] font-bold text-ink">
                References
              </p>
              <div className="rounded-xl bg-green-light p-3.5">
                <p className="m-0 text-xs font-bold text-[#15803D]">
                  {c.references.count} verified references
                </p>
                <p className="m-0 mt-[5px] break-words text-xs text-[#15803D]">
                  ●●●● ●●●● ●●●● ●●●● ●●●● ●●●●
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleViewProfile}
              className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-[14px] border-none bg-white/55"
            >
              <div className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-blue">
                <Lock size={16} className="text-white" aria-hidden />
              </div>
              <p className="m-0 px-4 text-center text-[12.5px] font-bold text-navy">
                View full employment history & references
              </p>
            </button>
          </div>
        )}

        <p className="mb-1 flex items-center gap-1 text-[11.5px] text-ink-faint">
          <Clock size={11} aria-hidden />
          Typically replies in {c.responseTime}
        </p>
      </div>

      <div className="grid w-full min-w-0 grid-cols-3 gap-2 border-t border-border bg-white px-[18px] py-3 pb-5">
        <ProfileActionButton
          icon={
            <Heart
              size={14}
              className={isSaved ? "text-white" : "text-ink"}
              fill={isSaved ? "#fff" : "none"}
              aria-hidden
            />
          }
          label={isSaved ? tCommon("saved") : tCommon("save")}
          filled={isSaved}
          accent="green"
          onClick={handleSave}
        />
        <ProfileActionButton
          icon={
            <MessageCircle
              size={14}
              className="text-ink"
              strokeWidth={2}
              aria-hidden
            />
          }
          label={tCommon("message")}
          onClick={handleMessage}
        />
        {isUnlocked ? (
          <div className="flex min-w-0 w-full items-center justify-center gap-1 rounded-[11px] bg-green-light px-1 py-2.5">
            <Check
              size={14}
              className="shrink-0 text-[#15803D]"
              strokeWidth={3}
              aria-hidden
            />
            <span className="truncate text-[11px] font-bold text-[#15803D] sm:text-[12.5px]">
              Profile unlocked
            </span>
          </div>
        ) : (
          <ProfileActionButton
            icon={<Lock size={13} className="text-white" aria-hidden />}
            label={tCommon("viewProfile")}
            filled
            accent="blue"
            onClick={handleViewProfile}
          />
        )}
      </div>

      <AccountGateSheet
        open={gateOpen}
        candidateName={firstName}
        actionLabel={actionLabel}
        onCreateAccount={openLoginSheet}
        onLogin={openLoginSheet}
        onDismiss={() => {
          setGateOpen(false);
          setPendingAction(null);
        }}
      />

      <EmployerLoginSheet
        open={loginOpen}
        pendingAction={pendingAction}
        onBack={() => {
          setLoginOpen(false);
          setGateOpen(true);
        }}
        onDismiss={() => {
          setLoginOpen(false);
          setPendingAction(null);
        }}
      />

      <MessageComposerSheet
        open={composerOpen}
        candidateName={firstName}
        onSend={(message) => void handleSendMessage(message)}
        onDismiss={() => {
          setComposerOpen(false);
          setMessageError(null);
        }}
      />
      {messageError && (
        <p className="fixed bottom-24 left-1/2 z-50 max-w-[90%] -translate-x-1/2 rounded-xl bg-red-50 px-4 py-2.5 text-center text-[12px] text-[#B91C1C] shadow">
          {messageError}
        </p>
      )}

      {paywallOpen && (
        <PaywallScreen
          variant={paywallVariant}
          used={Math.min(paywall.freeMessagesSent, FREE_MESSAGE_LIMIT)}
          limit={FREE_MESSAGE_LIMIT}
          onUnlock={handleUnlock}
          onBack={() => {
            setPaywallOpen(false);
            setPendingAction(null);
          }}
        />
      )}
    </div>
  );
}
