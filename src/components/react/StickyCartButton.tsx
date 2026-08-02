import { useEffect, useState } from 'react';
import { useStore } from './store';

const HIDDEN_PREFIXES = ['/cart', '/checkout', '/products/'];

export default function StickyCartButton() {
  const { totals, setCartOpen, cartOpen, enquiryOpen } = useStore();
  const [pathname, setPathname] = useState('');

  useEffect(() => {
    setPathname(window.location.pathname);
  }, []);

  const onUtilityRoute = HIDDEN_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  const hidden = totals.itemCount === 0 || cartOpen || enquiryOpen || onUtilityRoute;

  if (hidden) return null;

  return (
    <button
      type="button"
      className="btn btn-primary safe-fab-left z-50 shadow-[var(--shadow-lift)] md:hidden"
      aria-label={`Open demo cart, ${totals.itemCount} items`}
      onClick={() => setCartOpen(true)}
    >
      Cart ({totals.itemCount})
    </button>
  );
}
