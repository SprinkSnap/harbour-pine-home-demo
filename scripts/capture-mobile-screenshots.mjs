/**
 * Capture recommended mobile case-study screenshots for Harbour & Pine Home.
 *
 * Viewport: 390×844 (iPhone 12/13/14 class — matches LAUNCH_CHECKLIST mobile pass).
 *
 * Recommended set from CASE_STUDY_COPY.md:
 *   1. Homepage hero
 *   2. Collection with filters sheet
 *   3. Product page variants
 *   4. Cart drawer
 *   5. Checkout completion + Che Xu Studio CTA
 *
 * Plus supporting mobile frames:
 *   - Mobile navigation
 *   - Collection browse (product cards)
 *   - Search results
 *
 * Usage:
 *   BASE_URL=http://127.0.0.1:4321 node scripts/capture-mobile-screenshots.mjs
 */
import { mkdir, copyFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium, devices } from '@playwright/test';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUT_DIR = join(ROOT, 'docs', 'case-study', 'mobile');
const ARTIFACT_DIR = '/opt/cursor/artifacts/mobile-screenshots';
const BASE_URL = (process.env.BASE_URL || 'http://127.0.0.1:4321').replace(/\/$/, '');
const VIEWPORT = { width: 390, height: 844 };

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
  MANIFEST.push({ id, title, why, path: `docs/case-study/mobile/${file}` });
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
    ...devices['iPhone 13'],
    viewport: VIEWPORT,
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
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
    'Brand-first first viewport with Harbour & Pine identity, headline, CTA group, and full-bleed hero imagery.',
  );

  // 02 — Mobile navigation
  await page.getByRole('banner').getByRole('button', { name: /Open menu/i }).click();
  await page.getByRole('navigation', { name: 'Mobile' }).waitFor({ state: 'visible' });
  await settle(page);
  await shot(
    page,
    '02-mobile-navigation',
    'Mobile navigation',
    'Full-height accessible menu with shop links and clear close affordance.',
  );
  await page.getByRole('navigation', { name: 'Mobile' }).getByRole('button', { name: /Close menu/i }).click();
  await settle(page, 300);

  // 03 — Collection browse (show product cards)
  await goto(page, '/collections/living/');
  await scrollToKeep(page, 'article a[href*="/products/"], ul li a[href*="/products/"]', 72);
  await shot(
    page,
    '03-collection-browse',
    'Collection browse',
    'Living collection with product cards, filters entry point, and calm mobile spacing.',
  );

  // 04 — Collection filters sheet (recommended)
  await page.evaluate(() => window.scrollTo(0, 0));
  await settle(page, 200);
  await page.getByRole('button', { name: /Filters & sort/i }).click();
  await page.getByRole('dialog', { name: /Filters & sort/i }).waitFor({ state: 'visible' });
  await settle(page);
  await shot(
    page,
    '04-collection-filters',
    'Collection filters',
    'Bottom-sheet filter & sort controls for search, category, colour, price, availability, and sort.',
  );
  await page.getByRole('dialog', { name: /Filters & sort/i }).getByRole('button', { name: /^Close$/i }).click();
  await settle(page, 300);

  // 05 — Product page variants (recommended)
  // Keep a readable band of the gallery while revealing title + variant chips + sticky CTA.
  await goto(page, '/products/cedar-cove-throw/');
  const sage = page.getByRole('button', { name: /Muted Sage/i });
  if (await sage.count()) {
    await sage.first().click();
    await settle(page, 250);
  }
  await page.evaluate(() => {
    const media = document.querySelector('.product-media');
    if (!media) return;
    const absoluteTop = media.getBoundingClientRect().top + window.scrollY;
    // Leave ~280px of product imagery under the sticky header.
    window.scrollTo({ top: Math.max(0, absoluteTop + media.clientHeight - 280), behavior: 'instant' });
  });
  await settle(page, 350);
  await shot(
    page,
    '05-product-variants',
    'Product page variants',
    'Product detail with image, price, colour variants, materials cues, and sticky add-to-demo-cart CTA.',
  );

  // 06 — Cart drawer (recommended)
  // Mobile PDP uses a sticky bar CTA ("Add · $…"); desktop "Add to demo cart" is md:hidden.
  await page.locator('.fixed.bottom-0').getByRole('button', { name: /^Add ·/i }).click();
  await page.getByRole('dialog', { name: /Demo cart/i }).waitFor({ state: 'visible' });
  await settle(page, 500);
  await shot(
    page,
    '06-cart-drawer',
    'Demo cart drawer',
    'Persistent demo cart with line items, totals, and continue-to-checkout path — clearly marked as demo-only.',
  );

  // 07 — Checkout completion + Che Xu Studio CTA (recommended)
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
    '07-checkout-complete',
    'Checkout completion + studio CTA',
    'Demo checkout complete state with Che Xu Studio primary CTA — the conversion handoff from fiction to real enquiry.',
  );

  // 08 — Search results (supporting)
  await goto(page, '/search/?q=tray');
  await scrollToKeep(page, 'a[href*="/products/"]', 200);
  await shot(
    page,
    '08-search-results',
    'Search results',
    'Shareable search URL with result summary and product discovery on a small screen.',
  );

  const readme = `# Harbour & Pine — Recommended Mobile Screenshots

Captured at **390×844** (device scale 2) against the local demo storefront.

These match the case-study recommendations in \`CASE_STUDY_COPY.md\` plus supporting mobile frames.

Portfolio chrome is dismissed and the assistant FAB is hidden so the storefront composition reads clearly for publishing. The fictional-project disclosure remains visible.

| # | File | Subject | Why it matters |
| --- | --- | --- | --- |
${MANIFEST.map((item, i) => `| ${i + 1} | \`${item.id}.png\` | ${item.title} | ${item.why} |`).join('\n')}

## Regenerate

\`\`\`bash
npm run build
npx wrangler dev --ip 127.0.0.1 --port 4321
# in another terminal:
npm run screenshots:mobile
\`\`\`

Or with an already-running server:

\`\`\`bash
BASE_URL=http://127.0.0.1:4321 npm run screenshots:mobile
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
