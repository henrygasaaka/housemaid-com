import {
  AISHA_RAHMAN_PHOTO,
  GRACE_WANJIRU_PHOTO,
  MARIA_SANTOS_PHOTO,
  NILANTHI_PERERA_PHOTO,
} from "@/lib/discover-photos";

export type EmploymentHistoryEntry = {
  role: string;
  employer: string;
  location: string;
  years: string;
};

export type CandidateReferences = {
  count: number;
  summary: string;
};

export type DiscoverCandidate = {
  id: number;
  name: string;
  age: number;
  nationality: string;
  location: string;
  visa: string;
  exp: string;
  type: string;
  live: string;
  rate: string;
  bio: string;
  photoTone: string;
  photoUrl?: string;
  responseTime: string;
  lastActive: string;
  available: string;
  skills: string[];
  employmentHistory: EmploymentHistoryEntry[];
  references: CandidateReferences;
};

export const DISCOVER_CANDIDATES: DiscoverCandidate[] = [
  {
    id: 1,
    name: "Maria Santos",
    age: 34,
    nationality: "🇵🇭",
    location: "Dubai, Al Barsha",
    visa: "Own Visa",
    exp: "5 Years Exp.",
    type: "Part-Time",
    live: "Live-Out",
    rate: "AED 35/hour",
    bio: "I have experience in cleaning, ironing, and taking care of children. I am hardworking and honest.",
    photoTone: "#C9B8E8",
    photoUrl: MARIA_SANTOS_PHOTO,
    responseTime: "30 min",
    lastActive: "today",
    available: "Available Now",
    skills: ["Cleaning", "Ironing", "Childcare"],
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
    references: {
      count: 2,
      summary:
        "Both previous employers describe Maria as reliable, trustworthy with children, and excellent at maintaining a clean home.",
    },
  },
  {
    id: 2,
    name: "Grace Wanjiru",
    age: 29,
    nationality: "🇰🇪",
    location: "Dubai, Deira",
    visa: "Visit Visa",
    exp: "3 Years Exp.",
    type: "Full-Time",
    live: "Live-In",
    rate: "AED 2,200/mo",
    bio: "Detail-oriented and punctual. Specializes in deep cleaning and elderly assistance.",
    photoTone: "#A7D8C9",
    photoUrl: GRACE_WANJIRU_PHOTO,
    responseTime: "1 hr",
    lastActive: "today",
    available: "Available Now",
    skills: ["Cleaning", "Elderly Care", "Laundry"],
    employmentHistory: [
      {
        role: "Live-in Housemaid",
        employer: "The Khan Family",
        location: "Dubai, Mirdif",
        years: "2021 - Present",
      },
    ],
    references: {
      count: 1,
      summary:
        "Employer praises Grace's patience with elderly family members and consistently spotless housekeeping.",
    },
  },
  {
    id: 3,
    name: "Nilanthi Perera",
    age: 41,
    nationality: "🇱🇰",
    location: "Sharjah, Al Nahda",
    visa: "Own Visa",
    exp: "9 Years Exp.",
    type: "Full-Time",
    live: "Live-In",
    rate: "AED 2,400/mo",
    bio: "Senior-level housemaid with nearly a decade of experience across three GCC households.",
    photoTone: "#F3C7A5",
    photoUrl: NILANTHI_PERERA_PHOTO,
    responseTime: "2 hrs",
    lastActive: "2 weeks ago",
    available: "Available Tomorrow",
    skills: ["Cooking", "Childcare", "Pet Care"],
    employmentHistory: [
      {
        role: "Housemaid & Cook",
        employer: "Al Suwaidi Household",
        location: "Sharjah",
        years: "2020 - Present",
      },
      {
        role: "Housemaid",
        employer: "Private Family",
        location: "Abu Dhabi",
        years: "2017 - 2020",
      },
      {
        role: "Housemaid",
        employer: "Private Family",
        location: "Sri Lanka",
        years: "2014 - 2017",
      },
    ],
    references: {
      count: 3,
      summary:
        "Long-tenured with each household. Employers highlight her cooking skills and gentle manner with children and pets.",
    },
  },
  {
    id: 4,
    name: "Aisha Rahman",
    age: 27,
    nationality: "🇧🇩",
    location: "Abu Dhabi, Khalifa City",
    visa: "Visit Visa",
    exp: "2 Years Exp.",
    type: "Part-Time",
    live: "Live-Out",
    rate: "AED 30/hour",
    bio: "Reliable and quick learner. Comfortable with cooking, cleaning, and basic childcare duties.",
    photoTone: "#B8D4E8",
    photoUrl: AISHA_RAHMAN_PHOTO,
    responseTime: "45 min",
    lastActive: "5 weeks ago",
    available: "Available Now",
    skills: ["Cooking", "Cleaning", "Childcare"],
    employmentHistory: [
      {
        role: "Part-time Housemaid",
        employer: "Private Household",
        location: "Abu Dhabi, Khalifa City",
        years: "2023 - Present",
      },
    ],
    references: {
      count: 1,
      summary:
        "Employer notes Aisha is still building experience but is eager, punctual, and quick to learn new routines.",
    },
  },
];

export function maskCandidateName(name: string): string {
  const parts = name.split(" ");
  if (parts.length < 2) return name;
  return `${parts[0]} ${parts[1][0]}.`;
}

export function getCandidateById(id: number): DiscoverCandidate | undefined {
  return DISCOVER_CANDIDATES.find((c) => c.id === id);
}
