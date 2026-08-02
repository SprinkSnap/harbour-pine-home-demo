import { chromium } from 'playwright';

const pages = ['/', '/shop/', '/products/cedar-cove-throw/', '/collections/living/', '/checkout/'];
const widths = [320, 375, 390, 414];

const browser = await chromium.launch({ headless: true });
const results = [];

for (const width of widths) {
  const context = await browser.newContext({
    viewport: { width, height: 812 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  for (const path of pages) {
    const url = `http://127.0.0.1:4322${path}`;
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      const metrics = await page.evaluate(() => {
        const doc = document.documentElement;
        const body = document.body;
        const scrollWidth = Math.max(doc.scrollWidth, body.scrollWidth);
        const clientWidth = doc.clientWidth;
        const overflowX = scrollWidth > clientWidth + 1;
        const offenders = [];
        if (overflowX) {
          for (const el of document.querySelectorAll('body *')) {
            const rect = el.getBoundingClientRect();
            const style = getComputedStyle(el);
            if (style.display === 'none' || style.visibility === 'hidden') continue;
            const right = rect.right;
            const left = rect.left;
            if (right > clientWidth + 1 || left < -1) {
              const tag = el.tagName.toLowerCase();
              const cls = (el.className && typeof el.className === 'string') ? el.className.slice(0, 80) : '';
              offenders.push({
                tag,
                cls,
                left: Math.round(left),
                right: Math.round(right),
                width: Math.round(rect.width),
              });
            }
          }
        }
        // unique top offenders by class
        const uniq = [];
        const seen = new Set();
        for (const o of offenders) {
          const key = `${o.tag}.${o.cls}`;
          if (seen.has(key)) continue;
          seen.add(key);
          uniq.push(o);
          if (uniq.length >= 8) break;
        }
        return {
          clientWidth,
          scrollWidth,
          overflowX,
          offenders: uniq,
          title: document.title,
        };
      });
      results.push({ width, path, ...metrics });
    } catch (e) {
      results.push({ width, path, error: String(e) });
    }
  }
  await context.close();
}

await browser.close();
console.log(JSON.stringify(results, null, 2));
