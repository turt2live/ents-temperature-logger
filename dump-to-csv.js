const data = require("./dump.json");
const fs = require('fs');

const lines = [];
let time = 0;
for (const record of data) {
    lines.push(`${time += 10},${record}`);
}

fs.writeFileSync("dump.csv", lines.join("\n"), "utf-8");