const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Replace with the URL you want to scrape or use an environment variable
  const targetUrl = process.env.TARGET_URL || 'https://example.com'; 
  await page.goto(targetUrl, { waitUntil: 'networkidle' });

  const data = await page.evaluate(() => {
    return {
      title: document.title,
      text: document.body.innerText.slice(0, 500), // First 500 chars
      images: Array.from(document.querySelectorAll('img')).map(img => img.src),
      videos: Array.from(document.querySelectorAll('video source')).map(v => v.src),
      links: Array.from(document.querySelectorAll('a')).map(a => a.href).slice(0, 10)
    };
  });

  fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
  await browser.close();
})();
