import type { LegalSection } from "@/lib/legal-types";

export const CANDIDATE_TERMS_INTRO =
  "These Terms apply to candidates using Housemaid-AE to find domestic work in the UAE. By creating a profile, you agree to the rules below.";

export const CANDIDATE_TERMS_SECTIONS: LegalSection[] = [
  {
    heading: "1. Your profile",
    body: "You own the content you submit — including your photo, intro video, documents, work history, and bio. By publishing your profile, you grant Housemaid-AE a licence to display this information to employers on the platform for the purpose of matching you with job opportunities.",
  },
  {
    heading: "2. Information you share",
    body: "Your profile may include:",
    items: [
      "Profile photo and intro video",
      "Identity and visa documents (for verification only)",
      "Employment history and references",
      "Skills, languages, salary expectations, and availability",
      "Contact details (shared only after you choose to engage with an employer)",
    ],
  },
  {
    heading: "3. How we use your data",
    body: "We use your profile to match you with employers searching for domestic workers in the UAE. We may show your partially masked name and key details in Discover before an employer unlocks your full profile. We do not sell your personal data to third parties.",
  },
  {
    heading: "4. Matching with employers",
    body: "Employers can browse, save, and message you through the platform. You are free to accept or decline any opportunity. Housemaid-AE does not guarantee employment, interviews, or specific salary offers.",
  },
  {
    heading: "5. Accuracy and conduct",
    body: "You agree that all information in your profile is truthful. Misleading photos, fake references, or false visa status may result in immediate removal. Treat employers respectfully in all messages.",
  },
  {
    heading: "6. Deactivating your profile",
    body: "You may pause or deactivate your profile at any time. When deactivated, your profile is hidden from Discover and new employer contact is blocked. Existing message threads remain unless you request full account deletion.",
  },
  {
    heading: "7. Account deletion",
    body: "To permanently delete your account and data, contact support@housemaid-ae.com. We process deletion requests within 30 days, subject to legal retention requirements in the UAE.",
  },
  { heading: "8. Contact", body: "Questions about these Terms: support@housemaid-ae.com" },
];

export const CANDIDATE_PRIVACY_INTRO =
  "This Privacy Policy explains what we collect from candidates, why we collect it, and how you can control your data.";

export const CANDIDATE_PRIVACY_SECTIONS: LegalSection[] = [
  {
    heading: "What we collect",
    body: "When you create a candidate profile, we collect:",
    items: [
      "Name, phone number, and email address",
      "Profile photo and intro video",
      "Identity and visa documents",
      "Employment history and references",
      "Location (emirate and district)",
      "Skills, languages, salary expectations, and availability",
    ],
  },
  {
    heading: "Why we collect it",
    body: "We use this information to build your profile, verify your identity, match you with employers, prevent fraud, and improve the platform. Documents are reviewed by our team — they are not displayed publicly.",
  },
  {
    heading: "Who can see your information",
    body: "Employers browsing Discover see a partially masked version of your profile. Full details — including unmasked name, complete employment history, and contact information — are visible only to employers who have unlocked your profile or whom you have chosen to message.",
  },
  {
    heading: "How long we keep it",
    body: "We retain your profile data while your account is active. If you deactivate, we keep a limited record for up to 12 months. After account deletion, we remove personal data within 30 days except where UAE law requires longer retention.",
  },
  {
    heading: "How to delete your data",
    body: "You can update or remove most information from your profile at any time. To delete your account entirely, email support@housemaid-ae.com from your registered address.",
  },
  {
    heading: "Your rights",
    body: "You may request access to, correction of, or deletion of your personal data. Contact support@housemaid-ae.com and we will respond within 30 days.",
  },
  { heading: "Contact", body: "Housemaid-AE, Dubai, UAE. Email: support@housemaid-ae.com" },
];
