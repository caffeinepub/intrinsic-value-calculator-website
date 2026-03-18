/**
 * Validates that a string is a well-formed HTTP(S) URL
 * @param urlString - The URL string to validate
 * @returns true if valid HTTP(S) URL, false otherwise
 */
export function isValidHttpUrl(urlString: string): boolean {
  if (!urlString || typeof urlString !== "string") {
    return false;
  }

  try {
    const url = new URL(urlString.trim());
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Safely copies text to clipboard with error detection
 * @param text - The text to copy
 * @returns Promise that resolves to success message or rejects with user-friendly error
 */
export async function safeCopyToClipboard(text: string): Promise<string> {
  // Check if clipboard API is available
  if (!navigator.clipboard) {
    throw new Error(
      "Clipboard access is not available in your browser. Please copy the URL manually.",
    );
  }

  try {
    await navigator.clipboard.writeText(text);
    return "Copied to clipboard!";
  } catch (error) {
    // Handle permission denied or other clipboard errors
    if (error instanceof Error) {
      if (error.name === "NotAllowedError") {
        throw new Error(
          "Clipboard access was denied. Please allow clipboard permissions in your browser settings.",
        );
      }
    }
    throw new Error(
      "Failed to copy to clipboard. Please copy the URL manually.",
    );
  }
}

/**
 * Safely opens a URL in a new tab/window with validation
 * @param url - The URL to open
 * @returns true if successful, throws error otherwise
 */
export function safeOpenUrl(url: string): boolean {
  if (!isValidHttpUrl(url)) {
    throw new Error(
      "Invalid URL. Please enter a valid http:// or https:// URL.",
    );
  }

  const newWindow = window.open(url, "_blank", "noopener,noreferrer");

  if (!newWindow) {
    throw new Error(
      "Failed to open URL. Your browser may be blocking pop-ups. Please allow pop-ups for this site or copy the URL to open it manually.",
    );
  }

  return true;
}
