import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { mobileShopLinks, navPrimary, siteConfig } from '../../data/site';
import { trackEvent } from '../../lib/analytics';
import { useStore } from './store';

function IconSearch() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M9 3.5a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11Zm0 1.5a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm6.53 9.47 1.94 1.94-1.06 1.06-1.94-1.94 1.06-1.06Z"
        fill="currentColor"
      />
    </svg>
  );
}

function IconHeart() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M10 17.2 3.8 11.4A4.1 4.1 0 0 1 10 5.3a4.1 4.1 0 0 1 6.2 6.1L10 17.2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconCart() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M3.5 4h1.7l1.1 8.2a1.5 1.5 0 0 0 1.5 1.3h6.4a1.5 1.5 0 0 0 1.5-1.2L17 7H6.2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="8.2" cy="16" r="1.1" fill="currentColor" />
      <circle cx="14.2" cy="16" r="1.1" fill="currentColor" />
    </svg>
  );
}

export default function HeaderControls() {
  const { totals, wishlistIds, setCartOpen, setEnquiryOpen } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const menuId = useId();
  const openButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const menu =
    menuOpen && mounted
      ? createPortal(
          <div className="fixed inset-0 z-[100] lg:hidden" role="presentation">
            <button
              type="button"
              className="absolute inset-0 bg-pine-dark/45"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
            />
            <nav
              id={menuId}
              className="absolute inset-y-0 left-0 flex h-dvh w-[min(100%,22rem)] flex-col bg-porcelain pb-[env(safe-area-inset-bottom)] shadow-[var(--shadow-lift)]"
              aria-label="Mobile"
            >
              <div className="flex items-center justify-between border-b border-sand px-4 py-4">
                <p className="font-display text-xl text-pine-dark">{siteConfig.shortName}</p>
                <button ref={closeButtonRef} type="button" className="btn btn-ghost" onClick={() => setMenuOpen(false)}>
                  Close
                </button>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
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
                    <a
                      href="/search/"
                      className="flex min-h-11 items-center rounded-md px-2 font-semibold"
                      onClick={() => setMenuOpen(false)}
                    >
                      Search
                    </a>
                  </li>
                  <li>
                    <a
                      href="/wishlist/"
                      className="flex min-h-11 items-center rounded-md px-2 font-semibold"
                      onClick={() => setMenuOpen(false)}
                    >
                      Wishlist ({wishlistIds.length})
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
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <div className="flex shrink-0 items-center gap-0.5 sm:gap-1 md:gap-2">
        <a
          href="/search/"
          className="btn btn-ghost hidden min-h-11 min-w-11 px-2 md:inline-flex md:px-3"
          aria-label="Search products"
        >
          <IconSearch />
          <span className="hidden lg:inline">Search</span>
        </a>
        <a
          href="/wishlist/"
          className="btn btn-ghost relative hidden min-h-11 min-w-11 px-2 md:inline-flex md:px-3"
          aria-label={`Wishlist, ${wishlistIds.length} items`}
        >
          <IconHeart />
          <span className="hidden lg:inline">Wishlist</span>
          {wishlistIds.length > 0 ? (
            <span className="pill absolute -right-0.5 -top-0.5 min-h-5 min-w-5 justify-center px-1 text-[0.7rem] lg:static lg:ml-1">
              {wishlistIds.length}
            </span>
          ) : null}
        </a>
        <button
          type="button"
          className="btn btn-ghost relative hidden min-h-11 min-w-11 px-2 md:inline-flex md:px-3"
          aria-label={`Demo cart, ${totals.itemCount} items`}
          onClick={() => setCartOpen(true)}
        >
          <IconCart />
          <span className="hidden lg:inline">Cart</span>
          {totals.itemCount > 0 ? (
            <span className="pill absolute -right-0.5 -top-0.5 min-h-5 min-w-5 justify-center px-1 text-[0.7rem] lg:static lg:ml-1">
              {totals.itemCount}
            </span>
          ) : null}
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
          className="btn btn-secondary min-h-11 px-3 lg:hidden"
          aria-expanded={menuOpen}
          aria-controls={menuId}
          onClick={() => setMenuOpen(true)}
        >
          Menu
        </button>
      </div>
      {menu}
    </>
  );
}
