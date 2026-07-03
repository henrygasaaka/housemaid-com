import { HelpSupportScreen } from "@/components/support/help-support-screen";
import { CANDIDATE_HELP_FAQ } from "@/lib/candidate-help";

export default function CandidateSupportPage() {
  return <HelpSupportScreen items={CANDIDATE_HELP_FAQ} emailAccent="purple" />;
}
