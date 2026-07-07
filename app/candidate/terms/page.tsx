import { getTranslations } from "next-intl/server";
import { LegalDocumentScreen } from "@/components/legal/legal-document-screen";
import {
  getCandidateTermsIntro,
  getCandidateTermsSections,
} from "@/lib/i18n-legal";

export default async function CandidateTermsPage() {
  const t = await getTranslations("legal");
  const tCommon = await getTranslations("common");

  return (
    <LegalDocumentScreen
      title={t("candidateTerms.title")}
      lastUpdated={tCommon("lastUpdated", { date: t("lastUpdated") })}
      intro={getCandidateTermsIntro(t)}
      sections={getCandidateTermsSections(t)}
    />
  );
}
