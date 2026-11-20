export function formatPrice(amount: number | string): string {
  if (typeof amount === 'string' && amount.startsWith('₹')) {
    return amount;
  }
  const numeric = typeof amount === 'number' ? amount : Number(String(amount).replace(/[^0-9.]/g, ''));
  if (isNaN(numeric) || numeric === 0) return typeof amount === 'string' ? amount : '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(numeric);
}

export function formatDate(dateString: string): string {
  if (!dateString) return '';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}
