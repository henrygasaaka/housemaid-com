const fs = require("fs");
const raw = fs.readFileSync(process.argv[2], "utf8");
const line = JSON.parse(raw.split("\n")[6]).message.content[0].text;

const start = line.indexOf("function CandidateDashboard");
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
    if (depth === 0) {
      fs.writeFileSync("tmp-dashboard.txt", line.slice(start, i + 1));
      console.log("chars:", i + 1 - start);
      break;
    }
  }
}
