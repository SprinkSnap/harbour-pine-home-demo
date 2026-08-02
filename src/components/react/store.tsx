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
  let snapshot = typeof window === 'undefined' ? (null as T | null) : read();

  const emit = () => {
    listeners.forEach((listener) => listener());
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('hp:storage', { detail: { key } }));
    }
  };

  const refresh = () => {
    snapshot = read();
    emit();
  };

  return {
    subscribe(listener: Listener) {
      listeners.add(listener);
      const onEvent = (event: Event) => {
        const detail = (event as CustomEvent<{ key?: string }>).detail;
        if (!detail?.key || detail.key === key) {
          snapshot = read();
          listener();
        }
      };
      const onStorage = (event: StorageEvent) => {
        if (event.key === key) {
          snapshot = read();
          listener();
        }
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
      if (snapshot === null && typeof window !== 'undefined') {
        snapshot = read();
      }
      return snapshot as T;
    },
    set(value: T) {
      write(value);
      snapshot = value;
      emit();
    },
    refresh,
  };
}

type UiState = { cartOpen: boolean; enquiryOpen: boolean };

function getUiState(): UiState {
  if (typeof window === 'undefined') return { cartOpen: false, enquiryOpen: false };
  const w = window as Window & { __hpUi?: UiState };
  w.__hpUi = w.__hpUi ?? { cartOpen: false, enquiryOpen: false };
  return w.__hpUi;
}

function setUiStateValue(value: UiState) {
  if (typeof window === 'undefined') return;
  const w = window as Window & { __hpUi?: UiState };
  w.__hpUi = value;
  document.body.classList.toggle('is-drawer-open', value.cartOpen || value.enquiryOpen);
}

const emptyCart: CartItem[] = [];
const emptyWishlist: string[] = [];
const emptyUi: UiState = { cartOpen: false, enquiryOpen: false };

const cartStore = createBrowserStore<CartItem[]>(
  CART_STORAGE_KEY,
  () => (typeof window === 'undefined' ? emptyCart : normalizeCart(readJson<CartItem[]>(CART_STORAGE_KEY, []))),
  (value) => writeJson(CART_STORAGE_KEY, normalizeCart(value)),
);

const wishlistStore = createBrowserStore<string[]>(
  WISHLIST_STORAGE_KEY,
  () => (typeof window === 'undefined' ? emptyWishlist : [...new Set(readJson<string[]>(WISHLIST_STORAGE_KEY, []))]),
  (value) => writeJson(WISHLIST_STORAGE_KEY, [...new Set(value)]),
);

const uiStore = createBrowserStore<UiState>(
  'hp-demo-ui-v1',
  () => getUiState(),
  (value) => setUiStateValue(value),
);

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
  const cartItems = useSyncExternalStore(cartStore.subscribe, cartStore.getSnapshot, () => emptyCart);
  const wishlistIds = useSyncExternalStore(wishlistStore.subscribe, wishlistStore.getSnapshot, () => emptyWishlist);
  const ui = useSyncExternalStore(uiStore.subscribe, uiStore.getSnapshot, () => emptyUi);

  useEffect(() => {
    if (trackedPath === window.location.pathname) return;
    trackedPath = window.location.pathname;
    trackEvent('demo_viewed', { page: trackedPath });
  }, []);

  const cartLines = useMemo(() => toCartLines(cartItems), [cartItems]);
  const totals = useMemo(() => getCartTotals(cartItems), [cartItems]);

  const setCartOpen = useCallback((open: boolean) => {
    uiStore.set({ ...uiStore.getSnapshot(), cartOpen: open });
  }, []);

  const setEnquiryOpen = useCallback((open: boolean) => {
    uiStore.set({ ...uiStore.getSnapshot(), enquiryOpen: open });
  }, []);

  const addToCart = useCallback((productId: string, variantId: string, quantity = 1) => {
    cartStore.set(normalizeCart([...cartStore.getSnapshot(), { productId, variantId, quantity }]));
    trackEvent('add_to_demo_cart', { productId, variantId, quantity });
    uiStore.set({ ...uiStore.getSnapshot(), cartOpen: true });
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
    setCartOpen,
    setEnquiryOpen,
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
  uiStore.set({ ...uiStore.getSnapshot(), enquiryOpen: true });
}

export function openCartDrawer() {
  uiStore.set({ ...uiStore.getSnapshot(), cartOpen: true });
}
