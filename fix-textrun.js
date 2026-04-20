const fs = require('fs');
let c = fs.readFileSync('create-doc.js', 'utf8');
c = c.replace(/new TextRun\("([^"]*)"\)/g, 'new TextRun({ text: "$1" })');
fs.writeFileSync('create-doc.js', c);
console.log('Fix done');