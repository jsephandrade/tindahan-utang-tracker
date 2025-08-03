export function parseDate(value: unknown): Date | undefined {
  if (!value) return undefined;
  const date = value instanceof Date ? value : new Date(value as string | number);
  return isNaN(date.getTime()) ? undefined : date;
}

export function formatDate(value: unknown, locale?: string): string {
  const date = parseDate(value);
  return date ? date.toLocaleDateString(locale) : '—';
}
