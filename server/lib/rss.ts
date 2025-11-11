import { ofetch } from 'ofetch';
import Parser from 'rss-parser';

const parser = new Parser({
  customFields: {
    item: ['content:encoded', 'media:content'],
  },
  xml2js: {
    ignoreAttrs: true,
    mergeAttrs: false,
    explicitArray: false,
  },
});

export const fetchRssFeed = async (url: string) => {
  try {
    const response = await ofetch(url, {
      responseType: 'text',
      timeout: 30000,
      retry: 2,
    });

    if (!response || typeof response !== 'string') {
      throw new Error('Invalid RSS feed response');
    }

    const result = await parser.parseString(response);

    return {
      items: result.items || [],
      link: result.link || '',
      feedUrl: result.feedUrl || url,
      title: result.title || '',
      lastBuildDate: result.lastBuildDate || new Date().toISOString(),
    };
  } catch (error: any) {
    console.error(`Failed to fetch RSS feed from ${url}:`, error.message);

    if (
      error.message?.includes('Unexpected close tag') ||
      error.message?.includes('XML')
    ) {
      throw new Error(`Invalid XML format in RSS feed: ${url}`);
    }

    if (
      error.message?.includes('timeout') ||
      error.message?.includes('ETIMEDOUT')
    ) {
      throw new Error(`Connection timeout while fetching RSS feed: ${url}`);
    }

    throw new Error(
      `Failed to fetch RSS feed from ${url}: ${error.message || error}`,
    );
  }
};
