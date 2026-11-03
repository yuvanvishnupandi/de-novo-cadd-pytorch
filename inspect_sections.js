const fs = require('fs');
const html = fs.readFileSync('benchsci_home.html', 'utf8');

// Find all sections or main containers
const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
if (bodyMatch) {
  const body = bodyMatch[1];
  console.log('Body length:', body.length);
  // Find all section tags
  const sections = body.match(/<section[\s\S]*?<\/section>/gi) || [];
  console.log('Sections found:', sections.length);
  sections.forEach((s, i) => {
    const text = s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 150);
    console.log(`Section ${i+1}:`, text);
  });
}

// Find CSS styles or links
const styles = html.match(/<link[^>]+rel=["']stylesheet["'][^>]*>/gi) || [];
console.log('Stylesheets:');
styles.forEach(s => console.log(s));

