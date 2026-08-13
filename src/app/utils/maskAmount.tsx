export function maskAmount(
  value: number | string | undefined,
  isVisible: boolean,
  currency: string | undefined,
): string {
  if (!isVisible) return `${currency} XXXX.XX`;
  return `${currency} ${Number(value ?? 0).toLocaleString()}`;
}
