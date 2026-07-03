import { OtpScreen } from "@/components/candidate/otp-screen";

type PageProps = {
  searchParams: Promise<{ flow?: string }>;
};

export default async function CandidateOtpPage({ searchParams }: PageProps) {
  const { flow } = await searchParams;
  const otpFlow = flow === "login" ? "login" : "signup";

  return <OtpScreen flow={otpFlow} />;
}
