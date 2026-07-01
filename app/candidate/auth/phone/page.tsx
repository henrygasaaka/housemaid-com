import { PhoneEntryScreen } from "@/components/candidate/phone-entry-screen";

type PageProps = {
  searchParams: Promise<{ flow?: string }>;
};

export default async function CandidatePhoneAuthPage({
  searchParams,
}: PageProps) {
  const { flow } = await searchParams;
  const phoneFlow = flow === "login" ? "login" : "signup";

  return <PhoneEntryScreen flow={phoneFlow} />;
}
