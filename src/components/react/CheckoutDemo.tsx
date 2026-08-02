import { useEffect, useMemo, useState } from 'react';
import { formatCad } from '../../lib/money';
import { trackEvent } from '../../lib/analytics';
import { useStore } from './store';

type Step = 'contact' | 'delivery' | 'shipping' | 'review' | 'complete';

const STEPS: Array<{ id: Step; label: string }> = [
  { id: 'contact', label: 'Contact' },
  { id: 'delivery', label: 'Delivery' },
  { id: 'shipping', label: 'Shipping' },
  { id: 'review', label: 'Review' },
];

function OrderSummary() {
  const { cartLines, totals } = useStore();
  return (
    <>
      <ul className="mt-4 space-y-3">
        {cartLines.map((line) => (
          <li key={`${line.productId}:${line.variantId}`} className="flex justify-between gap-3 text-sm">
            <span>
              {line.name} × {line.quantity}
              <span className="block text-charcoal/70">{line.variantLabel}</span>
            </span>
            <span>{formatCad(line.lineTotal)}</span>
          </li>
        ))}
      </ul>
      <dl className="mt-4 space-y-1 border-t border-sand pt-4 text-sm">
        <div className="flex justify-between">
          <dt>Subtotal</dt>
          <dd>{formatCad(totals.subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Sample shipping</dt>
          <dd>{formatCad(totals.shipping)}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Sample tax</dt>
          <dd>{formatCad(totals.tax)}</dd>
        </div>
        <div className="flex justify-between text-base font-semibold">
          <dt>Total</dt>
          <dd>{formatCad(totals.total)}</dd>
        </div>
      </dl>
    </>
  );
}

export default function CheckoutDemo() {
  const { cartLines, totals, clearCart } = useStore();
  const [step, setStep] = useState<Step>('contact');
  const [demoName, setDemoName] = useState('Alex Example');
  const [demoEmail, setDemoEmail] = useState('alex@example.com');
  const [method, setMethod] = useState('standard');

  useEffect(() => {
    trackEvent('demo_checkout_started', { itemCount: totals.itemCount });
  }, [totals.itemCount]);

  const stepLabel = useMemo(() => {
    switch (step) {
      case 'contact':
        return 'Contact information demonstration';
      case 'delivery':
        return 'Sample delivery method';
      case 'shipping':
        return 'Sample shipping details';
      case 'review':
        return 'Order review';
      case 'complete':
        return 'Demo completion';
    }
  }, [step]);

  const stepIndex = STEPS.findIndex((item) => item.id === step);

  if (cartLines.length === 0 && step !== 'complete') {
    return (
      <div className="surface rounded-[var(--radius-xl)] p-6">
        <h1 className="font-display text-3xl text-pine-dark">Demo checkout</h1>
        <p className="mt-3 text-charcoal/80">Add products to the demo cart before starting checkout.</p>
        <a href="/shop/" className="btn btn-primary mt-4 w-full sm:w-auto">
          Continue shopping
        </a>
      </div>
    );
  }

  if (step === 'complete') {
    return (
      <div className="surface rounded-[var(--radius-xl)] p-6 md:p-8">
        <p className="eyebrow">Demo complete</p>
        <h1 className="mt-2 font-display text-3xl text-pine-dark sm:text-4xl">
          You’ve completed the Harbour & Pine checkout demonstration.
        </h1>
        <p className="mt-4 max-w-2xl text-charcoal/80">Want a shopping experience like this for your business?</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <a href="/contact/" className="btn btn-clay w-full sm:w-auto">
            Build My Online Store
          </a>
          <a
            href="https://chexustudio.com/work/harbour-pine-home"
            className="btn btn-secondary w-full sm:w-auto"
            target="_blank"
            rel="noopener noreferrer"
          >
            View the Case Study
          </a>
          <button
            type="button"
            className="btn btn-ghost w-full sm:w-auto"
            onClick={() => {
              clearCart();
              setStep('contact');
            }}
          >
            Restart Demo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:gap-8">
      <details className="surface rounded-[var(--radius-xl)] p-4 lg:hidden">
        <summary className="cursor-pointer list-none font-semibold text-pine-dark">
          Order summary · {formatCad(totals.total)}
        </summary>
        <OrderSummary />
      </details>

      <section className="surface rounded-[var(--radius-xl)] p-5 sm:p-6">
        <p className="rounded-md bg-sand/70 px-3 py-2 text-sm text-charcoal">
          This is a portfolio demonstration. No order, shipment or payment will be created.
        </p>
        <h1 className="mt-4 font-display text-2xl text-pine-dark sm:text-3xl">Checkout demonstration</h1>
        <ol className="mt-4 flex flex-wrap gap-2" aria-label="Checkout steps">
          {STEPS.map((item, index) => {
            const current = item.id === step;
            const done = stepIndex > index;
            return (
              <li
                key={item.id}
                className={`rounded-md px-2.5 py-1 text-xs font-semibold ${
                  current ? 'bg-pine text-porcelain' : done ? 'bg-sage/40 text-pine-dark' : 'bg-linen text-charcoal/70'
                }`}
                aria-current={current ? 'step' : undefined}
              >
                {index + 1}. {item.label}
              </li>
            );
          })}
        </ol>
        <p className="mt-2 text-sm text-charcoal/75">Step: {stepLabel}</p>

        {step === 'contact' ? (
          <form
            className="mt-6 space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              setStep('delivery');
            }}
          >
            <div className="field">
              <label htmlFor="demo-name">Name (demo value)</label>
              <input id="demo-name" value={demoName} onChange={(e) => setDemoName(e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="demo-email">Email (demo value)</label>
              <input id="demo-email" type="email" value={demoEmail} onChange={(e) => setDemoEmail(e.target.value)} />
            </div>
            <p className="text-sm text-charcoal/75">
              Do not enter real personal information. Values stay in your browser and are never transmitted.
            </p>
            <button type="submit" className="btn btn-primary w-full sm:w-auto">
              Continue
            </button>
          </form>
        ) : null}

        {step === 'delivery' ? (
          <form
            className="mt-6 space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              setStep('shipping');
            }}
          >
            <fieldset className="space-y-2">
              <legend className="font-semibold text-pine-dark">Sample delivery method</legend>
              <label className="flex min-h-11 items-center gap-2">
                <input
                  type="radio"
                  name="method"
                  checked={method === 'standard'}
                  onChange={() => setMethod('standard')}
                />
                Standard sample delivery
              </label>
              <label className="flex min-h-11 items-center gap-2">
                <input
                  type="radio"
                  name="method"
                  checked={method === 'express'}
                  onChange={() => setMethod('express')}
                />
                Express sample delivery
              </label>
            </fieldset>
            <p className="text-sm text-charcoal/75">Sample shipping options for demonstration only.</p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <button type="button" className="btn btn-secondary w-full sm:w-auto" onClick={() => setStep('contact')}>
                Back
              </button>
              <button type="submit" className="btn btn-primary w-full sm:w-auto">
                Continue
              </button>
            </div>
          </form>
        ) : null}

        {step === 'shipping' ? (
          <form
            className="mt-6 space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              setStep('review');
            }}
          >
            <div className="field">
              <label htmlFor="demo-city">City (sample)</label>
              <input id="demo-city" defaultValue="Toronto" />
            </div>
            <div className="field">
              <label htmlFor="demo-province">Province (sample)</label>
              <input id="demo-province" defaultValue="ON" />
            </div>
            <div className="field">
              <label htmlFor="demo-postal">Postal code (sample)</label>
              <input id="demo-postal" defaultValue="M5V 0A0" />
            </div>
            <p className="text-sm text-charcoal/75">Sample shipping details are not stored or sent anywhere.</p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <button type="button" className="btn btn-secondary w-full sm:w-auto" onClick={() => setStep('delivery')}>
                Back
              </button>
              <button type="submit" className="btn btn-primary w-full sm:w-auto">
                Continue
              </button>
            </div>
          </form>
        ) : null}

        {step === 'review' ? (
          <div className="mt-6 space-y-4">
            <h2 className="font-display text-2xl text-pine-dark">Review demo order</h2>
            <ul className="space-y-2 text-sm">
              <li>
                Contact: {demoName} · {demoEmail}
              </li>
              <li>Delivery method: {method}</li>
            </ul>
            <p className="rounded-md bg-linen px-3 py-2 text-sm">
              Completing this step finishes the demonstration only. No payment is collected.
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <button type="button" className="btn btn-secondary w-full sm:w-auto" onClick={() => setStep('shipping')}>
                Back
              </button>
              <button
                type="button"
                className="btn btn-primary w-full sm:w-auto"
                onClick={() => {
                  trackEvent('demo_checkout_completed', { itemCount: totals.itemCount });
                  clearCart();
                  setStep('complete');
                }}
              >
                Complete demo checkout
              </button>
            </div>
          </div>
        ) : null}
      </section>

      <aside className="surface hidden h-fit rounded-[var(--radius-xl)] p-6 lg:block">
        <h2 className="font-display text-2xl text-pine-dark">Order summary</h2>
        <OrderSummary />
      </aside>
    </div>
  );
}
