import type { FaqItem } from "@/lib/legal-types";

export const CANDIDATE_HELP_FAQ: FaqItem[] = [
  {
    id: "create-profile",
    question: "How do I create a profile?",
    answer:
      "Sign up with Google, phone, or email, then complete the onboarding steps: basic info, location and visa, experience and skills, photo and video, and review. A complete profile with verified documents gets far more employer views.",
  },
  {
    id: "employers-find",
    question: "How do employers find me?",
    answer:
      "Employers browse verified candidates on Discover. Your name is partially masked until an employer unlocks your full profile. Employers can filter by role type, location, and availability. Keep your profile active and complete to rank higher.",
  },
  {
    id: "documents",
    question: "Who can see my documents?",
    answer:
      "Your ID, visa, and reference documents are never shown publicly. Only Housemaid-AE's verification team reviews them. Employers see a Verified badge once approved — they do not download your raw documents unless you choose to share them in chat.",
  },
  {
    id: "pause",
    question: "How do I pause my profile?",
    answer:
      "Go to My Profile → Settings and switch your availability to unavailable, or contact support. While paused, your profile is hidden from Discover and employers cannot send new messages. Existing conversations remain accessible.",
  },
  {
    id: "delete",
    question: "How do I delete my account?",
    answer:
      "Email support@housemaid-ae.com from your registered address and request account deletion. We remove your profile, documents, and messages within 30 days, except where UAE law requires us to retain records.",
  },
];
