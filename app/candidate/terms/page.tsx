import { LegalDocumentScreen } from "@/components/legal/legal-document-screen";
import {
  CANDIDATE_TERMS_INTRO,
  CANDIDATE_TERMS_SECTIONS,
} from "@/lib/candidate-legal";
import { LEGAL_LAST_UPDATED } from "@/lib/legal-types";

export default function CandidateTermsPage() {
  return (
    <LegalDocumentScreen
      title="Terms of Service"
      lastUpdated={LEGAL_LAST_UPDATED}
      intro={CANDIDATE_TERMS_INTRO}
      sections={CANDIDATE_TERMS_SECTIONS}
    />
  );
}
