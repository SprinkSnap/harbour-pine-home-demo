const cadFormatter = new Intl.NumberFormat('en-CA', {
  style: 'currency',
  currency: 'CAD',
  currencyDisplay: 'symbol',
});

export function formatCad(amount: number): string {
  return cadFormatter.format(amount);
}

export function calcLineTotal(unitPrice: number, quantity: number): number {
  return roundMoney(unitPrice * quantity);
}

export function sumMoney(values: number[]): number {
  return roundMoney(values.reduce((total, value) => total + value, 0));
}

export function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/** Sample estimates for demo checkout only — not real tax or shipping. */
export function estimateDemoShipping(subtotal: number): number {
  if (subtotal <= 0) return 0;
  if (subtotal >= 150) return 0;
  return 12;
}

export function estimateDemoTax(subtotal: number, shipping: number): number {
  return roundMoney((subtotal + shipping) * 0.13);
}
