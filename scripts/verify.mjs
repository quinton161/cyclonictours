import { chromium } from 'playwright-core';
import fs from 'node:fs';

const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const outDir = process.env.TEMP || '.';
const targets = [
  { name: 'next-home', url: 'http://localhost:3000/' },
  { name: 'orig-home', url: 'http://localhost:4001/index.html' },
  { name: 'next-blog-detail', url: 'http://localhost:3000/blog/discover-the-soul-of-cities' },
  { name: 'next-hotel', url: 'http://localhost:3000/accommodations/amangiri-utah-usa' },
  { name: 'next-packages', url: 'http://localhost:3000/packages' },
  { name: 'next-gallery', url: 'http://localhost:3000/gallery' },
];

const browser = await chromium.launch({ executablePath: chrome, headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });

for (const target of targets) {
  const page = await context.newPage();
  const errors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', (err) => errors.push('pageerror: ' + err.message));

  await page.goto(target.url, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(20000);

  const info = await page.evaluate(() => {
    const style = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const cs = getComputedStyle(el);
      return { opacity: cs.opacity, transform: cs.transform, display: cs.display, visibility: cs.visibility };
    };
    return {
      url: location.href,
      title: document.title,
      htmlClass: document.documentElement.className,
      wfPage: document.documentElement.getAttribute('data-wf-page'),
      webflow: !!window.Webflow,
      ix2: !!(window.Webflow && window.Webflow.require),
      navStyle: style('.navbar'),
      review: style('[data-w-id="e6398e83-7223-f482-a38a-3d9b0c1d8f61"]'),
      heroSlide: style('.home-hero-slide'),
      slideCount: document.querySelectorAll('.w-slide').length,
      activeDots: document.querySelectorAll('.w-slider-dot.w-active').length,
      dataWid: document.querySelectorAll('[data-w-id]').length,
      imgs: document.querySelectorAll('img').length,
      brokenImgs: [...document.querySelectorAll('img')].filter((img) => img.complete && img.naturalWidth === 0).length,
      bodyHeight: document.body.scrollHeight,
      scriptCount: document.scripts.length,
    };
  });

  const client = await context.newCDPSession(page);
  const shot = await client.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  fs.writeFileSync(`${outDir}/shot-${target.name}.png`, Buffer.from(shot.data, 'base64'));

  console.log(`\n=== ${target.name} ===`);
  console.log(JSON.stringify(info, null, 2));
  console.log('errors:', errors.slice(0, 10));
  await page.close();
}

await browser.close();
