const fs = require('fs');
const html = fs.readFileSync('benchsci_home.html', 'utf8');

const title = html.match(/<title>([^<]+)<\/title>/i);
console.log('Title:', title ? title[1].trim() : 'N/A');

const h1s = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi) || [];
console.log('H1s:', h1s.map(h => h.replace(/<[^>]+>/g, '').trim()));

const h2s = html.match(/<h2[^>]*>([\s\S]*?)<\/h2>/gi) || [];
console.log('H2s:', h2s.map(h => h.replace(/<[^>]+>/g, '').trim()));

const navLinks = html.match(/<a[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi) || [];
console.log('Total links:', navLinks.length);

const cleanLinks = navLinks.map(l => {
  const hrefMatch = l.match(/href=["']([^"']+)["']/i);
  const text = l.replace(/<[^>]+>/g, '').trim();
  return { href: hrefMatch ? hrefMatch[1] : '', text };
}).filter(l => l.text && l.text.length < 40);

console.log('Sample links:', cleanLinks.slice(0, 30));

// Find images
const imgs = html.match(/src=["']([^"']+\.(?:png|jpg|jpeg|svg|webp))["']/gi) || [];
console.log('Images sample:', imgs.slice(0, 20));

