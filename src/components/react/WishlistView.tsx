import { useMemo } from 'react';
import { getProductById } from '../../data/products';
import { formatCad } from '../../lib/money';
import { useStore } from './store';

export default function WishlistView() {
  const { wishlistIds, toggleWishlist, moveWishlistToCart, clearWishlist } = useStore();
  const items = useMemo(
    () => wishlistIds.map((id) => getProductById(id)).filter((product): product is NonNullable<typeof product> => Boolean(product)),
    [wishlistIds],
  );

  if (items.length === 0) {
    return (
      <div className="surface rounded-[var(--radius-xl)] p-6">
        <h1 className="font-display text-3xl text-pine-dark">Wishlist</h1>
        <p className="mt-3 text-charcoal/80">Your demonstration wishlist is empty. Save products while browsing to compare them later.</p>
        <a href="/shop/" className="btn btn-primary mt-4">
          Browse products
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl text-pine-dark">Wishlist</h1>
          <p className="mt-2 text-charcoal/80">Saved locally in your browser. No account required.</p>
        </div>
        <button type="button" className="btn btn-secondary" onClick={clearWishlist}>
          Clear wishlist
        </button>
      </div>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((product) => (
          <li key={product.id} className="surface rounded-[var(--radius-lg)] p-4">
            <a href={`/products/${product.slug}/`}>
              <div className="product-media">
                <img src={product.images[0]?.src} alt={product.imageAlt} width={600} height={600} loading="lazy" />
              </div>
              <h2 className="mt-3 text-lg font-semibold text-pine-dark">{product.name}</h2>
              <p className="text-sm text-charcoal/75">{formatCad(product.price)}</p>
            </a>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => moveWishlistToCart(product.id, product.variants[0]?.id ?? '')}
              >
                Move to cart
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => toggleWishlist(product.id)}>
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
