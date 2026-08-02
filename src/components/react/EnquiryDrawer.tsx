import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  businessTypes,
  launchTimingOptions,
  primaryGoals,
  productCountOptions,
  recommendedStoreFeature,
  siteConfig,
  storeFeatures,
} from '../../data/site';
import { trackEvent } from '../../lib/analytics';
import { useStore } from './store';

type FormState = {
  name: string;
  email: string;
  businessName: string;
  businessType: (typeof businessTypes)[number];
  existingWebsite: string;
  productCount: (typeof productCountOptions)[number];
  primaryGoal: (typeof primaryGoals)[number];
  neededFeatures: string[];
  launchTiming: (typeof launchTimingOptions)[number];
  message: string;
  consent: boolean;
  website: string;
};

const initialState: FormState = {
  name: '',
  email: '',
  businessName: '',
  businessType: businessTypes[0],
  existingWebsite: '',
  productCount: productCountOptions[0],
  primaryGoal: primaryGoals[0],
  neededFeatures: [recommendedStoreFeature],
  launchTiming: launchTimingOptions[3],
  message: '',
  consent: false,
  website: '',
};

export default function EnquiryDrawer({ turnstileSiteKey = '' }: { turnstileSiteKey?: string }) {
  const { enquiryOpen, setEnquiryOpen } = useStore();
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const [form, setForm] = useState<FormState>(initialState);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  const [started, setStarted] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!enquiryOpen) return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    if (!started) {
      trackEvent('portfolio_lead_started');
      setStarted(true);
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setEnquiryOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      previouslyFocused.current?.focus();
    };
  }, [enquiryOpen, setEnquiryOpen, started]);

  if (!enquiryOpen || !mounted) return null;

  async function onSubmit(event: { preventDefault(): void }) {
    event.preventDefault();
    setStatus('submitting');
    setError('');

    const turnstileToken =
      (document.querySelector('input[name="cf-turnstile-response"]') as HTMLInputElement | null)?.value ||
      (turnstileSiteKey ? '' : 'dev-bypass');

    try {
      const response = await fetch('/api/portfolio-lead/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          turnstileToken,
        }),
      });
      if (!response.ok) {
        throw new Error('Unable to submit right now. Please try again shortly.');
      }
      setStatus('success');
      trackEvent('portfolio_lead_submitted', { source: siteConfig.sourceDemo });
      setForm(initialState);
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-[100]" role="presentation">
      <button
        type="button"
        className="absolute inset-0 bg-pine-dark/45"
        aria-label="Close enquiry drawer"
        onClick={() => setEnquiryOpen(false)}
      />
      <aside
        className="absolute inset-y-0 right-0 flex h-dvh w-full max-w-lg flex-col bg-porcelain pb-[env(safe-area-inset-bottom)] shadow-[var(--shadow-lift)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="flex items-start justify-between gap-3 border-b border-sand px-4 py-4 sm:gap-4 sm:px-5">
          <div className="min-w-0">
            <p className="eyebrow">Che Xu Studio</p>
            <h2 id={titleId} className="mt-2 font-display text-xl text-pine-dark sm:text-2xl">
              Ready to Build a Store Designed Around Your Customers?
            </h2>
            <p className="mt-2 text-sm text-charcoal/80">
              Che Xu Studio creates fast, conversion-focused online stores designed to make products easier to
              discover, understand and purchase.
            </p>
          </div>
          <button ref={closeRef} type="button" className="btn btn-ghost shrink-0" onClick={() => setEnquiryOpen(false)}>
            Close
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5">
          {status === 'success' ? (
            <div className="rounded-[var(--radius-lg)] border border-sage/50 bg-linen p-5" role="status">
              <p className="font-semibold text-pine-dark">Thanks — your store plan request was received.</p>
              <p className="mt-2 text-sm text-charcoal/80">
                Che Xu Studio will review your details. This is the only genuine lead capture in the demonstration.
              </p>
              <button type="button" className="btn btn-primary mt-4 w-full sm:w-auto" onClick={() => setEnquiryOpen(false)}>
                Continue browsing
              </button>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={onSubmit} noValidate>
              <div className="field">
                <label htmlFor="lead-name">Name</label>
                <input
                  id="lead-name"
                  name="name"
                  required
                  autoComplete="name"
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="field">
                <label htmlFor="lead-email">Email</label>
                <input
                  id="lead-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div className="field">
                <label htmlFor="lead-business">Business name (optional)</label>
                <input
                  id="lead-business"
                  name="businessName"
                  value={form.businessName}
                  onChange={(e) => setForm((prev) => ({ ...prev, businessName: e.target.value }))}
                />
              </div>
              <div className="field">
                <label htmlFor="lead-type">Business type</label>
                <select
                  id="lead-type"
                  value={form.businessType}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, businessType: e.target.value as FormState['businessType'] }))
                  }
                >
                  {businessTypes.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="lead-website">Existing website (optional)</label>
                <input
                  id="lead-website"
                  name="existingWebsite"
                  inputMode="url"
                  placeholder="https://"
                  value={form.existingWebsite}
                  onChange={(e) => setForm((prev) => ({ ...prev, existingWebsite: e.target.value }))}
                />
              </div>
              <div className="field">
                <label htmlFor="lead-count">Number of products</label>
                <select
                  id="lead-count"
                  value={form.productCount}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, productCount: e.target.value as FormState['productCount'] }))
                  }
                >
                  {productCountOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="lead-goal">Primary business goal</label>
                <select
                  id="lead-goal"
                  value={form.primaryGoal}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, primaryGoal: e.target.value as FormState['primaryGoal'] }))
                  }
                >
                  {primaryGoals.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <fieldset className="field">
                <legend className="font-semibold text-pine-dark">Required store features</legend>
                <p className="mt-1 text-sm text-charcoal/75">
                  Select what you need. The recommended option is pre-selected for most new store builds.
                </p>
                <div className="mt-3 grid gap-2">
                  {storeFeatures.map((feature) => {
                    const checked = form.neededFeatures.includes(feature);
                    const recommended = feature === recommendedStoreFeature;
                    return (
                      <label
                        key={feature}
                        className={`flex min-h-12 cursor-pointer items-start gap-3 rounded-[var(--radius-lg)] border px-3 py-3 text-sm transition ${
                          recommended
                            ? 'border-harbour/40 bg-linen/80'
                            : 'border-sand bg-porcelain'
                        } ${checked ? 'ring-1 ring-harbour/50' : ''}`}
                      >
                        <input
                          type="checkbox"
                          className="mt-0.5 h-5 w-5 shrink-0 accent-harbour"
                          checked={checked}
                          onChange={() =>
                            setForm((prev) => ({
                              ...prev,
                              neededFeatures: checked
                                ? prev.neededFeatures.filter((item) => item !== feature)
                                : [...prev.neededFeatures, feature],
                            }))
                          }
                        />
                        <span className="min-w-0 flex-1 leading-snug">
                          <span className="flex flex-wrap items-center gap-2">
                            <span className="font-semibold text-pine-dark">{feature}</span>
                            {recommended ? (
                              <span className="rounded-md bg-harbour px-2 py-0.5 text-[0.7rem] font-bold uppercase tracking-[0.06em] text-porcelain">
                                Recommended
                              </span>
                            ) : null}
                          </span>
                          {recommended ? (
                            <span className="mt-1 block text-xs text-charcoal/75">
                              Best starting point: phone-ready shopping flows plus product SEO foundations.
                            </span>
                          ) : null}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
              <div className="field">
                <label htmlFor="lead-timing">Preferred launch timing</label>
                <select
                  id="lead-timing"
                  value={form.launchTiming}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, launchTiming: e.target.value as FormState['launchTiming'] }))
                  }
                >
                  {launchTimingOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="lead-message">Message (optional)</label>
                <textarea
                  id="lead-message"
                  value={form.message}
                  onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
                />
              </div>
              <label className="flex min-h-12 cursor-pointer items-start gap-3 rounded-[var(--radius-lg)] border border-sand px-3 py-3 text-sm">
                <input
                  type="checkbox"
                  className="mt-0.5 h-5 w-5 shrink-0 accent-harbour"
                  checked={form.consent}
                  required
                  onChange={(e) => setForm((prev) => ({ ...prev, consent: e.target.checked }))}
                />
                <span className="leading-snug text-charcoal/90">
                  I consent to Che Xu Studio contacting me about store planning. My details will be stored only for
                  this enquiry.
                </span>
              </label>
              <div className="sr-only" aria-hidden="true">
                <label htmlFor="lead-hp">Website</label>
                <input
                  id="lead-hp"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.website}
                  onChange={(e) => setForm((prev) => ({ ...prev, website: e.target.value }))}
                />
              </div>
              {turnstileSiteKey ? (
                <div className="cf-turnstile" data-sitekey={turnstileSiteKey} data-theme="light" />
              ) : (
                <p className="text-xs text-charcoal/70">
                  Local development: Turnstile uses a secure bypass token when no site key is configured.
                </p>
              )}
              {status === 'error' ? (
                <p className="error" role="alert">
                  {error}
                </p>
              ) : null}
              <div className="grid gap-2 sm:grid-cols-2">
                <button type="submit" className="btn btn-clay w-full" disabled={status === 'submitting'}>
                  {status === 'submitting' ? 'Sending…' : 'Request My Store Plan'}
                </button>
                <a
                  href={siteConfig.packagesUrl}
                  className="btn btn-secondary w-full"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent('che_xu_cta_selected', { cta: 'packages' })}
                >
                  View Che Xu Studio Packages
                </a>
              </div>
            </form>
          )}
        </div>
      </aside>
    </div>,
    document.body,
  );
}
