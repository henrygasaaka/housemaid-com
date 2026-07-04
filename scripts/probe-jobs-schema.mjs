import fs from "fs";

const env = Object.fromEntries(
  fs.readFileSync(".env.local", "utf8").split(/\r?\n/).filter(Boolean).map((line) => {
    const i = line.indexOf("=");
    return [line.slice(0, i), line.slice(i + 1)];
  })
);

const headers = {
  apikey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  Authorization: `Bearer ${env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
};
const base = env.NEXT_PUBLIC_SUPABASE_URL;

const tables = [
  "jobs",
  "job_postings",
  "employer_jobs",
  "employer_job_postings",
  "vacancies",
  "openings",
  "applications",
  "job_applications",
  "candidate_applications",
  "saved_jobs",
  "candidate_jobs",
  "matches",
  "job_interests",
];

for (const table of tables) {
  const res = await fetch(`${base}/rest/v1/${table}?select=id&limit=0`, { headers });
  console.log(table, res.status, res.ok ? "exists" : (await res.text()).slice(0, 80));
}

const jobPostingCols = [
  "id", "created_at", "updated_at", "employer_id", "title", "role",
  "description", "emirate", "district", "location", "salary_min", "salary_max",
  "salary_text", "employment_type", "work_arrangement", "requirements", "skills",
  "status", "family_name",
];

async function probeCols(table, cols) {
  const valid = [];
  for (const col of cols) {
    const res = await fetch(`${base}/rest/v1/${table}?select=${col}&limit=0`, { headers });
    if (res.ok) valid.push(col);
  }
  return valid;
}

console.log("job_postings cols:", await probeCols("job_postings", jobPostingCols));
console.log("jobs cols:", await probeCols("jobs", jobPostingCols));
