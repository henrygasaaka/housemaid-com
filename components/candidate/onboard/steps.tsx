"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
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
  getCandidateSteps,
  getEmploymentLabel,
  getVisaLabel,
  EMPLOYMENT_TYPE,
  VISA_STATUS,
  type CandidateProfile,
} from "@/lib/candidate-profile";
import {
  AVAILABILITY_VALUES,
  DAY_VALUES,
  DISTRICT_VALUES,
  EMIRATE_VALUES,
  EXPERIENCE_VALUES,
  getAvailabilityLabel,
  getDayLabel,
  getDistrictLabel,
  getEmirateLabel,
  getExperienceLabel,
  getGenderLabel,
  getLanguageLabel,
  getNationalityLabel,
  getSkillLabel,
  LANGUAGE_VALUES,
  NATIONALITY_VALUES,
  SKILL_ICONS,
  SKILL_VALUES,
} from "@/lib/i18n-options";
import { calculateProfileCompletion } from "@/lib/candidate-dashboard";

type StepProps = {
  data: CandidateProfile;
  setData: (data: CandidateProfile) => void;
  onBack: () => void;
  onContinue: () => void;
  saving?: boolean;
  saveError?: string | null;
  uploadingPhoto?: boolean;
  uploadingVideo?: boolean;
  onPhotoSelect?: (file: File) => void;
  onVideoSelect?: (file: File) => void;
};

export function BasicInfoStep({
  data,
  setData,
  onBack,
  onContinue,
  saving,
  saveError,
  uploadingPhoto,
  onPhotoSelect,
}: StepProps) {
  const photoInputRef = useRef<HTMLInputElement>(null);
  const t = useTranslations();
  const tOnboard = useTranslations("onboard.basicInfo");
  const tCommon = useTranslations("common");
  const tAria = useTranslations("aria");
  const steps = getCandidateSteps((key) => t(key));

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <TopBar onBack={onBack} accent="purple" />
      <StepIndicator steps={steps} current={1} />
      <ScreenHeading
        title={tOnboard("title")}
        subtitle={tOnboard("subtitle")}
      />
      <div className="flex-1 px-[18px] pt-2">
        <div className="mb-[18px] text-center">
          <input
            ref={photoInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onPhotoSelect?.(file);
              e.target.value = "";
            }}
          />
          <button
            type="button"
            onClick={() => photoInputRef.current?.click()}
            disabled={uploadingPhoto}
            className={`mx-auto mb-2 flex h-[92px] w-[92px] cursor-pointer items-center justify-center overflow-hidden rounded-full border-none disabled:opacity-70 ${
              data.photoUploaded ? "bg-green-light" : "bg-purple-light"
            }`}
          >
            {data.photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={data.photoUrl}
                alt={tAria("profilePhotoAlt")}
                className="h-full w-full object-cover"
              />
            ) : data.photoUploaded ? (
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
            {uploadingPhoto
              ? tCommon("uploadingPhoto")
              : data.photoUploaded
                ? tCommon("photoAdded")
                : tCommon("uploadPhoto")}
          </p>
          <p className="m-0 mt-[3px] text-[11.5px] text-ink-soft">
            {data.photoUploaded
              ? tCommon("tapToChange")
              : tOnboard("photoHint")}
          </p>
        </div>

        <div className="flex gap-2.5">
          <div className="flex-1">
            <FieldLabel required>{tOnboard("firstName")}</FieldLabel>
            <TextField
              icon={<User size={15} className="text-ink-faint" aria-hidden />}
              value={data.firstName}
              onChange={(v) => setData({ ...data, firstName: v })}
            />
          </div>
          <div className="flex-1">
            <FieldLabel required>{tOnboard("lastName")}</FieldLabel>
            <TextField
              icon={<User size={15} className="text-ink-faint" aria-hidden />}
              value={data.lastName}
              onChange={(v) => setData({ ...data, lastName: v })}
            />
          </div>
        </div>

        <FieldLabel required>{tOnboard("emailAddress")}</FieldLabel>
        <TextField
          icon={<Mail size={15} className="text-ink-faint" aria-hidden />}
          value={data.email}
          onChange={(v) => setData({ ...data, email: v })}
          type="email"
        />

        <FieldLabel required>{tOnboard("phoneNumber")}</FieldLabel>
        <TextField
          icon={<Phone size={15} className="text-ink-faint" aria-hidden />}
          value={data.phone}
          onChange={(v) => setData({ ...data, phone: v })}
        />

        <FieldLabel required>{tOnboard("nationality")}</FieldLabel>
        <SelectField
          icon={<Globe size={15} className="text-ink-faint" aria-hidden />}
          value={data.nationality}
          options={[...NATIONALITY_VALUES]}
          getLabel={(v) => getNationalityLabel((key) => t(key), v)}
          onChange={(v) => setData({ ...data, nationality: v })}
        />

        <FieldLabel required>{tOnboard("gender")}</FieldLabel>
        <div className="mb-4 flex gap-2.5">
          {(["Female", "Male"] as const).map((g) => (
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
              {getGenderLabel((key) => t(key), g)}
            </button>
          ))}
        </div>
      </div>
      <FooterNav
        onContinue={onContinue}
        accent="purple"
        loading={saving}
        error={saveError}
      />
    </div>
  );
}

export function LocationVisaStep({
  data,
  setData,
  onBack,
  onContinue,
  saving,
  saveError,
}: StepProps) {
  const t = useTranslations();
  const tLoc = useTranslations("onboard.locationVisa");
  const tCommon = useTranslations("common");
  const steps = getCandidateSteps((key) => t(key));
  const visaOptions = [
    {
      key: VISA_STATUS.OWN,
      titleKey: "ownVisa" as const,
      badge: tCommon("recommended"),
    },
    { key: VISA_STATUS.VISIT, titleKey: "visitVisa" as const },
    { key: VISA_STATUS.CANCELLED, titleKey: "cancelledVisa" as const },
    { key: VISA_STATUS.SPONSORED, titleKey: "sponsoredVisa" as const },
    {
      key: VISA_STATUS.LOOKING_FOR_SPONSORSHIP,
      titleKey: "lookingForSponsorship" as const,
    },
  ];

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <TopBar onBack={onBack} accent="purple" />
      <StepIndicator steps={steps} current={2} />
      <ScreenHeading
        title={tLoc("title")}
        subtitle={tLoc("subtitle")}
      />
      <div className="flex-1 px-[18px] pt-2">
        <FieldLabel required>{tLoc("currentLocation")}</FieldLabel>
        <div className="mb-1 flex gap-2.5">
          <div className="flex-1">
            <SelectField
              icon={<MapPin size={15} className="text-ink-faint" aria-hidden />}
              value={data.emirate}
              options={[...EMIRATE_VALUES]}
              getLabel={(v) => getEmirateLabel((key) => t(key), v)}
              onChange={(v) => setData({ ...data, emirate: v })}
            />
          </div>
          <div className="flex-1">
            <SelectField
              icon={<MapPin size={15} className="text-ink-faint" aria-hidden />}
              value={data.district}
              options={[...DISTRICT_VALUES]}
              getLabel={(v) => getDistrictLabel((key) => t(key), v)}
              onChange={(v) => setData({ ...data, district: v })}
            />
          </div>
        </div>

        <FieldLabel required>{tLoc("visaStatus")}</FieldLabel>
        {visaOptions.map((v) => (
          <RadioCard
            key={v.key}
            selected={data.visa === v.key}
            title={tLoc(`visaOptions.${v.titleKey}.title`)}
            subtitle={tLoc(`visaOptions.${v.titleKey}.subtitle`)}
            badge={v.badge}
            onClick={() => setData({ ...data, visa: v.key })}
          />
        ))}

        <FieldLabel>{tLoc("whenCanStart")}</FieldLabel>
        <SelectField
          icon={<Calendar size={15} className="text-ink-faint" aria-hidden />}
          value={data.availability}
          options={[...AVAILABILITY_VALUES]}
          getLabel={(v) => getAvailabilityLabel((key) => t(key), v)}
          onChange={(v) => setData({ ...data, availability: v })}
        />
      </div>
      <FooterNav
        onContinue={onContinue}
        onBack={onBack}
        loading={saving}
        error={saveError}
      />
    </div>
  );
}

export function ExperienceStep({
  data,
  setData,
  onBack,
  onContinue,
  saving,
  saveError,
}: StepProps) {
  const t = useTranslations();
  const tExp = useTranslations("onboard.experience");
  const tCommon = useTranslations("common");
  const steps = getCandidateSteps((key) => t(key));

  function toggle(field: "skills" | "languages", item: string) {
    const set = new Set(data[field]);
    if (set.has(item)) set.delete(item);
    else set.add(item);
    setData({ ...data, [field]: [...set] });
  }

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <TopBar onBack={onBack} accent="purple" />
      <StepIndicator steps={steps} current={3} />
      <ScreenHeading
        title={tExp("title")}
        subtitle={tExp("subtitle")}
      />
      <div className="flex-1 px-[18px] pt-2">
        <FieldLabel required>{tExp("yearsOfExperience")}</FieldLabel>
        <div className="mb-4 grid grid-cols-2 gap-2">
          {EXPERIENCE_VALUES.map((e) => (
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
              {getExperienceLabel((key) => t(key), e)}
            </button>
          ))}
        </div>

        <FieldLabel>{tExp("skillsLabel")}</FieldLabel>
        <div className="mb-4 grid grid-cols-2 gap-2">
          {SKILL_VALUES.map((s) => (
            <CheckChip
              key={s}
              label={getSkillLabel((key) => t(key), s)}
              icon={SKILL_ICONS[s]}
              selected={data.skills.includes(s)}
              onClick={() => toggle("skills", s)}
            />
          ))}
        </div>

        <FieldLabel>{tExp("languagesLabel")}</FieldLabel>
        <div className="mb-4 grid grid-cols-2 gap-2">
          {LANGUAGE_VALUES.map((l) => (
            <CheckChip
              key={l}
              label={getLanguageLabel((key) => t(key), l)}
              icon="🌐"
              selected={data.languages.includes(l)}
              onClick={() => toggle("languages", l)}
            />
          ))}
        </div>

        <FieldLabel>{tExp("aboutMeOptional")}</FieldLabel>
        <textarea
          value={data.about}
          onChange={(e) => setData({ ...data, about: e.target.value })}
          placeholder={tExp("aboutPlaceholder")}
          maxLength={300}
          className="mb-1 box-border min-h-20 w-full resize-none rounded-xl border border-border p-3 text-[13.5px] text-ink outline-none"
        />
        <p className="mb-4 text-right text-[11px] text-ink-faint">
          {tCommon("aboutCharCount", { count: data.about.length })}
        </p>
      </div>
      <FooterNav
        onContinue={onContinue}
        onBack={onBack}
        loading={saving}
        error={saveError}
      />
    </div>
  );
}

export function MediaStep({
  data,
  setData,
  onBack,
  onContinue,
  saving,
  saveError,
  uploadingPhoto,
  uploadingVideo,
  onPhotoSelect,
  onVideoSelect,
}: StepProps) {
  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const t = useTranslations();
  const tMedia = useTranslations("onboard.media");
  const tCommon = useTranslations("common");
  const steps = getCandidateSteps((key) => t(key));
  const days = [...DAY_VALUES];

  function toggleDay(d: string) {
    const set = new Set(data.days);
    if (set.has(d)) set.delete(d);
    else set.add(d);
    setData({ ...data, days: [...set] });
  }

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <TopBar onBack={onBack} accent="purple" />
      <StepIndicator steps={steps} current={4} />
      <ScreenHeading
        title={tMedia("title")}
        subtitle={tMedia("subtitle")}
      />
      <div className="flex-1 px-[18px] pt-2">
        <FieldLabel required>{tMedia("profilePhoto")}</FieldLabel>
        <input
          ref={photoInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onPhotoSelect?.(file);
            e.target.value = "";
          }}
        />
        <button
          type="button"
          onClick={() => photoInputRef.current?.click()}
          disabled={uploadingPhoto}
          className={`mb-4 w-full cursor-pointer rounded-[14px] border-[1.5px] border-dashed px-3.5 py-[26px] text-center disabled:opacity-70 ${
            data.photoUploaded
              ? "border-green bg-green-light"
              : "border-purple bg-purple-light"
          }`}
        >
          {data.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={data.photoUrl}
              alt="Profile"
              className="mx-auto mb-2 h-20 w-20 rounded-full object-cover"
            />
          ) : data.photoUploaded ? (
            <Check size={22} className="mx-auto text-green" strokeWidth={3} />
          ) : (
            <Camera size={22} className="mx-auto text-purple" aria-hidden />
          )}
          <p
            className={`mb-0.5 mt-1.5 text-[13px] font-bold ${
              data.photoUploaded ? "text-green" : "text-purple"
            }`}
          >
            {uploadingPhoto
              ? tCommon("uploadingPhoto")
              : data.photoUploaded
                ? tCommon("photoAdded")
                : tCommon("uploadPhoto")}
          </p>
          <p className="m-0 text-[11px] text-ink-soft">
            {data.photoUploaded ? tCommon("tapToChange") : tMedia("photoFormats")}
          </p>
        </button>

        <FieldLabel>{tMedia("introVideo")}</FieldLabel>
        <input
          ref={videoInputRef}
          type="file"
          accept="video/mp4"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onVideoSelect?.(file);
            e.target.value = "";
          }}
        />
        <button
          type="button"
          onClick={() => videoInputRef.current?.click()}
          disabled={uploadingVideo}
          className={`mb-4 flex w-full cursor-pointer items-center gap-3 rounded-[14px] border-[1.5px] border-dashed px-4 py-4 text-left disabled:opacity-70 ${
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
              {uploadingVideo
                ? tCommon("uploadingVideo")
                : data.videoUploaded
                  ? tCommon("videoAdded")
                  : tCommon("uploadVideo")}
            </p>
            <p className="m-0 mt-0.5 text-[11px] text-ink-soft">
              {data.videoUploaded
                ? data.videoFileName || tCommon("tapToReplace")
                : tMedia("videoFormats")}
            </p>
          </div>
        </button>

        <FieldLabel required>{tMedia("salaryExpectation")}</FieldLabel>
        <div className="mb-4 flex items-center gap-2.5">
          <div className="flex-1 [&>div]:mb-0">
            <TextField
              value={data.salaryMin}
              onChange={(v) => setData({ ...data, salaryMin: v })}
              placeholder={tCommon("min")}
            />
          </div>
          <span className="text-ink-faint">{tCommon("emDash")}</span>
          <div className="flex-1 [&>div]:mb-0">
            <TextField
              value={data.salaryMax}
              onChange={(v) => setData({ ...data, salaryMax: v })}
              placeholder={tCommon("max")}
            />
          </div>
        </div>

        <FieldLabel required>{tMedia("preferredEmploymentType")}</FieldLabel>
        <div className="mb-4 flex gap-2.5">
          {(
            [
              [EMPLOYMENT_TYPE.LIVE_IN, "liveInTitle", "liveInSubtitle"],
              [EMPLOYMENT_TYPE.LIVE_OUT, "liveOutTitle", "liveOutSubtitle"],
            ] as const
          ).map(([key, titleKey, subtitleKey]) => (
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
              <p className="m-0 text-[12.5px] font-bold text-ink">
                {tMedia(titleKey)}
              </p>
              <p className="m-0 mt-0.5 text-[10.5px] text-ink-soft">
                {tMedia(subtitleKey)}
              </p>
            </button>
          ))}
        </div>

        <FieldLabel>{tMedia("preferredWorkingDays")}</FieldLabel>
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
              {getDayLabel((key) => t(key), d)}
            </button>
          ))}
        </div>
      </div>
      <FooterNav
        onContinue={onContinue}
        onBack={onBack}
        loading={saving}
        error={saveError}
      />
    </div>
  );
}

type ReviewStepProps = {
  data: CandidateProfile;
  onBack: () => void;
  onPublish: () => void;
  onEditSection: (step: number) => void;
  saving?: boolean;
  saveError?: string | null;
};

function ReviewSection({
  icon,
  title,
  step,
  onEditSection,
  children,
  editLabel,
}: {
  icon: React.ReactNode;
  title: string;
  step: number;
  onEditSection: (step: number) => void;
  children: React.ReactNode;
  editLabel: string;
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
          {editLabel}
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
  saving,
  saveError,
}: ReviewStepProps) {
  const t = useTranslations();
  const tReview = useTranslations("onboard.review");
  const tCommon = useTranslations("common");
  const steps = getCandidateSteps((key) => t(key));
  const completionPercent = calculateProfileCompletion(data).percent;
  const emDash = tCommon("emDash");

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <TopBar onBack={onBack} accent="purple" />
      <StepIndicator steps={steps} current={5} />
      <ScreenHeading
        title={tReview("title")}
        subtitle={tReview("subtitle")}
      />
      <div className="flex-1 overflow-y-auto px-[18px] pt-2">
        <ReviewSection
          icon={<User size={13} className="text-[#4C1D95]" aria-hidden />}
          title={tReview("basicInformation")}
          step={1}
          onEditSection={onEditSection}
          editLabel={tCommon("edit")}
        >
          <div className="flex gap-3">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-[10px] bg-purple-light">
              {data.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={data.photoUrl}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <User size={22} className="text-purple" aria-hidden />
              )}
            </div>
            <div>
              <ReviewRow
                label={tCommon("name")}
                value={`${data.firstName || emDash} ${data.lastName || ""}`.trim()}
              />
              <ReviewRow label={tCommon("email")} value={data.email || emDash} />
            </div>
          </div>
        </ReviewSection>

        <ReviewSection
          icon={<MapPin size={13} className="text-[#4C1D95]" aria-hidden />}
          title={tReview("locationAndVisa")}
          step={2}
          onEditSection={onEditSection}
          editLabel={tCommon("edit")}
        >
          <ReviewRow
            label={tReview("currentLocation")}
            value={`${data.district || emDash}, ${data.emirate || ""}`}
          />
          <ReviewRow
            label={tReview("visaStatus")}
            value={getVisaLabel((key) => t(key), data.visa) || emDash}
          />
        </ReviewSection>

        <ReviewSection
          icon={<Star size={13} className="text-[#4C1D95]" aria-hidden />}
          title={tReview("experienceSkillsLanguages")}
          step={3}
          onEditSection={onEditSection}
          editLabel={tCommon("edit")}
        >
          <ReviewRow
            label={tReview("yearsOfExperience")}
            value={getExperienceLabel((key) => t(key), data.experience) || emDash}
          />
          <ReviewRow
            label={tCommon("skills")}
            value={
              data.skills.map((s) => getSkillLabel((key) => t(key), s)).join(", ") ||
              emDash
            }
          />
          <ReviewRow
            label={tCommon("languages")}
            value={
              data.languages
                .map((l) => getLanguageLabel((key) => t(key), l))
                .join(", ") || emDash
            }
          />
        </ReviewSection>

        <ReviewSection
          icon={<Video size={13} className="text-[#4C1D95]" aria-hidden />}
          title={tReview("mediaSalaryAvailability")}
          step={4}
          onEditSection={onEditSection}
          editLabel={tCommon("edit")}
        >
          <ReviewRow
            label={tReview("salaryExpectation")}
            value={tCommon("salaryExpectation", {
              min: data.salaryMin || emDash,
              max: data.salaryMax || emDash,
            })}
          />
          <ReviewRow
            label={tReview("employmentType")}
            value={
              getEmploymentLabel((key) => t(key), data.employmentType) || emDash
            }
          />
          <ReviewRow
            label={tReview("preferredDays")}
            value={
              data.days.map((d) => getDayLabel((key) => t(key), d)).join(", ") ||
              emDash
            }
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
                strokeDasharray={`${completionPercent} 100`}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-green">
              {completionPercent}%
            </span>
          </div>
          <div>
            <p className="m-0 text-[12.5px] font-bold text-[#15803D]">
              {tCommon("profileCompletion")}
            </p>
            <p className="m-0 mt-px text-[11px] text-[#15803D]">
              {tCommon("profileCompletionHint")}
            </p>
          </div>
        </div>
      </div>

      <div className="px-[18px] pb-[22px]">
        {saveError && (
          <p className="mb-2 rounded-xl bg-red-50 px-3.5 py-2.5 text-center text-[12.5px] leading-relaxed text-[#B91C1C]">
            {saveError}
          </p>
        )}
        <div className="mb-2">
          <PrimaryButton onClick={onPublish} disabled={saving}>
            {saving ? tCommon("publishing") : tCommon("publishMyProfile")}
            {!saving && <Send size={15} aria-hidden />}
          </PrimaryButton>
        </div>
        <PrimaryButton outline>
          <Eye size={15} aria-hidden />
          {tCommon("previewProfile")}
        </PrimaryButton>
      </div>
    </div>
  );
}
