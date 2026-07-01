import { HelpSupportScreen } from "@/components/support/help-support-screen";
import { EMPLOYER_HELP_FAQ } from "@/lib/employer-help";

export default function EmployerSupportPage() {
  return <HelpSupportScreen items={EMPLOYER_HELP_FAQ} emailAccent="blue" />;
}
