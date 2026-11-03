const fs = require('fs');
const html = fs.readFileSync('benchsci_home.html', 'utf8');

// Inspect header / nav
const header = html.match(/<header[\s\S]*?<\/header>/i);
if (header) {
  console.log('--- HEADER ---');
  console.log(header[0].substring(0, 1500));
}

// Inspect main / sections
const main = html.match(/<main[\s\S]*?<\/main>/i);
if (main) {
  console.log('--- MAIN LENGTH ---', main[0].length);
  // find first section
  const sec1 = main[0].match(/<section[\s\S]*?<\/section>/i);
  if (sec1) {
    console.log('--- FIRST SECTION ---');
    console.log(sec1[0].substring(0, 1500));
  }
}

// Inspect footer
const footer = html.match(/<footer[\s\S]*?<\/footer>/i);
if (footer) {
  console.log('--- FOOTER ---');
  console.log(footer[0].substring(0, 1500));
}

