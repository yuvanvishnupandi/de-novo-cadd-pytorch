import scrape from 'website-scraper';

const options = {
  urls: ['https://enveda.com/'],
  directory: './public/enveda_clone',
  recursive: false,
  maxDepth: 1,
  filenameGenerator: 'bySiteStructure',
  request: {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  }
};

scrape(options).then((result) => {
    console.log("Entire website perfectly cloned and saved to /public/enveda_clone/");
}).catch((err) => {
    console.error("An error ocurred", err);
});
