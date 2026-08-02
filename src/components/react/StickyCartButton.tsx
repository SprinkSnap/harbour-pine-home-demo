import { useStore } from './store';

export default function StickyCartButton() {
  const { totals, setCartOpen } = useStore();
  return (
    <button
      type="button"
      className="btn btn-primary fixed bottom-4 right-4 z-50 shadow-[var(--shadow-lift)] md:hidden"
      aria-label={`Open demo cart, ${totals.itemCount} items`}
      onClick={() => setCartOpen(true)}
    >
      Cart ({totals.itemCount})
    </button>
  );
}
