import { chromium } from '@playwright/test';

const routes = ['/', '/collections/living/', '/products/cedar-cove-throw/', '/search/?q=tray', '/cart/', '/checkout/'];
const browser = await chromium.launch();
const page = await browser.newPage();
const results = [];

for (const route of routes) {
  const client = await page.context().newCDPSession(page);
  await client.send('Network.enable');
  let transfer = 0;
  client.on('Network.loadingFinished', (e) => {
    transfer += e.encodedDataLength || 0;
  });
  await page.goto(`http://127.0.0.1:4321${route}`, { waitUntil: 'networkidle' });
  const metrics = await page.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0];
    const paint = performance.getEntriesByType('paint');
    const lcpEntries = performance.getEntriesByType('largest-contentful-paint');
    return {
      domContentLoaded: nav?.domContentLoadedEventEnd,
      load: nav?.loadEventEnd,
      fcp: paint.find((p) => p.name === 'first-contentful-paint')?.startTime,
      lcp: lcpEntries.at(-1)?.startTime,
    };
  });
  results.push({ route, transferBytes: transfer, ...metrics });
  await client.detach();
}

console.log(JSON.stringify(results, null, 2));
await browser.close();
