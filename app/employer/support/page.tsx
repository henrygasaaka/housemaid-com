import { getTranslations } from "next-intl/server";
import { HelpSupportScreen } from "@/components/support/help-support-screen";
import { getEmployerHelpFaq } from "@/lib/i18n-help";

export default async function EmployerSupportPage() {
  const t = await getTranslations("help");

  return (
    <HelpSupportScreen items={getEmployerHelpFaq(t)} emailAccent="blue" />
  );
}
