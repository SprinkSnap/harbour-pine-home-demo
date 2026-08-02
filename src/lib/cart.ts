import { getProductById } from '../data/products';
import { calcLineTotal, estimateDemoShipping, estimateDemoTax, roundMoney, sumMoney } from './money';

export interface CartItem {
  productId: string;
  variantId: string;
  quantity: number;
}

export interface CartLine extends CartItem {
  name: string;
  slug: string;
  image: string;
  imageAlt: string;
  variantLabel: string;
  unitPrice: number;
  lineTotal: number;
  available: boolean;
}

export interface CartTotals {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  itemCount: number;
}

export const CART_STORAGE_KEY = 'hp-demo-cart-v1';
export const WISHLIST_STORAGE_KEY = 'hp-demo-wishlist-v1';

export function normalizeCart(items: CartItem[]): CartItem[] {
  const map = new Map<string, CartItem>();
  for (const item of items) {
    if (!item.productId || !item.variantId || item.quantity < 1) continue;
    const key = `${item.productId}:${item.variantId}`;
    const existing = map.get(key);
    if (existing) {
      existing.quantity = Math.min(10, existing.quantity + item.quantity);
    } else {
      map.set(key, { ...item, quantity: Math.min(10, item.quantity) });
    }
  }
  return [...map.values()];
}

export function toCartLines(items: CartItem[]): CartLine[] {
  return normalizeCart(items)
    .map((item) => {
      const product = getProductById(item.productId);
      if (!product) return null;
      const variant = product.variants.find((entry) => entry.id === item.variantId) ?? product.variants[0];
      if (!variant) return null;
      return {
        ...item,
        variantId: variant.id,
        name: product.name,
        slug: product.slug,
        image: product.images[0]?.src ?? '/images/products/placeholder.svg',
        imageAlt: product.imageAlt,
        variantLabel: variant.label,
        unitPrice: product.price,
        lineTotal: calcLineTotal(product.price, item.quantity),
        available: product.available && variant.available,
      } satisfies CartLine;
    })
    .filter((line): line is CartLine => Boolean(line));
}

export function getCartTotals(items: CartItem[]): CartTotals {
  const lines = toCartLines(items);
  const subtotal = sumMoney(lines.map((line) => line.lineTotal));
  const shipping = estimateDemoShipping(subtotal);
  const tax = estimateDemoTax(subtotal, shipping);
  const total = roundMoney(subtotal + shipping + tax);
  const itemCount = lines.reduce((count, line) => count + line.quantity, 0);
  return { subtotal, shipping, tax, total, itemCount };
}

export function updateCartQuantity(items: CartItem[], productId: string, variantId: string, quantity: number): CartItem[] {
  if (quantity < 1) {
    return items.filter((item) => !(item.productId === productId && item.variantId === variantId));
  }
  return normalizeCart(
    items.map((item) =>
      item.productId === productId && item.variantId === variantId
        ? { ...item, quantity: Math.min(10, quantity) }
        : item,
    ),
  );
}
