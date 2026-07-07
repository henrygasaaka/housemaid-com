import { getTranslations } from "next-intl/server";
import { HelpSupportScreen } from "@/components/support/help-support-screen";
import { getCandidateHelpFaq } from "@/lib/i18n-help";

export default async function CandidateSupportPage() {
  const t = await getTranslations("help");

  return (
    <HelpSupportScreen items={getCandidateHelpFaq(t)} emailAccent="purple" />
  );
}
