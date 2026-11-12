import { VAT_RATE, grossFromNet, vatFromNet } from '../../lib/arajanlat/pricing';

export function formatHuf(amount: number): string {
  return new Intl.NumberFormat('hu-HU', {
    style: 'currency',
    currency: 'HUF',
    maximumFractionDigits: 0,
  }).format(amount);
}

export { VAT_RATE, vatFromNet, grossFromNet };

export function vatPercentLabel(): string {
  return `${Math.round(VAT_RATE * 100)}%`;
}

export function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat('hu-HU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}
