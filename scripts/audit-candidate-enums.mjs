import fs from "fs";

const env = Object.fromEntries(
  fs
    .readFileSync(".env.local", "utf8")
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => {
      const i = line.indexOf("=");
      return [line.slice(0, i), line.slice(i + 1)];
    })
);

const headers = {
  apikey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  Authorization: `Bearer ${env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
};

async function probeEnumColumn(column, candidates) {
  const valid = [];
  const invalid = [];
  for (const value of candidates) {
    const res = await fetch(
      `${env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/candidates?select=${column}&${column}=eq.${encodeURIComponent(value)}&limit=0`,
      { headers }
    );
    if (res.ok) valid.push(value);
    else {
      const body = await res.text();
      if (body.includes("invalid input value for enum")) invalid.push(value);
    }
  }
  return { valid, invalid };
}

const audits = {
  status: {
    wizardSends: {
      draft: "draft (all incremental saves)",
      publish: "published (publishCandidateProfile)",
    },
    candidates: [
      "draft",
      "published",
      "active",
      "inactive",
      "paused",
      "archived",
      "pending",
      "live",
      "complete",
      "completed",
    ],
  },
  visa_status: {
    wizardSends: {
      options: "own_visa, visit_visa, cancelled_visa, sponsored_visa, looking_for_sponsorship (via VISA_STATUS + normalizeVisaStatus)",
    },
    candidates: [
      "own_visa",
      "visit_visa",
      "cancelled_visa",
      "sponsored_visa",
      "looking_for_sponsorship",
      "own",
      "visit",
    ],
  },
  employment_type: {
    wizardSends: {
      options: "live_in, live_out (via EMPLOYMENT_TYPE + normalizeEmploymentType)",
    },
    candidates: [
      "live_in",
      "live_out",
      "full_time",
      "part_time",
      "livein",
      "liveout",
    ],
  },
  gender: {
    wizardSends: { options: "Female, Male (plain strings from UI)" },
    candidates: ["Female", "Male", "female", "male", "F", "M"],
  },
  nationality: {
    wizardSends: {
      options:
        "Philippines, Kenya, Sri Lanka, Bangladesh, India, Indonesia, Nepal, Ethiopia, Uganda, Other",
    },
    candidates: [
      "Philippines",
      "Kenya",
      "Other",
      "philippines",
    ],
  },
  availability: {
    wizardSends: {
      options:
        "Available immediately, Within 1 week, Within 2 weeks, Within 1 month, Currently employed",
    },
    candidates: [
      "Available immediately",
      "Within 1 week",
      "Within 2 weeks",
      "Within 1 month",
      "Currently employed",
      "available_immediately",
    ],
  },
  years_experience: {
    wizardSends: {
      options:
        "Less than 1 year, 1 - 3 years, 3 - 5 years, 5+ years",
    },
    candidates: [
      "Less than 1 year",
      "1 - 3 years",
      "3 - 5 years",
      "5+ years",
      "less_than_1_year",
      "1_3_years",
    ],
  },
  emirate: {
    wizardSends: {
      options:
        "Dubai, Abu Dhabi, Sharjah, Ajman, Ras Al Khaimah, Fujairah, Umm Al Quwain",
    },
    candidates: ["Dubai", "Abu Dhabi", "dubai"],
  },
  district: {
    wizardSends: { options: "Al Barsha, Deira, Al Nahda, ... (plain strings)" },
    candidates: ["Al Barsha", "Deira", "al_barsha"],
  },
};

const results = {};

for (const [column, config] of Object.entries(audits)) {
  const res = await fetch(
    `${env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/candidates?select=${column}&limit=0`,
    { headers }
  );
  if (!res.ok) {
    results[column] = { exists: false, error: await res.text() };
    continue;
  }
  const enumProbe = await probeEnumColumn(column, config.candidates);
  results[column] = {
    exists: true,
    isEnum: enumProbe.invalid.length > 0 || enumProbe.valid.length < config.candidates.length,
    dbValidValues: enumProbe.valid,
    wizardSends: config.wizardSends,
    wizardValuesNotInDb: config.candidates.filter(
      (v) => !enumProbe.valid.includes(v) && enumProbe.invalid.includes(v)
    ),
  };
}

console.log(JSON.stringify(results, null, 2));
