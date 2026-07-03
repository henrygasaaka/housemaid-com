import type { LegalSection } from "@/lib/legal-types";

export const EMPLOYER_TERMS_INTRO =
  "These Terms apply to employers using Housemaid.com to find domestic workers in the UAE. By creating an account, you agree to the rules below.";

export const EMPLOYER_TERMS_SECTIONS: LegalSection[] = [
  {
    heading: "1. Browsing is free",
    body: "You can browse verified candidate profiles on Discover without creating an account. Names are partially masked and employment history is hidden until you unlock a profile.",
  },
  {
    heading: "2. Free messages",
    body: "After creating a free employer account, you receive 3 lifetime free messages across all candidates. This is a one-time grant — free messages do not reset monthly.",
  },
  {
    heading: "3. AED 100 unlock",
    body: "Once your 3 free messages are used, a one-time AED 100 payment unlocks unlimited messaging. A separate one-time AED 100 payment unlocks a candidate's full profile (employment history, references, and unmasked details). These are not subscriptions and do not auto-renew.",
  },
  {
    heading: "4. No refunds",
    body: "Unlock payments are non-refundable unless required by UAE law. If you believe you were charged in error, contact support@housemaid.com within 7 days.",
  },
  {
    heading: "5. Your responsibilities",
    body: "As an employer, you are solely responsible for:",
    items: [
      "Complying with UAE labour and immigration laws",
      "Conducting your own interviews and background checks",
      "Drafting and honouring employment contracts",
      "Treating candidates with respect and dignity",
      "Not requesting illegal payments or withholding passports",
    ],
  },
  {
    heading: "6. Messaging rules",
    body: "Do not send spam, harassment, threats, or discriminatory messages. Violations may result in permanent account suspension without refund.",
  },
  {
    heading: "7. No employment guarantee",
    body: "Housemaid.com facilitates introductions only. We do not employ candidates, guarantee suitability, or mediate employment disputes.",
  },
  {
    heading: "8. Governing law",
    body: "These Terms are governed by the laws of the United Arab Emirates.",
  },
  { heading: "9. Contact", body: "Questions about these Terms: support@housemaid.com" },
];

export const EMPLOYER_PRIVACY_INTRO =
  "This Privacy Policy explains what we collect from employers. We collect far less data from employers than from candidates.";

export const EMPLOYER_PRIVACY_SECTIONS: LegalSection[] = [
  {
    heading: "What we collect",
    body: "When you create an employer account, we collect only:",
    items: [
      "Your full name",
      "Email address",
      "Location (city/emirate in the UAE)",
    ],
  },
  {
    heading: "What we do not collect",
    body: "We do not collect or store your payment card details. All payments are processed securely by PayTabs, our third-party payment provider. We receive only a payment confirmation — not your card number.",
  },
  {
    heading: "How we use your information",
    body: "We use your name and email to operate your account, send message notifications, and provide customer support. Your location helps us show relevant candidates near you.",
  },
  {
    heading: "We do not sell your data",
    body: "We do not sell, rent, or trade employer personal information to third parties for marketing purposes.",
  },
  {
    heading: "Data retention",
    body: "We keep your account data while your account is active. If you delete your account, we remove personal data within 30 days, except where UAE law requires retention.",
  },
  {
    heading: "Account deletion",
    body: "To delete your employer account, email support@housemaid.com from your registered address. Deletion is processed within 30 days.",
  },
  { heading: "Contact", body: "Housemaid.com, Dubai, UAE. Email: support@housemaid.com" },
];
