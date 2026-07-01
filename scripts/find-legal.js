const fs = require("fs");
const line = JSON.parse(
  fs.readFileSync(process.argv[2], "utf8").split("\n")[6]
).message.content[0].text;

const needles = [
  "Terms of Service",
  "Privacy Policy",
  "onOpenTerms",
  "onOpenPrivacy",
  "Housemaid.com",
  "Last updated",
  "1. Introduction",
  "Personal Data",
];

for (const n of needles) {
  const i = line.indexOf(n);
  console.log(n, i >= 0 ? i : "NF");
}

const termsIdx = line.indexOf("Terms of Service");
if (termsIdx >= 0) {
  // find a block with legal content
  const slice = line.slice(termsIdx - 500, termsIdx + 8000);
  fs.writeFileSync("tmp-legal.txt", slice);
  console.log("wrote tmp-legal.txt", slice.length);
}
