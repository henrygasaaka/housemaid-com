const fs = require("fs");
const line = fs
  .readFileSync(
    "C:/Users/PC/.cursor/projects/c-Users-PC-Documents-housemaid-com/agent-transcripts/05eb8f98-4230-40e7-8b69-fbe103897c4f/05eb8f98-4230-40e7-8b69-fbe103897c4f.jsonl",
    "utf8"
  )
  .split("\n")[7];

function extractFunction(name) {
  const re = new RegExp(`function ${name}\\(`);
  const m = re.exec(line);
  if (!m) return null;
  const start = m.index;
  let i = line.indexOf("{", start);
  let depth = 0;
  for (; i < line.length; i++) {
    const c = line[i];
    if (c === '"' || c === "'" || c === "`") {
      const q = c;
      i++;
      while (i < line.length && line[i] !== q) {
        if (line[i] === "\\") i++;
        i++;
      }
      continue;
    }
    if (c === "{") depth++;
    else if (c === "}") {
      depth--;
      if (depth === 0) return line.slice(start, i + 1);
    }
  }
  return null;
}

const targets = [
  "PhoneFrame",
  "TopBar",
  "PrimaryButton",
  "TextField",
  "ScreenHeading",
  "PhoneEntryScreen",
  "OtpScreen",
  "EmailLoginScreen",
  "GoogleAuthScreen",
];

for (const name of targets) {
  const code = extractFunction(name);
  if (!code) {
    console.log(`===== ${name}: NOT FOUND =====\n`);
    continue;
  }
  console.log(`===== ${name} (${code.length} chars) =====`);
  console.log(code);
  console.log("\n");
}

// candidate-welcome section
const welcomeIdx = line.indexOf('screen === "candidate-welcome"');
if (welcomeIdx >= 0) {
  console.log("===== candidate-welcome block =====");
  console.log(line.slice(welcomeIdx, welcomeIdx + 8000));
}

const createIdx = line.indexOf('screen === "candidate-create-account"');
if (createIdx >= 0) {
  console.log("\n===== candidate-create-account block =====");
  console.log(line.slice(createIdx, createIdx + 8000));
}

const welcomePhoto = line.indexOf("CANDIDATE_WELCOME_PHOTO");
console.log("\nCANDIDATE_WELCOME_PHOTO at:", welcomePhoto);
if (welcomePhoto >= 0) {
  console.log(line.slice(welcomePhoto, welcomePhoto + 200));
}
