const fs = require("fs");

const jsonLine = fs
  .readFileSync(
    "C:/Users/PC/.cursor/projects/c-Users-PC-Documents-housemaid-com/agent-transcripts/05eb8f98-4230-40e7-8b69-fbe103897c4f/05eb8f98-4230-40e7-8b69-fbe103897c4f.jsonl",
    "utf8"
  )
  .split("\n")[7];

const entry = JSON.parse(jsonLine);
const text = entry.message.content[0].text;

const start = text.indexOf("const TRUSTED_AVATAR_PHOTOS = [");
const end = text.indexOf("];", start) + 2;
const arrText = text.slice(start, end);

const photos = [];
const re = /"(data:image\/[^"]+)"/g;
let m;
while ((m = re.exec(arrText))) {
  photos.push(m[1]);
}

const mapping = [
  ["maria-santos", 0, "Picsart_26-06-28_03-33-31-058.jpg"],
  ["grace-wanjiru", 2, "Picsart_26-06-28_08-33-49-652.jpg"],
  ["nilanthi-perera", 1, "Picsart_26-06-28_03-43-01-524.jpg"],
];

const outDir = "lib/discover-photos";
fs.mkdirSync(outDir, { recursive: true });

for (const [slug, idx, filename] of mapping) {
  const photo = photos[idx];
  fs.writeFileSync(
    `${outDir}/${slug}.ts`,
    `// ${filename}\nexport const DISCOVER_PHOTO = "${photo}";\n`
  );
  console.log(`Wrote ${slug}.ts (${photo.length} chars)`);
}

fs.writeFileSync(
  `${outDir}/index.ts`,
  `export { DISCOVER_PHOTO as MARIA_SANTOS_PHOTO } from "./maria-santos";\nexport { DISCOVER_PHOTO as GRACE_WANJIRU_PHOTO } from "./grace-wanjiru";\nexport { DISCOVER_PHOTO as NILANTHI_PERERA_PHOTO } from "./nilanthi-perera";\n`
);

console.log("Done.");
