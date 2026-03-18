/**
 * Safely parse a numeric input, treating empty strings as 0
 */
export function parseNumericInput(value: string): number {
  if (value === "" || value === null || value === undefined) {
    return 0;
  }
  const parsed = Number.parseFloat(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

/**
 * Parse a percentage input (e.g., "10" becomes 0.10)
 */
export function parsePercentInput(value: string): number {
  const num = parseNumericInput(value);
  return num / 100;
}

/**
 * Convert a decimal to percentage string (e.g., 0.10 becomes "10")
 */
export function toPercentString(decimal: number): string {
  return (decimal * 100).toString();
}
