import { useCallback, useEffect, useMemo, useSyncExternalStore } from 'react';
import {
  CART_STORAGE_KEY,
  WISHLIST_STORAGE_KEY,
  getCartTotals,
  normalizeCart,
  toCartLines,
  updateCartQuantity,
  type CartItem,
  type CartLine,
  type CartTotals,
} from '../../lib/cart';
import { trackEvent } from '../../lib/analytics';

type Listener = () => void;

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function createBrowserStore<T>(key: string, read: () => T, write: (value: T) => void) {
  const listeners = new Set<Listener>();

  const notify = () => {
    listeners.forEach((listener) => listener());
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('hp:storage', { detail: { key } }));
    }
  };

  return {
    subscribe(listener: Listener) {
      listeners.add(listener);
      const onEvent = (event: Event) => {
        const detail = (event as CustomEvent<{ key?: string }>).detail;
        if (!detail?.key || detail.key === key) listener();
      };
      const onStorage = (event: StorageEvent) => {
        if (event.key === key) listener();
      };
      if (typeof window !== 'undefined') {
        window.addEventListener('hp:storage', onEvent as EventListener);
        window.addEventListener('storage', onStorage);
      }
      return () => {
        listeners.delete(listener);
        if (typeof window !== 'undefined') {
          window.removeEventListener('hp:storage', onEvent as EventListener);
          window.removeEventListener('storage', onStorage);
        }
      };
    },
    getSnapshot() {
      return read();
    },
    set(value: T) {
      write(value);
      notify();
    },
  };
}

const cartStore = createBrowserStore<CartItem[]>(
  CART_STORAGE_KEY,
  () => normalizeCart(readJson<CartItem[]>(CART_STORAGE_KEY, [])),
  (value) => writeJson(CART_STORAGE_KEY, normalizeCart(value)),
);

const wishlistStore = createBrowserStore<string[]>(
  WISHLIST_STORAGE_KEY,
  () => [...new Set(readJson<string[]>(WISHLIST_STORAGE_KEY, []))],
  (value) => writeJson(WISHLIST_STORAGE_KEY, [...new Set(value)]),
);

type UiState = { cartOpen: boolean; enquiryOpen: boolean };
const uiListeners = new Set<Listener>();
let uiState: UiState = { cartOpen: false, enquiryOpen: false };

function setUiState(next: Partial<UiState>) {
  uiState = { ...uiState, ...next };
  uiListeners.forEach((listener) => listener());
  if (typeof document !== 'undefined') {
    document.body.classList.toggle('is-drawer-open', uiState.cartOpen || uiState.enquiryOpen);
  }
}

export interface StoreApi {
  cartItems: CartItem[];
  cartLines: CartLine[];
  totals: CartTotals;
  wishlistIds: string[];
  cartOpen: boolean;
  enquiryOpen: boolean;
  setCartOpen: (open: boolean) => void;
  setEnquiryOpen: (open: boolean) => void;
  addToCart: (productId: string, variantId: string, quantity?: number) => void;
  removeFromCart: (productId: string, variantId: string) => void;
  setQuantity: (productId: string, variantId: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  moveWishlistToCart: (productId: string, variantId: string) => void;
  clearWishlist: () => void;
  isWishlisted: (productId: string) => boolean;
}

let trackedPath: string | null = null;

export function useStore(): StoreApi {
  const cartItems = useSyncExternalStore(cartStore.subscribe, cartStore.getSnapshot, () => [] as CartItem[]);
  const wishlistIds = useSyncExternalStore(wishlistStore.subscribe, wishlistStore.getSnapshot, () => [] as string[]);
  const ui = useSyncExternalStore(
    (listener) => {
      uiListeners.add(listener);
      return () => uiListeners.delete(listener);
    },
    () => uiState,
    () => ({ cartOpen: false, enquiryOpen: false }),
  );

  useEffect(() => {
    if (trackedPath === window.location.pathname) return;
    trackedPath = window.location.pathname;
    trackEvent('demo_viewed', { page: trackedPath });
  }, []);

  const cartLines = useMemo(() => toCartLines(cartItems), [cartItems]);
  const totals = useMemo(() => getCartTotals(cartItems), [cartItems]);

  const addToCart = useCallback((productId: string, variantId: string, quantity = 1) => {
    cartStore.set([...cartStore.getSnapshot(), { productId, variantId, quantity }]);
    trackEvent('add_to_demo_cart', { productId, variantId, quantity });
    setUiState({ cartOpen: true });
  }, []);

  const removeFromCart = useCallback((productId: string, variantId: string) => {
    cartStore.set(
      cartStore.getSnapshot().filter((item) => !(item.productId === productId && item.variantId === variantId)),
    );
    trackEvent('remove_from_demo_cart', { productId, variantId });
  }, []);

  const setQuantity = useCallback((productId: string, variantId: string, quantity: number) => {
    cartStore.set(updateCartQuantity(cartStore.getSnapshot(), productId, variantId, quantity));
  }, []);

  const clearCart = useCallback(() => cartStore.set([]), []);

  const toggleWishlist = useCallback((productId: string) => {
    const current = wishlistStore.getSnapshot();
    if (current.includes(productId)) {
      wishlistStore.set(current.filter((id) => id !== productId));
    } else {
      wishlistStore.set([...current, productId]);
      trackEvent('wishlist_item_added', { productId });
    }
  }, []);

  const moveWishlistToCart = useCallback(
    (productId: string, variantId: string) => {
      addToCart(productId, variantId, 1);
      wishlistStore.set(wishlistStore.getSnapshot().filter((id) => id !== productId));
    },
    [addToCart],
  );

  const clearWishlist = useCallback(() => wishlistStore.set([]), []);
  const isWishlisted = useCallback((productId: string) => wishlistIds.includes(productId), [wishlistIds]);

  return {
    cartItems,
    cartLines,
    totals,
    wishlistIds,
    cartOpen: ui.cartOpen,
    enquiryOpen: ui.enquiryOpen,
    setCartOpen: (open) => setUiState({ cartOpen: open }),
    setEnquiryOpen: (open) => setUiState({ enquiryOpen: open }),
    addToCart,
    removeFromCart,
    setQuantity,
    clearCart,
    toggleWishlist,
    moveWishlistToCart,
    clearWishlist,
    isWishlisted,
  };
}

export function openEnquiryDrawer() {
  setUiState({ enquiryOpen: true });
}

export function openCartDrawer() {
  setUiState({ cartOpen: true });
}
