/**
 * Format a number as INR currency
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Format a large number as currency with abbreviated suffix (M, B, T)
 */
export function formatLargeCurrency(value: number): string {
  const absValue = Math.abs(value);
  const sign = value < 0 ? "-" : "";

  if (absValue >= 1e12) {
    return `${sign}₹${(absValue / 1e12).toFixed(2)}T`;
  }
  if (absValue >= 1e9) {
    return `${sign}₹${(absValue / 1e9).toFixed(2)}B`;
  }
  if (absValue >= 1e6) {
    return `${sign}₹${(absValue / 1e6).toFixed(2)}M`;
  }
  return formatCurrency(value);
}

/**
 * Format a decimal as a percentage
 */
export function formatPercent(decimal: number, decimals = 2): string {
  return `${(decimal * 100).toFixed(decimals)}%`;
}

/**
 * Format a number with commas
 */
export function formatNumber(value: number, decimals = 2): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}
