const fs = require("fs");
const jsonLine = fs.readFileSync(
  "C:/Users/PC/.cursor/projects/c-Users-PC-Documents-housemaid-com/agent-transcripts/05eb8f98-4230-40e7-8b69-fbe103897c4f/05eb8f98-4230-40e7-8b69-fbe103897c4f.jsonl",
  "utf8"
).split("\n")[7];

const entry = JSON.parse(jsonLine);
const text = entry.message.content[0].text;

const marker = "const CANDIDATE_WELCOME_PHOTO = ";
const start = text.indexOf(marker);
if (start < 0) {
  console.error("CANDIDATE_WELCOME_PHOTO not found");
  process.exit(1);
}

const quoteStart = start + marker.length + 1;
let i = quoteStart;
while (i < text.length) {
  if (text[i] === "\\") {
    i += 2;
    continue;
  }
  if (text[i] === '"') break;
  i++;
}

const photo = text.slice(quoteStart, i);
fs.writeFileSync(
  "lib/landing-photos/candidate-welcome.ts",
  `export const CANDIDATE_WELCOME_PHOTO = "${photo}";\n`
);
console.log("Extracted CANDIDATE_WELCOME_PHOTO, length:", photo.length);
