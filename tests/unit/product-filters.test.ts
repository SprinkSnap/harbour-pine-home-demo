import { describe, expect, it } from 'vitest';
import { products } from '../../src/data/products';
import { filterProducts, recommendProducts } from '../../src/lib/product-filters';

describe('product filters', () => {
  it('filters by collection and colour', () => {
    const result = filterProducts(products, { collection: 'workspace', colour: 'pine', sort: 'price-asc' });
    expect(result.total).toBeGreaterThan(0);
    expect(result.items.every((product) => product.collection === 'workspace')).toBe(true);
  });

  it('supports search queries', () => {
    const result = filterProducts(products, { q: 'tray' });
    expect(result.total).toBeGreaterThan(0);
    expect(result.items.some((product) => product.name.toLowerCase().includes('tray'))).toBe(true);
  });

  it('recommends products without hiding catalogue alternatives', () => {
    const picks = recommendProducts(products, {
      room: 'workspace',
      productType: 'desk-tray',
      colour: 'pine',
      budget: '40-70',
    });
    expect(picks.length).toBeGreaterThan(0);
    expect(picks.length).toBeLessThanOrEqual(4);
  });
});
