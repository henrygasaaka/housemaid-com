import type { FaqItem } from "@/lib/legal-types";
import type { AppTranslateFn } from "@/lib/i18n-types";

export function getCandidateHelpFaq(t: AppTranslateFn): FaqItem[] {
  return [
    {
      id: "create-profile",
      question: t("candidate.createProfile.question"),
      answer: t("candidate.createProfile.answer"),
    },
    {
      id: "employers-find",
      question: t("candidate.employersFind.question"),
      answer: t("candidate.employersFind.answer"),
    },
    {
      id: "documents",
      question: t("candidate.documents.question"),
      answer: t("candidate.documents.answer"),
    },
    {
      id: "pause",
      question: t("candidate.pause.question"),
      answer: t("candidate.pause.answer"),
    },
    {
      id: "delete",
      question: t("candidate.delete.question"),
      answer: t("candidate.delete.answer"),
    },
  ];
}

export function getEmployerHelpFaq(t: AppTranslateFn): FaqItem[] {
  return [
    {
      id: "message",
      question: t("employer.message.question"),
      answer: t("employer.message.answer"),
    },
    {
      id: "unlock",
      question: t("employer.unlock.question"),
      answer: t("employer.unlock.answer"),
    },
    {
      id: "refund",
      question: t("employer.refund.question"),
      answer: t("employer.refund.answer"),
    },
    {
      id: "find",
      question: t("employer.find.question"),
      answer: t("employer.find.answer"),
    },
  ];
}
