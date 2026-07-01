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
  INITIAL_CANDIDATE_PROFILE,
  loadProfile,
  saveProfile,
  type CandidateProfile,
} from "@/lib/candidate-profile";

export function OnboardWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [data, setDataState] = useState<CandidateProfile>(
    INITIAL_CANDIDATE_PROFILE
  );
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setDataState(loadProfile());
    setHydrated(true);
  }, []);

  const setData = useCallback((next: CandidateProfile) => {
    setDataState(next);
    saveProfile(next);
  }, []);

  function goBack() {
    if (step === 1) {
      router.push("/candidate/auth");
      return;
    }
    setStep((s) => s - 1);
  }

  function goContinue() {
    setStep((s) => Math.min(5, s + 1));
  }

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
          data={data}
          setData={setData}
          onBack={goBack}
          onContinue={goContinue}
        />
      );
    case 2:
      return (
        <LocationVisaStep
          data={data}
          setData={setData}
          onBack={goBack}
          onContinue={goContinue}
        />
      );
    case 3:
      return (
        <ExperienceStep
          data={data}
          setData={setData}
          onBack={goBack}
          onContinue={goContinue}
        />
      );
    case 4:
      return (
        <MediaStep
          data={data}
          setData={setData}
          onBack={goBack}
          onContinue={goContinue}
        />
      );
    case 5:
      return (
        <ReviewStep
          data={data}
          onBack={goBack}
          onPublish={() => router.push("/")}
          onEditSection={setStep}
        />
      );
    default:
      return null;
  }
}
