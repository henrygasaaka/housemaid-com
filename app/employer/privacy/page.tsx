import { getTranslations } from "next-intl/server";
import { LegalDocumentScreen } from "@/components/legal/legal-document-screen";
import {
  getEmployerPrivacyIntro,
  getEmployerPrivacySections,
} from "@/lib/i18n-legal";

export default async function EmployerPrivacyPage() {
  const t = await getTranslations("legal");
  const tCommon = await getTranslations("common");

  return (
    <LegalDocumentScreen
      title={t("employerPrivacy.title")}
      lastUpdated={tCommon("lastUpdated", { date: t("lastUpdated") })}
      intro={getEmployerPrivacyIntro(t)}
      sections={getEmployerPrivacySections(t)}
    />
  );
}
