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

  if (compact) {
    return (
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          className="btn btn-primary min-h-10 px-3 text-sm"
          disabled={!product.available || !selected?.available}
          onClick={() => {
            if (!selected) return;
            addToCart(product.id, selected.id, 1);
            setStatus(`${product.name} added to demo cart`);
          }}
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
    <div className="space-y-4">
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

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="btn btn-primary"
          disabled={!product.available || !selected?.available}
          onClick={() => {
            if (!selected) return;
            addToCart(product.id, selected.id, quantity);
            setStatus(`${product.name} added to demo cart`);
          }}
        >
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
      <p className="text-sm text-charcoal/75">Demo cart only — no real order or payment will be created.</p>
      <p className="sr-only" role="status" aria-live="polite">
        {status}
      </p>
    </div>
  );
}
