import { getTranslations } from "next-intl/server";
import { LegalDocumentScreen } from "@/components/legal/legal-document-screen";
import {
  getCandidatePrivacyIntro,
  getCandidatePrivacySections,
} from "@/lib/i18n-legal";

export default async function CandidatePrivacyPage() {
  const t = await getTranslations("legal");
  const tCommon = await getTranslations("common");

  return (
    <LegalDocumentScreen
      title={t("candidatePrivacy.title")}
      lastUpdated={tCommon("lastUpdated", { date: t("lastUpdated") })}
      intro={getCandidatePrivacyIntro(t)}
      sections={getCandidatePrivacySections(t)}
    />
  );
}
