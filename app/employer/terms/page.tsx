import { LegalDocumentScreen } from "@/components/legal/legal-document-screen";
import {
  EMPLOYER_TERMS_INTRO,
  EMPLOYER_TERMS_SECTIONS,
} from "@/lib/employer-legal";
import { LEGAL_LAST_UPDATED } from "@/lib/legal-types";

export default function EmployerTermsPage() {
  return (
    <LegalDocumentScreen
      title="Terms of Service"
      lastUpdated={LEGAL_LAST_UPDATED}
      intro={EMPLOYER_TERMS_INTRO}
      sections={EMPLOYER_TERMS_SECTIONS}
    />
  );
}
