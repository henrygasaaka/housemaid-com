import type { LegalSection } from "@/lib/legal-types";
import type { AppTranslateFn } from "@/lib/i18n-types";

export function getCandidateTermsIntro(t: AppTranslateFn): string {
  return t("candidateTerms.intro");
}

export function getCandidateTermsSections(t: AppTranslateFn): LegalSection[] {
  return [
    {
      heading: t("candidateTerms.sections.yourProfile.heading"),
      body: t("candidateTerms.sections.yourProfile.body"),
    },
    {
      heading: t("candidateTerms.sections.informationYouShare.heading"),
      body: t("candidateTerms.sections.informationYouShare.body"),
      items: [
        t("candidateTerms.sections.informationYouShare.items.photoVideo"),
        t("candidateTerms.sections.informationYouShare.items.documents"),
        t("candidateTerms.sections.informationYouShare.items.history"),
        t("candidateTerms.sections.informationYouShare.items.details"),
        t("candidateTerms.sections.informationYouShare.items.contact"),
      ],
    },
    {
      heading: t("candidateTerms.sections.howWeUseData.heading"),
      body: t("candidateTerms.sections.howWeUseData.body"),
    },
    {
      heading: t("candidateTerms.sections.matching.heading"),
      body: t("candidateTerms.sections.matching.body"),
    },
    {
      heading: t("candidateTerms.sections.accuracy.heading"),
      body: t("candidateTerms.sections.accuracy.body"),
    },
    {
      heading: t("candidateTerms.sections.deactivating.heading"),
      body: t("candidateTerms.sections.deactivating.body"),
    },
    {
      heading: t("candidateTerms.sections.deletion.heading"),
      body: t("candidateTerms.sections.deletion.body"),
    },
    {
      heading: t("candidateTerms.sections.contact.heading"),
      body: t("candidateTerms.sections.contact.body"),
    },
  ];
}

export function getCandidatePrivacyIntro(t: AppTranslateFn): string {
  return t("candidatePrivacy.intro");
}

export function getCandidatePrivacySections(t: AppTranslateFn): LegalSection[] {
  return [
    {
      heading: t("candidatePrivacy.sections.whatWeCollect.heading"),
      body: t("candidatePrivacy.sections.whatWeCollect.body"),
      items: [
        t("candidatePrivacy.sections.whatWeCollect.items.contact"),
        t("candidatePrivacy.sections.whatWeCollect.items.media"),
        t("candidatePrivacy.sections.whatWeCollect.items.documents"),
        t("candidatePrivacy.sections.whatWeCollect.items.history"),
        t("candidatePrivacy.sections.whatWeCollect.items.location"),
        t("candidatePrivacy.sections.whatWeCollect.items.details"),
      ],
    },
    {
      heading: t("candidatePrivacy.sections.whyWeCollect.heading"),
      body: t("candidatePrivacy.sections.whyWeCollect.body"),
    },
    {
      heading: t("candidatePrivacy.sections.whoCanSee.heading"),
      body: t("candidatePrivacy.sections.whoCanSee.body"),
    },
    {
      heading: t("candidatePrivacy.sections.howLong.heading"),
      body: t("candidatePrivacy.sections.howLong.body"),
    },
    {
      heading: t("candidatePrivacy.sections.howToDelete.heading"),
      body: t("candidatePrivacy.sections.howToDelete.body"),
    },
    {
      heading: t("candidatePrivacy.sections.yourRights.heading"),
      body: t("candidatePrivacy.sections.yourRights.body"),
    },
    {
      heading: t("candidatePrivacy.sections.contact.heading"),
      body: t("candidatePrivacy.sections.contact.body"),
    },
  ];
}

export function getEmployerTermsIntro(t: AppTranslateFn): string {
  return t("employerTerms.intro");
}

export function getEmployerTermsSections(t: AppTranslateFn): LegalSection[] {
  return [
    {
      heading: t("employerTerms.sections.browsingFree.heading"),
      body: t("employerTerms.sections.browsingFree.body"),
    },
    {
      heading: t("employerTerms.sections.freeMessages.heading"),
      body: t("employerTerms.sections.freeMessages.body"),
    },
    {
      heading: t("employerTerms.sections.unlock.heading"),
      body: t("employerTerms.sections.unlock.body"),
    },
    {
      heading: t("employerTerms.sections.noRefunds.heading"),
      body: t("employerTerms.sections.noRefunds.body"),
    },
    {
      heading: t("employerTerms.sections.responsibilities.heading"),
      body: t("employerTerms.sections.responsibilities.body"),
      items: [
        t("employerTerms.sections.responsibilities.items.labour"),
        t("employerTerms.sections.responsibilities.items.checks"),
        t("employerTerms.sections.responsibilities.items.contracts"),
        t("employerTerms.sections.responsibilities.items.respect"),
        t("employerTerms.sections.responsibilities.items.illegal"),
      ],
    },
    {
      heading: t("employerTerms.sections.messagingRules.heading"),
      body: t("employerTerms.sections.messagingRules.body"),
    },
    {
      heading: t("employerTerms.sections.noGuarantee.heading"),
      body: t("employerTerms.sections.noGuarantee.body"),
    },
    {
      heading: t("employerTerms.sections.governingLaw.heading"),
      body: t("employerTerms.sections.governingLaw.body"),
    },
    {
      heading: t("employerTerms.sections.contact.heading"),
      body: t("employerTerms.sections.contact.body"),
    },
  ];
}

export function getEmployerPrivacyIntro(t: AppTranslateFn): string {
  return t("employerPrivacy.intro");
}

export function getEmployerPrivacySections(t: AppTranslateFn): LegalSection[] {
  return [
    {
      heading: t("employerPrivacy.sections.whatWeCollect.heading"),
      body: t("employerPrivacy.sections.whatWeCollect.body"),
      items: [
        t("employerPrivacy.sections.whatWeCollect.items.name"),
        t("employerPrivacy.sections.whatWeCollect.items.email"),
        t("employerPrivacy.sections.whatWeCollect.items.location"),
      ],
    },
    {
      heading: t("employerPrivacy.sections.whatWeDoNotCollect.heading"),
      body: t("employerPrivacy.sections.whatWeDoNotCollect.body"),
    },
    {
      heading: t("employerPrivacy.sections.howWeUse.heading"),
      body: t("employerPrivacy.sections.howWeUse.body"),
    },
    {
      heading: t("employerPrivacy.sections.noSelling.heading"),
      body: t("employerPrivacy.sections.noSelling.body"),
    },
    {
      heading: t("employerPrivacy.sections.retention.heading"),
      body: t("employerPrivacy.sections.retention.body"),
    },
    {
      heading: t("employerPrivacy.sections.deletion.heading"),
      body: t("employerPrivacy.sections.deletion.body"),
    },
    {
      heading: t("employerPrivacy.sections.contact.heading"),
      body: t("employerPrivacy.sections.contact.body"),
    },
  ];
}
