import { LegalDocumentScreen } from "@/components/legal/legal-document-screen";
import {
  CANDIDATE_PRIVACY_INTRO,
  CANDIDATE_PRIVACY_SECTIONS,
} from "@/lib/candidate-legal";
import { LEGAL_LAST_UPDATED } from "@/lib/legal-types";

export default function CandidatePrivacyPage() {
  return (
    <LegalDocumentScreen
      title="Privacy Policy"
      lastUpdated={LEGAL_LAST_UPDATED}
      intro={CANDIDATE_PRIVACY_INTRO}
      sections={CANDIDATE_PRIVACY_SECTIONS}
    />
  );
}
