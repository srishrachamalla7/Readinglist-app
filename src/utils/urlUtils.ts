/**
 * Extract domain from URL
 */
export function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace('www.', '');
  } catch {
    return 'unknown';
  }
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Normalize URL (add protocol if missing)
 */
export function normalizeUrl(url: string): string {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`;
  }
  return url;
}

/**
 * Get favicon URL for a domain
 */
export function getFaviconUrl(domain: string): string {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
}

/**
 * Extract metadata from URL (placeholder for future implementation)
 */
export async function fetchUrlMetadata(url: string): Promise<{
  title?: string;
  description?: string;
  domain: string;
}> {
  const domain = extractDomain(url);
  
  // In a real implementation, this would fetch the page and extract metadata
  // For now, return basic info
  return {
    domain,
    title: `Article from ${domain}`,
    description: `Content from ${domain}`,
  };
}