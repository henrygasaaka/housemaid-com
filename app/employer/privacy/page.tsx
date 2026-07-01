import { LegalDocumentScreen } from "@/components/legal/legal-document-screen";
import {
  EMPLOYER_PRIVACY_INTRO,
  EMPLOYER_PRIVACY_SECTIONS,
} from "@/lib/employer-legal";
import { LEGAL_LAST_UPDATED } from "@/lib/legal-types";

export default function EmployerPrivacyPage() {
  return (
    <LegalDocumentScreen
      title="Privacy Policy"
      lastUpdated={LEGAL_LAST_UPDATED}
      intro={EMPLOYER_PRIVACY_INTRO}
      sections={EMPLOYER_PRIVACY_SECTIONS}
    />
  );
}
