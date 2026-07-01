import { MARIA_SANTOS_PHOTO } from "@/lib/discover-photos";
import type { EmploymentHistoryEntry } from "@/lib/discover-candidates";

export type CandidateProfileDisplay = {
  name: string;
  nationalityFlag: string;
  location: string;
  photoUrl: string;
  lastActive: string;
  stats: string[];
  bio: string;
  skills: string[];
  languages: string[];
  employmentHistory: EmploymentHistoryEntry[];
  salary: string;
  availability: string;
};

export const MARIA_PROFILE_DISPLAY: CandidateProfileDisplay = {
  name: "Maria Santos",
  nationalityFlag: "🇵🇭",
  location: "Dubai, Al Barsha",
  photoUrl: MARIA_SANTOS_PHOTO,
  lastActive: "today",
  stats: ["3 Years Exp", "Own Visa", "Live-in"],
  bio: "I have experience in cleaning, ironing, and taking care of children. I am hardworking, honest, and take pride in keeping a home organised and welcoming.",
  skills: ["Cleaning", "Ironing", "Childcare"],
  languages: ["English", "Tagalog"],
  employmentHistory: [
    {
      role: "Housemaid",
      employer: "Al Rashid Family",
      location: "Dubai, JLT",
      years: "2022 - Present",
    },
    {
      role: "Nanny",
      employer: "Private Household",
      location: "Dubai, Marina",
      years: "2019 - 2022",
    },
  ],
  salary: "AED 2,500 - 3,000/mo",
  availability: "Available immediately",
};
