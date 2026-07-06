import Link from "next/link";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Globe,
  Lock,
  MessageCircle,
  Shield,
  User,
} from "lucide-react";
import { Logo } from "@/components/logo";
import {
  LANDING_CANDIDATE_PHOTO,
  LANDING_EMPLOYER_PHOTO,
  TRUSTED_AVATAR_PHOTOS,
} from "@/lib/photos";

const CITIES = ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "RAK", "+3"];

const TRUST_FEATURES = [
  { icon: Shield, label: "Verified Profiles" },
  { icon: Lock, label: "Safe & Secure" },
  { icon: MessageCircle, label: "Direct Chat" },
] as const;

function LanguagePicker() {
  return (
    <div className="flex items-center gap-[3px] rounded-[20px] border border-border px-2.5 py-[5px] text-[12.5px] font-medium text-ink">
      <Globe size={13} aria-hidden />
      EN
      <ChevronDown size={12} aria-hidden />
    </div>
  );
}

type RoleCardProps = {
  tag: string;
  role: string;
  desc: string;
  bullets: string[];
  accent: "purple" | "blue";
  photoUrl?: string;
  href?: string;
};

function RoleCard({
  tag,
  role,
  desc,
  bullets,
  accent,
  photoUrl,
  href,
}: RoleCardProps) {
  const isPurple = accent === "purple";
  const accentColor = isPurple ? "bg-purple" : "bg-blue";
  const accentText = isPurple ? "text-purple" : "text-blue";
  const accentBg = isPurple ? "bg-purple-light" : "bg-blue-light";

  const className = `mb-3 flex w-full cursor-pointer items-center gap-3.5 rounded-2xl p-3.5 text-left no-underline ${accentBg}`;

  const content = (
    <>
      <div
        className={`flex h-[86px] w-[76px] shrink-0 items-center justify-center overflow-hidden rounded-[13px] bg-cover bg-center ${accentColor}`}
        style={photoUrl ? { backgroundImage: `url(${photoUrl})` } : undefined}
      >
        {!photoUrl && <User size={32} className="text-white" aria-hidden />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="m-0 text-[13px] font-medium text-ink-soft">{tag}</p>
        <p className={`m-0 text-[19px] font-extrabold ${accentText}`}>{role}</p>
        <p className="mb-1.5 mt-px text-[12.5px] font-medium text-ink">{desc}</p>
        {bullets.map((b) => (
          <div key={b} className="mb-0.5 flex items-center gap-[5px]">
            <Check
              size={11}
              className={accentText}
              strokeWidth={3}
              aria-hidden
            />
            <span className="text-[11px] text-ink-soft">{b}</span>
          </div>
        ))}
      </div>
      <div
        className={`flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full ${accentColor}`}
      >
        <ArrowRight size={16} className="text-white" aria-hidden />
      </div>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" className={className}>
      {content}
    </button>
  );
}

function LandingScreen() {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between px-[18px] pt-4">
        <Logo accent="purple" />
        <LanguagePicker />
      </div>

      {/* Hero */}
      <div className="px-6 pb-1.5 pt-5 text-center">
        <p className="m-0 text-[15px] font-medium text-ink-soft">Welcome to</p>
        <h1 className="font-head m-0 mt-0.5 inline-flex items-start text-[30px] font-extrabold leading-none text-navy">
          Housemaid
          <span
            className="bg-clip-text font-extrabold text-transparent"
            style={{
              backgroundImage: "linear-gradient(135deg, #9B6BFF, #6B3FE0)",
            }}
          >
            -AE
          </span>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            className="ml-0.5 -mt-1 shrink-0"
            aria-hidden
          >
            <path
              d="M12 21s-7-4.35-7-9.5C5 8.5 7.2 6.5 9.6 6.5c1.4 0 2.4.7 2.4 1.7C12 7.2 13 6.5 14.4 6.5 16.8 6.5 19 8.5 19 11.5 19 16.65 12 21 12 21z"
              stroke="#6C2BD9"
              strokeWidth="1.6"
              fill="none"
            />
          </svg>
        </h1>
        <p className="m-0 mt-2 text-[13.5px] leading-[1.5] text-ink-soft">
          Connecting trusted housemaids and employers across{" "}
          <span className="font-semibold text-purple">UAE</span>
        </p>
      </div>

      {/* City filter bar */}
      <div className="min-w-0 overflow-hidden px-[18px] mt-3.5">
        <div className="no-scrollbar flex items-center gap-2 overflow-x-auto rounded-[30px] border border-border px-3.5 py-2 text-[12.5px] font-semibold text-ink">
        <span className="flex shrink-0 items-center gap-[5px]">UAE Wide</span>
        <span className="text-border">|</span>
        {CITIES.map((c) => (
          <span key={c} className="shrink-0 font-medium text-ink-soft">
            {c}
          </span>
        ))}
        </div>
      </div>

      {/* Role picker heading */}
      <div className="px-6 pb-1 pt-[22px] text-center">
        <h2 className="font-head m-0 text-[16.5px] font-bold text-navy">
          What brings you here today?
        </h2>
        <p className="m-0 mt-1 text-[12.5px] text-ink-soft">
          Please choose an option to continue
        </p>
      </div>

      {/* Role cards */}
      <div className="px-[18px] pt-3">
        <RoleCard
          tag="I'm a"
          role="Candidate"
          desc="Looking for a job"
          bullets={["Create your profile", "Get discovered", "Find the right job"]}
          accent="purple"
          photoUrl={LANDING_CANDIDATE_PHOTO}
          href="/candidate/auth"
        />
        <RoleCard
          tag="I'm an"
          role="Employer"
          desc="Hiring a housemaid"
          bullets={[
            "Browse verified candidates",
            "Chat directly",
            "Find the perfect match",
          ]}
          accent="blue"
          photoUrl={LANDING_EMPLOYER_PHOTO}
          href="/employer/discover"
        />
      </div>

      {/* Trust section */}
      <div className="px-6 pb-[22px] pt-5 text-center">
        <p className="mb-2.5 text-xs text-ink-soft">
          Trusted by families across UAE
        </p>
        <div className="flex items-center justify-center gap-2.5">
          <div className="flex">
            {TRUSTED_AVATAR_PHOTOS.map((photo, i) => (
              <div
                key={photo}
                className="h-[30px] w-[30px] shrink-0 overflow-hidden rounded-full border-2 border-white"
                style={{ marginLeft: i === 0 ? 0 : -8 }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo}
                  alt=""
                  className="block h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
          <span className="flex items-center gap-[5px] rounded-[10px] bg-purple-light px-3 py-[7px] text-xs font-bold text-purple">
            <Shield size={13} aria-hidden />
            Verified Profiles
          </span>
        </div>
        <div className="mt-[18px] flex justify-around">
          {TRUST_FEATURES.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-[5px] text-purple"
            >
              <Icon size={18} aria-hidden />
              <span className="text-[10.5px] font-medium text-ink-soft">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return <LandingScreen />;
}
