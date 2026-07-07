import type { SupabaseClient } from "@supabase/supabase-js";
import {
  CANDIDATE_STATUS,
  normalizeEmploymentType,
  normalizeVisaStatus,
  type CandidateProfile,
  type CandidateStatus,
} from "@/lib/candidate-profile";
import { normalizeNationalityCode } from "@/lib/countries";

/** Columns confirmed on public.candidates via PostgREST introspection. */
export type CandidateRow = {
  id: string;
  created_at?: string;
  updated_at?: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  nationality: string | null;
  gender: string | null;
  emirate: string | null;
  district: string | null;
  visa_status: string | null;
  availability: string | null;
  years_experience: string | null;
  skills: string[] | null;
  languages: string[] | null;
  about: string | null;
  salary_min: number | null;
  salary_max: number | null;
  employment_type: string | null;
  status: string | null;
  photo_url: string | null;
  video_storage_path: string | null;
  last_active_at: string | null;
  preferred_days: string[] | null;
};

const PHOTO_BUCKET = "candidate-photos";
const VIDEO_BUCKET = "candidate-videos";

function parseSalary(value: string): number | null {
  const digits = value.replace(/[^\d]/g, "");
  if (!digits) return null;
  const parsed = Number.parseInt(digits, 10);
  return Number.isFinite(parsed) ? parsed : null;
}

function logSupabaseFailure(
  operation: string,
  error: unknown,
  context?: Record<string, unknown>
) {
  console.error("[onboard] Supabase write failed", {
    operation,
    context,
    error,
  });
}

function formatSupabaseError(
  operation: string,
  error: {
    message: string;
    code?: string;
    details?: string | null;
    hint?: string | null;
    statusCode?: string | number;
    name?: string;
  }
) {
  const parts = [`[${operation}]`, error.message];
  if (error.code) parts.push(`(code: ${error.code})`);
  else if (error.statusCode) parts.push(`(status: ${error.statusCode})`);
  if (error.details) parts.push(`details: ${error.details}`);
  if (error.hint) parts.push(`hint: ${error.hint}`);
  return parts.join(" ");
}

function raiseSupabaseError(
  operation: string,
  error: {
    message: string;
    code?: string;
    details?: string | null;
    hint?: string | null;
    statusCode?: string | number;
    name?: string;
  },
  context?: Record<string, unknown>
): never {
  logSupabaseFailure(operation, error, context);
  throw new Error(formatSupabaseError(operation, error));
}

export function mapProfileToRow(
  profile: CandidateProfile,
  userId: string,
  status: CandidateStatus
): Partial<CandidateRow> {
  return {
    id: userId,
    first_name: profile.firstName.trim() || null,
    last_name: profile.lastName.trim() || null,
    phone: profile.phone.trim() || null,
    nationality: normalizeNationalityCode(profile.nationality) || null,
    gender: profile.gender || null,
    emirate: profile.emirate || null,
    district: profile.district || null,
    visa_status: normalizeVisaStatus(profile.visa) || null,
    availability: profile.availability || null,
    years_experience: profile.experience || null,
    skills: profile.skills.length ? profile.skills : null,
    languages: profile.languages.length ? profile.languages : null,
    about: profile.about.trim() || null,
    salary_min: parseSalary(profile.salaryMin),
    salary_max: parseSalary(profile.salaryMax),
    employment_type: normalizeEmploymentType(profile.employmentType) || null,
    photo_url: profile.photoUrl,
    video_storage_path: profile.videoStoragePath,
    status,
  };
}

export function mapRowToProfile(row: CandidateRow): Partial<CandidateProfile> {
  return {
    firstName: row.first_name ?? "",
    lastName: row.last_name ?? "",
    phone: row.phone ?? "",
    nationality: normalizeNationalityCode(row.nationality ?? ""),
    gender: row.gender ?? "",
    emirate: row.emirate ?? "",
    district: row.district ?? "",
    visa: row.visa_status ?? "",
    availability: row.availability ?? "",
    experience: row.years_experience ?? "",
    skills: row.skills ?? [],
    languages: row.languages ?? [],
    about: row.about ?? "",
    salaryMin: row.salary_min != null ? String(row.salary_min) : "",
    salaryMax: row.salary_max != null ? String(row.salary_max) : "",
    employmentType: row.employment_type ?? "",
    photoUrl: row.photo_url ?? null,
    photoStoragePath: row.photo_url
      ? extractPhotoStoragePath(row.photo_url)
      : null,
    videoStoragePath: row.video_storage_path ?? null,
    videoFileName: row.video_storage_path
      ? row.video_storage_path.split("/").pop() ?? null
      : null,
    photoUploaded: Boolean(row.photo_url),
    videoUploaded: Boolean(row.video_storage_path),
  };
}

function extractPhotoStoragePath(photoUrl: string) {
  const marker = `/storage/v1/object/public/${PHOTO_BUCKET}/`;
  const index = photoUrl.indexOf(marker);
  if (index === -1) return null;
  return photoUrl.slice(index + marker.length);
}

export function getPublicPhotoUrl(storagePath: string) {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  if (!base) return storagePath;
  return `${base}/storage/v1/object/public/${PHOTO_BUCKET}/${storagePath}`;
}

export async function fetchCandidateDraft(
  supabase: SupabaseClient,
  userId: string
): Promise<Partial<CandidateProfile> | null> {
  const { data: row, error } = await supabase
    .from("candidates")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    raiseSupabaseError("candidates.select", error, { userId });
  }

  if (!row) return null;

  return mapRowToProfile(row as CandidateRow);
}

function buildDraftPatch(
  profile: CandidateProfile,
  userId: string,
  wizardStep: number,
  extras: Partial<CandidateRow> = {}
): Partial<CandidateRow> {
  const fullRow = mapProfileToRow(profile, userId, CANDIDATE_STATUS.DRAFT);
  let patch: Partial<CandidateRow> = {
    id: userId,
    status: CANDIDATE_STATUS.DRAFT,
    ...extras,
  };

  if (wizardStep >= 1) {
    patch = {
      ...patch,
      first_name: fullRow.first_name,
      last_name: fullRow.last_name,
      phone: fullRow.phone,
      nationality: fullRow.nationality,
      gender: fullRow.gender,
    };
  }

  if (wizardStep >= 2) {
    patch = {
      ...patch,
      emirate: fullRow.emirate,
      district: fullRow.district,
      visa_status: fullRow.visa_status,
      availability: fullRow.availability,
    };
  }

  if (wizardStep >= 3) {
    patch = {
      ...patch,
      years_experience: fullRow.years_experience,
      skills: fullRow.skills,
      languages: fullRow.languages,
      about: fullRow.about,
    };
  }

  if (wizardStep >= 4) {
    patch = {
      ...patch,
      salary_min: fullRow.salary_min,
      salary_max: fullRow.salary_max,
      employment_type: fullRow.employment_type,
      photo_url: fullRow.photo_url,
      video_storage_path: fullRow.video_storage_path,
    };
  }

  return patch;
}

async function upsertCandidateDraft(
  supabase: SupabaseClient,
  userId: string,
  profile: CandidateProfile,
  wizardStep: number,
  extras: Partial<CandidateRow> = {}
) {
  const patch = buildDraftPatch(profile, userId, wizardStep, extras);
  const { error } = await supabase.from("candidates").upsert(patch, {
    onConflict: "id",
  });

  if (error) {
    raiseSupabaseError("candidates.upsert", error, { userId, wizardStep, patch });
  }
}

export async function upsertCandidateStep(
  supabase: SupabaseClient,
  userId: string,
  profile: CandidateProfile,
  step: number
) {
  await upsertCandidateDraft(supabase, userId, profile, step);
}

export async function publishCandidateProfile(
  supabase: SupabaseClient,
  userId: string,
  profile: CandidateProfile
) {
  const row = mapProfileToRow(profile, userId, CANDIDATE_STATUS.ACTIVE);
  const { error } = await supabase.from("candidates").upsert(row, {
    onConflict: "id",
  });

  if (error) {
    raiseSupabaseError("candidates.publish", error, { userId, row });
  }
}

export async function uploadCandidatePhoto(
  supabase: SupabaseClient,
  userId: string,
  profile: CandidateProfile,
  wizardStep: number,
  file: File
) {
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const storagePath = `${userId}/profile-${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(PHOTO_BUCKET)
    .upload(storagePath, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type || undefined,
    });

  if (uploadError) {
    raiseSupabaseError("storage.candidate-photos.upload", uploadError, {
      userId,
      bucket: PHOTO_BUCKET,
      storagePath,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
    });
  }

  const publicUrl = getPublicPhotoUrl(storagePath);
  await upsertCandidateDraft(supabase, userId, profile, wizardStep, {
    photo_url: publicUrl,
  });

  return { publicUrl, storagePath };
}

export async function uploadCandidateVideo(
  supabase: SupabaseClient,
  userId: string,
  profile: CandidateProfile,
  wizardStep: number,
  file: File
) {
  const ext = file.name.split(".").pop()?.toLowerCase() || "mp4";
  const storagePath = `${userId}/intro-${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(VIDEO_BUCKET)
    .upload(storagePath, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type || undefined,
    });

  if (uploadError) {
    raiseSupabaseError("storage.candidate-videos.upload", uploadError, {
      userId,
      bucket: VIDEO_BUCKET,
      storagePath,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
    });
  }

  await upsertCandidateDraft(supabase, userId, profile, wizardStep, {
    video_storage_path: storagePath,
  });

  return { storagePath };
}

import type { AppTranslateFn } from "@/lib/i18n-types";

export function validateOnboardStep(
  step: number,
  profile: CandidateProfile,
  t: AppTranslateFn
): string | null {
  switch (step) {
    case 1:
      if (!profile.firstName.trim()) return t("firstNameRequired");
      if (!profile.lastName.trim()) return t("lastNameRequired");
      if (!profile.phone.trim()) return t("phoneRequired");
      if (!profile.nationality) return t("nationalityRequired");
      if (!profile.gender) return t("genderRequired");
      return null;
    case 2:
      if (!profile.emirate) return t("emirateRequired");
      if (!profile.district) return t("districtRequired");
      if (!profile.visa) return t("visaRequired");
      return null;
    case 3:
      if (!profile.experience) return t("experienceRequired");
      return null;
    case 4:
      if (!profile.photoUploaded && !profile.photoUrl) {
        return t("photoRequired");
      }
      if (!profile.salaryMin.trim() || !profile.salaryMax.trim()) {
        return t("salaryRequired");
      }
      if (!profile.employmentType) return t("employmentTypeRequired");
      return null;
    default:
      return null;
  }
}
