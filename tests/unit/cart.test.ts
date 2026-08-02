import { describe, expect, it } from 'vitest';
import { getCartTotals, normalizeCart, toCartLines, updateCartQuantity } from '../../src/lib/cart';

describe('demo cart', () => {
  it('normalizes duplicate lines and caps quantity', () => {
    const items = normalizeCart([
      { productId: 'hp-005', variantId: 'mixed', quantity: 2 },
      { productId: 'hp-005', variantId: 'mixed', quantity: 3 },
    ]);
    expect(items).toHaveLength(1);
    expect(items[0]?.quantity).toBe(5);
  });

  it('builds lines and totals from product source of truth', () => {
    const lines = toCartLines([{ productId: 'hp-005', variantId: 'mixed', quantity: 2 }]);
    expect(lines[0]?.unitPrice).toBe(42);
    expect(lines[0]?.lineTotal).toBe(84);
    const totals = getCartTotals([{ productId: 'hp-005', variantId: 'mixed', quantity: 2 }]);
    expect(totals.subtotal).toBe(84);
    expect(totals.itemCount).toBe(2);
  });

  it('removes items when quantity drops below 1', () => {
    const next = updateCartQuantity([{ productId: 'hp-005', variantId: 'mixed', quantity: 1 }], 'hp-005', 'mixed', 0);
    expect(next).toHaveLength(0);
  });
});
