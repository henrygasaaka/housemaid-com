const fs = require("fs");
const line = JSON.parse(
  fs.readFileSync(process.argv[2], "utf8").split("\n")[6]
).message.content[0].text;

const re = /screen === "candidate-[^"]+"/g;
let m;
const screens = new Set();
while ((m = re.exec(line))) screens.add(m[0]);
console.log([...screens].join("\n"));

const idx = line.indexOf("function MessagingInbox");
console.log("MessagingInbox", idx);
if (idx < 0) {
  const idx2 = line.indexOf("lastMessagePreview");
  console.log("lastMessagePreview", idx2);
  const idx3 = line.indexOf("unread badge");
  console.log("unread badge", idx3);
}

// search for bubble
const b = line.indexOf("from === \"employer\"");
console.log("employer bubble", b);
if (b >= 0) console.log(line.slice(b - 200, b + 1500));
