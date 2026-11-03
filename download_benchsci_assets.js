const https = require('https');
const fs = require('fs');

const html = fs.readFileSync('benchsci_home.html', 'utf8');
const links = html.match(/href=["'](\/_next\/static\/chunks\/[^"']+\.css)["']/g) || [];

console.log('CSS chunk links:', links);

links.forEach(l => {
  const match = l.match(/href=["']([^"']+)["']/);
  if (!match) return;
  const path = match[1];
  const url = 'https://www.benchsci.com' + path;
  const filename = path.split('/').pop();
  console.log('Downloading CSS:', url);
  https.get(url, (res) => {
    let d = '';
    res.on('data', c => d += c);
    res.on('end', () => {
      fs.writeFileSync('benchsci_' + filename, d);
      console.log('Saved benchsci_' + filename, 'size:', d.length);
    });
  }).on('error', err => console.error(err));
});

