import { describe, expect, it } from 'vitest';
import { getDemoRobots, isDemoMode, shouldEmitProductSchema } from '../../src/lib/demo-mode';
import { sanitizeAnalyticsPayload } from '../../src/lib/analytics';

describe('demo mode and privacy helpers', () => {
  it('defaults to demo mode and noindex', () => {
    expect(isDemoMode(undefined)).toBe(true);
    expect(isDemoMode('true')).toBe(true);
    expect(isDemoMode('false')).toBe(false);
    expect(getDemoRobots()).toBe('noindex, nofollow');
    expect(shouldEmitProductSchema(true)).toBe(false);
  });

  it('redacts sensitive analytics keys', () => {
    const clean = sanitizeAnalyticsPayload({
      productId: 'hp-001',
      email: 'secret@example.com',
      name: 'Alex',
      search: 'personal query',
    });
    expect(clean.productId).toBe('hp-001');
    expect(clean.email).toBeUndefined();
    expect(clean.name).toBeUndefined();
    expect(clean.search).toBeUndefined();
  });
});
