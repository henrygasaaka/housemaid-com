export type LegalSection = {
  heading: string;
  body: string;
  items?: string[];
};

export const LEGAL_LAST_UPDATED = "June 2026";

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export const SUPPORT_EMAIL = "support@housemaid.com";

export const SUPPORT_WHATSAPP_URL =
  "https://wa.me/971800468362?text=Hi%20Housemaid.com%20support";
