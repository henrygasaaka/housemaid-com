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
  "Content-Type": "application/json",
  Prefer: "return=representation",
};
const base = env.NEXT_PUBLIC_SUPABASE_URL;

const employerCols = [
  "id", "phone", "full_name", "family_name", "email", "emirate", "district",
];
const valid = [];
for (const col of employerCols) {
  const res = await fetch(`${base}/rest/v1/employers?select=${col}&limit=0`, { headers });
  if (res.ok) valid.push(col);
}
console.log("employers writable cols:", valid);

const convCols = [
  "id", "candidate_id", "employer_id", "status",
];
const convInsert = {
  candidate_id: "00000000-0000-0000-0000-000000000002",
  employer_id: "00000000-0000-0000-0000-000000000003",
  status: "messaging",
};
const convRes = await fetch(`${base}/rest/v1/conversations`, {
  method: "POST",
  headers,
  body: JSON.stringify(convInsert),
});
console.log("conversation insert:", convRes.status, (await convRes.text()).slice(0, 250));

const empInsert = { id: "00000000-0000-0000-0000-000000000003", full_name: "Test Family" };
const empRes = await fetch(`${base}/rest/v1/employers`, {
  method: "POST",
  headers,
  body: JSON.stringify(empInsert),
});
console.log("employer insert:", empRes.status, (await empRes.text()).slice(0, 250));
