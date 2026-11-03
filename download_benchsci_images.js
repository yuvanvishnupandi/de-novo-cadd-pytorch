const https = require('https');
const fs = require('fs');
const path = require('path');

const html = fs.readFileSync('benchsci_home.html', 'utf8');

const regex = /["'](\/(?:images|_next\/image|\w+)[^"']+\.(?:svg|png|jpg|jpeg|webp|gif|mp4)(?:\?[^"']*)?)["']/gi;
const matches = [...new Set(Array.from(html.matchAll(regex), m => m[1]))];

console.log('Total media paths found:', matches.length);

function downloadFile(fullRelPath) {
  const cleanPath = fullRelPath.split('?')[0];
  const url = 'https://www.benchsci.com' + fullRelPath;
  const localDest = path.join('frontend/public', cleanPath);
  
  fs.mkdirSync(path.dirname(localDest), { recursive: true });

  const file = fs.createWriteStream(localDest);
  https.get(url, {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  }, res => {
    if (res.statusCode === 200) {
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log('Saved:', cleanPath);
      });
    } else {
      console.log('Skipped (' + res.statusCode + '):', cleanPath);
      file.close();
      if (fs.existsSync(localDest)) fs.unlinkSync(localDest);
    }
  }).on('error', err => {
    console.error('Error for ' + cleanPath + ':', err.message);
  });
}

matches.forEach(m => downloadFile(m));
