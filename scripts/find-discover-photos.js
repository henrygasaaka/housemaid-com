const fs = require("fs");

const jsonLine = fs
  .readFileSync(
    "C:/Users/PC/.cursor/projects/c-Users-PC-Documents-housemaid-com/agent-transcripts/05eb8f98-4230-40e7-8b69-fbe103897c4f/05eb8f98-4230-40e7-8b69-fbe103897c4f.jsonl",
    "utf8"
  )
  .split("\n")[7];

const entry = JSON.parse(jsonLine);
const text = entry.message.content[0].text;

// All const ... = "data:image..." declarations
const re = /const ([A-Z_0-9]+) = "(data:image\/[^"]+)"/g;
const photos = [];
let m;
while ((m = re.exec(text))) {
  photos.push({ name: m[1], len: m[2].length, data: m[2] });
}

console.log("Found", photos.length, "embedded photo constants:\n");
photos.forEach((p) => console.log(`${p.name}: ${p.len} chars`));

// Search for Picsart in context of data:image
const picsartNames = [
  "03-33-31-058",
  "03-43-01-524",
  "08-33-49-652",
];

for (const name of picsartNames) {
  const idx = text.indexOf(name);
  // search backwards for nearest const
  const before = text.slice(Math.max(0, idx - 500), idx + 100);
  console.log(`\n=== Context for ${name} ===`);
  console.log(before);
}

// Maybe photos are in a map or array
const discoverPhotoIdx = text.indexOf("DISCOVER_CANDIDATE");
console.log("\nDISCOVER_CANDIDATE at:", discoverPhotoIdx);
if (discoverPhotoIdx >= 0) {
  console.log(text.slice(discoverPhotoIdx, discoverPhotoIdx + 500));
}

// Search photoUrl with data:
const photoUrlData = text.indexOf('photoUrl: "data:image');
console.log('\nphotoUrl: "data:image at:', photoUrlData);
if (photoUrlData >= 0) {
  console.log(text.slice(photoUrlData, photoUrlData + 200));
}

// Look for CANDIDATE_PHOTOS or similar
["CANDIDATE_PHOTOS", "DISCOVER_PHOTOS", "SAMPLE_CANDIDATES", "PREVIEW_PHOTO"].forEach(
  (s) => {
    const i = text.indexOf(s);
    if (i >= 0) console.log(`\n${s} at ${i}:`, text.slice(i, i + 200));
  }
);
