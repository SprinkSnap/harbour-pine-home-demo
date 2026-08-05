/**
 * Capture recommended desktop case-study screenshots for Harbour & Pine Home.
 *
 * Viewport: 1440×900 (matches LAUNCH_CHECKLIST desktop pass at 1440).
 *
 * Recommended set from CASE_STUDY_COPY.md:
 *   1. Homepage hero
 *   2. Collection filters (desktop sidebar)
 *   3. Product page variants
 *   4. Cart drawer
 *   5. Checkout completion + Che Xu Studio CTA
 *
 * Plus supporting desktop frames:
 *   - Shop browse
 *   - Search results
 *
 * Usage:
 *   BASE_URL=http://127.0.0.1:4321 node scripts/capture-desktop-screenshots.mjs
 */
import { mkdir, copyFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium, devices } from '@playwright/test';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUT_DIR = join(ROOT, 'docs', 'case-study', 'desktop');
const ARTIFACT_DIR = '/opt/cursor/artifacts/desktop-screenshots';
const BASE_URL = (process.env.BASE_URL || 'http://127.0.0.1:4321').replace(/\/$/, '');
const VIEWPORT = { width: 1440, height: 900 };

/** @type {Array<{ id: string; title: string; why: string; path?: string }>} */
const MANIFEST = [];

async function settle(page, ms = 450) {
  await page.waitForTimeout(ms);
}

async function shot(page, id, title, why, options = {}) {
  const file = `${id}.png`;
  const dest = join(OUT_DIR, file);
  await page.screenshot({
    path: dest,
    fullPage: false,
    animations: 'disabled',
    ...options,
  });
  await copyFile(dest, join(ARTIFACT_DIR, file));
  MANIFEST.push({ id, title, why, path: `docs/case-study/desktop/${file}` });
  console.log(`✓ ${file} — ${title}`);
}

/**
 * Prepare a clean case-study frame:
 * - dismiss the sticky portfolio bar (reclaim first-viewport space)
 * - hide the assistant FAB so it does not cover CTAs
 * - keep the fictional-project disclosure
 */
async function prepareFrame(page) {
  const dismiss = page.getByRole('button', { name: /Dismiss portfolio notice/i });
  if (await dismiss.isVisible().catch(() => false)) {
    await dismiss.click();
    await settle(page, 250);
  }
  await page.addStyleTag({
    content: `
      button[aria-label="Open Che Xu Studio demo shopping assistant"] {
        display: none !important;
        visibility: hidden !important;
        pointer-events: none !important;
      }
    `,
  });
  await page.evaluate(() => {
    document
      .querySelectorAll('button[aria-label="Open Che Xu Studio demo shopping assistant"]')
      .forEach((button) => {
        button.setAttribute('hidden', '');
        button.style.display = 'none';
      });
  });
}

async function goto(page, path) {
  await page.goto(`${BASE_URL}${path}`, { waitUntil: 'networkidle', timeout: 60000 });
  await settle(page, 500);
  await prepareFrame(page);
  await settle(page, 200);
}

async function scrollToKeep(page, selector, offset = 120) {
  await page.evaluate(
    ({ selector, offset }) => {
      const el = document.querySelector(selector);
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: Math.max(0, top - offset), behavior: 'instant' });
    },
    { selector, offset },
  );
  await settle(page, 300);
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  await mkdir(ARTIFACT_DIR, { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext({
    ...devices['Desktop Chrome'],
    viewport: VIEWPORT,
    deviceScaleFactor: 2,
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();

  // 01 — Homepage hero (first viewport composition)
  await goto(page, '/');
  await page.evaluate(() => window.scrollTo(0, 0));
  await settle(page, 300);
  await shot(
    page,
    '01-homepage-hero',
    'Homepage hero',
    'Brand-first first viewport with Harbour & Pine identity, headline, CTA group, and full-bleed hero imagery at desktop width.',
  );

  // 02 — Shop browse (supporting — desktop IA)
  await goto(page, '/shop/');
  await scrollToKeep(page, 'article a[href*="/products/"], .grid article', 100);
  await shot(
    page,
    '02-shop-browse',
    'Shop browse',
    'Desktop catalogue with sidebar filters and multi-column product discovery.',
  );

  // 03 — Collection with sidebar filters (recommended)
  await goto(page, '/collections/living/');
  await scrollToKeep(page, 'form.surface, .lg\\:grid-cols-\\[280px_1fr\\], article a[href*="/products/"]', 80);
  // Prefer framing the filter sidebar + product grid together.
  await page.evaluate(() => {
    const filters = document.querySelector('form.surface');
    const grid = document.querySelector('.mt-8.grid, [class*="lg:grid-cols"]');
    const target = filters || grid;
    if (!target) return;
    const top = target.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: Math.max(0, top - 96), behavior: 'instant' });
  });
  await settle(page, 350);
  await shot(
    page,
    '03-collection-filters',
    'Collection filters',
    'Living collection with persistent desktop filter sidebar, result count, and product grid.',
  );

  // 04 — Product page variants (recommended)
  await goto(page, '/products/cedar-cove-throw/');
  const sage = page.getByRole('button', { name: /Muted Sage/i });
  if (await sage.count()) {
    await sage.first().click();
    await settle(page, 250);
  }
  await page.evaluate(() => {
    const media = document.querySelector('.product-media');
    if (!media) return;
    const top = media.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: Math.max(0, top - 88), behavior: 'instant' });
  });
  await settle(page, 350);
  await shot(
    page,
    '04-product-variants',
    'Product page variants',
    'Two-column product detail with gallery, price, colour variants, and add-to-demo-cart CTA.',
  );

  // 05 — Cart drawer (recommended)
  // Desktop PDP uses the visible "Add to demo cart" control (not the mobile sticky bar).
  await page
    .locator('div.hidden.md\\:flex, .md\\:flex')
    .getByRole('button', { name: /Add to demo cart/i })
    .first()
    .click();
  await page.getByRole('dialog', { name: /Demo cart/i }).waitFor({ state: 'visible' });
  await settle(page, 500);
  await shot(
    page,
    '05-cart-drawer',
    'Demo cart drawer',
    'Right-side demo cart with line items, totals, and continue-to-checkout — clearly marked as demo-only.',
  );

  // 06 — Checkout completion + Che Xu Studio CTA (recommended)
  await page.getByRole('link', { name: /Continue to demo checkout/i }).click();
  await page.getByRole('heading', { name: /Checkout demonstration/i }).waitFor({ state: 'visible' });
  await settle(page, 400);
  for (let i = 0; i < 3; i++) {
    await page.getByRole('button', { name: 'Continue' }).click();
    await settle(page, 350);
  }
  await page.getByRole('button', { name: /Complete demo checkout/i }).click();
  const completeHeading = page.getByRole('heading', {
    name: /You’ve completed the Harbour & Pine Home checkout demonstration/i,
  });
  await completeHeading.waitFor({ state: 'visible' });
  await prepareFrame(page);
  await page.evaluate(() => window.scrollTo(0, 0));
  await completeHeading.scrollIntoViewIfNeeded();
  await settle(page, 500);
  await shot(
    page,
    '06-checkout-complete',
    'Checkout completion + studio CTA',
    'Demo checkout complete state with Che Xu Studio primary CTA — the conversion handoff from fiction to real enquiry.',
  );

  // 07 — Search results (supporting)
  await goto(page, '/search/?q=tray');
  await page.evaluate(() => {
    const filters = document.querySelector('form.surface');
    if (!filters) {
      window.scrollTo(0, 0);
      return;
    }
    const top = filters.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: Math.max(0, top - 96), behavior: 'instant' });
  });
  await settle(page, 350);
  await shot(
    page,
    '07-search-results',
    'Search results',
    'Shareable search URL with sidebar filters and multi-column product results.',
  );

  const readme = `# Harbour & Pine — Recommended Desktop Screenshots

Captured at **1440×900** (device scale 2) against the local demo storefront.

These match the case-study recommendations in \`CASE_STUDY_COPY.md\` plus supporting desktop frames.

Portfolio chrome is dismissed and the assistant FAB is hidden so the storefront composition reads clearly for publishing. The fictional-project disclosure remains visible.

| # | File | Subject | Why it matters |
| --- | --- | --- | --- |
${MANIFEST.map((item, i) => `| ${i + 1} | \`${item.id}.png\` | ${item.title} | ${item.why} |`).join('\n')}

## Regenerate

\`\`\`bash
npm run build
npx wrangler dev --ip 127.0.0.1 --port 4321
# in another terminal:
npm run screenshots:desktop
\`\`\`

Or with an already-running server:

\`\`\`bash
BASE_URL=http://127.0.0.1:4321 npm run screenshots:desktop
\`\`\`
`;

  await writeFile(join(OUT_DIR, 'README.md'), readme);
  await writeFile(
    join(OUT_DIR, 'manifest.json'),
    JSON.stringify({ viewport: VIEWPORT, deviceScaleFactor: 2, baseUrl: BASE_URL, shots: MANIFEST }, null, 2),
  );
  await copyFile(join(OUT_DIR, 'README.md'), join(ARTIFACT_DIR, 'README.md'));
  await copyFile(join(OUT_DIR, 'manifest.json'), join(ARTIFACT_DIR, 'manifest.json'));

  await browser.close();
  console.log(`\nWrote ${MANIFEST.length} screenshots to ${OUT_DIR}`);
  console.log(`Artifacts mirrored to ${ARTIFACT_DIR}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
