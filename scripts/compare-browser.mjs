import { chromium } from 'playwright-core';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: true,
});
const output = path.join(os.tmpdir(), 'cyclonic-comparison');
fs.mkdirSync(output, { recursive: true });

try {
  for (const width of [1440, 390]) {
    const results = await Promise.all(['original', 'next'].map(async (version) => {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      const errors = [];
      page.on('pageerror', (error) => errors.push(error.message));
      await page.goto(version === 'original' ? 'http://localhost:4001/index.html' : 'http://localhost:3000/', { waitUntil: 'domcontentloaded' });
      await page.evaluate(() => Promise.race([document.fonts.ready, new Promise((resolve) => setTimeout(resolve, 8000))]));
      await page.waitForTimeout(6000);
      const state = await page.evaluate(() => {
        const selectors = ['.navbar', '.home-hero-slide', 'h1', '.page-wrapper'];
        return {
          title: document.title,
          webflow: typeof window.Webflow?.require === 'function',
          elements: Object.fromEntries(selectors.map((selector) => {
            const element = document.querySelector(selector);
            if (!element) return [selector, null];
            const rect = element.getBoundingClientRect();
            const style = getComputedStyle(element);
            return [selector, { x: rect.x, y: rect.y, width: rect.width, height: rect.height, font: style.fontFamily, opacity: style.opacity }];
          })),
          images: document.images.length,
          activeSliders: document.querySelectorAll('.w-slider-dot.w-active').length,
        };
      });
      await page.screenshot({ path: path.join(output, `${version}-${width}.png`), timeout: 15000 });
      if (width === 390) {
        const menu = page.locator('.w-nav-button').first();
        await menu.click();
        await page.waitForTimeout(500);
        state.mobileMenuOpens = await menu.getAttribute('aria-expanded') === 'true';
      }
      console.log(JSON.stringify({ version, width, errors, ...state }));
      await page.close();
      return state;
    }));
    console.log('Matching layout:', width, JSON.stringify(results[0].elements) === JSON.stringify(results[1].elements));
  }
  console.log('Screenshots:', output);
} finally {
  await browser.close();
}
