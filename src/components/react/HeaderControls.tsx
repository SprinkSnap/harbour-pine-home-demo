import { useEffect, useId, useRef, useState } from 'react';
import { mobileShopLinks, navPrimary, siteConfig } from '../../data/site';
import { trackEvent } from '../../lib/analytics';
import { useStore } from './store';

export default function HeaderControls() {
  const { totals, wishlistIds, setCartOpen, setEnquiryOpen } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();
  const openButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    document.body.classList.toggle('is-nav-open', menuOpen);
    return () => document.body.classList.remove('is-nav-open');
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      (previouslyFocused.current ?? openButtonRef.current)?.focus();
    };
  }, [menuOpen]);

  return (
    <>
      <div className="flex items-center gap-1 sm:gap-2">
        <a href="/search/" className="btn btn-ghost min-h-11 px-3" aria-label="Search products">
          Search
        </a>
        <a href="/wishlist/" className="btn btn-ghost min-h-11 px-3" aria-label={`Wishlist, ${wishlistIds.length} items`}>
          Wishlist
          <span className="pill">{wishlistIds.length}</span>
        </a>
        <button
          type="button"
          className="btn btn-ghost min-h-11 px-3"
          aria-label={`Demo cart, ${totals.itemCount} items`}
          onClick={() => setCartOpen(true)}
        >
          Cart
          <span className="pill">{totals.itemCount}</span>
        </button>
        <button
          type="button"
          className="btn btn-clay hidden min-h-11 lg:inline-flex"
          onClick={() => {
            trackEvent('che_xu_cta_selected', { cta: 'header' });
            setEnquiryOpen(true);
          }}
        >
          Build a Store Like This
        </button>
        <button
          ref={openButtonRef}
          type="button"
          className="btn btn-secondary min-h-11 lg:hidden"
          aria-expanded={menuOpen}
          aria-controls={menuId}
          onClick={() => setMenuOpen(true)}
        >
          Menu
        </button>
      </div>

      {menuOpen ? (
        <div className="fixed inset-0 z-[75] lg:hidden" role="presentation">
          <button
            type="button"
            className="absolute inset-0 bg-pine-dark/45"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          />
          <nav
            id={menuId}
            className="absolute inset-y-0 left-0 flex w-[min(100%,22rem)] flex-col bg-porcelain shadow-[var(--shadow-lift)]"
            aria-label="Mobile"
          >
            <div className="flex items-center justify-between border-b border-sand px-4 py-4">
              <p className="font-display text-xl text-pine-dark">{siteConfig.shortName}</p>
              <button ref={closeButtonRef} type="button" className="btn btn-ghost" onClick={() => setMenuOpen(false)}>
                Close
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-4">
              <p className="eyebrow">Shop</p>
              <ul className="mt-3 space-y-1">
                {mobileShopLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="flex min-h-11 items-center rounded-md px-2 text-base font-semibold text-pine-dark hover:bg-linen"
                      onClick={() => setMenuOpen(false)}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
              <p className="eyebrow mt-6">Explore</p>
              <ul className="mt-3 space-y-1">
                {navPrimary.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="flex min-h-11 items-center rounded-md px-2 text-base font-semibold text-pine-dark hover:bg-linen"
                      onClick={() => setMenuOpen(false)}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
                <li>
                  <a href="/search/" className="flex min-h-11 items-center rounded-md px-2 font-semibold" onClick={() => setMenuOpen(false)}>
                    Search
                  </a>
                </li>
                <li>
                  <a href="/wishlist/" className="flex min-h-11 items-center rounded-md px-2 font-semibold" onClick={() => setMenuOpen(false)}>
                    Wishlist
                  </a>
                </li>
                <li>
                  <button
                    type="button"
                    className="flex min-h-11 w-full items-center rounded-md px-2 text-left font-semibold"
                    onClick={() => {
                      setMenuOpen(false);
                      setCartOpen(true);
                    }}
                  >
                    Cart ({totals.itemCount})
                  </button>
                </li>
              </ul>
            </div>
            <div className="border-t border-sand p-4">
              <button
                type="button"
                className="btn btn-clay w-full"
                onClick={() => {
                  setMenuOpen(false);
                  trackEvent('che_xu_cta_selected', { cta: 'mobile-menu' });
                  setEnquiryOpen(true);
                }}
              >
                Build a Store Like This
              </button>
            </div>
          </nav>
        </div>
      ) : null}
    </>
  );
}
