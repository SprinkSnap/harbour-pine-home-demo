import { expect, test } from '@playwright/test';

test.describe('Harbour & Pine storefront', () => {
  test('homepage discloses fictional status and renders key sections', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1, name: /Thoughtful Pieces for Everyday Living/i })).toBeVisible();
    await expect(page.getByText(/fictional e-commerce demonstration/i).first()).toBeVisible();
    await expect(page.getByRole('heading', { name: /Considered Favourites/i })).toBeVisible();
    const robots = await page.locator('meta[name="robots"]').getAttribute('content');
    expect(robots).toContain('noindex');
  });

  test('collection and product routes work', async ({ page }) => {
    await page.goto('/collections/living/');
    await expect(page.getByRole('heading', { level: 1, name: 'Living' })).toBeVisible();
    await page.goto('/products/cedar-cove-throw/');
    await expect(page.getByRole('heading', { level: 1, name: 'Cedar Cove Throw' })).toBeVisible();
    await expect(page.getByText(/Sample shipping information/i)).toBeVisible();
  });

  test('search and filters return products', async ({ page }) => {
    await page.goto('/search/?q=tray');
    await expect(page.getByText(/result/i).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /tray/i }).first()).toBeVisible();
  });

  test('wishlist, cart and checkout demo flow', async ({ page }) => {
    await page.goto('/products/daybreak-mug-set/');
    await page.getByRole('button', { name: /Add to demo cart/i }).first().click();
    await expect(page.getByRole('dialog', { name: /Demo cart/i })).toBeVisible();
    await page.getByRole('link', { name: /Continue to demo checkout/i }).click();
    await expect(page.getByRole('heading', { name: /Checkout demonstration/i })).toBeVisible();
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByRole('button', { name: /Complete demo checkout/i }).click();
    await expect(page.getByText(/You’ve completed the Harbour & Pine checkout demonstration/i)).toBeVisible();
  });

  test('mobile menu opens and restores focus', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    const menuButton = page.getByRole('button', { name: 'Menu' });
    await menuButton.click();
    await expect(page.getByRole('navigation', { name: 'Mobile' })).toBeVisible();
    await page.getByRole('button', { name: 'Close' }).click();
    await expect(page.getByRole('navigation', { name: 'Mobile' })).toHaveCount(0);
  });
});
