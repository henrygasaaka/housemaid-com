const fs = require("fs");
const line = JSON.parse(
  fs.readFileSync(process.argv[2], "utf8").split("\n")[6]
).message.content[0].text;

function extractFrom(name) {
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

for (const name of [
  "CandidateInboxScreen",
  "CandidateThreadScreen",
  "MessageBubble",
  "StatusBadge",
]) {
  const code = extractFrom(name);
  if (!code) {
    console.log(`===== ${name}: NOT FOUND =====\n`);
    continue;
  }
  console.log(`===== ${name} (${code.length} chars) =====`);
  console.log(code);
  console.log("\n");
}
