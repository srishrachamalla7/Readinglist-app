import type { MetadataFetchResult } from './types';

export class MetadataFetcher {
  private static readonly CORS_PROXY = 'https://api.allorigins.win/get?url=';
  private static readonly TIMEOUT = 10000;

  static async fetchMetadata(url: string): Promise<MetadataFetchResult> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT);

      // Try direct fetch first, then fallback to CORS proxy
      let response: Response;
      try {
        response = await fetch(url, {
          signal: controller.signal,
          headers: {
            'User-Agent': 'ReadingList/1.0'
          }
        });
      } catch (corsError) {
        // Fallback to CORS proxy
        response = await fetch(`${this.CORS_PROXY}${encodeURIComponent(url)}`, {
          signal: controller.signal
        });
        
        if (response.ok) {
          const data = await response.json();
          response = new Response(data.contents, {
            status: 200,
            headers: { 'Content-Type': 'text/html' }
          });
        }
      }

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      const title = this.extractTitle(doc, url);
      const description = this.extractDescription(doc);
      const favicon = this.extractFavicon(doc, url);
      const wordCount = this.extractWordCount(doc);
      const estMinutes = Math.max(1, Math.ceil(wordCount / 200)); // 200 WPM average

      return {
        title,
        description,
        favicon,
        wordCount,
        estMinutes,
        success: true
      };
    } catch (error) {
      console.warn('Metadata fetch failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private static extractTitle(doc: Document, url: string): string {
    // Try various title sources in order of preference
    const selectors = [
      'meta[property="og:title"]',
      'meta[name="twitter:title"]',
      'title',
      'h1'
    ];

    for (const selector of selectors) {
      const element = doc.querySelector(selector);
      if (element) {
        const title = selector.includes('meta') 
          ? element.getAttribute('content')
          : element.textContent;
        
        if (title?.trim()) {
          return title.trim();
        }
      }
    }

    // Fallback to URL-based title
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace('www.', '');
    } catch {
      return 'Untitled';
    }
  }

  private static extractDescription(doc: Document): string | undefined {
    const selectors = [
      'meta[property="og:description"]',
      'meta[name="twitter:description"]',
      'meta[name="description"]'
    ];

    for (const selector of selectors) {
      const element = doc.querySelector(selector);
      const description = element?.getAttribute('content');
      if (description?.trim()) {
        return description.trim();
      }
    }

    // Fallback to first paragraph
    const firstP = doc.querySelector('p');
    if (firstP?.textContent?.trim()) {
      return firstP.textContent.trim().substring(0, 300);
    }

    return undefined;
  }

  private static extractFavicon(doc: Document, url: string): string | undefined {
    const selectors = [
      'link[rel="icon"]',
      'link[rel="shortcut icon"]',
      'link[rel="apple-touch-icon"]'
    ];

    for (const selector of selectors) {
      const element = doc.querySelector(selector);
      const href = element?.getAttribute('href');
      if (href) {
        try {
          return new URL(href, url).href;
        } catch {
          continue;
        }
      }
    }

    // Fallback to default favicon
    try {
      const urlObj = new URL(url);
      return `${urlObj.protocol}//${urlObj.host}/favicon.ico`;
    } catch {
      return undefined;
    }
  }

  private static extractWordCount(doc: Document): number {
    // Remove script and style elements
    const scripts = doc.querySelectorAll('script, style, nav, header, footer');
    scripts.forEach(el => el.remove());

    // Get main content
    const contentSelectors = [
      'main',
      'article',
      '[role="main"]',
      '.content',
      '#content',
      '.post',
      '.entry'
    ];

    let content = '';
    for (const selector of contentSelectors) {
      const element = doc.querySelector(selector);
      if (element?.textContent) {
        content = element.textContent;
        break;
      }
    }

    // Fallback to body content
    if (!content) {
      content = doc.body?.textContent || '';
    }

    // Count words
    const words = content
      .replace(/\s+/g, ' ')
      .trim()
      .split(' ')
      .filter(word => word.length > 0);

    return words.length;
  }
}
