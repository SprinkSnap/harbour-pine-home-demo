export type AnalyticsEventName =
  | 'demo_viewed'
  | 'collection_viewed'
  | 'product_viewed'
  | 'search_used'
  | 'filter_used'
  | 'wishlist_item_added'
  | 'add_to_demo_cart'
  | 'remove_from_demo_cart'
  | 'demo_checkout_started'
  | 'demo_checkout_completed'
  | 'che_xu_cta_selected'
  | 'portfolio_lead_started'
  | 'portfolio_lead_submitted'
  | 'case_study_selected'
  | 'chat_opened';

export type AnalyticsPayload = Record<string, string | number | boolean | undefined>;

const SENSITIVE_KEYS = /name|email|address|phone|message|card|password|search/i;

export function sanitizeAnalyticsPayload(payload: AnalyticsPayload = {}): AnalyticsPayload {
  const clean: AnalyticsPayload = {};
  for (const [key, value] of Object.entries(payload)) {
    if (SENSITIVE_KEYS.test(key)) continue;
    if (typeof value === 'string' && value.length > 80) {
      clean[key] = value.slice(0, 80);
      continue;
    }
    clean[key] = value;
  }
  return clean;
}

export function trackEvent(name: AnalyticsEventName, payload: AnalyticsPayload = {}): void {
  if (typeof window === 'undefined') return;
  const detail = { name, payload: sanitizeAnalyticsPayload(payload), at: Date.now() };
  window.dispatchEvent(new CustomEvent('hp:analytics', { detail }));
  const w = window as Window & { __hpAnalytics?: Array<typeof detail> };
  w.__hpAnalytics = w.__hpAnalytics ?? [];
  w.__hpAnalytics.push(detail);
}
