import { GoogleAuthScreen } from "@/components/candidate/google-auth-screen";

type PageProps = {
  searchParams: Promise<{ mode?: string }>;
};

export default async function CandidateGoogleAuthPage({
  searchParams,
}: PageProps) {
  const { mode } = await searchParams;
  const authMode = mode === "signup" ? "signup" : "login";

  return <GoogleAuthScreen mode={authMode} />;
}
