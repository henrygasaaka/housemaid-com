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

const cols = [
  "interview_date", "interview_time", "interview_location", "interview_link",
  "interview_role", "role", "location", "scheduled_at", "interview_at",
  "interview_type", "meeting_link", "call_link", "notes",
];

const valid = [];
for (const col of cols) {
  const res = await fetch(`${base}/rest/v1/conversations?select=${col}&limit=0`, { headers });
  if (res.ok) valid.push(col);
}
console.log("conversations interview cols:", valid);

// sample row with interview statuses
for (const s of ["interview_requested", "interview_scheduled", "interviewed"]) {
  const res = await fetch(`${base}/rest/v1/conversations?select=*&status=eq.${s}&limit=1`, { headers });
  console.log(s, res.status, await res.text());
}
