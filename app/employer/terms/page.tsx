import { getTranslations } from "next-intl/server";
import { LegalDocumentScreen } from "@/components/legal/legal-document-screen";
import {
  getEmployerTermsIntro,
  getEmployerTermsSections,
} from "@/lib/i18n-legal";

export default async function EmployerTermsPage() {
  const t = await getTranslations("legal");
  const tCommon = await getTranslations("common");

  return (
    <LegalDocumentScreen
      title={t("employerTerms.title")}
      lastUpdated={tCommon("lastUpdated", { date: t("lastUpdated") })}
      intro={getEmployerTermsIntro(t)}
      sections={getEmployerTermsSections(t)}
    />
  );
}
