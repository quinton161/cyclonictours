import { chromium } from 'playwright-core';

const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const browser = await chromium.launch({ executablePath: chrome, headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

page.on('console', (msg) => console.log('CONSOLE', msg.type(), msg.text().slice(0, 300)));
page.on('pageerror', (err) => console.log('PAGEERROR', err.message));
page.on('requestfailed', (req) => console.log('FAILED', req.url(), req.failure()?.errorText));
page.on('response', (res) => {
  const u = res.url();
  if (u.includes('tripvana-agency') || u.includes('jquery') || u.includes('webfont')) {
    console.log('RESP', res.status(), u);
  }
});

await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(30000);

const info = await page.evaluate(() => ({
  started: window.__webflowLoaderStarted,
  scripts: [...document.scripts].map((s) => s.src || s.text.slice(0, 80)),
  webflow: typeof window.Webflow,
  jquery: typeof window.jQuery,
  wf: document.documentElement.className,
  chunks: window.self && window.self.webpackChunk ? window.self.webpackChunk.length : null,
  next: !!window.next,
  reactRoot: !!document.querySelector('#__next'),
  bodyFirst: document.body.firstElementChild ? document.body.firstElementChild.className : null,
}));
console.log(JSON.stringify(info, null, 2));

await browser.close();
