"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BasicInfoStep,
  ExperienceStep,
  LocationVisaStep,
  MediaStep,
  ReviewStep,
} from "@/components/candidate/onboard/steps";
import {
  fetchCandidateDraft,
  publishCandidateProfile,
  uploadCandidatePhoto,
  uploadCandidateVideo,
  upsertCandidateStep,
  validateOnboardStep,
} from "@/lib/candidate-db";
import {
  clearProfileDraft,
  INITIAL_CANDIDATE_PROFILE,
  loadProfile,
  saveProfile,
  type CandidateProfile,
} from "@/lib/candidate-profile";
import { createClient } from "@/lib/supabase";

function logWizardFailure(
  action: string,
  error: unknown,
  context?: Record<string, unknown>
) {
  console.error("[onboard] wizard action failed", { action, context, error });
}

export function OnboardWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [data, setDataState] = useState<CandidateProfile>(
    INITIAL_CANDIDATE_PROFILE
  );
  const [hydrated, setHydrated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/candidate/auth");
        return;
      }

      if (cancelled) return;

      setUserId(user.id);

      const localDraft = loadProfile();
      let merged: CandidateProfile = {
        ...INITIAL_CANDIDATE_PROFILE,
        ...localDraft,
        email: user.email ?? localDraft.email,
      };

      try {
        const remoteDraft = await fetchCandidateDraft(supabase, user.id);
        if (remoteDraft) {
          merged = { ...merged, ...remoteDraft, email: user.email ?? merged.email };
        }
      } catch (error) {
        console.error("Failed to load candidate draft:", error);
      }

      if (!cancelled) {
        setDataState(merged);
        setHydrated(true);
      }
    }

    void bootstrap();

    return () => {
      cancelled = true;
    };
  }, [router]);

  const setData = useCallback((next: CandidateProfile) => {
    setDataState(next);
    saveProfile(next);
  }, []);

  async function handleContinue(currentStep: number) {
    if (!userId) {
      router.replace("/candidate/auth");
      return;
    }

    const validationError = validateOnboardStep(currentStep, data);
    if (validationError) {
      setSaveError(validationError);
      return;
    }

    setSaving(true);
    setSaveError(null);

    try {
      const supabase = createClient();
      await upsertCandidateStep(supabase, userId, data, currentStep);
      setStep((s) => Math.min(5, s + 1));
    } catch (error) {
      logWizardFailure("continue", error, { step: currentStep, userId, data });
      setSaveError(
        error instanceof Error ? error.message : "Failed to save your progress."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handlePublish() {
    if (!userId) {
      router.replace("/candidate/auth");
      return;
    }

    const validationError = validateOnboardStep(4, data);
    if (validationError) {
      setSaveError(validationError);
      return;
    }

    setSaving(true);
    setSaveError(null);

    try {
      const supabase = createClient();
      await upsertCandidateStep(supabase, userId, data, 4);
      await publishCandidateProfile(supabase, userId, data);
      clearProfileDraft();
      router.push("/candidate/dashboard");
    } catch (error) {
      logWizardFailure("publish", error, { userId, data });
      setSaveError(
        error instanceof Error ? error.message : "Failed to publish your profile."
      );
      setSaving(false);
    }
  }

  async function handlePhotoSelect(file: File) {
    if (!userId) {
      router.replace("/candidate/auth");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setSaveError("Please choose a JPG or PNG image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setSaveError("Profile photo must be 5MB or smaller.");
      return;
    }

    if (step === 1) {
      const validationError = validateOnboardStep(1, data);
      if (validationError) {
        setSaveError(validationError);
        return;
      }
    }

    setUploadingPhoto(true);
    setSaveError(null);

    try {
      const supabase = createClient();
      const previewUrl = URL.createObjectURL(file);
      const { publicUrl, storagePath } = await uploadCandidatePhoto(
        supabase,
        userId,
        data,
        step,
        file
      );

      setData({
        ...data,
        photoUploaded: true,
        photoUrl: publicUrl,
        photoStoragePath: storagePath,
      });

      URL.revokeObjectURL(previewUrl);
    } catch (error) {
      logWizardFailure("uploadPhoto", error, {
        userId,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
      });
      setSaveError(
        error instanceof Error ? error.message : "Failed to upload profile photo."
      );
    } finally {
      setUploadingPhoto(false);
    }
  }

  async function handleVideoSelect(file: File) {
    if (!userId) {
      router.replace("/candidate/auth");
      return;
    }

    if (file.type !== "video/mp4" && !file.name.toLowerCase().endsWith(".mp4")) {
      setSaveError("Introduction video must be an MP4 file.");
      return;
    }

    if (file.size > 30 * 1024 * 1024) {
      setSaveError("Introduction video must be 30MB or smaller.");
      return;
    }

    setUploadingVideo(true);
    setSaveError(null);

    try {
      const supabase = createClient();
      const { storagePath } = await uploadCandidateVideo(
        supabase,
        userId,
        data,
        step,
        file
      );

      setData({
        ...data,
        videoUploaded: true,
        videoStoragePath: storagePath,
        videoFileName: file.name,
      });
    } catch (error) {
      logWizardFailure("uploadVideo", error, {
        userId,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
      });
      setSaveError(
        error instanceof Error ? error.message : "Failed to upload introduction video."
      );
    } finally {
      setUploadingVideo(false);
    }
  }

  function goBack() {
    if (step === 1) {
      router.push("/candidate/auth");
      return;
    }
    setSaveError(null);
    setStep((s) => s - 1);
  }

  const sharedStepProps = {
    data,
    setData,
    onBack: goBack,
    saving,
    saveError,
    uploadingPhoto,
    uploadingVideo,
    onPhotoSelect: handlePhotoSelect,
    onVideoSelect: handleVideoSelect,
  };

  if (!hydrated) {
    return (
      <div className="flex min-h-full flex-1 items-center justify-center bg-white">
        <div className="h-8 w-8 animate-pulse rounded-full bg-purple-light" />
      </div>
    );
  }

  switch (step) {
    case 1:
      return (
        <BasicInfoStep
          {...sharedStepProps}
          onContinue={() => void handleContinue(1)}
        />
      );
    case 2:
      return (
        <LocationVisaStep
          {...sharedStepProps}
          onContinue={() => void handleContinue(2)}
        />
      );
    case 3:
      return (
        <ExperienceStep
          {...sharedStepProps}
          onContinue={() => void handleContinue(3)}
        />
      );
    case 4:
      return (
        <MediaStep
          {...sharedStepProps}
          onContinue={() => void handleContinue(4)}
        />
      );
    case 5:
      return (
        <ReviewStep
          data={data}
          onBack={goBack}
          onPublish={() => void handlePublish()}
          onEditSection={(nextStep) => {
            setSaveError(null);
            setStep(nextStep);
          }}
          saving={saving}
          saveError={saveError}
        />
      );
    default:
      return null;
  }
}
