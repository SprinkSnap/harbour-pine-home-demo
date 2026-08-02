import { describe, expect, it } from 'vitest';
import { calcLineTotal, estimateDemoShipping, estimateDemoTax, formatCad, sumMoney } from '../../src/lib/money';

describe('money helpers', () => {
  it('formats CAD for en-CA', () => {
    expect(formatCad(98)).toContain('98');
    expect(formatCad(98)).toMatch(/\$/);
  });

  it('calculates line totals and sums', () => {
    expect(calcLineTotal(42, 3)).toBe(126);
    expect(sumMoney([12.5, 7.5])).toBe(20);
  });

  it('estimates demo shipping and tax transparently', () => {
    expect(estimateDemoShipping(0)).toBe(0);
    expect(estimateDemoShipping(80)).toBe(12);
    expect(estimateDemoShipping(150)).toBe(0);
    expect(estimateDemoTax(100, 12)).toBe(14.56);
  });
});
