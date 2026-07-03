import { notFound } from "next/navigation";
import { CandidateFullProfile } from "@/components/employer/candidate-full-profile";
import { fetchDiscoverCandidateById } from "@/lib/discover-candidates-db";
import { createClient } from "@/lib/supabase/server";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function CandidateProfilePage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const candidate = await fetchDiscoverCandidateById(supabase, id);

  if (!candidate) {
    notFound();
  }

  return <CandidateFullProfile candidate={candidate} />;
}
