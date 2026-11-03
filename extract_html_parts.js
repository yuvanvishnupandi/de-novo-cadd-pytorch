const fs = require('fs');
const html = fs.readFileSync('benchsci_home.html', 'utf8');

// Extract Header
const header = html.match(/<header[\s\S]*?<\/header>/i);
if (header) {
  fs.writeFileSync('benchsci_extracted_header.html', header[0]);
  console.log('Saved header, length:', header[0].length);
}

// Extract Main
const main = html.match(/<main[\s\S]*?<\/main>/i);
if (main) {
  fs.writeFileSync('benchsci_extracted_main.html', main[0]);
  console.log('Saved main, length:', main[0].length);
}

// Extract Footer
const footer = html.match(/<footer[\s\S]*?<\/footer>/i);
if (footer) {
  fs.writeFileSync('benchsci_extracted_footer.html', footer[0]);
  console.log('Saved footer, length:', footer[0].length);
}
