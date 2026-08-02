import { formatCad } from '../../lib/money';
import { useStore } from './store';

export default function CartPageView() {
  const { cartLines, totals, setQuantity, removeFromCart, clearCart } = useStore();

  if (cartLines.length === 0) {
    return (
      <div className="surface rounded-[var(--radius-xl)] p-6">
        <h1 className="font-display text-3xl text-pine-dark">Demo cart</h1>
        <p className="mt-3 text-charcoal/80">Your demo cart is empty. No real order will be created in this demonstration.</p>
        <a href="/shop/" className="btn btn-primary mt-4">
          Continue shopping
        </a>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      <section className="surface rounded-[var(--radius-xl)] p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl text-pine-dark">Demo cart</h1>
            <p className="mt-2 text-sm text-charcoal/75">Demo cart—no real order will be created.</p>
          </div>
          <button type="button" className="btn btn-ghost" onClick={clearCart}>
            Clear cart
          </button>
        </div>
        <ul className="mt-6 space-y-4">
          {cartLines.map((line) => (
            <li key={`${line.productId}:${line.variantId}`} className="flex gap-4 border-b border-sand pb-4">
              <img src={line.image} alt="" width={96} height={96} className="h-24 w-24 rounded-md object-cover" />
              <div className="flex-1">
                <a href={`/products/${line.slug}/`} className="font-semibold text-pine-dark hover:underline">
                  {line.name}
                </a>
                <p className="text-sm text-charcoal/75">{line.variantLabel}</p>
                <p className="mt-1 font-semibold">{formatCad(line.unitPrice)}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <label className="sr-only" htmlFor={`cart-qty-${line.productId}-${line.variantId}`}>
                    Quantity for {line.name}
                  </label>
                  <input
                    id={`cart-qty-${line.productId}-${line.variantId}`}
                    type="number"
                    min={1}
                    max={10}
                    value={line.quantity}
                    className="w-20 rounded-md border border-charcoal/20 px-2 py-1"
                    onChange={(event) => setQuantity(line.productId, line.variantId, Number(event.target.value) || 1)}
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
              <p className="font-semibold">{formatCad(line.lineTotal)}</p>
            </li>
          ))}
        </ul>
      </section>
      <aside className="surface h-fit rounded-[var(--radius-xl)] p-6">
        <h2 className="font-display text-2xl text-pine-dark">Summary</h2>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt>Subtotal</dt>
            <dd>{formatCad(totals.subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Sample shipping estimate</dt>
            <dd>{formatCad(totals.shipping)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Sample tax estimate</dt>
            <dd>{formatCad(totals.tax)}</dd>
          </div>
          <div className="flex justify-between text-base font-semibold">
            <dt>Total</dt>
            <dd>{formatCad(totals.total)}</dd>
          </div>
        </dl>
        <p className="mt-3 text-xs text-charcoal/70">
          Sample shipping and availability details are illustrative only.
        </p>
        <div className="mt-4 grid gap-2">
          <a href="/checkout/" className="btn btn-primary">
            Checkout demonstration
          </a>
          <a href="/shop/" className="btn btn-secondary">
            Continue shopping
          </a>
        </div>
      </aside>
    </div>
  );
}
