"use client";

import {
  Calendar,
  Camera,
  Check,
  Edit2,
  Eye,
  Globe,
  Mail,
  MapPin,
  Phone,
  Send,
  Star,
  Upload,
  User,
  Video,
} from "lucide-react";
import { TopBar } from "@/components/ui/top-bar";
import { StepIndicator } from "@/components/ui/step-indicator";
import { ScreenHeading } from "@/components/ui/screen-heading";
import { FieldLabel } from "@/components/ui/field-label";
import { TextField } from "@/components/ui/text-field";
import { SelectField } from "@/components/ui/select-field";
import { RadioCard } from "@/components/ui/radio-card";
import { CheckChip } from "@/components/ui/check-chip";
import { FooterNav } from "@/components/ui/footer-nav";
import { PrimaryButton } from "@/components/ui/primary-button";
import {
  CANDIDATE_STEPS,
  VISA_LABELS,
  type CandidateProfile,
} from "@/lib/candidate-profile";

type StepProps = {
  data: CandidateProfile;
  setData: (data: CandidateProfile) => void;
  onBack: () => void;
  onContinue: () => void;
};

export function BasicInfoStep({
  data,
  setData,
  onBack,
  onContinue,
}: StepProps) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <TopBar onBack={onBack} accent="purple" />
      <StepIndicator steps={CANDIDATE_STEPS} current={1} />
      <ScreenHeading
        title="Create your profile"
        subtitle="Let's get started! Tell us a bit about yourself."
      />
      <div className="flex-1 px-[18px] pt-2">
        <div className="mb-[18px] text-center">
          <button
            type="button"
            onClick={() => setData({ ...data, photoUploaded: true })}
            className={`mx-auto mb-2 flex h-[92px] w-[92px] cursor-pointer items-center justify-center rounded-full border-none ${
              data.photoUploaded ? "bg-green-light" : "bg-purple-light"
            }`}
          >
            {data.photoUploaded ? (
              <Check size={28} className="text-green" strokeWidth={3} />
            ) : (
              <Camera size={26} className="text-purple" aria-hidden />
            )}
          </button>
          <p
            className={`m-0 text-[13px] font-bold ${
              data.photoUploaded ? "text-green" : "text-purple"
            }`}
          >
            {data.photoUploaded ? "Photo added" : "Upload photo"}
          </p>
          <p className="m-0 mt-[3px] text-[11.5px] text-ink-soft">
            {data.photoUploaded
              ? "Tap to change"
              : "Add a clear photo of yourself"}
          </p>
        </div>

        <div className="flex gap-2.5">
          <div className="flex-1">
            <FieldLabel required>First name</FieldLabel>
            <TextField
              icon={<User size={15} className="text-ink-faint" aria-hidden />}
              value={data.firstName}
              onChange={(v) => setData({ ...data, firstName: v })}
            />
          </div>
          <div className="flex-1">
            <FieldLabel required>Last name</FieldLabel>
            <TextField
              icon={<User size={15} className="text-ink-faint" aria-hidden />}
              value={data.lastName}
              onChange={(v) => setData({ ...data, lastName: v })}
            />
          </div>
        </div>

        <FieldLabel required>Email address</FieldLabel>
        <TextField
          icon={<Mail size={15} className="text-ink-faint" aria-hidden />}
          value={data.email}
          onChange={(v) => setData({ ...data, email: v })}
          type="email"
        />

        <FieldLabel required>Phone number</FieldLabel>
        <TextField
          icon={<Phone size={15} className="text-ink-faint" aria-hidden />}
          value={data.phone}
          onChange={(v) => setData({ ...data, phone: v })}
        />

        <FieldLabel required>Nationality</FieldLabel>
        <SelectField
          icon={<Globe size={15} className="text-ink-faint" aria-hidden />}
          value={data.nationality}
          options={[
            "Philippines",
            "Kenya",
            "Sri Lanka",
            "Bangladesh",
            "India",
            "Indonesia",
            "Nepal",
            "Ethiopia",
            "Uganda",
            "Other",
          ]}
          onChange={(v) => setData({ ...data, nationality: v })}
        />

        <FieldLabel required>Gender</FieldLabel>
        <div className="mb-4 flex gap-2.5">
          {["Female", "Male"].map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setData({ ...data, gender: g })}
              className={`flex-1 cursor-pointer rounded-[11px] border-[1.5px] py-[11px] text-[13.5px] font-semibold text-ink ${
                data.gender === g
                  ? "border-purple bg-purple-light"
                  : "border-border bg-white"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>
      <FooterNav onContinue={onContinue} accent="purple" />
    </div>
  );
}

export function LocationVisaStep({
  data,
  setData,
  onBack,
  onContinue,
}: StepProps) {
  const visaOptions = [
    {
      key: "own",
      title: "Own visa",
      subtitle: "You are sponsoring your own visa",
      badge: "Recommended",
    },
    {
      key: "visit",
      title: "Visit visa",
      subtitle: "You are in UAE on a visit visa",
    },
    {
      key: "cancelled",
      title: "Cancelled visa",
      subtitle: "You have a cancelled visa",
    },
    {
      key: "sponsored",
      title: "Sponsored visa",
      subtitle: "Your visa is sponsored by your employer",
    },
    {
      key: "sponsorship",
      title: "Looking for sponsorship",
      subtitle: "You need visa sponsorship",
    },
  ];

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <TopBar onBack={onBack} accent="purple" />
      <StepIndicator steps={CANDIDATE_STEPS} current={2} />
      <ScreenHeading
        title="Where are you located?"
        subtitle="This helps employers find you in their area."
      />
      <div className="flex-1 px-[18px] pt-2">
        <FieldLabel required>Current location</FieldLabel>
        <div className="mb-1 flex gap-2.5">
          <div className="flex-1">
            <SelectField
              icon={<MapPin size={15} className="text-ink-faint" aria-hidden />}
              value={data.emirate}
              options={[
                "Dubai",
                "Abu Dhabi",
                "Sharjah",
                "Ajman",
                "Ras Al Khaimah",
                "Fujairah",
                "Umm Al Quwain",
              ]}
              onChange={(v) => setData({ ...data, emirate: v })}
            />
          </div>
          <div className="flex-1">
            <SelectField
              icon={<MapPin size={15} className="text-ink-faint" aria-hidden />}
              value={data.district}
              options={[
                "Al Barsha",
                "Deira",
                "Al Nahda",
                "Khalifa City",
                "Jumeirah",
                "Mirdif",
                "Marina",
                "Al Quoz",
                "Downtown",
              ]}
              onChange={(v) => setData({ ...data, district: v })}
            />
          </div>
        </div>

        <FieldLabel required>Visa status in UAE</FieldLabel>
        {visaOptions.map((v) => (
          <RadioCard
            key={v.key}
            selected={data.visa === v.key}
            title={v.title}
            subtitle={v.subtitle}
            badge={v.badge}
            onClick={() => setData({ ...data, visa: v.key })}
          />
        ))}

        <FieldLabel>When can you start working?</FieldLabel>
        <SelectField
          icon={<Calendar size={15} className="text-ink-faint" aria-hidden />}
          value={data.availability}
          options={[
            "Available immediately",
            "Within 1 week",
            "Within 2 weeks",
            "Within 1 month",
            "Currently employed",
          ]}
          onChange={(v) => setData({ ...data, availability: v })}
        />
      </div>
      <FooterNav onContinue={onContinue} onBack={onBack} />
    </div>
  );
}

export function ExperienceStep({
  data,
  setData,
  onBack,
  onContinue,
}: StepProps) {
  const expOptions = [
    "Less than 1 year",
    "1 - 3 years",
    "3 - 5 years",
    "5+ years",
  ];
  const skillOptions: [string, string][] = [
    ["Cleaning", "🧹"],
    ["Cooking", "🍳"],
    ["Childcare", "🍼"],
    ["Laundry", "🧺"],
    ["Ironing", "👕"],
    ["Elderly care", "🧑‍🦳"],
    ["Pet care", "🐾"],
    ["Car washing", "🚗"],
    ["Gardening", "🌿"],
    ["Tutoring", "📖"],
    ["Disabled care", "♿"],
    ["Other", "···"],
  ];
  const langOptions = [
    "English",
    "Arabic",
    "Tagalog",
    "Hindi",
    "Urdu",
    "Tamil",
    "French",
    "Other",
  ];

  function toggle(field: "skills" | "languages", item: string) {
    const set = new Set(data[field]);
    if (set.has(item)) set.delete(item);
    else set.add(item);
    setData({ ...data, [field]: [...set] });
  }

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <TopBar onBack={onBack} accent="purple" />
      <StepIndicator steps={CANDIDATE_STEPS} current={3} />
      <ScreenHeading
        title="Tell us about your experience"
        subtitle="This helps employers understand you better."
      />
      <div className="flex-1 px-[18px] pt-2">
        <FieldLabel required>Years of experience</FieldLabel>
        <div className="mb-4 grid grid-cols-2 gap-2">
          {expOptions.map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => setData({ ...data, experience: e })}
              className={`cursor-pointer rounded-[11px] border-[1.5px] px-1.5 py-[11px] text-center text-[12.5px] font-semibold text-ink ${
                data.experience === e
                  ? "border-purple bg-purple-light"
                  : "border-border bg-white"
              }`}
            >
              {e}
            </button>
          ))}
        </div>

        <FieldLabel>Skills (select all that apply)</FieldLabel>
        <div className="mb-4 grid grid-cols-2 gap-2">
          {skillOptions.map(([s, icon]) => (
            <CheckChip
              key={s}
              label={s}
              icon={icon}
              selected={data.skills.includes(s)}
              onClick={() => toggle("skills", s)}
            />
          ))}
        </div>

        <FieldLabel>Languages</FieldLabel>
        <div className="mb-4 grid grid-cols-2 gap-2">
          {langOptions.map((l) => (
            <CheckChip
              key={l}
              label={l}
              icon="🌐"
              selected={data.languages.includes(l)}
              onClick={() => toggle("languages", l)}
            />
          ))}
        </div>

        <FieldLabel>About me (optional)</FieldLabel>
        <textarea
          value={data.about}
          onChange={(e) => setData({ ...data, about: e.target.value })}
          placeholder="Write a short description about yourself..."
          maxLength={300}
          className="mb-1 box-border min-h-20 w-full resize-none rounded-xl border border-border p-3 text-[13.5px] text-ink outline-none"
        />
        <p className="mb-4 text-right text-[11px] text-ink-faint">
          {data.about.length}/300
        </p>
      </div>
      <FooterNav onContinue={onContinue} onBack={onBack} />
    </div>
  );
}

export function MediaStep({ data, setData, onBack, onContinue }: StepProps) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  function toggleDay(d: string) {
    const set = new Set(data.days);
    if (set.has(d)) set.delete(d);
    else set.add(d);
    setData({ ...data, days: [...set] });
  }

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <TopBar onBack={onBack} accent="purple" />
      <StepIndicator steps={CANDIDATE_STEPS} current={4} />
      <ScreenHeading
        title="Add your photos, video and availability"
        subtitle="This helps employers get to know you better."
      />
      <div className="flex-1 px-[18px] pt-2">
        <FieldLabel required>Profile photo</FieldLabel>
        <button
          type="button"
          onClick={() => setData({ ...data, photoUploaded: true })}
          className={`mb-4 w-full cursor-pointer rounded-[14px] border-[1.5px] border-dashed px-3.5 py-[26px] text-center ${
            data.photoUploaded
              ? "border-green bg-green-light"
              : "border-purple bg-purple-light"
          }`}
        >
          {data.photoUploaded ? (
            <Check size={22} className="mx-auto text-green" strokeWidth={3} />
          ) : (
            <Camera size={22} className="mx-auto text-purple" aria-hidden />
          )}
          <p
            className={`mb-0.5 mt-1.5 text-[13px] font-bold ${
              data.photoUploaded ? "text-green" : "text-purple"
            }`}
          >
            {data.photoUploaded ? "Photo added" : "Upload photo"}
          </p>
          <p className="m-0 text-[11px] text-ink-soft">
            {data.photoUploaded ? "Tap to change" : "JPG, PNG (max 5MB)"}
          </p>
        </button>

        <FieldLabel>Introduction video (highly recommended)</FieldLabel>
        <button
          type="button"
          onClick={() => setData({ ...data, videoUploaded: true })}
          className={`mb-4 flex w-full cursor-pointer items-center gap-3 rounded-[14px] border-[1.5px] border-dashed px-4 py-4 text-left ${
            data.videoUploaded
              ? "border-green bg-green-light"
              : "border-purple bg-purple-light"
          }`}
        >
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[11px] ${
              data.videoUploaded ? "bg-green" : "bg-purple"
            }`}
          >
            {data.videoUploaded ? (
              <Check size={18} className="text-white" strokeWidth={3} />
            ) : (
              <Upload size={18} className="text-white" aria-hidden />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p
              className={`m-0 text-[12.5px] font-bold ${
                data.videoUploaded ? "text-green" : "text-purple"
              }`}
            >
              {data.videoUploaded ? "Video added" : "Upload video"}
            </p>
            <p className="m-0 mt-0.5 text-[11px] text-ink-soft">
              {data.videoUploaded
                ? "Tap to replace"
                : "MP4 only, max 30 seconds, max 30MB"}
            </p>
          </div>
        </button>

        <FieldLabel required>Salary expectation (AED)</FieldLabel>
        <div className="mb-4 flex items-center gap-2.5">
          <div className="flex-1 [&>div]:mb-0">
            <TextField
              value={data.salaryMin}
              onChange={(v) => setData({ ...data, salaryMin: v })}
              placeholder="Min"
            />
          </div>
          <span className="text-ink-faint">—</span>
          <div className="flex-1 [&>div]:mb-0">
            <TextField
              value={data.salaryMax}
              onChange={(v) => setData({ ...data, salaryMax: v })}
              placeholder="Max"
            />
          </div>
        </div>

        <FieldLabel required>Preferred employment type</FieldLabel>
        <div className="mb-4 flex gap-2.5">
          {(
            [
              ["livein", "Live-in", "I can live at employer's home"],
              ["liveout", "Live-out", "I will go home after work"],
            ] as const
          ).map(([key, title, subtitle]) => (
            <button
              key={key}
              type="button"
              onClick={() => setData({ ...data, employmentType: key })}
              className={`flex-1 cursor-pointer rounded-xl border-[1.5px] p-2.5 text-left ${
                data.employmentType === key
                  ? "border-purple bg-purple-light"
                  : "border-border bg-white"
              }`}
            >
              <p className="m-0 text-[12.5px] font-bold text-ink">{title}</p>
              <p className="m-0 mt-0.5 text-[10.5px] text-ink-soft">
                {subtitle}
              </p>
            </button>
          ))}
        </div>

        <FieldLabel>Preferred working days</FieldLabel>
        <div className="mb-4 flex flex-wrap gap-1.5">
          {days.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => toggleDay(d)}
              className={`cursor-pointer rounded-[9px] border-[1.5px] px-[13px] py-2 text-[12.5px] font-semibold text-ink ${
                data.days.includes(d)
                  ? "border-purple bg-purple-light"
                  : "border-border bg-white"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>
      <FooterNav onContinue={onContinue} onBack={onBack} />
    </div>
  );
}

type ReviewStepProps = {
  data: CandidateProfile;
  onBack: () => void;
  onPublish: () => void;
  onEditSection: (step: number) => void;
};

function ReviewSection({
  icon,
  title,
  step,
  onEditSection,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  step: number;
  onEditSection: (step: number) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-3 rounded-[14px] border border-border p-3.5">
      <div className="mb-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-purple-light">
            {icon}
          </div>
          <span className="text-[13.5px] font-bold text-ink">{title}</span>
        </div>
        <button
          type="button"
          onClick={() => onEditSection(step)}
          className="flex cursor-pointer items-center gap-[3px] border-none bg-transparent text-xs font-bold text-purple"
        >
          <Edit2 size={11} aria-hidden />
          Edit
        </button>
      </div>
      {children}
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="mb-1.5">
      <p className="m-0 text-[11px] text-ink-soft">{label}</p>
      <p className="m-0 mt-px text-[13px] font-semibold text-ink">{value}</p>
    </div>
  );
}

export function ReviewStep({
  data,
  onBack,
  onPublish,
  onEditSection,
}: ReviewStepProps) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <TopBar onBack={onBack} accent="purple" />
      <StepIndicator steps={CANDIDATE_STEPS} current={5} />
      <ScreenHeading
        title="Review your profile"
        subtitle="Please review your information before publishing."
      />
      <div className="flex-1 overflow-y-auto px-[18px] pt-2">
        <ReviewSection
          icon={<User size={13} className="text-[#4C1D95]" aria-hidden />}
          title="Basic information"
          step={1}
          onEditSection={onEditSection}
        >
          <div className="flex gap-3">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[10px] bg-purple-light">
              <User size={22} className="text-purple" aria-hidden />
            </div>
            <div>
              <ReviewRow
                label="Name"
                value={`${data.firstName || "—"} ${data.lastName || ""}`.trim()}
              />
              <ReviewRow label="Email" value={data.email || "—"} />
            </div>
          </div>
        </ReviewSection>

        <ReviewSection
          icon={<MapPin size={13} className="text-[#4C1D95]" aria-hidden />}
          title="Location & visa"
          step={2}
          onEditSection={onEditSection}
        >
          <ReviewRow
            label="Current location"
            value={`${data.district || "—"}, ${data.emirate || ""}`}
          />
          <ReviewRow
            label="Visa status"
            value={VISA_LABELS[data.visa] || "—"}
          />
        </ReviewSection>

        <ReviewSection
          icon={<Star size={13} className="text-[#4C1D95]" aria-hidden />}
          title="Experience, skills & languages"
          step={3}
          onEditSection={onEditSection}
        >
          <ReviewRow
            label="Years of experience"
            value={data.experience || "—"}
          />
          <ReviewRow
            label="Skills"
            value={data.skills.join(", ") || "—"}
          />
          <ReviewRow
            label="Languages"
            value={data.languages.join(", ") || "—"}
          />
        </ReviewSection>

        <ReviewSection
          icon={<Video size={13} className="text-[#4C1D95]" aria-hidden />}
          title="Media, salary & availability"
          step={4}
          onEditSection={onEditSection}
        >
          <ReviewRow
            label="Salary expectation"
            value={`AED ${data.salaryMin || "—"} – ${data.salaryMax || "—"}`}
          />
          <ReviewRow
            label="Employment type"
            value={
              data.employmentType === "livein" ? "Live-in" : "Live-out"
            }
          />
          <ReviewRow
            label="Preferred days"
            value={data.days.join(", ") || "—"}
          />
        </ReviewSection>

        <div className="mb-4 flex items-center gap-3 rounded-xl bg-green-light p-3.5">
          <div className="relative h-10 w-10 shrink-0">
            <svg
              width="40"
              height="40"
              className="-rotate-90"
              aria-hidden
            >
              <circle
                cx="20"
                cy="20"
                r="16"
                fill="none"
                stroke="#D1F0DD"
                strokeWidth="4"
              />
              <circle
                cx="20"
                cy="20"
                r="16"
                fill="none"
                stroke="#16A34A"
                strokeWidth="4"
                strokeDasharray="85 100"
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-green">
              85%
            </span>
          </div>
          <div>
            <p className="m-0 text-[12.5px] font-bold text-[#15803D]">
              Profile completion
            </p>
            <p className="m-0 mt-px text-[11px] text-[#15803D]">
              A complete profile gets more views and better job opportunities.
            </p>
          </div>
        </div>
      </div>

      <div className="px-[18px] pb-[22px]">
        <div className="mb-2">
          <PrimaryButton onClick={onPublish}>
            Publish my profile
            <Send size={15} aria-hidden />
          </PrimaryButton>
        </div>
        <PrimaryButton outline>
          <Eye size={15} aria-hidden />
          Preview profile
        </PrimaryButton>
      </div>
    </div>
  );
}
