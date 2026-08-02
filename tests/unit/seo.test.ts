import { describe, expect, it } from 'vitest';
import { products } from '../../src/data/products';
import { collections } from '../../src/data/collections';
import { faqs } from '../../src/data/site';
import {
  buildRobotsTxt,
  faqJsonLd,
  productJsonLd,
  collectionJsonLd,
  resolveRobots,
} from '../../src/lib/seo';
import { shouldEmitProductSchema } from '../../src/lib/demo-mode';

describe('seo helpers', () => {
  it('blocks indexing in demo mode and when forceNoindex is set', () => {
    expect(resolveRobots(true, false)).toBe('noindex, nofollow');
    expect(resolveRobots(false, true)).toBe('noindex, nofollow');
    expect(resolveRobots(false, false)).toBe('index, follow');
  });

  it('builds demo and live robots.txt', () => {
    const demo = buildRobotsTxt(true, 'https://example.com');
    expect(demo).toContain('Disallow: /');
    expect(demo).toContain('Sitemap: https://example.com/sitemap.xml');

    const live = buildRobotsTxt(false, 'https://example.com');
    expect(live).toContain('Allow: /');
    expect(live).toContain('Disallow: /cart/');
    expect(live).toContain('Disallow: /checkout/');
    expect(live).toContain('Disallow: /wishlist/');
    expect(live).toContain('Disallow: /search/');
  });

  it('emits product schema only outside demo mode', () => {
    expect(shouldEmitProductSchema(true)).toBe(false);
    expect(shouldEmitProductSchema(false)).toBe(true);

    const product = products[0];
    const schema = productJsonLd(product, 'https://example.com');
    expect(schema['@type']).toBe('Product');
    expect(schema.offers.priceCurrency).toBe('CAD');
    expect(schema.offers.url).toContain(`/products/${product.slug}/`);
  });

  it('builds FAQ and collection schema', () => {
    const faq = faqJsonLd(faqs.slice(0, 2));
    expect(faq['@type']).toBe('FAQPage');
    expect(faq.mainEntity).toHaveLength(2);

    const collection = collections[0];
    const page = collectionJsonLd(collection, 4, 'https://example.com');
    expect(page['@type']).toBe('CollectionPage');
    expect(page.numberOfItems).toBe(4);
  });
});
