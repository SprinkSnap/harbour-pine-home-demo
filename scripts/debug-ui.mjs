import { chromium, devices } from '@playwright/test';

const browser = await chromium.launch();
const context = await browser.newContext({
  ...devices['Desktop Chrome'],
  viewport: { width: 390, height: 844 },
});
const page = await context.newPage();
page.on('pageerror', (e) => console.log('PAGEERROR', e.message));
page.on('console', (msg) => {
  if (msg.type() === 'error') console.log('CONSOLE', msg.text());
});

await page.goto('http://127.0.0.1:4321/', { waitUntil: 'networkidle' });
const menu = page.locator('button', { hasText: 'Menu' });
console.log({
  menuCount: await menu.count(),
  menuVisible: await menu.isVisible().catch((e) => String(e)),
  menuDisplay: await menu
    .evaluate((el) => getComputedStyle(el).display)
    .catch((e) => String(e)),
  roleCount: await page.getByRole('button', { name: 'Menu' }).count(),
});

await page.goto('http://127.0.0.1:4321/products/daybreak-mug-set/', { waitUntil: 'networkidle' });
await page.getByRole('button', { name: /Add to demo cart/i }).first().click();
await page.waitForTimeout(800);
console.log({
  dialogs: await page.getByRole('dialog').count(),
  hpUi: await page.evaluate(() => window.__hpUi),
  dialogText: await page.locator('[role="dialog"]').allTextContents(),
});

await browser.close();
