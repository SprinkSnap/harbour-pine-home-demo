import { describe, expect, it } from 'vitest';
import { portfolioLeadSchema, redactLeadForLogs } from '../../src/lib/lead-schema';

describe('portfolio lead schema', () => {
  it('accepts a valid consented payload', () => {
    const parsed = portfolioLeadSchema.safeParse({
      name: 'Jordan Lee',
      email: 'jordan@example.com',
      businessName: 'Example Goods',
      businessType: 'Home & lifestyle brand',
      existingWebsite: 'https://example.com',
      productCount: '26–100',
      primaryGoal: 'Launch a new online store',
      neededFeatures: ['Product variants', 'Search and filtering'],
      launchTiming: '1–2 months',
      message: 'Looking for a calm storefront.',
      consent: true,
      website: '',
      turnstileToken: 'dev-bypass',
    });
    expect(parsed.success).toBe(true);
  });

  it('rejects missing consent and redacts personal fields in logs', () => {
    const parsed = portfolioLeadSchema.safeParse({
      name: 'Jordan Lee',
      email: 'jordan@example.com',
      businessType: 'Home & lifestyle brand',
      productCount: '26–100',
      primaryGoal: 'Launch a new online store',
      neededFeatures: [],
      launchTiming: 'Exploring options',
      consent: false,
      turnstileToken: 'dev-bypass',
    });
    expect(parsed.success).toBe(false);
    const redacted = redactLeadForLogs({
      name: 'Jordan Lee',
      email: 'jordan@example.com',
      businessType: 'Home & lifestyle brand',
      consent: true,
      neededFeatures: ['Product variants'],
    });
    expect(redacted).not.toHaveProperty('name');
    expect(redacted).not.toHaveProperty('email');
  });
});
