const fs = require("fs");

const jsonLine = fs
  .readFileSync(
    "C:/Users/PC/.cursor/projects/c-Users-PC-Documents-housemaid-com/agent-transcripts/05eb8f98-4230-40e7-8b69-fbe103897c4f/05eb8f98-4230-40e7-8b69-fbe103897c4f.jsonl",
    "utf8"
  )
  .split("\n")[7];

const entry = JSON.parse(jsonLine);
const text = entry.message.content[0].text;

// Extract TRUSTED_AVATAR_PHOTOS array
const start = text.indexOf("const TRUSTED_AVATAR_PHOTOS = [");
const end = text.indexOf("];", start) + 2;
const arrText = text.slice(start, end);

// Parse by finding all data:image strings in array
const photos = [];
const re = /"(data:image\/[^"]+)"/g;
let m;
while ((m = re.exec(arrText))) {
  photos.push(m[1]);
}

console.log("TRUSTED_AVATAR_PHOTOS count:", photos.length);
photos.forEach((p, i) => console.log(`  ${i}: ${p.length} chars`));

// Extract all data:image strings from entire file with index
const allRe = /"(data:image\/jpeg;base64,[^"]{100,})"/g;
const all = [];
while ((m = allRe.exec(text))) {
  all.push({ index: m.index, len: m[1].length, prefix: m[1].slice(0, 60) });
}
console.log("\nAll large data:image strings:", all.length);
all.forEach((p, i) => console.log(`  ${i}: idx=${p.index} len=${p.len}`));

// Write trusted avatars for inspection
const outDir = "lib/discover-photos";
fs.mkdirSync(outDir, { recursive: true });
photos.forEach((p, i) => {
  fs.writeFileSync(`${outDir}/avatar-${i + 1}.ts`, `export const PHOTO = "${p}";\n`);
});
