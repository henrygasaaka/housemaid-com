const fs = require("fs");
const raw = fs.readFileSync(
  process.argv[2],
  "utf8"
);
const line = JSON.parse(raw.split("\n")[6]).message.content[0].text;

const needles = [
  "function CandidateDashboard",
  "function CandidateBottomNav",
  "function ProgressRing",
  "Views this week",
  "Complete your profile",
  "Recent activity",
  "Hi ",
];

for (const n of needles) {
  const idx = line.indexOf(n);
  console.log(n, idx >= 0 ? idx : "NOT FOUND");
  if (idx >= 0) {
    console.log(line.slice(idx, idx + 500));
    console.log("---");
  }
}
