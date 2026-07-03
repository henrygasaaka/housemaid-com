import { notFound } from "next/navigation";
import { CandidateFullProfile } from "@/components/employer/candidate-full-profile";
import { getCandidateById } from "@/lib/discover-candidates";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function CandidateProfilePage({ params }: PageProps) {
  const { id } = await params;
  const candidateId = Number(id);
  const candidate = getCandidateById(candidateId);

  if (!candidate || Number.isNaN(candidateId)) {
    notFound();
  }

  return <CandidateFullProfile candidate={candidate} />;
}
