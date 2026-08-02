import { useEffect, useState } from 'react';
import CartIcon, { CartCountBadge } from './CartIcon';
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
      className="btn btn-primary safe-fab-left z-50 gap-2 px-3.5 shadow-[var(--shadow-lift)] md:hidden"
      aria-label={`Open demo cart, ${totals.itemCount} ${totals.itemCount === 1 ? 'item' : 'items'}`}
      onClick={() => setCartOpen(true)}
    >
      <span className="relative inline-flex">
        <CartIcon size={22} active />
        <CartCountBadge count={totals.itemCount} className="absolute -right-2 -top-2" />
      </span>
      <span className="text-sm font-semibold">Cart</span>
    </button>
  );
}
