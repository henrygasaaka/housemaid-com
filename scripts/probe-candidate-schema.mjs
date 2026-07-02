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
const base = env.NEXT_PUBLIC_SUPABASE_URL;

const candidateCols = [
  "id", "created_at", "updated_at", "first_name", "last_name", "phone",
  "nationality", "gender", "emirate", "district", "visa_status", "availability",
  "years_experience", "skills", "languages", "about", "salary_min", "salary_max",
  "employment_type", "status", "photo_url", "video_storage_path",
  "view_count", "views_this_week", "profile_views", "saved_count", "is_verified",
  "last_active_at", "preferred_days",
];

const savedCols = ["id", "candidate_id", "employer_id", "created_at", "saved_at"];

async function probeCols(table, cols) {
  const valid = [];
  for (const col of cols) {
    const res = await fetch(`${base}/rest/v1/${table}?select=${col}&limit=0`, { headers });
    if (res.ok) valid.push(col);
  }
  return valid;
}

const [candidates, saved] = await Promise.all([
  probeCols("candidates", candidateCols),
  probeCols("saved_candidates", savedCols),
]);

console.log("candidates:", candidates);
console.log("saved_candidates:", saved);

// conversations columns
const convCols = ["id", "candidate_id", "employer_id", "status", "created_at"];
console.log("conversations:", await probeCols("conversations", convCols));
