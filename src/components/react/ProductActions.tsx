import { useMemo, useState } from 'react';
import type { Product } from '../../data/types';
import { formatCad } from '../../lib/money';
import { useStore } from './store';

interface Props {
  product: Product;
  compact?: boolean;
}

export default function ProductActions({ product, compact = false }: Props) {
  const { addToCart, toggleWishlist, isWishlisted } = useStore();
  const defaultVariant = useMemo(
    () => product.variants.find((variant) => variant.available) ?? product.variants[0],
    [product.variants],
  );
  const [variantId, setVariantId] = useState(defaultVariant?.id ?? '');
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState('');
  const selected = product.variants.find((variant) => variant.id === variantId) ?? defaultVariant;
  const wishlisted = isWishlisted(product.id);
  const canAdd = Boolean(product.available && selected?.available);

  function handleAdd(qty = quantity) {
    if (!selected) return;
    addToCart(product.id, selected.id, qty);
    setStatus(`${product.name} added to demo cart`);
  }

  if (compact) {
    return (
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          className="btn btn-primary min-h-10 flex-1 px-3 text-sm sm:flex-none"
          disabled={!canAdd}
          onClick={() => handleAdd(1)}
        >
          Add to demo cart
        </button>
        <button
          type="button"
          className="btn btn-secondary min-h-10 px-3 text-sm"
          aria-pressed={wishlisted}
          onClick={() => {
            toggleWishlist(product.id);
            setStatus(wishlisted ? `${product.name} removed from wishlist` : `${product.name} saved to wishlist`);
          }}
        >
          {wishlisted ? 'Saved' : 'Wishlist'}
        </button>
        <p className="sr-only" role="status" aria-live="polite">
          {status}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-24 md:pb-0">
      <p className="text-2xl font-semibold text-pine-dark">{formatCad(product.price)} CAD</p>
      <fieldset>
        <legend className="mb-2 text-sm font-semibold text-pine-dark">Variant</legend>
        <div className="flex flex-wrap gap-2">
          {product.variants.map((variant) => {
            const active = variant.id === selected?.id;
            return (
              <button
                key={variant.id}
                type="button"
                className={`btn min-h-11 px-3 ${active ? 'btn-primary' : 'btn-secondary'}`}
                aria-pressed={active}
                disabled={!variant.available}
                onClick={() => setVariantId(variant.id)}
              >
                {variant.label}
                {!variant.available ? ' (unavailable)' : ''}
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-sm text-charcoal/75">Selected: {selected?.label ?? 'None'}</p>
      </fieldset>

      <div className="field max-w-[8rem]">
        <label htmlFor={`qty-${product.id}`}>Quantity</label>
        <input
          id={`qty-${product.id}`}
          type="number"
          min={1}
          max={10}
          value={quantity}
          onChange={(event) => setQuantity(Math.min(10, Math.max(1, Number(event.target.value) || 1)))}
        />
      </div>

      <div className="hidden flex-wrap gap-2 md:flex">
        <button type="button" className="btn btn-primary" disabled={!canAdd} onClick={() => handleAdd()}>
          Add to demo cart
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          aria-pressed={wishlisted}
          onClick={() => {
            toggleWishlist(product.id);
            setStatus(wishlisted ? `${product.name} removed from wishlist` : `${product.name} saved to wishlist`);
          }}
        >
          {wishlisted ? 'Saved to wishlist' : 'Save to wishlist'}
        </button>
      </div>
      <p className="hidden text-sm text-charcoal/75 md:block">Demo cart only — no real order or payment will be created.</p>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-sand bg-porcelain/95 px-4 py-3 pr-[7.5rem] shadow-[var(--shadow-lift)] backdrop-blur-md md:hidden safe-bottom">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="btn btn-secondary min-h-11 min-w-11 px-3"
            aria-label={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
            aria-pressed={wishlisted}
            onClick={() => {
              toggleWishlist(product.id);
              setStatus(wishlisted ? `${product.name} removed from wishlist` : `${product.name} saved to wishlist`);
            }}
          >
            {wishlisted ? 'Saved' : 'Save'}
          </button>
          <button type="button" className="btn btn-primary min-h-11 flex-1" disabled={!canAdd} onClick={() => handleAdd()}>
            Add · {formatCad(product.price)}
          </button>
        </div>
        <p className="mx-auto mt-2 max-w-lg text-center text-xs text-charcoal/70">Demo cart only — no payment.</p>
      </div>

      <p className="sr-only" role="status" aria-live="polite">
        {status}
      </p>
    </div>
  );
}
