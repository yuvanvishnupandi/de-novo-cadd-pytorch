const fs = require('fs');
const main = fs.readFileSync('benchsci_extracted_main.html', 'utf8');

const sections = main.match(/<section[\s\S]*?<\/section>/gi) || [];
console.log('Sections found:', sections.length);

sections.forEach((s, i) => {
  fs.writeFileSync(`benchsci_sec_${i+1}.html`, s);
  console.log(`Saved benchsci_sec_${i+1}.html, size:`, s.length);
});

