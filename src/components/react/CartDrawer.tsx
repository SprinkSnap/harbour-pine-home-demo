import { useEffect, useId, useRef } from 'react';
import { formatCad } from '../../lib/money';
import { useStore } from './store';

export default function CartDrawer() {
  const { cartOpen, setCartOpen, cartLines, totals, setQuantity, removeFromCart } = useStore();
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!cartOpen) return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setCartOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      previouslyFocused.current?.focus();
    };
  }, [cartOpen, setCartOpen]);

  if (!cartOpen) return null;

  return (
    <div className="fixed inset-0 z-[70]" role="presentation">
      <button
        type="button"
        className="absolute inset-0 bg-pine-dark/40"
        aria-label="Close cart drawer"
        onClick={() => setCartOpen(false)}
      />
      <aside
        className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-porcelain pb-[env(safe-area-inset-bottom)] shadow-[var(--shadow-lift)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="flex items-center justify-between border-b border-sand px-5 py-4">
          <div>
            <h2 id={titleId} className="font-display text-2xl text-pine-dark">
              Demo cart
            </h2>
            <p className="mt-1 text-sm text-charcoal/80">Demo cart—no real order will be created.</p>
          </div>
          <button ref={closeRef} type="button" className="btn btn-ghost" onClick={() => setCartOpen(false)}>
            Close
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {cartLines.length === 0 ? (
            <div className="rounded-[var(--radius-lg)] border border-dashed border-sand p-6">
              <p className="font-medium text-pine-dark">Your demo cart is empty.</p>
              <p className="mt-2 text-sm text-charcoal/80">
                Browse the collection and add a few pieces to explore the checkout flow.
              </p>
              <a href="/shop/" className="btn btn-primary mt-4 w-full" onClick={() => setCartOpen(false)}>
                Shop the collection
              </a>
            </div>
          ) : (
            <ul className="space-y-4">
              {cartLines.map((line) => (
                <li key={`${line.productId}:${line.variantId}`} className="flex gap-3 border-b border-sand/80 pb-4">
                  <img src={line.image} alt="" width={72} height={72} className="h-18 w-18 rounded-md object-cover" />
                  <div className="min-w-0 flex-1">
                    <a href={`/products/${line.slug}/`} className="font-semibold text-pine-dark hover:underline">
                      {line.name}
                    </a>
                    <p className="text-sm text-charcoal/75">{line.variantLabel}</p>
                    <p className="mt-1 text-sm font-semibold">{formatCad(line.unitPrice)}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <label className="sr-only" htmlFor={`qty-${line.productId}-${line.variantId}`}>
                        Quantity for {line.name}
                      </label>
                      <input
                        id={`qty-${line.productId}-${line.variantId}`}
                        type="number"
                        min={1}
                        max={10}
                        value={line.quantity}
                        className="w-16 rounded-md border border-charcoal/20 px-2 py-1"
                        onChange={(event) =>
                          setQuantity(line.productId, line.variantId, Number(event.target.value) || 1)
                        }
                      />
                      <button
                        type="button"
                        className="btn btn-ghost"
                        onClick={() => removeFromCart(line.productId, line.variantId)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-sand px-5 py-4">
          {cartLines.length > 0 ? (
            <>
              <dl className="space-y-1 text-sm">
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
                <div className="flex justify-between text-base font-semibold text-pine-dark">
                  <dt>Total</dt>
                  <dd>{formatCad(totals.total)}</dd>
                </div>
              </dl>
              <p className="mt-2 text-xs text-charcoal/70">Sample shipping and tax estimates for demonstration only.</p>
              <div className="mt-4 grid gap-2">
                <a href="/cart/" className="btn btn-secondary w-full" onClick={() => setCartOpen(false)}>
                  View cart
                </a>
                <a href="/checkout/" className="btn btn-primary w-full" onClick={() => setCartOpen(false)}>
                  Continue to demo checkout
                </a>
              </div>
            </>
          ) : (
            <a href="/shop/" className="btn btn-secondary w-full" onClick={() => setCartOpen(false)}>
              Continue shopping
            </a>
          )}
        </div>
      </aside>
    </div>
  );
}
